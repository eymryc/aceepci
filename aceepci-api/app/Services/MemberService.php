<?php

namespace App\Services;

use App\Models\Group;
use App\Models\Member;
use App\Models\MemberLevel;
use App\Models\MemberStatus;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

/**
 * Service de gestion des membres.
 */
class MemberService
{
    use HasPaginatedSearch;

    private const EAGER_RELATIONS = [
        'city',
        'district',
        'nationality',
        'desiredServiceDepartment',
        'memberType',
        'memberLevel',
        'academicLevel',
        'heardAboutSource',
        'memberStatus',
        'family',
        'group',
        'serviceDomains',
    ];

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Member::query()
            ->with(self::EAGER_RELATIONS)
            ->latest('id');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

            $query->where(function (Builder $q) use ($term, $likeOp) {
                $q->where('firstname', $likeOp, $term)
                    ->orWhere('lastname', $likeOp, $term)
                    ->orWhere('fullname', $likeOp, $term)
                    ->orWhere('email', $likeOp, $term)
                    ->orWhere('phone', $likeOp, $term)
                    ->orWhereHas('family', fn (Builder $family) => $family->where('name', $likeOp, $term))
                    ->orWhereHas('group', fn (Builder $group) => $group->where('name', $likeOp, $term));
            });
        }

        return $query->paginate(min($perPage, 100));
    }

    public function find(Member $member): Member
    {
        return $member->load(self::EAGER_RELATIONS);
    }

    public function create(array $data, bool $fromSite = false): Member
    {
        return DB::transaction(function () use ($data, $fromSite) {
            $domainIds = $data['service_domain_ids'] ?? null;
            unset($data['service_domain_ids']);

            $memberLevelId = $data['member_level_id'] ?? null;

            if ($memberLevelId) {
                [$familyId, $groupId] = $this->assignFamilyAndGroupByLevel($memberLevelId);
                $data['family_id'] = $familyId;
                $data['group_id'] = $groupId;
            }

            $data['source'] = $fromSite ? 'site' : 'admin';
            $data['member_status_id'] ??= $this->resolveDefaultStatusId();
            $data['fullname'] ??= trim(($data['firstname'] ?? '') . ' ' . ($data['lastname'] ?? ''));
            $data['accept_charter'] = $data['accept_charter'] ?? false;
            $data['accept_payment'] = $data['accept_payment'] ?? false;

            $member = Member::create($data);

            if (is_array($domainIds)) {
                $member->serviceDomains()->sync($domainIds);
            }

            return $this->find($member);
        });
    }

    public function update(Member $member, array $data): Member
    {
        return DB::transaction(function () use ($member, $data) {
            $domainIds = $data['service_domain_ids'] ?? null;
            unset($data['service_domain_ids']);

            $levelChanged = array_key_exists('member_level_id', $data)
                && $data['member_level_id'] != $member->member_level_id;

            if ($levelChanged || ! $member->family_id || ! $member->group_id) {
                $levelId = $data['member_level_id'] ?? $member->member_level_id;

                if ($levelId) {
                    [$familyId, $groupId] = $this->assignFamilyAndGroupByLevel($levelId, $member->id);
                    $data['family_id'] = $familyId;
                    $data['group_id'] = $groupId;
                }
            }

            if (array_key_exists('firstname', $data) || array_key_exists('lastname', $data)) {
                $data['fullname'] = trim(($data['firstname'] ?? $member->firstname) . ' ' . ($data['lastname'] ?? $member->lastname));
            }

            $member->update($data);

            if (is_array($domainIds)) {
                $member->serviceDomains()->sync($domainIds);
            }

            return $this->find($member->fresh());
        });
    }

    public function updateStatus(Member $member, array $data): Member
    {
        $member->update(['member_status_id' => $data['member_status_id'] ?? null]);

        return $this->find($member->fresh());
    }

    public function delete(Member $member): void
    {
        foreach ([
            $member->identity_photo_url,
            $member->identity_document_url,
            $member->pastor_attestation_url,
            $member->student_certificate_url,
        ] as $path) {
            if ($path && ! str_starts_with($path, 'http')) {
                Storage::disk('public')->delete($path);
            }
        }

        $member->delete();
    }

    private function resolveDefaultStatusId(): ?int
    {
        $status = MemberStatus::query()->get()->first(function (MemberStatus $status) {
            $name = $this->normalize($status->name);

            return in_array($name, ['en attente', 'attente', 'pending'], true);
        });

        return $status?->id;
    }

    /**
     * Affecte famille et groupe en se basant sur le member_level_id.
     * Le MemberLevel porte un family_id optionnel.
     *
     * @return array{0:int,1:int}
     */
    private function assignFamilyAndGroupByLevel(int $memberLevelId, ?int $ignoreMemberId = null): array
    {
        $level = MemberLevel::with('family')->find($memberLevelId);

        if (! $level) {
            throw ValidationException::withMessages([
                'member_level_id' => 'Le niveau de membre sélectionné est invalide.',
            ]);
        }

        if (! $level->family_id || ! $level->family) {
            throw ValidationException::withMessages([
                'member_level_id' => "Aucune famille configurée pour le niveau « {$level->label} ».",
            ]);
        }

        $family = $level->family;

        $groups = Group::query()
            ->where('family_id', $family->id)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        foreach ($groups as $group) {
            $count = Member::query()
                ->where('group_id', $group->id)
                ->when($ignoreMemberId, fn (Builder $q) => $q->where('id', '!=', $ignoreMemberId))
                ->count();

            if ($count < 10) {
                return [$family->id, $group->id];
            }
        }

        $groupNumber = $groups->count() + 1;

        $group = Group::create([
            'name' => "{$family->name} - Groupe {$groupNumber}",
            'family_id' => $family->id,
            'description' => "Groupe auto-créé pour la famille {$family->name}",
        ]);

        return [$family->id, $group->id];
    }

    private function normalize(string $value): string
    {
        $value = mb_strtolower(trim($value));
        $value = str_replace(['-', '_'], ' ', $value);
        $value = preg_replace('/\s+/', ' ', $value) ?? $value;

        return str_replace(['à', 'è', 'é', 'ê', 'ù'], ['a', 'e', 'e', 'e', 'u'], $value);
    }
}
