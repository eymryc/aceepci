<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Endpoint;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreEventCategoryRequest;
use App\Http\Requests\Api\V1\UpdateEventCategoryRequest;
use App\Http\Resources\Api\V1\EventCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\EventCategory;
use App\Services\EventCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Catégories d\'événements', description: 'Paramétrage des catégories d\'événements', weight: 10)]
class EventCategoryController extends Controller
{
    public function __construct(
        private EventCategoryService $eventCategoryService
    ) {}

    /** Liste des catégories d'événements pour les listes déroulantes */
    public function options(): JsonResponse
    {
        return ApiResponse::success(
            EventCategoryResource::collection($this->eventCategoryService->list()),
            'List retrieved'
        );
    }

    /** Liste paginée des catégories d'événements */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        return ApiResponse::success(
            EventCategoryResource::collection($this->eventCategoryService->listPaginated($search, $perPage)),
            'List retrieved'
        );
    }

    /** Détail d'une catégorie d'événement */
    public function show(EventCategory $event_category): JsonResponse
    {
        $this->authorize('parameters.view');

        return ApiResponse::success(
            new EventCategoryResource($this->eventCategoryService->find($event_category)),
            'Item retrieved'
        );
    }

    /** Création d'une catégorie d'événement */
    public function store(StoreEventCategoryRequest $request): JsonResponse
    {
        $item = $this->eventCategoryService->create($request->validated());

        return ApiResponse::success(new EventCategoryResource($item), 'Item created', Response::HTTP_CREATED);
    }

    #[Endpoint(title: "Mise à jour d'une catégorie d'événement", operationId: 'eventCategoryUpdate')]
    public function update(UpdateEventCategoryRequest $request, EventCategory $event_category): JsonResponse
    {
        $item = $this->eventCategoryService->update($event_category, $request->validated());

        return ApiResponse::success(new EventCategoryResource($item), 'Item updated');
    }

    /** Suppression d'une catégorie d'événement */
    public function destroy(EventCategory $event_category): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->eventCategoryService->delete($event_category);

        return ApiResponse::success(null, 'Item deleted');
    }
}
