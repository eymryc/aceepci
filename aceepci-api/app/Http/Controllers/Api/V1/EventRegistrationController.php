<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreEventRegistrationRequest;
use App\Http\Resources\Api\V1\EventRegistrationResource;
use App\Http\Responses\ApiResponse;
use App\Models\EventRegistration;
use App\Services\EventRegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Inscriptions aux événements', description: 'Création et consultation des inscriptions aux événements', weight: 3)]
class EventRegistrationController extends Controller
{
    public function __construct(
        private EventRegistrationService $eventRegistrationService
    ) {}

    /** Création d'une inscription (public, formulaire site) */
    public function store(StoreEventRegistrationRequest $request): JsonResponse
    {
        $registration = $this->eventRegistrationService->create($request->validated());

        return ApiResponse::success(
            new EventRegistrationResource($this->eventRegistrationService->find($registration)),
            'Inscription enregistrée',
            Response::HTTP_CREATED
        );
    }

    /** Liste paginée des inscriptions */
    public function index(Request $request): JsonResponse
    {
        $eventId = $request->query('event_id') ? (int) $request->query('event_id') : null;
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 25);
        $perPage = $perPage > 0 ? min($perPage, 100) : 25;

        $items = $this->eventRegistrationService->listPaginated($eventId, $search, $perPage);

        return ApiResponse::success(EventRegistrationResource::collection($items), 'List retrieved');
    }

    /** Détail d'une inscription */
    public function show(EventRegistration $event_registration): JsonResponse
    {
        return ApiResponse::success(
            new EventRegistrationResource($this->eventRegistrationService->find($event_registration)),
            'Item retrieved'
        );
    }
}
