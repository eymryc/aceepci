<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreNewsCategoryRequest;
use App\Http\Requests\Api\V1\UpdateNewsCategoryRequest;
use App\Http\Resources\Api\V1\NewsCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\NewsCategory;
use App\Services\NewsCategoryService;
use Dedoc\Scramble\Attributes\Endpoint;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Catégories d\'articles', description: 'Paramétrage des catégories d\'articles / actualités', weight: 17)]
class NewsCategoryController extends Controller
{
    public function __construct(
        private NewsCategoryService $newsCategoryService
    ) {}

    /** Liste des catégories d'articles pour les listes déroulantes */
    public function options(): JsonResponse
    {
        return ApiResponse::success(
            NewsCategoryResource::collection($this->newsCategoryService->list()),
            'List retrieved'
        );
    }

    /** Liste paginée des catégories d'articles */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        return ApiResponse::success(
            NewsCategoryResource::collection($this->newsCategoryService->listPaginated($search, $perPage)),
            'List retrieved'
        );
    }

    /** Détail d'une catégorie d'article */
    public function show(NewsCategory $news_category): JsonResponse
    {
        return ApiResponse::success(
            new NewsCategoryResource($this->newsCategoryService->find($news_category)),
            'Item retrieved'
        );
    }

    /** Création d'une catégorie d'article */
    public function store(StoreNewsCategoryRequest $request): JsonResponse
    {
        $item = $this->newsCategoryService->create($request->validated());

        return ApiResponse::success(new NewsCategoryResource($item), 'Item created', Response::HTTP_CREATED);
    }

    #[Endpoint(title: "Mise à jour d'une catégorie d'article", operationId: 'newsCategoryUpdate')]
    public function update(UpdateNewsCategoryRequest $request, NewsCategory $news_category): JsonResponse
    {
        $item = $this->newsCategoryService->update($news_category, $request->validated());

        return ApiResponse::success(new NewsCategoryResource($item), 'Item updated');
    }

    /** Suppression d'une catégorie d'article */
    public function destroy(NewsCategory $news_category): JsonResponse
    {
        $this->newsCategoryService->delete($news_category);

        return ApiResponse::success(null, 'Item deleted');
    }
}

