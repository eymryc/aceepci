<?php

namespace App\Services;

use App\Models\District;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Service de gestion des districts (quartiers).
 */
class DistrictService
{
    /** Liste avec pagination et recherche (nom, code, ville) */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = District::with('city')->orderBy('name');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('name', $likeOp, $term)
                    ->orWhere('code', $likeOp, $term)
                    ->orWhereHas('city', fn ($c) => $c->where('name', $likeOp, $term));
            });
        }

        return $query->paginate(min($perPage, 100));
    }

    /** Liste pour les select (public), optionnellement filtrée par ville */
    public function listForOptions(?int $cityId = null): Collection
    {
        $query = District::with('city')->orderBy('name');
        if ($cityId) {
            $query->where('city_id', $cityId);
        }

        return $query->get();
    }

    /** Liste tous les districts avec leur ville, triés par nom */
    public function list(): Collection
    {
        return District::with('city')->orderBy('name')->get();
    }

    /** Récupère un district avec sa ville */
    public function find(District $district): District
    {
        return $district->load('city');
    }

    /** Crée un nouveau district */
    public function create(array $data): District
    {
        $district = District::create($data);

        return $district->load('city');
    }

    /** Met à jour un district */
    public function update(District $district, array $data): District
    {
        $district->update($data);

        return $district->fresh(['city']);
    }

    /** Supprime un district */
    public function delete(District $district): void
    {
        $district->delete();
    }
}
