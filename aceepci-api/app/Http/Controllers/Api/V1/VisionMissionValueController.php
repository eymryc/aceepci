<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SaveVisionMissionValueRequest;
use App\Http\Resources\Api\V1\VisionMissionValueResource;
use App\Http\Responses\ApiResponse;
use App\Services\VisionMissionValueService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur pour la section Vision, Mission & Valeurs.
 *
 * Deux options : enregistrer simple (brouillon) ou enregistrer et publier.
 */
#[Group('Vision, Mission & Valeurs', description: 'Contenu du bloc Vision, Mission & Valeurs', weight: 17)]
class VisionMissionValueController extends Controller
{
    public function __construct(
        private VisionMissionValueService $service
    ) {}

    /** Récupère le contenu pour édition (admin) */
    public function show(): JsonResponse
    {
        $this->authorize('vision-mission-values.view');

        $record = $this->service->getCurrent();

        return ApiResponse::success(
            $record ? new VisionMissionValueResource($record) : null,
            'Contenu récupéré'
        );
    }

    /** Récupère le contenu publié (public) */
    public function published(): JsonResponse
    {
        $record = $this->service->getPublished();

        return ApiResponse::success(
            $record ? new VisionMissionValueResource($record) : null,
            'Contenu récupéré'
        );
    }

    /**
     * Enregistre la section Vision, Mission & Valeurs.
     * - publish=false : enregistrer simple (brouillon)
     * - publish=true : enregistrer et publier
     */
    public function save(SaveVisionMissionValueRequest $request): JsonResponse
    {
        $data = $request->validated();
        $publish = $data['publish'] ?? false;
        unset($data['publish']);

        $record = $this->service->save($data, $publish);

        return ApiResponse::success(
            new VisionMissionValueResource($record),
            $publish ? 'Contenu enregistré et publié' : 'Contenu enregistré'
        );
    }
}
