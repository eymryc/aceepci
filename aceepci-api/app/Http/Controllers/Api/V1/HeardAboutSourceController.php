<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreHeardAboutSourceRequest;
use App\Http\Requests\Api\V1\UpdateHeardAboutSourceRequest;
use App\Http\Resources\Api\V1\HeardAboutSourceResource;
use App\Http\Responses\ApiResponse;
use App\Models\HeardAboutSource;
use App\Services\HeardAboutSourceService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les sources de connaissance ACEEPCI.
 */
#[Group('Sources de connaissance', description: 'CRUD des sources « Comment avez-vous connu l\'ACEEPCI ? »', weight: 13)]
class HeardAboutSourceController extends Controller
{
    public function __construct(
        private HeardAboutSourceService $service
    ) {}

    /** Liste pour les select (public) */
    public function options(): JsonResponse
    {
        $items = $this->service->list();

        return ApiResponse::success(HeardAboutSourceResource::collection($items), 'List retrieved');
    }

    /** Liste paginée (admin) */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->service->listPaginated($search, $perPage);

        return ApiResponse::success(HeardAboutSourceResource::collection($items), 'List retrieved');
    }

    /** Détail */
    public function show(HeardAboutSource $heard_about_source): JsonResponse
    {
        $this->authorize('parameters.view');

        return ApiResponse::success(new HeardAboutSourceResource($this->service->find($heard_about_source)), 'Item retrieved');
    }

    /** Création */
    public function store(StoreHeardAboutSourceRequest $request): JsonResponse
    {
        $item = $this->service->create($request->validated());

        return ApiResponse::success(new HeardAboutSourceResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour */
    public function update(UpdateHeardAboutSourceRequest $request, HeardAboutSource $heard_about_source): JsonResponse
    {
        $item = $this->service->update($heard_about_source, $request->validated());

        return ApiResponse::success(new HeardAboutSourceResource($item), 'Item updated');
    }

    /** Suppression */
    public function destroy(HeardAboutSource $heard_about_source): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->service->delete($heard_about_source);

        return ApiResponse::success(null, 'Item deleted');
    }
}
