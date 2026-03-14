<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des années académiques.
 */
class AcademicYearService
{
    use HasPaginatedSearch;

    /** Liste avec pagination et recherche */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = AcademicYear::query()->orderBy('year_start', 'desc');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    /** Liste toutes les années académiques, triées par year_start décroissant */
    public function list(): Collection
    {
        return AcademicYear::query()->orderBy('year_start', 'desc')->get();
    }

    /** Récupère une année académique par son modèle */
    public function find(AcademicYear $academicYear): AcademicYear
    {
        return $academicYear;
    }

    /** Crée une nouvelle année académique */
    public function create(array $data): AcademicYear
    {
        return AcademicYear::create($data);
    }

    /** Met à jour une année académique */
    public function update(AcademicYear $academicYear, array $data): AcademicYear
    {
        $academicYear->update($data);

        return $academicYear->fresh();
    }

    /** Supprime une année académique */
    public function delete(AcademicYear $academicYear): void
    {
        $academicYear->delete();
    }
}
