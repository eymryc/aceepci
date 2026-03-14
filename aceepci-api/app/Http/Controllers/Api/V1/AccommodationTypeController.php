<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Endpoint;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreAccommodationTypeRequest;
use App\Http\Requests\Api\V1\UpdateAccommodationTypeRequest;
use App\Http\Resources\Api\V1\AccommodationTypeResource;
use App\Http\Responses\ApiResponse;
use App\Models\AccommodationType;
use App\Services\AccommodationTypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Types d\'hébergement', description: 'Paramétrage des types d\'hébergement pour les événements', weight: 10)]
class AccommodationTypeController extends Controller
{
    public function __construct(
        private AccommodationTypeService $accommodationTypeService
    ) {}

    /** Liste des types d'hébergement pour les listes déroulantes */
    public function options(): JsonResponse
    {
        return ApiResponse::success(
            AccommodationTypeResource::collection($this->accommodationTypeService->list()),
            'List retrieved'
        );
    }

    /** Liste paginée des types d'hébergement */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        return ApiResponse::success(
            AccommodationTypeResource::collection($this->accommodationTypeService->listPaginated($search, $perPage)),
            'List retrieved'
        );
    }

    /** Détail d'un type d'hébergement */
    public function show(AccommodationType $accommodation_type): JsonResponse
    {
        $this->authorize('parameters.view');

        return ApiResponse::success(
            new AccommodationTypeResource($this->accommodationTypeService->find($accommodation_type)),
            'Item retrieved'
        );
    }

    /** Création d'un type d'hébergement */
    public function store(StoreAccommodationTypeRequest $request): JsonResponse
    {
        $item = $this->accommodationTypeService->create($request->validated());

        return ApiResponse::success(new AccommodationTypeResource($item), 'Item created', Response::HTTP_CREATED);
    }

    #[Endpoint(title: "Mise à jour d'un type d'hébergement", operationId: 'accommodationTypeUpdate')]
    public function update(UpdateAccommodationTypeRequest $request, AccommodationType $accommodation_type): JsonResponse
    {
        $item = $this->accommodationTypeService->update($accommodation_type, $request->validated());

        return ApiResponse::success(new AccommodationTypeResource($item), 'Item updated');
    }

    /** Suppression d'un type d'hébergement */
    public function destroy(AccommodationType $accommodation_type): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->accommodationTypeService->delete($accommodation_type);

        return ApiResponse::success(null, 'Item deleted');
    }
}
