<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreDevotionalCommentRequest;
use App\Http\Requests\Api\V1\StoreDevotionalRequest;
use App\Http\Requests\Api\V1\UpdateDevotionalRequest;
use App\Http\Resources\Api\V1\DevotionalCommentResource;
use App\Http\Resources\Api\V1\DevotionalResource;
use App\Http\Responses\ApiResponse;
use App\Models\Devotional;
use App\Models\DevotionalComment;
use App\Services\CaptchaService;
use App\Services\DevotionalService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

#[Group('Dévotionnels', description: 'CRUD des dévotionnels (méditations quotidiennes)', weight: 5)]
class DevotionalController extends Controller
{
    public function __construct(
        private DevotionalService $devotionalService,
        private CaptchaService $captchaService
    ) {}

    /** Liste des dévotionnels publiés (site public) */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categoryId = $request->query('devotional_category_id') ? (int) $request->query('devotional_category_id') : null;
        $perPage = (int) $request->query('per_page', 12);
        $perPage = $perPage > 0 ? min($perPage, 100) : 12;

        $items = $this->devotionalService->listPublished($search, $categoryId, $perPage);

        return ApiResponse::success(DevotionalResource::collection($items), 'List retrieved');
    }

    /** Liste des dévotionnels pour l'admin (tous statuts, avec filtre) */
    public function adminIndex(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categoryId = $request->query('devotional_category_id') ? (int) $request->query('devotional_category_id') : null;
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;
        $status = $request->query('status');

        $items = $this->devotionalService->listForAdmin($search, $categoryId, $perPage, $status);

        return ApiResponse::success(DevotionalResource::collection($items), 'List retrieved');
    }

    /** Détail d'un dévotionnel (par id) */
    public function show(Devotional $devotional): JsonResponse
    {
        return ApiResponse::success(
            new DevotionalResource($this->devotionalService->find($devotional)),
            'Item retrieved'
        );
    }

    /** Détail d'un dévotionnel (slug ou id) pour le site, avec incrément de vues */
    public function showForSite(string $slugOrId): JsonResponse
    {
        $devotional = $this->devotionalService->findBySlugOrId($slugOrId);

        if (! $devotional || ! $devotional->is_published) {
            return ApiResponse::error('Dévotion introuvable', null, Response::HTTP_NOT_FOUND);
        }

        $devotional = $this->devotionalService->incrementViews($devotional);

        return ApiResponse::success(
            new DevotionalResource($this->devotionalService->find($devotional)),
            'Item retrieved'
        );
    }

    /** Création d'un dévotionnel (admin) */
    public function store(StoreDevotionalRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->store('devotionals/covers', 'public');
        }
        unset($data['cover_image']);

        $devotional = $this->devotionalService->create($data);

        return ApiResponse::success(new DevotionalResource($devotional), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour d'un dévotionnel (admin) */
    public function update(UpdateDevotionalRequest $request, Devotional $devotional): JsonResponse
    {
        $data = $request->validated();

        if ($request->boolean('remove_cover_image') && $devotional->cover_image_path) {
            Storage::disk('public')->delete($devotional->cover_image_path);
            $data['cover_image_path'] = null;
        } elseif ($request->hasFile('cover_image')) {
            if ($devotional->cover_image_path) {
                Storage::disk('public')->delete($devotional->cover_image_path);
            }
            $data['cover_image_path'] = $request->file('cover_image')->store('devotionals/covers', 'public');
        }
        unset($data['cover_image'], $data['remove_cover_image']);

        $devotional = $this->devotionalService->update($devotional, $data);

        return ApiResponse::success(new DevotionalResource($devotional), 'Item updated');
    }

    /** Suppression d'un dévotionnel (admin) */
    public function destroy(Devotional $devotional): JsonResponse
    {
        if ($devotional->cover_image_path) {
            Storage::disk('public')->delete($devotional->cover_image_path);
        }
        $this->devotionalService->delete($devotional);

        return ApiResponse::success(null, 'Item deleted');
    }

    /** Publication d'un dévotionnel (admin) */
    public function publish(Devotional $devotional): JsonResponse
    {
        $devotional = $this->devotionalService->publish($devotional);

        return ApiResponse::success(new DevotionalResource($devotional), 'Devotional published');
    }

    /** Dépublication d'un dévotionnel (admin) */
    public function unpublish(Devotional $devotional): JsonResponse
    {
        $devotional = $this->devotionalService->unpublish($devotional);

        return ApiResponse::success(new DevotionalResource($devotional), 'Devotional unpublished');
    }

    /** Liste des commentaires d'un dévotionnel (site public) */
    public function comments(string $slugOrId, Request $request): JsonResponse
    {
        $devotional = $this->devotionalService->findBySlugOrId($slugOrId);

        if (! $devotional || ! $devotional->is_published) {
            return ApiResponse::error('Dévotion introuvable', null, Response::HTTP_NOT_FOUND);
        }

        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? min($perPage, 100) : 10;

        $comments = $devotional->comments()
            ->where('is_approved', true)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return ApiResponse::success(
            DevotionalCommentResource::collection($comments),
            'Comments retrieved'
        );
    }

    /** Ajout d'un commentaire / témoignage (site public) */
    public function addComment(StoreDevotionalCommentRequest $request, string $slugOrId): JsonResponse
    {
        $devotional = $this->devotionalService->findBySlugOrId($slugOrId);

        if (! $devotional || ! $devotional->is_published || ! $devotional->comments_enabled) {
            return ApiResponse::error('Dévotion introuvable ou commentaires désactivés', null, Response::HTTP_BAD_REQUEST);
        }

        $captchaToken = (string) $request->input('captcha_token', '');
        if (! $this->captchaService->verify($captchaToken, $request->ip())) {
            return ApiResponse::error('Vérification CAPTCHA échouée', ['captcha' => ['Token invalide ou expiré']], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validated = $request->validated();
        unset($validated['captcha_token']);

        $comment = new DevotionalComment($validated);
        $comment->devotional()->associate($devotional);
        $comment->save();

        return ApiResponse::success(
            new DevotionalCommentResource($comment),
            'Comment created',
            Response::HTTP_CREATED
        );
    }

    /** Enregistrement d'une réaction (Amen, Béni, Édifiant) - site public */
    public function react(Request $request, string $slugOrId): JsonResponse
    {
        $devotional = $this->devotionalService->findBySlugOrId($slugOrId);

        if (! $devotional || ! $devotional->is_published || ! $devotional->reactions_enabled) {
            return ApiResponse::error('Dévotion introuvable ou réactions désactivées', null, Response::HTTP_BAD_REQUEST);
        }

        $type = $request->input('type', 'amen');
        if (! in_array($type, ['amen', 'beni', 'edifiant'], true)) {
            return ApiResponse::error('Type de réaction invalide', null, Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $userId = $request->user()?->id;
        $ip = $request->ip();

        $devotional = $this->devotionalService->addReaction($devotional, $type, $userId, $ip);

        return ApiResponse::success(new DevotionalResource($this->devotionalService->find($devotional)), 'Reaction recorded');
    }

    /** Liste des commentaires d'un dévotionnel (admin, tous statuts) */
    public function adminComments(Devotional $devotional, Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 20);
        $perPage = $perPage > 0 ? min($perPage, 100) : 20;

        $comments = $devotional->comments()->orderByDesc('created_at')->paginate($perPage);

        return ApiResponse::success(
            DevotionalCommentResource::collection($comments),
            'Comments retrieved'
        );
    }

    /** Approuver / désapprouver un commentaire (admin) */
    public function approveComment(Request $request, DevotionalComment $devotionalComment): JsonResponse
    {
        $approve = $request->boolean('is_approved', true);
        $devotionalComment->forceFill(['is_approved' => $approve])->save();

        return ApiResponse::success(
            new DevotionalCommentResource($devotionalComment->refresh()),
            $approve ? 'Comment approved' : 'Comment unapproved'
        );
    }

    /** Suppression d'un commentaire (admin) */
    public function destroyComment(DevotionalComment $devotionalComment): JsonResponse
    {
        $devotionalComment->delete();

        return ApiResponse::success(null, 'Comment deleted');
    }
}

