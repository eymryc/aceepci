<?php

namespace App\Services;

use App\Models\City;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des villes.
 */
class CityService
{
    use HasPaginatedSearch;

    /** Liste avec pagination et recherche */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = City::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    /** Liste toutes les villes, triées par nom */
    public function list(): Collection
    {
        return City::query()->orderBy('name')->get();
    }

    /** Récupère une ville avec ses districts */
    public function find(City $city): City
    {
        return $city->load('districts');
    }

    /** Crée une nouvelle ville */
    public function create(array $data): City
    {
        return City::create($data);
    }

    /** Met à jour une ville */
    public function update(City $city, array $data): City
    {
        $city->update($data);

        return $city->fresh();
    }

    /** Supprime une ville */
    public function delete(City $city): void
    {
        $city->delete();
    }
}
