<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreEventRequest;
use App\Http\Requests\Api\V1\UpdateEventRequest;
use App\Http\Resources\Api\V1\EventResource;
use App\Http\Responses\ApiResponse;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

#[Group('Événements', description: 'CRUD des événements (camps, conférences, retraites)', weight: 3)]
class EventController extends Controller
{
    public function __construct(
        private EventService $eventService
    ) {}

    /** Liste des événements (public : publiés | admin : tous avec ?published=0) */
    public function index(Request $request): JsonResponse
    {
        $published = $request->boolean('published', true);

        if ($published) {
            $items = $this->eventService->listPublished();
        } else {
            $search = $request->query('search');
            $perPage = (int) $request->query('per_page', 15);
            $perPage = $perPage > 0 ? min($perPage, 100) : 15;
            $items = $this->eventService->listPaginated($search, $perPage);
        }

        return ApiResponse::success(EventResource::collection($items), 'List retrieved');
    }

    /** Détail d'un événement */
    public function show(Event $event): JsonResponse
    {
        return ApiResponse::success(
            new EventResource($this->eventService->find($event)),
            'Item retrieved'
        );
    }

    /** Création d'un événement */
    public function store(StoreEventRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image_url'] = $request->file('image')->store('events', 'public');
        }
        unset($data['image']);

        $event = $this->eventService->create($data);

        return ApiResponse::success(new EventResource($event), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour d'un événement */
    public function update(UpdateEventRequest $request, Event $event): JsonResponse
    {
        $data = $request->validated();

        if ($request->boolean('remove_image') && $event->image_url) {
            Storage::disk('public')->delete($event->image_url);
            $data['image_url'] = null;
        } elseif ($request->hasFile('image')) {
            if ($event->image_url) {
                Storage::disk('public')->delete($event->image_url);
            }
            $data['image_url'] = $request->file('image')->store('events', 'public');
        }
        unset($data['image'], $data['remove_image']);

        $event = $this->eventService->update($event, $data);

        return ApiResponse::success(new EventResource($event), 'Item updated');
    }

    /** Suppression d'un événement */
    public function destroy(Event $event): JsonResponse
    {
        $this->eventService->delete($event);

        return ApiResponse::success(null, 'Item deleted');
    }
}
