<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SaveOrganizationSectionRequest;
use App\Http\Resources\Api\V1\OrganizationSectionResource;
use App\Http\Responses\ApiResponse;
use App\Services\OrganizationSectionService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur pour la section « Notre Organisation ».
 *
 * Deux options : enregistrer simple (brouillon) ou enregistrer et publier.
 */
#[Group('Organisation', description: 'Gestion de la section Notre Organisation (en-tête + cartes dynamiques)', weight: 16)]
class OrganizationSectionController extends Controller
{
    public function __construct(
        private OrganizationSectionService $service
    ) {}

    /** Récupère le contenu pour édition (admin) */
    public function show(): JsonResponse
    {
        $this->authorize('organization.view');

        $record = $this->service->getCurrent();

        return ApiResponse::success(
            $record ? new OrganizationSectionResource($record) : null,
            'Contenu récupéré'
        );
    }

    /** Récupère le contenu publié (public) */
    public function published(): JsonResponse
    {
        $record = $this->service->getPublished();

        return ApiResponse::success(
            $record ? new OrganizationSectionResource($record) : null,
            'Contenu récupéré'
        );
    }

    /**
     * Enregistre la section Organisation.
     * - publish=false : enregistrer simple (brouillon)
     * - publish=true : enregistrer et publier
     */
    public function save(SaveOrganizationSectionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $publish = $data['publish'] ?? false;
        unset($data['publish']);

        $record = $this->service->save($data, $publish);

        return ApiResponse::success(
            new OrganizationSectionResource($record),
            $publish ? 'Contenu enregistré et publié' : 'Contenu enregistré'
        );
    }
}
