<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreSlideRequest;
use App\Http\Requests\Api\V1\UpdateSlideRequest;
use App\Http\Resources\Api\V1\SlideResource;
use App\Http\Responses\ApiResponse;
use App\Models\Slide;
use App\Services\SlideService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

/**
 * Contrôleur CRUD pour les slides (carousel).
 */
#[Group('Slides', description: 'CRUD et publication des slides du carousel', weight: 5)]
class SlideController extends Controller
{
    public function __construct(
        private SlideService $slideService
    ) {}

    /** Liste tous les slides (admin) */
    public function index(): JsonResponse
    {
        $this->authorize('slides.view');

        $items = $this->slideService->list();

        return ApiResponse::success(SlideResource::collection($items), 'List retrieved');
    }

    /** Liste les slides publiés (public) */
    public function published(): JsonResponse
    {
        $items = $this->slideService->listPublished();

        return ApiResponse::success(SlideResource::collection($items), 'List retrieved');
    }

    /** Affiche un slide */
    public function show(Slide $slide): JsonResponse
    {
        $this->authorize('slides.view');

        $item = $this->slideService->find($slide);

        return ApiResponse::success(new SlideResource($item), 'Item retrieved');
    }

    /** Crée un nouveau slide */
    public function store(StoreSlideRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image_url'] = $request->file('image')->store('slides', 'public');
        }
        $item = $this->slideService->create($data);

        return ApiResponse::success(new SlideResource($item), 'Slide créé', Response::HTTP_CREATED);
    }

    /** Met à jour un slide */
    public function update(UpdateSlideRequest $request, Slide $slide): JsonResponse
    {
        $data = $request->validated();
        if ($request->boolean('remove_image')) {
            if ($slide->image_url) {
                Storage::disk('public')->delete($slide->image_url);
            }
            $data['image_url'] = null;
        } elseif ($request->hasFile('image')) {
            if ($slide->image_url) {
                Storage::disk('public')->delete($slide->image_url);
            }
            $data['image_url'] = $request->file('image')->store('slides', 'public');
        }
        unset($data['remove_image']);
        $item = $this->slideService->update($slide, $data);

        return ApiResponse::success(new SlideResource($item), 'Slide mis à jour');
    }

    /** Publie ou dépublie un slide */
    public function publish(Request $request, Slide $slide): JsonResponse
    {
        $this->authorize('slides.publish');

        $publish = $request->boolean('publish', true);
        $item = $this->slideService->publish($slide, $publish);

        return ApiResponse::success(
            new SlideResource($item),
            $publish ? 'Slide publié' : 'Slide dépublié'
        );
    }

    /** Supprime un slide */
    public function destroy(Slide $slide): JsonResponse
    {
        $this->authorize('slides.manage');

        $this->slideService->delete($slide);

        return ApiResponse::success(null, 'Slide supprimé');
    }
}
