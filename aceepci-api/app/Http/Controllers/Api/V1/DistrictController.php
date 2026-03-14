<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreDistrictRequest;
use App\Http\Requests\Api\V1\UpdateDistrictRequest;
use App\Http\Resources\Api\V1\DistrictResource;
use App\Http\Responses\ApiResponse;
use App\Models\District;
use App\Services\DistrictService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les districts (quartiers).
 */
#[Group('Districts', description: 'CRUD des districts (quartiers)', weight: 10)]
class DistrictController extends Controller
{
    public function __construct(
        private DistrictService $districtService
    ) {}

    /** Liste pour les select (public, sans pagination). Optionnel : ?city_id= pour filtrer par ville */
    public function options(\Illuminate\Http\Request $request): JsonResponse
    {
        $items = $this->districtService->listForOptions($request->query('city_id'));

        return ApiResponse::success(DistrictResource::collection($items), 'List retrieved');
    }

    /** Liste tous les districts (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->districtService->listPaginated($search, $perPage);

        return ApiResponse::success(DistrictResource::collection($items), 'List retrieved');
    }

    /** Affiche un district */
    public function show(District $district): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->districtService->find($district);

        return ApiResponse::success(new DistrictResource($item), 'Item retrieved');
    }

    /** Crée un nouveau district */
    public function store(StoreDistrictRequest $request): JsonResponse
    {
        $item = $this->districtService->create($request->validated());

        return ApiResponse::success(new DistrictResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour un district */
    public function update(UpdateDistrictRequest $request, District $district): JsonResponse
    {
        $item = $this->districtService->update($district, $request->validated());

        return ApiResponse::success(new DistrictResource($item), 'Item updated');
    }

    /** Supprime un district */
    public function destroy(District $district): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->districtService->delete($district);

        return ApiResponse::success(null, 'Item deleted');
    }
}
