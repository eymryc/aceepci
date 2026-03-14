<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Endpoint;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreWorkshopOptionRequest;
use App\Http\Requests\Api\V1\UpdateWorkshopOptionRequest;
use App\Http\Resources\Api\V1\WorkshopOptionResource;
use App\Http\Responses\ApiResponse;
use App\Models\WorkshopOption;
use App\Services\WorkshopOptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Options d\'atelier', description: 'Paramétrage des options d\'atelier pour les événements', weight: 10)]
class WorkshopOptionController extends Controller
{
    public function __construct(
        private WorkshopOptionService $workshopOptionService
    ) {}

    /** Liste des options d'atelier pour les listes déroulantes (filtrée par événement) */
    public function options(Request $request): JsonResponse
    {
        $eventId = $request->query('event_id') ? (int) $request->query('event_id') : null;

        return ApiResponse::success(
            WorkshopOptionResource::collection($this->workshopOptionService->list($eventId)),
            'List retrieved'
        );
    }

    /** Liste paginée des options d'atelier */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $eventId = $request->query('event_id') ? (int) $request->query('event_id') : null;
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        return ApiResponse::success(
            WorkshopOptionResource::collection($this->workshopOptionService->listPaginated($search, $eventId, $perPage)),
            'List retrieved'
        );
    }

    /** Détail d'une option d'atelier */
    public function show(WorkshopOption $workshop_option): JsonResponse
    {
        $this->authorize('parameters.view');

        return ApiResponse::success(
            new WorkshopOptionResource($this->workshopOptionService->find($workshop_option)),
            'Item retrieved'
        );
    }

    /** Création d'une option d'atelier */
    public function store(StoreWorkshopOptionRequest $request): JsonResponse
    {
        $item = $this->workshopOptionService->create($request->validated());

        return ApiResponse::success(new WorkshopOptionResource($item), 'Item created', Response::HTTP_CREATED);
    }

    #[Endpoint(title: "Mise à jour d'une option d'atelier", operationId: 'workshopOptionUpdate')]
    public function update(UpdateWorkshopOptionRequest $request, WorkshopOption $workshop_option): JsonResponse
    {
        $item = $this->workshopOptionService->update($workshop_option, $request->validated());

        return ApiResponse::success(new WorkshopOptionResource($item), 'Item updated');
    }

    /** Suppression d'une option d'atelier */
    public function destroy(WorkshopOption $workshop_option): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->workshopOptionService->delete($workshop_option);

        return ApiResponse::success(null, 'Item deleted');
    }
}
