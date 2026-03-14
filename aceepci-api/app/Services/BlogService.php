<?php

namespace App\Services;

use App\Models\Blog;
use App\Models\BlogReaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class BlogService
{
    public function listPaginated(
        ?string $search = null,
        ?int $categoryId = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        $query = Blog::query()
            ->with(['category', 'newsCategory', 'event'])
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('title', $likeOp, $term)
                    ->orWhere('slug', $likeOp, $term)
                    ->orWhere('excerpt', $likeOp, $term)
                    ->orWhere('content', $likeOp, $term);
            });
        }

        if ($categoryId) {
            $query->where('blog_category_id', $categoryId);
        }

        $query->where('is_published', true);

        return $query->paginate(min($perPage, 100));
    }

    public function listPublished(
        ?string $search = null,
        ?int $categoryId = null,
        int $perPage = 12,
    ): LengthAwarePaginator {
        return $this->listPaginated($search, $categoryId, $perPage);
    }

    public function listForAdmin(
        ?string $search = null,
        ?int $categoryId = null,
        int $perPage = 15,
        ?string $status = null,
    ): LengthAwarePaginator {
        $query = Blog::query()
            ->with(['category', 'newsCategory', 'event'])
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('title', $likeOp, $term)
                    ->orWhere('slug', $likeOp, $term)
                    ->orWhere('excerpt', $likeOp, $term)
                    ->orWhere('content', $likeOp, $term);
            });
        }

        if ($categoryId) {
            $query->where('blog_category_id', $categoryId);
        }

        if ($status === 'published') {
            $query->where('is_published', true);
        } elseif ($status === 'draft') {
            $query->where(function ($q) {
                $q->whereNull('is_published')->orWhere('is_published', false);
            });
        }

        return $query->paginate(min($perPage, 100));
    }

    public function find(Blog $blog): Blog
    {
        return $blog->load(['category', 'newsCategory', 'event', 'comments']);
    }

    public function findBySlugOrId(string|int $slugOrId): ?Blog
    {
        if (is_numeric($slugOrId)) {
            return Blog::query()->whereKey((int) $slugOrId)->first();
        }

        return Blog::query()->where('slug', $slugOrId)->first();
    }

    public function create(array $data): Blog
    {
        $fillable = (new Blog)->getFillable();
        $data = array_merge(array_fill_keys($fillable, null), array_intersect_key($data, array_fill_keys($fillable, true)));

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title'] ?? 'blog-' . uniqid());
        }

        // Colonnes NOT NULL : éviter d'envoyer null à PostgreSQL (le default de la migration n'est pas utilisé si on envoie null)
        if ($data['reading_time_minutes'] === null) {
            $data['reading_time_minutes'] = 0;
        }
        if ($data['views_count'] === null && (! isset($data['initial_views']) || (int) $data['initial_views'] <= 0)) {
            $data['views_count'] = 0;
        }
        if (isset($data['initial_views']) && (int) $data['initial_views'] > 0) {
            $data['views_count'] = (int) $data['initial_views'];
        }
        if ($data['initial_views'] === null) {
            $data['initial_views'] = 0;
        }
        if ($data['likes_count'] === null) {
            $data['likes_count'] = 0;
        }
        if ($data['loves_count'] === null) {
            $data['loves_count'] = 0;
        }
        if ($data['interesting_count'] === null) {
            $data['interesting_count'] = 0;
        }

        $blog = Blog::create($data);

        return $this->find($blog);
    }

    public function update(Blog $blog, array $data): Blog
    {
        if (! empty($data['initial_views']) && $data['initial_views'] !== $blog->initial_views) {
            $delta = (int) $data['initial_views'] - (int) $blog->initial_views;
            $data['views_count'] = max(0, (int) $blog->views_count + $delta);
        }

        // Éviter d'envoyer null pour les colonnes NOT NULL
        if (array_key_exists('reading_time_minutes', $data) && $data['reading_time_minutes'] === null) {
            $data['reading_time_minutes'] = 0;
        }

        $blog->update($data);

        return $this->find($blog);
    }

    public function delete(Blog $blog): void
    {
        $blog->delete();
    }

    public function publish(Blog $blog): Blog
    {
        $blog->forceFill([
            'is_published' => true,
            'published_at' => $blog->published_at ?? now(),
        ])->save();

        return $this->find($blog);
    }

    public function unpublish(Blog $blog): Blog
    {
        $blog->forceFill([
            'is_published' => false,
        ])->save();

        return $this->find($blog);
    }

    public function incrementViews(Blog $blog): Blog
    {
        $blog->increment('views_count');

        return $blog->refresh();
    }

    public function addReaction(Blog $blog, string $type, ?int $userId, ?string $ip): Blog
    {
        $column = match ($type) {
            'love' => 'loves_count',
            'interesting' => 'interesting_count',
            default => 'likes_count',
        };

        $query = BlogReaction::query()->where('blog_id', $blog->id);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($ip) {
            $query->where('ip_address', $ip);
        } else {
            $blog->increment($column);

            return $blog->refresh();
        }

        /** @var BlogReaction|null $existing */
        $existing = $query->first();

        if ($existing && $existing->type === $type) {
            return $blog->refresh();
        }

        if ($existing) {
            $oldColumn = match ($existing->type) {
                'love' => 'loves_count',
                'interesting' => 'interesting_count',
                default => 'likes_count',
            };
            if ($blog->{$oldColumn} > 0) {
                $blog->decrement($oldColumn);
            }
            $existing->type = $type;
            $existing->save();
        } else {
            BlogReaction::create([
                'blog_id' => $blog->id,
                'user_id' => $userId,
                'ip_address' => $userId ? null : $ip,
                'type' => $type,
            ]);
        }

        $blog->increment($column);

        return $blog->refresh();
    }
}
