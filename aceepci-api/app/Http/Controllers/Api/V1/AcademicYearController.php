<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreAcademicYearRequest;
use App\Http\Requests\Api\V1\UpdateAcademicYearRequest;
use App\Http\Resources\Api\V1\AcademicYearResource;
use App\Http\Responses\ApiResponse;
use App\Models\AcademicYear;
use App\Services\AcademicYearService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les années académiques.
 */
#[Group('Années académiques', description: 'CRUD des années académiques', weight: 10)]
class AcademicYearController extends Controller
{
    public function __construct(
        private AcademicYearService $academicYearService
    ) {}

    /** Liste pour les select (public, sans pagination) */
    public function options(): JsonResponse
    {
        $items = $this->academicYearService->list();

        return ApiResponse::success(AcademicYearResource::collection($items), 'List retrieved');
    }

    /** Liste toutes les années académiques (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->academicYearService->listPaginated($search, $perPage);

        return ApiResponse::success(AcademicYearResource::collection($items), 'List retrieved');
    }

    /** Affiche une année académique */
    public function show(AcademicYear $academic_year): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->academicYearService->find($academic_year);

        return ApiResponse::success(new AcademicYearResource($item), 'Item retrieved');
    }

    /** Crée une nouvelle année académique */
    public function store(StoreAcademicYearRequest $request): JsonResponse
    {
        $item = $this->academicYearService->create($request->validated());

        return ApiResponse::success(new AcademicYearResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour une année académique */
    public function update(UpdateAcademicYearRequest $request, AcademicYear $academic_year): JsonResponse
    {
        $item = $this->academicYearService->update($academic_year, $request->validated());

        return ApiResponse::success(new AcademicYearResource($item), 'Item updated');
    }

    /** Supprime une année académique */
    public function destroy(AcademicYear $academic_year): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->academicYearService->delete($academic_year);

        return ApiResponse::success(null, 'Item deleted');
    }
}
