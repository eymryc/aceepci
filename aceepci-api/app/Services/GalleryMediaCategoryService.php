<?php

namespace App\Services;

use App\Models\GalleryMediaCategory;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class GalleryMediaCategoryService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = GalleryMediaCategory::query()->orderBy('display_order')->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return GalleryMediaCategory::query()->orderBy('display_order')->orderBy('name')->get();
    }

    public function find(GalleryMediaCategory $category): GalleryMediaCategory
    {
        return $category;
    }

    public function create(array $data): GalleryMediaCategory
    {
        return GalleryMediaCategory::create($data);
    }

    public function update(GalleryMediaCategory $category, array $data): GalleryMediaCategory
    {
        $category->update($data);

        return $category->fresh();
    }

    public function delete(GalleryMediaCategory $category): void
    {
        $category->delete();
    }
}
