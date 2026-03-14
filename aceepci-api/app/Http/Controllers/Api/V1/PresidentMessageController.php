<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\SavePresidentMessageRequest;
use App\Http\Resources\Api\V1\PresidentMessageResource;
use App\Http\Responses\ApiResponse;
use App\Services\PresidentMessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * Contrôleur pour le mot du président.
 *
 * Deux options : enregistrer simple (brouillon) ou enregistrer et publier.
 */
#[Group('Mot du président', description: 'Contenu du bloc Mot du président sur la page d\'accueil', weight: 7)]
class PresidentMessageController extends Controller
{
    public function __construct(
        private PresidentMessageService $presidentMessageService
    ) {}

    /** Récupère le contenu pour édition (admin) */
    public function show(): JsonResponse
    {
        $this->authorize('president-message.view');

        $message = $this->presidentMessageService->getCurrent();

        return ApiResponse::success(
            $message ? new PresidentMessageResource($message) : null,
            'Content retrieved'
        );
    }

    /** Récupère le contenu publié (public) */
    public function published(): JsonResponse
    {
        $message = $this->presidentMessageService->getPublished();

        return ApiResponse::success(
            $message ? new PresidentMessageResource($message) : null,
            'Content retrieved'
        );
    }

    /**
     * Enregistre le mot du président.
     * - publish=false : enregistrer simple (brouillon)
     * - publish=true : enregistrer et publier
     */
    public function save(SavePresidentMessageRequest $request): JsonResponse
    {
        $data = $request->validated();
        $publish = $data['publish'] ?? false;
        unset($data['publish'], $data['remove_image']);

        $current = $this->presidentMessageService->getCurrent();

        if ($request->boolean('remove_image') && $current?->image_url) {
            $this->presidentMessageService->deleteImage($current);
            $data['image_url'] = null;
        } elseif ($request->hasFile('image')) {
            if ($current?->image_url) {
                $this->presidentMessageService->deleteImage($current);
            }
            $data['image_url'] = $request->file('image')->store('president-messages', 'public');
        }

        $message = $this->presidentMessageService->save($data, $publish);

        return ApiResponse::success(
            new PresidentMessageResource($message),
            $publish ? 'Contenu enregistré et publié' : 'Contenu enregistré'
        );
    }
}
