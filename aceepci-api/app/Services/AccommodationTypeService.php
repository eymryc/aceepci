<?php

namespace App\Services;

use App\Models\AccommodationType;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AccommodationTypeService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = AccommodationType::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return AccommodationType::query()->orderBy('name')->get();
    }

    public function find(AccommodationType $accommodationType): AccommodationType
    {
        return $accommodationType;
    }

    public function create(array $data): AccommodationType
    {
        return AccommodationType::create($data);
    }

    public function update(AccommodationType $accommodationType, array $data): AccommodationType
    {
        $accommodationType->update($data);

        return $accommodationType->fresh();
    }

    public function delete(AccommodationType $accommodationType): void
    {
        $accommodationType->delete();
    }
}
