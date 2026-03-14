<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreGalleryMediaRequest;
use App\Http\Requests\Api\V1\UpdateGalleryMediaRequest;
use App\Http\Resources\Api\V1\GalleryMediaResource;
use App\Http\Responses\ApiResponse;
use App\Models\GalleryMedia;
use App\Services\GalleryMediaService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

#[Group('Galerie média', description: 'CRUD galerie photos (accueil, section galerie)', weight: 6)]
class GalleryMediaController extends Controller
{
    public function __construct(
        private GalleryMediaService $galleryMediaService
    ) {}

    /** Liste paginée pour l'admin */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('gallery.view');

        $search = $request->query('search');
        $status = $request->query('status');
        $perPage = (int) $request->query('per_page', 12);
        $perPage = $perPage > 0 ? min($perPage, 100) : 12;

        $items = $this->galleryMediaService->listForAdmin($search, $perPage, $status);

        return ApiResponse::success(GalleryMediaResource::collection($items), 'List retrieved');
    }

    /** Liste pour le site (page d'accueil, galerie) */
    public function published(Request $request): JsonResponse
    {
        $limit = $request->query('limit') ? (int) $request->query('limit') : null;
        $items = $this->galleryMediaService->listPublished($limit);

        return ApiResponse::success(GalleryMediaResource::collection($items), 'List retrieved');
    }

    /** Détail d'une entrée (admin) */
    public function show(GalleryMedia $galleryMedia): JsonResponse
    {
        $this->authorize('gallery.view');

        return ApiResponse::success(
            new GalleryMediaResource($this->galleryMediaService->find($galleryMedia)),
            'Item retrieved'
        );
    }

    /** Créer une entrée */
    public function store(StoreGalleryMediaRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('gallery_media', 'public');
        }
        unset($data['image']);
        $item = $this->galleryMediaService->create($data);

        return ApiResponse::success(new GalleryMediaResource($item), 'Photo ajoutée', Response::HTTP_CREATED);
    }

    /** Mettre à jour une entrée */
    public function update(UpdateGalleryMediaRequest $request, GalleryMedia $galleryMedia): JsonResponse
    {
        $data = $request->validated();
        if ($request->boolean('remove_image')) {
            if ($galleryMedia->image_path) {
                Storage::disk('public')->delete($galleryMedia->image_path);
            }
            $data['image_path'] = null;
        } elseif ($request->hasFile('image')) {
            if ($galleryMedia->image_path) {
                Storage::disk('public')->delete($galleryMedia->image_path);
            }
            $data['image_path'] = $request->file('image')->store('gallery_media', 'public');
        }
        unset($data['image'], $data['remove_image']);
        $item = $this->galleryMediaService->update($galleryMedia, $data);

        return ApiResponse::success(new GalleryMediaResource($item), 'Photo mise à jour');
    }

    /** Supprimer une entrée */
    public function destroy(GalleryMedia $galleryMedia): JsonResponse
    {
        $this->authorize('gallery.manage');

        $this->galleryMediaService->delete($galleryMedia);

        return ApiResponse::success(null, 'Photo supprimée');
    }

    /** Publier une photo (visible sur le site) */
    public function publish(GalleryMedia $galleryMedia): JsonResponse
    {
        $this->authorize('gallery.manage');

        $item = $this->galleryMediaService->publish($galleryMedia);

        return ApiResponse::success(new GalleryMediaResource($item), 'Photo publiée');
    }

    /** Dépublier une photo (brouillon, plus visible sur le site) */
    public function unpublish(GalleryMedia $galleryMedia): JsonResponse
    {
        $this->authorize('gallery.manage');

        $item = $this->galleryMediaService->unpublish($galleryMedia);

        return ApiResponse::success(new GalleryMediaResource($item), 'Photo dépubliée');
    }
}
