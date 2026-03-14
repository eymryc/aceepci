<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreServiceDepartmentRequest;
use App\Http\Requests\Api\V1\UpdateServiceDepartmentRequest;
use App\Http\Resources\Api\V1\ServiceDepartmentResource;
use App\Http\Responses\ApiResponse;
use App\Models\ServiceDepartment;
use App\Services\ServiceDepartmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les départements de service.
 */
#[Group('Départements de service', description: 'CRUD des départements de service', weight: 10)]
class ServiceDepartmentController extends Controller
{
    public function __construct(
        private ServiceDepartmentService $serviceDepartmentService
    ) {}

    /** Liste pour les select (public, sans pagination) */
    public function options(): JsonResponse
    {
        $items = $this->serviceDepartmentService->list();

        return ApiResponse::success(ServiceDepartmentResource::collection($items), 'List retrieved');
    }

    /** Liste tous les départements de service (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->serviceDepartmentService->listPaginated($search, $perPage);

        return ApiResponse::success(ServiceDepartmentResource::collection($items), 'List retrieved');
    }

    /** Affiche un département de service */
    public function show(ServiceDepartment $service_department): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->serviceDepartmentService->find($service_department);

        return ApiResponse::success(new ServiceDepartmentResource($item), 'Item retrieved');
    }

    /** Crée un nouveau département de service */
    public function store(StoreServiceDepartmentRequest $request): JsonResponse
    {
        $item = $this->serviceDepartmentService->create($request->validated());

        return ApiResponse::success(new ServiceDepartmentResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour un département de service */
    public function update(UpdateServiceDepartmentRequest $request, ServiceDepartment $service_department): JsonResponse
    {
        $item = $this->serviceDepartmentService->update($service_department, $request->validated());

        return ApiResponse::success(new ServiceDepartmentResource($item), 'Item updated');
    }

    /** Supprime un département de service */
    public function destroy(ServiceDepartment $service_department): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->serviceDepartmentService->delete($service_department);

        return ApiResponse::success(null, 'Item deleted');
    }
}
