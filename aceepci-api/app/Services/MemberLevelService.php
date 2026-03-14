<?php

namespace App\Services;

use App\Models\MemberLevel;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des niveaux de membre.
 */
class MemberLevelService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = MemberLevel::query()->with(['memberType', 'family'])->orderBy('display_order')->orderBy('label');

        return $this->paginateWithSearch($query, ['value', 'label', 'code'], $search, $perPage);
    }

    public function list(?int $memberTypeId = null): Collection
    {
        return MemberLevel::query()
            ->when($memberTypeId, fn ($q) => $q->where('member_type_id', $memberTypeId))
            ->orderBy('display_order')
            ->orderBy('label')
            ->get();
    }

    public function find(MemberLevel $memberLevel): MemberLevel
    {
        return $memberLevel->load(['memberType', 'family']);
    }

    public function create(array $data): MemberLevel
    {
        $data['display_order'] ??= 0;

        return MemberLevel::create($data);
    }

    public function update(MemberLevel $memberLevel, array $data): MemberLevel
    {
        $memberLevel->update($data);

        return $memberLevel->fresh();
    }

    public function delete(MemberLevel $memberLevel): void
    {
        $memberLevel->delete();
    }
}
