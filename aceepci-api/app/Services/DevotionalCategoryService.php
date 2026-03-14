<?php

namespace App\Services;

use App\Models\DevotionalCategory;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class DevotionalCategoryService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = DevotionalCategory::query()->orderBy('display_order')->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return DevotionalCategory::query()->orderBy('display_order')->orderBy('name')->get();
    }

    public function find(DevotionalCategory $devotionalCategory): DevotionalCategory
    {
        return $devotionalCategory;
    }

    public function create(array $data): DevotionalCategory
    {
        return DevotionalCategory::create($data);
    }

    public function update(DevotionalCategory $devotionalCategory, array $data): DevotionalCategory
    {
        $devotionalCategory->update($data);

        return $devotionalCategory->fresh();
    }

    public function delete(DevotionalCategory $devotionalCategory): void
    {
        $devotionalCategory->delete();
    }
}
