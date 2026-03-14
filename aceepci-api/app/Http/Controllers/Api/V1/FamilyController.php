<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreFamilyRequest;
use App\Http\Requests\Api\V1\UpdateFamilyRequest;
use App\Http\Resources\Api\V1\FamilyResource;
use App\Http\Responses\ApiResponse;
use App\Models\Family;
use App\Services\FamilyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les familles.
 */
#[Group('Familles', description: 'CRUD des familles', weight: 10)]
class FamilyController extends Controller
{
    public function __construct(
        private FamilyService $familyService
    ) {}

    /** Liste pour les select (public, sans pagination) */
    public function options(): JsonResponse
    {
        $items = $this->familyService->list();

        return ApiResponse::success(FamilyResource::collection($items), 'List retrieved');
    }

    /** Liste toutes les familles (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->familyService->listPaginated($search, $perPage);

        return ApiResponse::success(FamilyResource::collection($items), 'List retrieved');
    }

    /** Affiche une famille */
    public function show(Family $family): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->familyService->find($family);

        return ApiResponse::success(new FamilyResource($item), 'Item retrieved');
    }

    /** Crée une nouvelle famille */
    public function store(StoreFamilyRequest $request): JsonResponse
    {
        $item = $this->familyService->create($request->validated());

        return ApiResponse::success(new FamilyResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour une famille */
    public function update(UpdateFamilyRequest $request, Family $family): JsonResponse
    {
        $item = $this->familyService->update($family, $request->validated());

        return ApiResponse::success(new FamilyResource($item), 'Item updated');
    }

    /** Supprime une famille */
    public function destroy(Family $family): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->familyService->delete($family);

        return ApiResponse::success(null, 'Item deleted');
    }
}
