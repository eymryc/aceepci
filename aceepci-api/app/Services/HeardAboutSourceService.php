<?php

namespace App\Services;

use App\Models\HeardAboutSource;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des sources de connaissance ACEEPCI.
 */
class HeardAboutSourceService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = HeardAboutSource::query()->orderBy('display_order')->orderBy('label');

        return $this->paginateWithSearch($query, ['value', 'label', 'code'], $search, $perPage);
    }

    public function list(): Collection
    {
        return HeardAboutSource::query()->orderBy('display_order')->orderBy('label')->get();
    }

    public function find(HeardAboutSource $source): HeardAboutSource
    {
        return $source;
    }

    public function create(array $data): HeardAboutSource
    {
        $data['display_order'] ??= 0;

        return HeardAboutSource::create($data);
    }

    public function update(HeardAboutSource $source, array $data): HeardAboutSource
    {
        $source->update($data);

        return $source->fresh();
    }

    public function delete(HeardAboutSource $source): void
    {
        $source->delete();
    }
}
