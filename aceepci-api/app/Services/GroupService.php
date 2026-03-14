<?php

namespace App\Services;

use App\Models\Group;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Service de gestion des groupes.
 */
class GroupService
{
    /** Liste avec pagination et recherche (nom, code, famille) */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Group::with('family')->orderBy('name');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('name', $likeOp, $term)
                    ->orWhere('code', $likeOp, $term)
                    ->orWhere('description', $likeOp, $term)
                    ->orWhereHas('family', fn ($c) => $c->where('name', $likeOp, $term));
            });
        }

        return $query->paginate(min($perPage, 100));
    }

    /** Liste pour les select (public), optionnellement filtrée par famille */
    public function listForOptions(?int $familyId = null): Collection
    {
        $query = Group::with('family')->orderBy('name');
        if ($familyId) {
            $query->where('family_id', $familyId);
        }

        return $query->get();
    }

    /** Liste tous les groupes avec leur famille, triés par nom */
    public function list(): Collection
    {
        return Group::with('family')->orderBy('name')->get();
    }

    /** Récupère un groupe avec sa famille */
    public function find(Group $group): Group
    {
        return $group->load('family');
    }

    /** Crée un nouveau groupe */
    public function create(array $data): Group
    {
        $group = Group::create($data);

        return $group->load('family');
    }

    /** Met à jour un groupe */
    public function update(Group $group, array $data): Group
    {
        $group->update($data);

        return $group->fresh(['family']);
    }

    /** Supprime un groupe */
    public function delete(Group $group): void
    {
        $group->delete();
    }
}
