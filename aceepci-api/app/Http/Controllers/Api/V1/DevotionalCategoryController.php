<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreDevotionalCategoryRequest;
use App\Http\Requests\Api\V1\UpdateDevotionalCategoryRequest;
use App\Http\Resources\Api\V1\DevotionalCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\DevotionalCategory;
use App\Services\DevotionalCategoryService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Catégories de dévotionnels', description: 'Paramétrage des catégories de dévotionnels (Dévotion quotidienne, Foi, Prière, Amour, etc.)', weight: 17)]
class DevotionalCategoryController extends Controller
{
    public function __construct(
        private DevotionalCategoryService $devotionalCategoryService
    ) {}

    /** Liste des catégories de dévotionnels pour les listes déroulantes (public) */
    public function options(): JsonResponse
    {
        return ApiResponse::success(
            DevotionalCategoryResource::collection($this->devotionalCategoryService->list()),
            'List retrieved'
        );
    }

    /** Liste paginée des catégories de dévotionnels */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $paginator = $this->devotionalCategoryService->listPaginated($search, $perPage);

        return ApiResponse::success(
            DevotionalCategoryResource::collection($paginator),
            'List retrieved'
        );
    }

    /** Détail d'une catégorie de dévotionnel */
    public function show(DevotionalCategory $devotional_category): JsonResponse
    {
        return ApiResponse::success(
            new DevotionalCategoryResource($this->devotionalCategoryService->find($devotional_category)),
            'Item retrieved'
        );
    }

    /** Création d'une catégorie de dévotionnel */
    public function store(StoreDevotionalCategoryRequest $request): JsonResponse
    {
        $item = $this->devotionalCategoryService->create($request->validated());

        return ApiResponse::success(
            new DevotionalCategoryResource($item),
            'Item created',
            Response::HTTP_CREATED
        );
    }

    /** Mise à jour d'une catégorie de dévotionnel */
    public function update(UpdateDevotionalCategoryRequest $request, DevotionalCategory $devotional_category): JsonResponse
    {
        $item = $this->devotionalCategoryService->update($devotional_category, $request->validated());

        return ApiResponse::success(new DevotionalCategoryResource($item), 'Item updated');
    }

    /** Suppression d'une catégorie de dévotionnel */
    public function destroy(DevotionalCategory $devotional_category): JsonResponse
    {
        $this->devotionalCategoryService->delete($devotional_category);

        return ApiResponse::success(null, 'Item deleted');
    }
}
