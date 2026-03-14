<?php

namespace App\Services;

use App\Models\FieldOfStudy;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des domaines de formation.
 */
class FieldOfStudyService
{
    use HasPaginatedSearch;

    /** Liste avec pagination et recherche */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = FieldOfStudy::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    /** Liste tous les domaines de formation, triés par nom */
    public function list(): Collection
    {
        return FieldOfStudy::query()->orderBy('name')->get();
    }

    /** Récupère un domaine de formation par son modèle */
    public function find(FieldOfStudy $fieldOfStudy): FieldOfStudy
    {
        return $fieldOfStudy;
    }

    /** Crée un nouveau domaine de formation */
    public function create(array $data): FieldOfStudy
    {
        return FieldOfStudy::create($data);
    }

    /** Met à jour un domaine de formation */
    public function update(FieldOfStudy $fieldOfStudy, array $data): FieldOfStudy
    {
        $fieldOfStudy->update($data);

        return $fieldOfStudy->fresh();
    }

    /** Supprime un domaine de formation */
    public function delete(FieldOfStudy $fieldOfStudy): void
    {
        $fieldOfStudy->delete();
    }
}
