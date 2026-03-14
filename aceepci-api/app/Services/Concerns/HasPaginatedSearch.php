<?php

namespace App\Services\Concerns;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

/**
 * Trait pour les services avec pagination et recherche.
 */
trait HasPaginatedSearch
{
    /**
     * Applique pagination et recherche sur une requête.
     *
     * @param  Builder  $query
     * @param  array<string>  $searchColumns  Colonnes sur lesquelles chercher
     * @param  string|null  $search
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    protected function paginateWithSearch(
        Builder $query,
        array $searchColumns,
        ?string $search = null,
        int $perPage = 15
    ): LengthAwarePaginator {
        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($searchColumns, $term, $likeOp) {
                $first = true;
                foreach ($searchColumns as $column) {
                    $first ? $q->where($column, $likeOp, $term) : $q->orWhere($column, $likeOp, $term);
                    $first = false;
                }
            });
        }

        return $query->paginate(min($perPage, 100));
    }
}
