<?php

namespace App\Services;

use App\Models\News;
use App\Models\NewsReaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class NewsService
{
    public function listPaginated(
        ?string $search = null,
        ?int $categoryId = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        $query = News::query()
            ->with(['category', 'event'])
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
            $query->where('news_category_id', $categoryId);
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
        $query = News::query()
            ->with(['category', 'event'])
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
            $query->where('news_category_id', $categoryId);
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

    public function find(News $news): News
    {
        return $news->load(['category', 'event', 'comments']);
    }

    public function findBySlugOrId(string|int $slugOrId): ?News
    {
        if (is_numeric($slugOrId)) {
            return News::query()->whereKey((int) $slugOrId)->first();
        }

        return News::query()->where('slug', $slugOrId)->first();
    }

    public function create(array $data): News
    {
        $fillable = (new News)->getFillable();
        $data = array_merge(array_fill_keys($fillable, null), array_intersect_key($data, array_fill_keys($fillable, true)));

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title'] ?? 'news-' . uniqid());
        }

        if (isset($data['initial_views']) && (int) $data['initial_views'] > 0) {
            $data['views_count'] = (int) $data['initial_views'];
        }

        $news = News::create($data);

        return $this->find($news);
    }

    public function update(News $news, array $data): News
    {
        if (! empty($data['initial_views']) && $data['initial_views'] !== $news->initial_views) {
            $delta = (int) $data['initial_views'] - (int) $news->initial_views;
            $data['views_count'] = max(0, (int) $news->views_count + $delta);
        }

        $news->update($data);

        return $this->find($news);
    }

    public function delete(News $news): void
    {
        $news->delete();
    }

    public function publish(News $news): News
    {
        $news->forceFill([
            'is_published' => true,
            'published_at' => $news->published_at ?? now(),
        ])->save();

        return $this->find($news);
    }

    public function unpublish(News $news): News
    {
        $news->forceFill([
            'is_published' => false,
        ])->save();

        return $this->find($news);
    }

    public function incrementViews(News $news): News
    {
        $news->increment('views_count');

        return $news->refresh();
    }

    public function addReaction(News $news, string $type, ?int $userId, ?string $ip): News
    {
        $column = match ($type) {
            'love' => 'loves_count',
            'interesting' => 'interesting_count',
            default => 'likes_count',
        };

        $query = NewsReaction::query()->where('news_id', $news->id);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($ip) {
            $query->where('ip_address', $ip);
        } else {
            // Pas d'identifiant fiable : on incrémente simplement le compteur.
            $news->increment($column);

            return $news->refresh();
        }

        /** @var NewsReaction|null $existing */
        $existing = $query->first();

        if ($existing && $existing->type === $type) {
            // Même réaction déjà enregistrée pour cet utilisateur / IP : ne rien faire.
            return $news->refresh();
        }

        // Ajuster les compteurs si changement de type
        if ($existing) {
            $oldColumn = match ($existing->type) {
                'love' => 'loves_count',
                'interesting' => 'interesting_count',
                default => 'likes_count',
            };
            if ($news->{$oldColumn} > 0) {
                $news->decrement($oldColumn);
            }
            $existing->type = $type;
            $existing->save();
        } else {
            NewsReaction::create([
                'news_id' => $news->id,
                'user_id' => $userId,
                'ip_address' => $userId ? null : $ip,
                'type' => $type,
            ]);
        }

        $news->increment($column);

        return $news->refresh();
    }
}

