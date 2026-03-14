<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreNewsCommentRequest;
use App\Http\Requests\Api\V1\StoreNewsRequest;
use App\Http\Requests\Api\V1\UpdateNewsRequest;
use App\Http\Resources\Api\V1\NewsCommentResource;
use App\Http\Resources\Api\V1\NewsResource;
use App\Http\Responses\ApiResponse;
use App\Models\News;
use App\Models\NewsComment;
use App\Services\CaptchaService;
use App\Services\NewsService;
use Dedoc\Scramble\Attributes\Endpoint;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

#[Group('Actualités', description: 'CRUD des actualités et interactions (likes, commentaires, vues)', weight: 4)]
class NewsController extends Controller
{
    public function __construct(
        private NewsService $newsService,
        private CaptchaService $captchaService
    ) {}

    /** Liste des actualités publiées (site public) */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categoryId = $request->query('news_category_id') ? (int) $request->query('news_category_id') : null;
        $perPage = (int) $request->query('per_page', 12);
        $perPage = $perPage > 0 ? min($perPage, 100) : 12;
        $items = $this->newsService->listPublished($search, $categoryId, $perPage);

        return ApiResponse::success(NewsResource::collection($items), 'List retrieved');
    }

    /** Liste des actualités pour l'admin (tous statuts, avec filtre) */
    public function adminIndex(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categoryId = $request->query('news_category_id') ? (int) $request->query('news_category_id') : null;
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;
        $status = $request->query('status'); // 'published', 'draft' ou null

        $items = $this->newsService->listForAdmin($search, $categoryId, $perPage, $status);

        return ApiResponse::success(NewsResource::collection($items), 'List retrieved');
    }

    /** Détail d'une actualité (par id) */
    public function show(News $news): JsonResponse
    {
        return ApiResponse::success(
            new NewsResource($this->newsService->find($news)),
            'Item retrieved'
        );
    }

    /** Détail d'une actualité (slug ou id) pour le site, avec incrément de vues */
    #[Endpoint(title: "Détail d'une actualité (site)", operationId: 'siteNewsShow')]
    public function showForSite(string $slugOrId): JsonResponse
    {
        $news = $this->newsService->findBySlugOrId($slugOrId);

        if (! $news || ! $news->is_published) {
            return ApiResponse::error('Actualité introuvable', null, Response::HTTP_NOT_FOUND);
        }

        $news = $this->newsService->incrementViews($news);

        return ApiResponse::success(
            new NewsResource($this->newsService->find($news)),
            'Item retrieved'
        );
    }

    /** Création d'une actualité (admin) */
    public function store(StoreNewsRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->store('news/covers', 'public');
        }
        unset($data['cover_image']);

        if ($request->hasFile('author_avatar')) {
            $data['author_avatar_path'] = $request->file('author_avatar')->store('news/authors', 'public');
        }
        unset($data['author_avatar']);

        $data['gallery'] = $this->buildGalleryPathsFromRequest($request, $data['gallery'] ?? []);

        $news = $this->newsService->create($data);

        return ApiResponse::success(new NewsResource($news), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour d'une actualité (admin) */
    public function update(UpdateNewsRequest $request, News $news): JsonResponse
    {
        $data = $request->validated();

        if ($request->boolean('remove_cover_image') && $news->cover_image_path) {
            Storage::disk('public')->delete($news->cover_image_path);
            $data['cover_image_path'] = null;
        } elseif ($request->hasFile('cover_image')) {
            if ($news->cover_image_path) {
                Storage::disk('public')->delete($news->cover_image_path);
            }
            $data['cover_image_path'] = $request->file('cover_image')->store('news/covers', 'public');
        }
        unset($data['cover_image'], $data['remove_cover_image']);

        if ($request->boolean('remove_author_avatar') && $news->author_avatar_path) {
            Storage::disk('public')->delete($news->author_avatar_path);
            $data['author_avatar_path'] = null;
        } elseif ($request->hasFile('author_avatar')) {
            if ($news->author_avatar_path) {
                Storage::disk('public')->delete($news->author_avatar_path);
            }
            $data['author_avatar_path'] = $request->file('author_avatar')->store('news/authors', 'public');
        }
        unset($data['author_avatar'], $data['remove_author_avatar']);

        if (array_key_exists('gallery', $data)) {
            $data['gallery'] = $this->buildGalleryPathsFromRequest($request, $data['gallery']);
            $this->deleteRemovedGalleryFiles($news->gallery ?? [], $data['gallery']);
        }

        $news = $this->newsService->update($news, $data);

        return ApiResponse::success(new NewsResource($news), 'Item updated');
    }

    /** Suppression d'une actualité (admin) */
    public function destroy(News $news): JsonResponse
    {
        $this->newsService->delete($news);

        return ApiResponse::success(null, 'Item deleted');
    }

    /** Publication d'une actualité (admin) */
    public function publish(News $news): JsonResponse
    {
        $news = $this->newsService->publish($news);

        return ApiResponse::success(new NewsResource($news), 'News published');
    }

    /** Dépublication d'une actualité (admin) */
    public function unpublish(News $news): JsonResponse
    {
        $news = $this->newsService->unpublish($news);

        return ApiResponse::success(new NewsResource($news), 'News unpublished');
    }

    /** Enregistrement d'un like/réaction (site) */
    public function react(Request $request, string $slugOrId): JsonResponse
    {
        $news = $this->newsService->findBySlugOrId($slugOrId);

        if (! $news || ! $news->is_published || ! $news->reactions_enabled) {
            return ApiResponse::error('Actualité introuvable ou réactions désactivées', null, Response::HTTP_BAD_REQUEST);
        }

        $type = $request->input('type', 'like');
        if (! in_array($type, ['like', 'love', 'interesting'], true)) {
            return ApiResponse::error('Type de réaction invalide', null, Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $userId = $request->user()?->id;
        $ip = $request->ip();

        $news = $this->newsService->addReaction($news, $type, $userId, $ip);

        return ApiResponse::success(new NewsResource($news), 'Reaction recorded');
    }

    /** Liste des commentaires d'une actualité (site) */
    public function comments(string $slugOrId, Request $request): JsonResponse
    {
        $news = $this->newsService->findBySlugOrId($slugOrId);

        if (! $news || ! $news->is_published) {
            return ApiResponse::error('Actualité introuvable', null, Response::HTTP_NOT_FOUND);
        }

        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? min($perPage, 100) : 10;

        $comments = $news->comments()
            ->where('is_approved', true)
            ->paginate($perPage);

        return ApiResponse::success(
            NewsCommentResource::collection($comments),
            'Comments retrieved'
        );
    }

    /** Ajout d'un commentaire public sur une actualité (site) */
    public function addComment(StoreNewsCommentRequest $request, string $slugOrId): JsonResponse
    {
        $news = $this->newsService->findBySlugOrId($slugOrId);

        if (! $news || ! $news->is_published || ! $news->comments_enabled) {
            return ApiResponse::error('Actualité introuvable ou commentaires désactivés', null, Response::HTTP_BAD_REQUEST);
        }

        $captchaToken = (string) $request->input('captcha_token', '');
        if (! $this->captchaService->verify($captchaToken, $request->ip())) {
            return ApiResponse::error('Vérification CAPTCHA échouée', ['captcha' => ['Token invalide ou expiré']], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validated = $request->validated();
        unset($validated['captcha_token']);

        $comment = new NewsComment($validated);
        $comment->news()->associate($news);
        $comment->save();

        return ApiResponse::success(
            new NewsCommentResource($comment),
            'Comment created',
            Response::HTTP_CREATED
        );
    }

    /** Liste des commentaires d'une actualité pour l'admin (tous statuts) */
    public function adminComments(News $news, Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 20);
        $perPage = $perPage > 0 ? min($perPage, 100) : 20;

        $comments = $news->comments()->paginate($perPage);

        return ApiResponse::success(
            NewsCommentResource::collection($comments),
            'Comments retrieved'
        );
    }

    /** Approbation / désapprobation d'un commentaire (admin) */
    public function approveComment(Request $request, NewsComment $newsComment): JsonResponse
    {
        $approve = $request->boolean('is_approved', true);
        $newsComment->forceFill(['is_approved' => $approve])->save();

        return ApiResponse::success(
            new NewsCommentResource($newsComment->refresh()),
            $approve ? 'Comment approved' : 'Comment unapproved'
        );
    }

    /** Suppression d'un commentaire (admin) */
    public function destroyComment(NewsComment $newsComment): JsonResponse
    {
        $newsComment->delete();

        return ApiResponse::success(null, 'Comment deleted');
    }

    /**
     * Construit le tableau de chemins de la galerie à partir de la requête :
     * - Fichiers uploadés : enregistrés dans storage et chemins ajoutés
     * - Chaînes (chemins existants) : conservées
     */
    private function buildGalleryPathsFromRequest(Request $request, array $inputGallery): array
    {
        $paths = [];
        foreach ($inputGallery as $i => $item) {
            if ($request->hasFile('gallery.'.$i)) {
                $paths[] = $request->file('gallery.'.$i)->store('news/gallery', 'public');
            } elseif (is_string($item) && $item !== '') {
                $paths[] = $item;
            }
        }
        if (empty($paths) && $request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $paths[] = $file->store('news/gallery', 'public');
            }
        }

        return $paths;
    }

    /** Supprime du disque les anciennes images de galerie qui ne sont plus dans la nouvelle liste. */
    private function deleteRemovedGalleryFiles(array $previousPaths, array $newPaths): void
    {
        $toRemove = array_diff($previousPaths, $newPaths);
        foreach ($toRemove as $path) {
            if (is_string($path) && $path !== '') {
                Storage::disk('public')->delete($path);
            }
        }
    }
}

