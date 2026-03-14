<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreGalleryMediaCategoryRequest;
use App\Http\Requests\Api\V1\UpdateGalleryMediaCategoryRequest;
use App\Http\Resources\Api\V1\GalleryMediaCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\GalleryMediaCategory;
use App\Services\GalleryMediaCategoryService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Catégories galerie média', description: 'Paramétrage des catégories de la galerie média (Formation, Réunion, Culture, etc.)', weight: 18)]
class GalleryMediaCategoryController extends Controller
{
    public function __construct(
        private GalleryMediaCategoryService $galleryMediaCategoryService
    ) {}

    /** Liste des catégories pour les listes déroulantes (public) */
    public function options(): JsonResponse
    {
        return ApiResponse::success(
            GalleryMediaCategoryResource::collection($this->galleryMediaCategoryService->list()),
            'List retrieved'
        );
    }

    /** Liste paginée des catégories */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $paginator = $this->galleryMediaCategoryService->listPaginated($search, $perPage);

        return ApiResponse::success(
            GalleryMediaCategoryResource::collection($paginator),
            'List retrieved'
        );
    }

    /** Détail d'une catégorie */
    public function show(GalleryMediaCategory $gallery_media_category): JsonResponse
    {
        return ApiResponse::success(
            new GalleryMediaCategoryResource($this->galleryMediaCategoryService->find($gallery_media_category)),
            'Item retrieved'
        );
    }

    /** Création d'une catégorie */
    public function store(StoreGalleryMediaCategoryRequest $request): JsonResponse
    {
        $item = $this->galleryMediaCategoryService->create($request->validated());

        return ApiResponse::success(
            new GalleryMediaCategoryResource($item),
            'Item created',
            Response::HTTP_CREATED
        );
    }

    /** Mise à jour d'une catégorie */
    public function update(UpdateGalleryMediaCategoryRequest $request, GalleryMediaCategory $gallery_media_category): JsonResponse
    {
        $item = $this->galleryMediaCategoryService->update($gallery_media_category, $request->validated());

        return ApiResponse::success(new GalleryMediaCategoryResource($item), 'Item updated');
    }

    /** Suppression d'une catégorie */
    public function destroy(GalleryMediaCategory $gallery_media_category): JsonResponse
    {
        $this->galleryMediaCategoryService->delete($gallery_media_category);

        return ApiResponse::success(null, 'Item deleted');
    }
}
