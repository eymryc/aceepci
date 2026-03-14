<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SaveMottoSectionRequest;
use App\Http\Resources\Api\V1\MottoSectionResource;
use App\Http\Responses\ApiResponse;
use App\Services\MottoSectionService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur pour la section « Notre devise ».
 *
 * Deux options : enregistrer simple (brouillon) ou enregistrer et publier.
 */
#[Group('Devise', description: 'Gestion de la section Notre devise (textes généraux + piliers)', weight: 15)]
class MottoSectionController extends Controller
{
    public function __construct(
        private MottoSectionService $service
    ) {}

    /** Récupère le contenu pour édition (admin) */
    public function show(): JsonResponse
    {
        $this->authorize('motto.view');

        $record = $this->service->getCurrent();

        return ApiResponse::success(
            $record ? new MottoSectionResource($record) : null,
            'Contenu récupéré'
        );
    }

    /** Récupère le contenu publié (public) */
    public function published(): JsonResponse
    {
        $record = $this->service->getPublished();

        return ApiResponse::success(
            $record ? new MottoSectionResource($record) : null,
            'Contenu récupéré'
        );
    }

    /**
     * Enregistre la section Devise.
     * - publish=false : enregistrer simple (brouillon)
     * - publish=true : enregistrer et publier
     */
    public function save(SaveMottoSectionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $publish = $data['publish'] ?? false;
        unset($data['publish']);

        $record = $this->service->save($data, $publish);

        return ApiResponse::success(
            new MottoSectionResource($record),
            $publish ? 'Contenu enregistré et publié' : 'Contenu enregistré'
        );
    }
}

