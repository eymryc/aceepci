<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreBlogCommentRequest;
use App\Http\Requests\Api\V1\StoreBlogRequest;
use App\Http\Requests\Api\V1\UpdateBlogRequest;
use App\Http\Resources\Api\V1\BlogCommentResource;
use App\Http\Resources\Api\V1\BlogResource;
use App\Http\Responses\ApiResponse;
use App\Models\Blog;
use App\Models\BlogComment;
use App\Services\CaptchaService;
use App\Services\BlogService;
use Dedoc\Scramble\Attributes\Endpoint;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

#[Group('Blogs', description: 'CRUD des articles de blog et interactions (likes, commentaires, vues)', weight: 5)]
class BlogController extends Controller
{
    public function __construct(
        private BlogService $blogService,
        private CaptchaService $captchaService
    ) {}

    /** Liste des articles de blog publiés (site public) */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categoryId = $request->query('blog_category_id') ? (int) $request->query('blog_category_id') : null;
        $perPage = (int) $request->query('per_page', 12);
        $perPage = $perPage > 0 ? min($perPage, 100) : 12;
        $items = $this->blogService->listPublished($search, $categoryId, $perPage);

        return ApiResponse::success(BlogResource::collection($items), 'List retrieved');
    }

    /** Liste des articles de blog pour l'admin (tous statuts, avec filtre) */
    public function adminIndex(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categoryId = $request->query('blog_category_id') ? (int) $request->query('blog_category_id') : null;
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;
        $status = $request->query('status');

        $items = $this->blogService->listForAdmin($search, $categoryId, $perPage, $status);

        return ApiResponse::success(BlogResource::collection($items), 'List retrieved');
    }

    /** Détail d'un article de blog (par id) */
    public function show(Blog $blog): JsonResponse
    {
        return ApiResponse::success(
            new BlogResource($this->blogService->find($blog)),
            'Item retrieved'
        );
    }

    /** Détail d'un article de blog (slug ou id) pour le site, avec incrément de vues */
    #[Endpoint(title: "Détail d'un article de blog (site)", operationId: 'siteBlogShow')]
    public function showForSite(string $slugOrId): JsonResponse
    {
        $blog = $this->blogService->findBySlugOrId($slugOrId);

        if (! $blog || ! $blog->is_published) {
            return ApiResponse::error('Article de blog introuvable', null, Response::HTTP_NOT_FOUND);
        }

        $blog = $this->blogService->incrementViews($blog);

        return ApiResponse::success(
            new BlogResource($this->blogService->find($blog)),
            'Item retrieved'
        );
    }

    /** Création d'un article de blog (admin) */
    public function store(StoreBlogRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->mergeBlogCategoryFromRequest($request, $data);

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->store('blogs/covers', 'public');
        }
        unset($data['cover_image']);

        if ($request->hasFile('author_avatar')) {
            $data['author_avatar_path'] = $request->file('author_avatar')->store('blogs/authors', 'public');
        }
        unset($data['author_avatar']);

        $data['gallery'] = $this->buildGalleryPathsFromRequest($request, $data['gallery'] ?? []);

        $blog = $this->blogService->create($data);

        return ApiResponse::success(new BlogResource($blog), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour d'un article de blog (admin) */
    public function update(UpdateBlogRequest $request, Blog $blog): JsonResponse
    {
        $data = $request->validated();
        $this->mergeBlogCategoryFromRequest($request, $data);

        if ($request->boolean('remove_cover_image') && $blog->cover_image_path) {
            Storage::disk('public')->delete($blog->cover_image_path);
            $data['cover_image_path'] = null;
        } elseif ($request->hasFile('cover_image')) {
            if ($blog->cover_image_path) {
                Storage::disk('public')->delete($blog->cover_image_path);
            }
            $data['cover_image_path'] = $request->file('cover_image')->store('blogs/covers', 'public');
        }
        unset($data['cover_image'], $data['remove_cover_image']);

        if ($request->boolean('remove_author_avatar') && $blog->author_avatar_path) {
            Storage::disk('public')->delete($blog->author_avatar_path);
            $data['author_avatar_path'] = null;
        } elseif ($request->hasFile('author_avatar')) {
            if ($blog->author_avatar_path) {
                Storage::disk('public')->delete($blog->author_avatar_path);
            }
            $data['author_avatar_path'] = $request->file('author_avatar')->store('blogs/authors', 'public');
        }
        unset($data['author_avatar'], $data['remove_author_avatar']);

        if (array_key_exists('gallery', $data)) {
            $data['gallery'] = $this->buildGalleryPathsFromRequest($request, $data['gallery']);
            $this->deleteRemovedGalleryFiles($blog->gallery ?? [], $data['gallery']);
        }

        $blog = $this->blogService->update($blog, $data);

        return ApiResponse::success(new BlogResource($blog), 'Item updated');
    }

    /** Suppression d'un article de blog (admin) */
    public function destroy(Blog $blog): JsonResponse
    {
        $this->blogService->delete($blog);

        return ApiResponse::success(null, 'Item deleted');
    }

    /** Publication d'un article de blog (admin) */
    public function publish(Blog $blog): JsonResponse
    {
        $blog = $this->blogService->publish($blog);

        return ApiResponse::success(new BlogResource($blog), 'Blog published');
    }

    /** Dépublication d'un article de blog (admin) */
    public function unpublish(Blog $blog): JsonResponse
    {
        $blog = $this->blogService->unpublish($blog);

        return ApiResponse::success(new BlogResource($blog), 'Blog unpublished');
    }

    /** Enregistrement d'un like/réaction (site) */
    public function react(Request $request, string $slugOrId): JsonResponse
    {
        $blog = $this->blogService->findBySlugOrId($slugOrId);

        if (! $blog || ! $blog->is_published || ! $blog->reactions_enabled) {
            return ApiResponse::error('Article introuvable ou réactions désactivées', null, Response::HTTP_BAD_REQUEST);
        }

        $type = $request->input('type', 'like');
        if (! in_array($type, ['like', 'love', 'interesting'], true)) {
            return ApiResponse::error('Type de réaction invalide', null, Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $userId = $request->user()?->id;
        $ip = $request->ip();

        $blog = $this->blogService->addReaction($blog, $type, $userId, $ip);

        return ApiResponse::success(new BlogResource($blog), 'Reaction recorded');
    }

    /** Liste des commentaires d'un article de blog (site) */
    public function comments(string $slugOrId, Request $request): JsonResponse
    {
        $blog = $this->blogService->findBySlugOrId($slugOrId);

        if (! $blog || ! $blog->is_published) {
            return ApiResponse::error('Article de blog introuvable', null, Response::HTTP_NOT_FOUND);
        }

        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? min($perPage, 100) : 10;

        $comments = $blog->comments()
            ->where('is_approved', true)
            ->paginate($perPage);

        return ApiResponse::success(
            BlogCommentResource::collection($comments),
            'Comments retrieved'
        );
    }

    /** Ajout d'un commentaire public sur un article de blog (site) */
    public function addComment(StoreBlogCommentRequest $request, string $slugOrId): JsonResponse
    {
        $blog = $this->blogService->findBySlugOrId($slugOrId);

        if (! $blog || ! $blog->is_published || ! $blog->comments_enabled) {
            return ApiResponse::error('Article introuvable ou commentaires désactivés', null, Response::HTTP_BAD_REQUEST);
        }

        $captchaToken = (string) $request->input('captcha_token', '');
        if (! $this->captchaService->verify($captchaToken, $request->ip())) {
            return ApiResponse::error('Vérification CAPTCHA échouée', ['captcha' => ['Token invalide ou expiré']], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validated = $request->validated();
        unset($validated['captcha_token']);

        $comment = new BlogComment($validated);
        $comment->blog()->associate($blog);
        $comment->save();

        return ApiResponse::success(
            new BlogCommentResource($comment),
            'Comment created',
            Response::HTTP_CREATED
        );
    }

    /** Liste des commentaires d'un article de blog pour l'admin (tous statuts) */
    public function adminComments(Blog $blog, Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 20);
        $perPage = $perPage > 0 ? min($perPage, 100) : 20;

        $comments = $blog->comments()->paginate($perPage);

        return ApiResponse::success(
            BlogCommentResource::collection($comments),
            'Comments retrieved'
        );
    }

    /** Approbation / désapprobation d'un commentaire (admin) */
    public function approveComment(Request $request, BlogComment $blogComment): JsonResponse
    {
        $approve = $request->boolean('is_approved', true);
        $blogComment->forceFill(['is_approved' => $approve])->save();

        return ApiResponse::success(
            new BlogCommentResource($blogComment->refresh()),
            $approve ? 'Comment approved' : 'Comment unapproved'
        );
    }

    /** Suppression d'un commentaire (admin) */
    public function destroyComment(BlogComment $blogComment): JsonResponse
    {
        $blogComment->delete();

        return ApiResponse::success(null, 'Comment deleted');
    }

    /**
     * S'assure que blog_category_id et news_category_id sont bien pris en compte (form multipart).
     * Si l'un est renseigné, l'autre est mis à null pour ne garder qu'une catégorie.
     *
     * @param  array<string, mixed>  $data
     */
    private function mergeBlogCategoryFromRequest(Request $request, array &$data): void
    {
        $blogCat = $request->has('blog_category_id') ? $request->input('blog_category_id') : null;
        $newsCat = $request->has('news_category_id') ? $request->input('news_category_id') : null;

        if ($request->has('blog_category_id')) {
            $v = $blogCat;
            if ($v === '' || $v === null || (is_string($v) && trim($v) === '')) {
                $data['blog_category_id'] = null;
            } elseif (is_numeric($v)) {
                $data['blog_category_id'] = (int) $v;
                $data['news_category_id'] = null;
            }
        }
        if ($request->has('news_category_id')) {
            $v = $newsCat;
            if ($v === '' || $v === null || (is_string($v) && trim($v) === '')) {
                $data['news_category_id'] = null;
            } elseif (is_numeric($v)) {
                $data['news_category_id'] = (int) $v;
                $data['blog_category_id'] = null;
            }
        }
    }

    /**
     * Construit le tableau de chemins de la galerie à partir de la requête.
     */
    private function buildGalleryPathsFromRequest(Request $request, array $inputGallery): array
    {
        $paths = [];
        foreach ($inputGallery as $i => $item) {
            if ($request->hasFile('gallery.'.$i)) {
                $paths[] = $request->file('gallery.'.$i)->store('blogs/gallery', 'public');
            } elseif (is_string($item) && $item !== '') {
                $paths[] = $item;
            }
        }
        if (empty($paths) && $request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $paths[] = $file->store('blogs/gallery', 'public');
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
