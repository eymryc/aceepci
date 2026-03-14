<?php

namespace App\Services;

use App\Models\NewsCategory;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class NewsCategoryService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = NewsCategory::query()->orderBy('sort_order')->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return NewsCategory::query()->orderBy('sort_order')->orderBy('name')->get();
    }

    public function find(NewsCategory $newsCategory): NewsCategory
    {
        return $newsCategory;
    }

    public function create(array $data): NewsCategory
    {
        return NewsCategory::create($data);
    }

    public function update(NewsCategory $newsCategory, array $data): NewsCategory
    {
        $newsCategory->update($data);

        return $newsCategory->fresh();
    }

    public function delete(NewsCategory $newsCategory): void
    {
        $newsCategory->delete();
    }
}

