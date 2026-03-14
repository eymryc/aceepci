<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreFieldOfStudyRequest;
use App\Http\Requests\Api\V1\UpdateFieldOfStudyRequest;
use App\Http\Resources\Api\V1\FieldOfStudyResource;
use App\Http\Responses\ApiResponse;
use App\Models\FieldOfStudy;
use App\Services\FieldOfStudyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les domaines de formation.
 */
#[Group('Domaines de formation', description: 'CRUD des domaines de formation', weight: 10)]
class FieldOfStudyController extends Controller
{
    public function __construct(
        private FieldOfStudyService $fieldOfStudyService
    ) {}

    /** Liste pour les select (public, sans pagination) */
    public function options(): JsonResponse
    {
        $items = $this->fieldOfStudyService->list();

        return ApiResponse::success(FieldOfStudyResource::collection($items), 'List retrieved');
    }

    /** Liste tous les domaines de formation (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->fieldOfStudyService->listPaginated($search, $perPage);

        return ApiResponse::success(FieldOfStudyResource::collection($items), 'List retrieved');
    }

    /** Affiche un domaine de formation */
    public function show(FieldOfStudy $field_of_study): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->fieldOfStudyService->find($field_of_study);

        return ApiResponse::success(new FieldOfStudyResource($item), 'Item retrieved');
    }

    /** Crée un nouveau domaine de formation */
    public function store(StoreFieldOfStudyRequest $request): JsonResponse
    {
        $item = $this->fieldOfStudyService->create($request->validated());

        return ApiResponse::success(new FieldOfStudyResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour un domaine de formation */
    public function update(UpdateFieldOfStudyRequest $request, FieldOfStudy $field_of_study): JsonResponse
    {
        $item = $this->fieldOfStudyService->update($field_of_study, $request->validated());

        return ApiResponse::success(new FieldOfStudyResource($item), 'Item updated');
    }

    /** Supprime un domaine de formation */
    public function destroy(FieldOfStudy $field_of_study): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->fieldOfStudyService->delete($field_of_study);

        return ApiResponse::success(null, 'Item deleted');
    }
}
