<?php

namespace App\Services;

use App\Models\ServiceDomain;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des domaines de service.
 */
class ServiceDomainService
{
    use HasPaginatedSearch;

    /** Liste avec pagination et recherche */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = ServiceDomain::query()->orderBy('name');

        return $this->paginateWithSearch($query, ['name', 'code'], $search, $perPage);
    }

    /** Liste tous les domaines de service, triés par nom */
    public function list(): Collection
    {
        return ServiceDomain::query()->orderBy('name')->get();
    }

    /** Récupère un domaine de service par son modèle */
    public function find(ServiceDomain $serviceDomain): ServiceDomain
    {
        return $serviceDomain;
    }

    /** Crée un nouveau domaine de service */
    public function create(array $data): ServiceDomain
    {
        return ServiceDomain::create($data);
    }

    /** Met à jour un domaine de service */
    public function update(ServiceDomain $serviceDomain, array $data): ServiceDomain
    {
        $serviceDomain->update($data);

        return $serviceDomain->fresh();
    }

    /** Supprime un domaine de service */
    public function delete(ServiceDomain $serviceDomain): void
    {
        $serviceDomain->delete();
    }
}
