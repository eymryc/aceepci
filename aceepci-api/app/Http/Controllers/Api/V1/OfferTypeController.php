<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Endpoint;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreOfferTypeRequest;
use App\Http\Requests\Api\V1\UpdateOfferTypeRequest;
use App\Http\Resources\Api\V1\OfferTypeResource;
use App\Http\Responses\ApiResponse;
use App\Models\OfferType;
use App\Services\OfferTypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Types d\'offres', description: 'Paramétrage des types/contrats d\'offres (CDI, CDD, Stage, etc.)', weight: 16)]
class OfferTypeController extends Controller
{
    public function __construct(
        private OfferTypeService $offerTypeService
    ) {}

    /** Liste des types d'offres pour les listes déroulantes */
    public function options(): JsonResponse
    {
        return ApiResponse::success(
            OfferTypeResource::collection($this->offerTypeService->list()),
            'List retrieved'
        );
    }

    /** Liste paginée des types d'offres */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        return ApiResponse::success(
            OfferTypeResource::collection($this->offerTypeService->listPaginated($search, $perPage)),
            'List retrieved'
        );
    }

    /** Détail d'un type d'offre */
    public function show(OfferType $offer_type): JsonResponse
    {
        return ApiResponse::success(
            new OfferTypeResource($this->offerTypeService->find($offer_type)),
            'Item retrieved'
        );
    }

    /** Création d'un type d'offre */
    public function store(StoreOfferTypeRequest $request): JsonResponse
    {
        $item = $this->offerTypeService->create($request->validated());

        return ApiResponse::success(new OfferTypeResource($item), 'Item created', Response::HTTP_CREATED);
    }

    #[Endpoint(title: "Mise à jour d'un type d'offre", operationId: 'offerTypeUpdate')]
    public function update(UpdateOfferTypeRequest $request, OfferType $offer_type): JsonResponse
    {
        $item = $this->offerTypeService->update($offer_type, $request->validated());

        return ApiResponse::success(new OfferTypeResource($item), 'Item updated');
    }

    /** Suppression d'un type d'offre */
    public function destroy(OfferType $offer_type): JsonResponse
    {
        $this->offerTypeService->delete($offer_type);

        return ApiResponse::success(null, 'Item deleted');
    }
}
