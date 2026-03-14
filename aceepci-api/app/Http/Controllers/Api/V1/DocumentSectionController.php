<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SaveDocumentSectionRequest;
use App\Http\Resources\Api\V1\DocumentSectionResource;
use App\Http\Responses\ApiResponse;
use App\Services\DocumentSectionService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur pour la section « Documents officiels ».
 *
 * Deux options : enregistrer simple (brouillon) ou enregistrer et publier.
 */
#[Group('Documents officiels', description: 'Gestion de la section Documents officiels (statuts, règlement intérieur, etc.)', weight: 18)]
class DocumentSectionController extends Controller
{
    public function __construct(
        private DocumentSectionService $service
    ) {}

    /** Récupère le contenu pour édition (admin) */
    public function show(): JsonResponse
    {
        $this->authorize('documents.view');

        $record = $this->service->getCurrent();

        return ApiResponse::success(
            $record ? new DocumentSectionResource($record) : null,
            'Contenu récupéré'
        );
    }

    /** Récupère le contenu publié (public) */
    public function published(): JsonResponse
    {
        $record = $this->service->getPublished();

        return ApiResponse::success(
            $record ? new DocumentSectionResource($record) : null,
            'Contenu récupéré'
        );
    }

    /**
     * Enregistre la section Documents officiels.
     * - publish=false : enregistrer simple (brouillon)
     * - publish=true : enregistrer et publier
     */
    public function save(SaveDocumentSectionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $publish = $data['publish'] ?? false;
        unset($data['publish'], $data['removed_files']);

        // Extraire les fichiers uploadés par index de document
        $uploadedFiles = [];
        if ($request->has('documents')) {
            foreach ($request->input('documents', []) as $index => $doc) {
                if ($request->hasFile("documents.{$index}.file")) {
                    $uploadedFiles[$index] = $request->file("documents.{$index}.file");
                }
            }
        }

        // Fichiers à supprimer (anciens fichiers remplacés ou documents supprimés)
        $removedFiles = $request->input('removed_files', []);

        $record = $this->service->save($data, $uploadedFiles, $removedFiles, $publish);

        return ApiResponse::success(
            new DocumentSectionResource($record),
            $publish ? 'Contenu enregistré et publié' : 'Contenu enregistré'
        );
    }
}
