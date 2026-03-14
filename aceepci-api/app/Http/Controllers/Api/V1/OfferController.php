<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreOfferRequest;
use App\Http\Requests\Api\V1\UpdateOfferRequest;
use App\Http\Resources\Api\V1\OfferResource;
use App\Http\Responses\ApiResponse;
use App\Models\Offer;
use App\Services\OfferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Offres', description: 'CRUD des offres (emploi, stage, bourse, bénévolat)', weight: 15)]
class OfferController extends Controller
{
    public function __construct(
        private OfferService $offerService
    ) {}

    /** Liste paginée des offres */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categoryId = $request->query('offer_category_id') ? (int) $request->query('offer_category_id') : null;
        $typeId = $request->query('offer_type_id') ? (int) $request->query('offer_type_id') : null;
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;
        $includeExpired = $request->boolean('include_expired', false);
        $includeUnpublished = $request->boolean('include_unpublished', false);

        $items = $this->offerService->listPaginated(
            $search,
            $categoryId,
            $typeId,
            $perPage,
            $includeExpired,
            $includeUnpublished,
        );

        return ApiResponse::success(OfferResource::collection($items), 'List retrieved');
    }

    /** Détail d'une offre */
    public function show(Offer $offer): JsonResponse
    {
        return ApiResponse::success(
            new OfferResource($this->offerService->find($offer)),
            'Item retrieved'
        );
    }

    /** Création d'une offre */
    public function store(StoreOfferRequest $request): JsonResponse
    {
        $offer = $this->offerService->create($request->validated());

        return ApiResponse::success(
            new OfferResource($offer),
            'Offre créée',
            Response::HTTP_CREATED
        );
    }

    /** Mise à jour d'une offre */
    public function update(UpdateOfferRequest $request, Offer $offer): JsonResponse
    {
        $offer = $this->offerService->update($offer, $request->validated());

        return ApiResponse::success(new OfferResource($offer), 'Offre mise à jour');
    }

    /** Suppression d'une offre */
    public function destroy(Offer $offer): JsonResponse
    {
        $this->offerService->delete($offer);

        return ApiResponse::success(null, 'Offre supprimée');
    }

    /** Publication d'une offre (passe de brouillon à publié) */
    public function publish(Offer $offer): JsonResponse
    {
        $offer = $this->offerService->publish($offer);

        return ApiResponse::success(new OfferResource($offer), 'Offre publiée');
    }

    /** Dépublication d'une offre (repasse en brouillon) */
    public function unpublish(Offer $offer): JsonResponse
    {
        $offer = $this->offerService->unpublish($offer);

        return ApiResponse::success(new OfferResource($offer), 'Offre dépubliée');
    }
}
