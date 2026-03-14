<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreServiceDomainRequest;
use App\Http\Requests\Api\V1\UpdateServiceDomainRequest;
use App\Http\Resources\Api\V1\ServiceDomainResource;
use App\Http\Responses\ApiResponse;
use App\Models\ServiceDomain;
use App\Services\ServiceDomainService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les domaines de service.
 */
#[Group('Domaines de service', description: 'CRUD des domaines de service', weight: 10)]
class ServiceDomainController extends Controller
{
    public function __construct(
        private ServiceDomainService $serviceDomainService
    ) {}

    /** Liste pour les select (public, sans pagination) */
    public function options(): JsonResponse
    {
        $items = $this->serviceDomainService->list();

        return ApiResponse::success(ServiceDomainResource::collection($items), 'List retrieved');
    }

    /** Liste tous les domaines de service (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->serviceDomainService->listPaginated($search, $perPage);

        return ApiResponse::success(ServiceDomainResource::collection($items), 'List retrieved');
    }

    /** Affiche un domaine de service */
    public function show(ServiceDomain $service_domain): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->serviceDomainService->find($service_domain);

        return ApiResponse::success(new ServiceDomainResource($item), 'Item retrieved');
    }

    /** Crée un nouveau domaine de service */
    public function store(StoreServiceDomainRequest $request): JsonResponse
    {
        $item = $this->serviceDomainService->create($request->validated());

        return ApiResponse::success(new ServiceDomainResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour un domaine de service */
    public function update(UpdateServiceDomainRequest $request, ServiceDomain $service_domain): JsonResponse
    {
        $item = $this->serviceDomainService->update($service_domain, $request->validated());

        return ApiResponse::success(new ServiceDomainResource($item), 'Item updated');
    }

    /** Supprime un domaine de service */
    public function destroy(ServiceDomain $service_domain): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->serviceDomainService->delete($service_domain);

        return ApiResponse::success(null, 'Item deleted');
    }
}
