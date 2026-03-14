<?php

namespace App\Services;

use App\Models\MemberStatus;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des statuts de membre.
 */
class MemberStatusService
{
    use HasPaginatedSearch;

    /** Liste avec pagination et recherche */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = MemberStatus::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    /** Liste tous les statuts de membre, triés par nom */
    public function list(): Collection
    {
        return MemberStatus::query()->orderBy('name')->get();
    }

    public function find(MemberStatus $memberStatus): MemberStatus
    {
        return $memberStatus;
    }

    /** Crée un nouveau statut de membre */
    public function create(array $data): MemberStatus
    {
        return MemberStatus::create($data);
    }

    /** Met à jour un statut de membre */
    public function update(MemberStatus $memberStatus, array $data): MemberStatus
    {
        $memberStatus->update($data);

        return $memberStatus->fresh();
    }

    /** Supprime un statut de membre */
    public function delete(MemberStatus $memberStatus): void
    {
        $memberStatus->delete();
    }
}
