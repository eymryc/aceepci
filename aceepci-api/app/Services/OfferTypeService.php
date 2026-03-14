<?php

namespace App\Services;

use App\Models\OfferType;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class OfferTypeService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = OfferType::query()->orderBy('sort_order')->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return OfferType::query()->orderBy('sort_order')->orderBy('name')->get();
    }

    public function find(OfferType $offerType): OfferType
    {
        return $offerType;
    }

    public function create(array $data): OfferType
    {
        return OfferType::create($data);
    }

    public function update(OfferType $offerType, array $data): OfferType
    {
        $offerType->update($data);

        return $offerType->fresh();
    }

    public function delete(OfferType $offerType): void
    {
        $offerType->delete();
    }
}
