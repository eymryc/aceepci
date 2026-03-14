<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SaveHistoryRequest;
use App\Http\Resources\Api\V1\HistoryResource;
use App\Http\Responses\ApiResponse;
use App\Services\HistoryService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur pour la section Histoire.
 *
 * Deux options : enregistrer simple (brouillon) ou enregistrer et publier.
 */
#[Group('Histoire', description: 'Contenu du bloc Histoire sur la page d\'accueil', weight: 8)]
class HistoryController extends Controller
{
    public function __construct(
        private HistoryService $historyService
    ) {}

    /** Récupère le contenu pour édition (admin) */
    public function show(): JsonResponse
    {
        $this->authorize('history.view');

        $history = $this->historyService->getCurrent();

        return ApiResponse::success(
            $history ? new HistoryResource($history) : null,
            'Content retrieved'
        );
    }

    /** Récupère le contenu publié (public) */
    public function published(): JsonResponse
    {
        $history = $this->historyService->getPublished();

        return ApiResponse::success(
            $history ? new HistoryResource($history) : null,
            'Content retrieved'
        );
    }

    /**
     * Enregistre la section Histoire.
     * - publish=false : enregistrer simple (brouillon)
     * - publish=true : enregistrer et publier
     */
    public function save(SaveHistoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $publish = $data['publish'] ?? false;
        unset($data['publish'], $data['remove_image']);

        $current = $this->historyService->getCurrent();

        if ($request->boolean('remove_image') && $current?->image_url) {
            $this->historyService->deleteImage($current);
            $data['image_url'] = null;
        } elseif ($request->hasFile('image')) {
            if ($current?->image_url) {
                $this->historyService->deleteImage($current);
            }
            $data['image_url'] = $request->file('image')->store('histories', 'public');
        }

        $history = $this->historyService->save($data, $publish);

        return ApiResponse::success(
            new HistoryResource($history),
            $publish ? 'Contenu enregistré et publié' : 'Contenu enregistré'
        );
    }
}
