<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreBlogCategoryRequest;
use App\Http\Requests\Api\V1\UpdateBlogCategoryRequest;
use App\Http\Resources\Api\V1\BlogCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\BlogCategory;
use App\Services\BlogCategoryService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Catégories de blogs', description: 'Paramétrage des catégories de blogs', weight: 18)]
class BlogCategoryController extends Controller
{
    public function __construct(
        private BlogCategoryService $blogCategoryService
    ) {}

    /** Liste des catégories de blogs pour les listes déroulantes */
    public function options(): JsonResponse
    {
        return ApiResponse::success(
            BlogCategoryResource::collection($this->blogCategoryService->list()),
            'List retrieved'
        );
    }

    /** Liste paginée des catégories de blogs */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        return ApiResponse::success(
            BlogCategoryResource::collection($this->blogCategoryService->listPaginated($search, $perPage)),
            'List retrieved'
        );
    }

    /** Détail d'une catégorie de blog */
    public function show(BlogCategory $blog_category): JsonResponse
    {
        return ApiResponse::success(
            new BlogCategoryResource($this->blogCategoryService->find($blog_category)),
            'Item retrieved'
        );
    }

    /** Création d'une catégorie de blog */
    public function store(StoreBlogCategoryRequest $request): JsonResponse
    {
        $item = $this->blogCategoryService->create($request->validated());

        return ApiResponse::success(new BlogCategoryResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour d'une catégorie de blog */
    public function update(UpdateBlogCategoryRequest $request, BlogCategory $blog_category): JsonResponse
    {
        $item = $this->blogCategoryService->update($blog_category, $request->validated());

        return ApiResponse::success(new BlogCategoryResource($item), 'Item updated');
    }

    /** Suppression d'une catégorie de blog */
    public function destroy(BlogCategory $blog_category): JsonResponse
    {
        $this->blogCategoryService->delete($blog_category);

        return ApiResponse::success(null, 'Item deleted');
    }
}
