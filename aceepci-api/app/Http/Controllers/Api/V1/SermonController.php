<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreSermonRequest;
use App\Http\Requests\Api\V1\UpdateSermonRequest;
use App\Http\Resources\Api\V1\SermonResource;
use App\Http\Responses\ApiResponse;
use App\Models\Sermon;
use App\Services\SermonService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

#[Group('Sermons', description: 'CRUD des sermons (vidéo, audio, texte)', weight: 6)]
class SermonController extends Controller
{
    public function __construct(
        private SermonService $sermonService
    ) {}

    /** Liste des sermons publiés (site public) */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $type = $request->query('type');
        $perPage = (int) $request->query('per_page', 12);
        $perPage = $perPage > 0 ? min($perPage, 100) : 12;

        $items = $this->sermonService->listPublished($search, $type, $perPage);

        return ApiResponse::success(SermonResource::collection($items), 'List retrieved');
    }

    /** Liste des sermons pour l'admin */
    public function adminIndex(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $type = $request->query('type');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;
        $status = $request->query('status');

        $items = $this->sermonService->listForAdmin($search, $type, $perPage, $status);

        return ApiResponse::success(SermonResource::collection($items), 'List retrieved');
    }

    /** Détail d'un sermon (admin, par id) */
    public function show(Sermon $sermon): JsonResponse
    {
        return ApiResponse::success(
            new SermonResource($this->sermonService->find($sermon)),
            'Item retrieved'
        );
    }

    /** Détail d'un sermon (slug ou id) pour le site, avec incrément de vues */
    public function showForSite(string $slugOrId): JsonResponse
    {
        $sermon = $this->sermonService->findBySlugOrId($slugOrId);

        if (! $sermon || ! $sermon->is_published) {
            return ApiResponse::error('Sermon introuvable', null, Response::HTTP_NOT_FOUND);
        }

        $sermon = $this->sermonService->incrementViews($sermon);

        return ApiResponse::success(
            new SermonResource($this->sermonService->find($sermon)),
            'Item retrieved'
        );
    }

    /** Création d'un sermon (admin) */
    public function store(StoreSermonRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->store('sermons/covers', 'public');
        }
        unset($data['cover_image']);

        $sermon = $this->sermonService->create($data);

        return ApiResponse::success(new SermonResource($sermon), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour d'un sermon (admin) */
    public function update(UpdateSermonRequest $request, Sermon $sermon): JsonResponse
    {
        $data = $request->validated();

        if ($request->boolean('remove_cover_image') && $sermon->cover_image_path) {
            Storage::disk('public')->delete($sermon->cover_image_path);
            $data['cover_image_path'] = null;
        } elseif ($request->hasFile('cover_image')) {
            if ($sermon->cover_image_path) {
                Storage::disk('public')->delete($sermon->cover_image_path);
            }
            $data['cover_image_path'] = $request->file('cover_image')->store('sermons/covers', 'public');
        }
        unset($data['cover_image'], $data['remove_cover_image']);

        $sermon = $this->sermonService->update($sermon, $data);

        return ApiResponse::success(new SermonResource($sermon), 'Item updated');
    }

    /** Suppression d'un sermon (admin) */
    public function destroy(Sermon $sermon): JsonResponse
    {
        if ($sermon->cover_image_path) {
            Storage::disk('public')->delete($sermon->cover_image_path);
        }
        $this->sermonService->delete($sermon);

        return ApiResponse::success(null, 'Item deleted');
    }

    /** Publier un sermon */
    public function publish(Sermon $sermon): JsonResponse
    {
        $sermon = $this->sermonService->publish($sermon);

        return ApiResponse::success(new SermonResource($sermon), 'Published');
    }

    /** Dépublier un sermon */
    public function unpublish(Sermon $sermon): JsonResponse
    {
        $sermon = $this->sermonService->unpublish($sermon);

        return ApiResponse::success(new SermonResource($sermon), 'Unpublished');
    }
}
