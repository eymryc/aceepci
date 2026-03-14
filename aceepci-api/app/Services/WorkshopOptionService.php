<?php

namespace App\Services;

use App\Models\WorkshopOption;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class WorkshopOptionService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, ?int $eventId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = WorkshopOption::query()
            ->with('event')
            ->orderBy('sort_order')
            ->orderBy('name');

        if ($eventId) {
            $query->where(function ($q) use ($eventId) {
                $q->where('event_id', $eventId)->orWhereNull('event_id');
            });
        }

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    public function list(?int $eventId = null): Collection
    {
        $query = WorkshopOption::query()->orderBy('sort_order')->orderBy('name');

        if ($eventId) {
            $query->where(function ($q) use ($eventId) {
                $q->where('event_id', $eventId)->orWhereNull('event_id');
            });
        }

        return $query->get();
    }

    public function find(WorkshopOption $workshopOption): WorkshopOption
    {
        return $workshopOption->load('event');
    }

    public function create(array $data): WorkshopOption
    {
        return WorkshopOption::create($data);
    }

    public function update(WorkshopOption $workshopOption, array $data): WorkshopOption
    {
        $workshopOption->update($data);

        return $workshopOption->fresh();
    }

    public function delete(WorkshopOption $workshopOption): void
    {
        $workshopOption->delete();
    }
}
