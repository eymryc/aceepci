<?php

namespace App\Services;

use App\Models\Nationality;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des nationalités.
 */
class NationalityService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Nationality::query()->orderBy('display_order')->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return Nationality::query()->orderBy('display_order')->orderBy('name')->get();
    }

    public function find(Nationality $nationality): Nationality
    {
        return $nationality;
    }

    public function create(array $data): Nationality
    {
        $data['display_order'] ??= 0;

        return Nationality::create($data);
    }

    public function update(Nationality $nationality, array $data): Nationality
    {
        $nationality->update($data);

        return $nationality->fresh();
    }

    public function delete(Nationality $nationality): void
    {
        $nationality->delete();
    }
}
