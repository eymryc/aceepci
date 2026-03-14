<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreDailyVerseRequest;
use App\Http\Requests\Api\V1\UpdateDailyVerseRequest;
use App\Http\Resources\Api\V1\DailyVerseResource;
use App\Http\Responses\ApiResponse;
use App\Models\DailyVerse;
use App\Services\DailyVerseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

/**
 * Contrôleur CRUD et publication pour le verset du jour.
 */
#[Group('Verset du jour', description: 'CRUD et publication du verset affiché sur la page d\'accueil', weight: 6)]
class DailyVerseController extends Controller
{
    public function __construct(
        private DailyVerseService $dailyVerseService
    ) {}

    /** Liste tous les versets (historique) avec pagination et recherche */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('daily-verses.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->dailyVerseService->listPaginated($search, $perPage);

        return ApiResponse::success(DailyVerseResource::collection($items), 'List retrieved');
    }

    /** Récupère le verset publié (public) */
    public function published(): JsonResponse
    {
        $verse = $this->dailyVerseService->getPublished();

        return ApiResponse::success(
            $verse ? new DailyVerseResource($verse) : null,
            'Verse retrieved'
        );
    }

    /** Affiche un verset */
    public function show(DailyVerse $daily_verse): JsonResponse
    {
        $this->authorize('daily-verses.view');

        $item = $this->dailyVerseService->find($daily_verse);

        return ApiResponse::success(new DailyVerseResource($item), 'Item retrieved');
    }

    /** Crée un nouveau verset */
    public function store(StoreDailyVerseRequest $request): JsonResponse
    {
        $data = $request->validated();
        $publish = $data['publish'] ?? false;
        unset($data['publish']);

        if ($request->hasFile('image')) {
            $data['image_url'] = $request->file('image')->store('daily-verses', 'public');
        }

        $item = $this->dailyVerseService->create($data);

        if ($publish) {
            $item = $this->dailyVerseService->publish($item);
        }

        return ApiResponse::success(new DailyVerseResource($item), 'Verset créé', Response::HTTP_CREATED);
    }

    /** Met à jour un verset */
    public function update(UpdateDailyVerseRequest $request, DailyVerse $daily_verse): JsonResponse
    {
        $data = $request->validated();

        if ($request->boolean('remove_image')) {
            if ($daily_verse->image_url) {
                Storage::disk('public')->delete($daily_verse->image_url);
            }
            $data['image_url'] = null;
        } elseif ($request->hasFile('image')) {
            if ($daily_verse->image_url) {
                Storage::disk('public')->delete($daily_verse->image_url);
            }
            $data['image_url'] = $request->file('image')->store('daily-verses', 'public');
        }
        unset($data['remove_image']);

        $item = $this->dailyVerseService->update($daily_verse, $data);

        return ApiResponse::success(new DailyVerseResource($item), 'Verset mis à jour');
    }

    /** Publie un verset (le rend visible sur la page d'accueil) */
    public function publish(DailyVerse $daily_verse): JsonResponse
    {
        $this->authorize('daily-verses.publish');

        $item = $this->dailyVerseService->publish($daily_verse);

        return ApiResponse::success(new DailyVerseResource($item), 'Verset publié');
    }

    /** Supprime un verset */
    public function destroy(DailyVerse $daily_verse): JsonResponse
    {
        $this->authorize('daily-verses.manage');

        $this->dailyVerseService->delete($daily_verse);

        return ApiResponse::success(null, 'Verset supprimé');
    }
}
