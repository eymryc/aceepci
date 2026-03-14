<?php

namespace App\Services;

use App\Models\BlogCategory;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BlogCategoryService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = BlogCategory::query()->orderBy('sort_order')->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return BlogCategory::query()->orderBy('sort_order')->orderBy('name')->get();
    }

    public function find(BlogCategory $blogCategory): BlogCategory
    {
        return $blogCategory;
    }

    public function create(array $data): BlogCategory
    {
        return BlogCategory::create($data);
    }

    public function update(BlogCategory $blogCategory, array $data): BlogCategory
    {
        $blogCategory->update($data);

        return $blogCategory->fresh();
    }

    public function delete(BlogCategory $blogCategory): void
    {
        $blogCategory->delete();
    }
}
