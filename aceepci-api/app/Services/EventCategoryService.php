<?php

namespace App\Services;

use App\Models\EventCategory;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EventCategoryService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = EventCategory::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return EventCategory::query()->orderBy('name')->get();
    }

    public function find(EventCategory $eventCategory): EventCategory
    {
        return $eventCategory;
    }

    public function create(array $data): EventCategory
    {
        return EventCategory::create($data);
    }

    public function update(EventCategory $eventCategory, array $data): EventCategory
    {
        $eventCategory->update($data);

        return $eventCategory->fresh();
    }

    public function delete(EventCategory $eventCategory): void
    {
        $eventCategory->delete();
    }
}
