<?php

namespace App\Services;

use App\Models\ServiceDepartment;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des départements de service.
 */
class ServiceDepartmentService
{
    use HasPaginatedSearch;

    /** Liste avec pagination et recherche */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = ServiceDepartment::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code', 'slug'], $search, $perPage);
    }

    /** Liste tous les départements de service, triés par nom */
    public function list(): Collection
    {
        return ServiceDepartment::query()->orderBy('name')->get();
    }

    /** Récupère un département de service par son modèle */
    public function find(ServiceDepartment $serviceDepartment): ServiceDepartment
    {
        return $serviceDepartment;
    }

    /** Crée un nouveau département de service */
    public function create(array $data): ServiceDepartment
    {
        return ServiceDepartment::create($data);
    }

    /** Met à jour un département de service */
    public function update(ServiceDepartment $serviceDepartment, array $data): ServiceDepartment
    {
        $serviceDepartment->update($data);

        return $serviceDepartment->fresh();
    }

    /** Supprime un département de service */
    public function delete(ServiceDepartment $serviceDepartment): void
    {
        $serviceDepartment->delete();
    }
}
