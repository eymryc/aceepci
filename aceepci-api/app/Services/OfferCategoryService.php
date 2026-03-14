<?php

namespace App\Services;

use App\Models\OfferCategory;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class OfferCategoryService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = OfferCategory::query()->orderBy('sort_order')->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return OfferCategory::query()->orderBy('sort_order')->orderBy('name')->get();
    }

    public function find(OfferCategory $offerCategory): OfferCategory
    {
        return $offerCategory;
    }

    public function create(array $data): OfferCategory
    {
        return OfferCategory::create($data);
    }

    public function update(OfferCategory $offerCategory, array $data): OfferCategory
    {
        $offerCategory->update($data);

        return $offerCategory->fresh();
    }

    public function delete(OfferCategory $offerCategory): void
    {
        $offerCategory->delete();
    }
}
