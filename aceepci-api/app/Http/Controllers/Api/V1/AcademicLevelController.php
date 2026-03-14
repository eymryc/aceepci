<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreAcademicLevelRequest;
use App\Http\Requests\Api\V1\UpdateAcademicLevelRequest;
use App\Http\Resources\Api\V1\AcademicLevelResource;
use App\Http\Responses\ApiResponse;
use App\Models\AcademicLevel;
use App\Services\AcademicLevelService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les niveaux académiques.
 */
#[Group('Niveaux académiques', description: 'CRUD des niveaux académiques', weight: 12)]
class AcademicLevelController extends Controller
{
    public function __construct(
        private AcademicLevelService $service
    ) {}

    /** Liste pour les select (public, filtrable par member_type_id) */
    public function options(Request $request): JsonResponse
    {
        $memberTypeId = $request->query('member_type_id') ? (int) $request->query('member_type_id') : null;
        $items = $this->service->list($memberTypeId);

        return ApiResponse::success(AcademicLevelResource::collection($items), 'List retrieved');
    }

    /** Liste paginée (admin) */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->service->listPaginated($search, $perPage);

        return ApiResponse::success(AcademicLevelResource::collection($items), 'List retrieved');
    }

    /** Détail */
    public function show(AcademicLevel $academic_level): JsonResponse
    {
        $this->authorize('parameters.view');

        return ApiResponse::success(new AcademicLevelResource($this->service->find($academic_level)), 'Item retrieved');
    }

    /** Création */
    public function store(StoreAcademicLevelRequest $request): JsonResponse
    {
        $item = $this->service->create($request->validated());

        return ApiResponse::success(new AcademicLevelResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour */
    public function update(UpdateAcademicLevelRequest $request, AcademicLevel $academic_level): JsonResponse
    {
        $item = $this->service->update($academic_level, $request->validated());

        return ApiResponse::success(new AcademicLevelResource($item), 'Item updated');
    }

    /** Suppression */
    public function destroy(AcademicLevel $academic_level): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->service->delete($academic_level);

        return ApiResponse::success(null, 'Item deleted');
    }
}
