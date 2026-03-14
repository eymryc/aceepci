<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreNationalityRequest;
use App\Http\Requests\Api\V1\UpdateNationalityRequest;
use App\Http\Resources\Api\V1\NationalityResource;
use App\Http\Responses\ApiResponse;
use App\Models\Nationality;
use App\Services\NationalityService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les nationalités.
 */
#[Group('Nationalités', description: 'CRUD des nationalités', weight: 14)]
class NationalityController extends Controller
{
    public function __construct(
        private NationalityService $service
    ) {}

    /** Liste pour les select (public) */
    public function options(): JsonResponse
    {
        $items = $this->service->list();

        return ApiResponse::success(NationalityResource::collection($items), 'List retrieved');
    }

    /** Liste paginée (admin) */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->service->listPaginated($search, $perPage);

        return ApiResponse::success(NationalityResource::collection($items), 'List retrieved');
    }

    /** Détail */
    public function show(Nationality $nationality): JsonResponse
    {
        $this->authorize('parameters.view');

        return ApiResponse::success(new NationalityResource($this->service->find($nationality)), 'Item retrieved');
    }

    /** Création */
    public function store(StoreNationalityRequest $request): JsonResponse
    {
        $item = $this->service->create($request->validated());

        return ApiResponse::success(new NationalityResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour */
    public function update(UpdateNationalityRequest $request, Nationality $nationality): JsonResponse
    {
        $item = $this->service->update($nationality, $request->validated());

        return ApiResponse::success(new NationalityResource($item), 'Item updated');
    }

    /** Suppression */
    public function destroy(Nationality $nationality): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->service->delete($nationality);

        return ApiResponse::success(null, 'Item deleted');
    }
}
