<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreContactMessageRequest;
use App\Http\Resources\Api\V1\ContactMessageResource;
use App\Http\Responses\ApiResponse;
use App\Models\ContactMessage;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Contact', description: 'Formulaire de contact et messages reçus', weight: 19)]
class ContactMessageController extends Controller
{
    /** Envoi d'un message depuis le formulaire (public, sans auth) */
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = ContactMessage::create($request->validated());

        return ApiResponse::success(
            new ContactMessageResource($message),
            'Message envoyé. Nous vous répondrons dans les plus brefs délais.',
            Response::HTTP_CREATED
        );
    }

    /** Liste des messages (admin, paginée) */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('contact.view');

        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;
        $unreadOnly = $request->boolean('unread_only');

        $query = ContactMessage::query()->orderByDesc('created_at');
        if ($unreadOnly) {
            $query->whereNull('read_at');
        }
        $items = $query->paginate($perPage);

        return ApiResponse::success(ContactMessageResource::collection($items), 'List retrieved');
    }

    /** Détail d'un message (admin) */
    public function show(ContactMessage $contact_message): JsonResponse
    {
        $this->authorize('contact.view');

        if (! $contact_message->read_at) {
            $contact_message->update(['read_at' => now()]);
        }

        return ApiResponse::success(new ContactMessageResource($contact_message->fresh()), 'Item retrieved');
    }

    /** Marquer comme lu (admin) */
    public function markRead(ContactMessage $contact_message): JsonResponse
    {
        $this->authorize('contact.view');

        $contact_message->update(['read_at' => now()]);

        return ApiResponse::success(new ContactMessageResource($contact_message->fresh()), 'Message marqué comme lu');
    }
}
