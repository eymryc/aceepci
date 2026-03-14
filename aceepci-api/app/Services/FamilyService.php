<?php

namespace App\Services;

use App\Models\Family;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des familles.
 */
class FamilyService
{
    use HasPaginatedSearch;

    /** Liste avec pagination et recherche */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Family::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code', 'description'], $search, $perPage);
    }

    /** Liste toutes les familles, triées par nom */
    public function list(): Collection
    {
        return Family::query()->orderBy('name')->get();
    }

    /** Récupère une famille avec ses groupes */
    public function find(Family $family): Family
    {
        return $family->load('groups');
    }

    /** Crée une nouvelle famille */
    public function create(array $data): Family
    {
        return Family::create($data);
    }

    /** Met à jour une famille */
    public function update(Family $family, array $data): Family
    {
        $family->update($data);

        return $family->fresh();
    }

    /** Supprime une famille */
    public function delete(Family $family): void
    {
        $family->delete();
    }
}
