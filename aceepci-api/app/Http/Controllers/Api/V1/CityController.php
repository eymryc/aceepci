<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreCityRequest;
use App\Http\Requests\Api\V1\UpdateCityRequest;
use App\Http\Resources\Api\V1\CityResource;
use App\Http\Responses\ApiResponse;
use App\Models\City;
use App\Services\CityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les villes.
 */
#[Group('Villes', description: 'CRUD des villes', weight: 10)]
class CityController extends Controller
{
    public function __construct(
        private CityService $cityService
    ) {}

    /** Liste pour les select (public, sans pagination) */
    public function options(): JsonResponse
    {
        $items = $this->cityService->list();

        return ApiResponse::success(CityResource::collection($items), 'List retrieved');
    }

    /** Liste toutes les villes (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->cityService->listPaginated($search, $perPage);

        return ApiResponse::success(CityResource::collection($items), 'List retrieved');
    }

    /** Affiche une ville */
    public function show(City $city): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->cityService->find($city);

        return ApiResponse::success(new CityResource($item), 'Item retrieved');
    }

    /** Crée une nouvelle ville */
    public function store(StoreCityRequest $request): JsonResponse
    {
        $item = $this->cityService->create($request->validated());

        return ApiResponse::success(new CityResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour une ville */
    public function update(UpdateCityRequest $request, City $city): JsonResponse
    {
        $item = $this->cityService->update($city, $request->validated());

        return ApiResponse::success(new CityResource($item), 'Item updated');
    }

    /** Supprime une ville */
    public function destroy(City $city): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->cityService->delete($city);

        return ApiResponse::success(null, 'Item deleted');
    }
}
