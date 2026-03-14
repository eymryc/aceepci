<?php

namespace App\Services;

use App\Models\MealPreference;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MealPreferenceService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = MealPreference::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return MealPreference::query()->orderBy('name')->get();
    }

    public function find(MealPreference $mealPreference): MealPreference
    {
        return $mealPreference;
    }

    public function create(array $data): MealPreference
    {
        return MealPreference::create($data);
    }

    public function update(MealPreference $mealPreference, array $data): MealPreference
    {
        $mealPreference->update($data);

        return $mealPreference->fresh();
    }

    public function delete(MealPreference $mealPreference): void
    {
        $mealPreference->delete();
    }
}
