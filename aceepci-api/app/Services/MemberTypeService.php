<?php

namespace App\Services;

use App\Models\MemberType;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des types de membre.
 */
class MemberTypeService
{
    use HasPaginatedSearch;

    /** Liste avec pagination et recherche */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = MemberType::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    /** Liste tous les types de membre avec niveaux associés, triés par nom */
    public function list(): Collection
    {
        return MemberType::query()
            ->with(['memberLevels', 'academicLevels'])
            ->orderBy('name')
            ->get();
    }

    /** Récupère un type de membre par son modèle */
    public function find(MemberType $memberType): MemberType
    {
        return $memberType;
    }

    /** Crée un nouveau type de membre */
    public function create(array $data): MemberType
    {
        return MemberType::create($data);
    }

    /** Met à jour un type de membre */
    public function update(MemberType $memberType, array $data): MemberType
    {
        $memberType->update($data);

        return $memberType->fresh();
    }

    /** Supprime un type de membre */
    public function delete(MemberType $memberType): void
    {
        $memberType->delete();
    }
}
