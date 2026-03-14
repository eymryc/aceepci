<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Endpoint;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreOfferCategoryRequest;
use App\Http\Requests\Api\V1\UpdateOfferCategoryRequest;
use App\Http\Resources\Api\V1\OfferCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\OfferCategory;
use App\Services\OfferCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Catégories d\'offres', description: 'Paramétrage des catégories d\'offres (Emploi, Stage, Bourse, Bénévolat)', weight: 16)]
class OfferCategoryController extends Controller
{
    public function __construct(
        private OfferCategoryService $offerCategoryService
    ) {}

    /** Liste des catégories d'offres pour les listes déroulantes */
    public function options(): JsonResponse
    {
        return ApiResponse::success(
            OfferCategoryResource::collection($this->offerCategoryService->list()),
            'List retrieved'
        );
    }

    /** Liste paginée des catégories d'offres */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        return ApiResponse::success(
            OfferCategoryResource::collection($this->offerCategoryService->listPaginated($search, $perPage)),
            'List retrieved'
        );
    }

    /** Détail d'une catégorie d'offre */
    public function show(OfferCategory $offer_category): JsonResponse
    {
        return ApiResponse::success(
            new OfferCategoryResource($this->offerCategoryService->find($offer_category)),
            'Item retrieved'
        );
    }

    /** Création d'une catégorie d'offre */
    public function store(StoreOfferCategoryRequest $request): JsonResponse
    {
        $item = $this->offerCategoryService->create($request->validated());

        return ApiResponse::success(new OfferCategoryResource($item), 'Item created', Response::HTTP_CREATED);
    }

    #[Endpoint(title: "Mise à jour d'une catégorie d'offre", operationId: 'offerCategoryUpdate')]
    public function update(UpdateOfferCategoryRequest $request, OfferCategory $offer_category): JsonResponse
    {
        $item = $this->offerCategoryService->update($offer_category, $request->validated());

        return ApiResponse::success(new OfferCategoryResource($item), 'Item updated');
    }

    /** Suppression d'une catégorie d'offre */
    public function destroy(OfferCategory $offer_category): JsonResponse
    {
        $this->offerCategoryService->delete($offer_category);

        return ApiResponse::success(null, 'Item deleted');
    }
}
