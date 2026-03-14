<?php

namespace App\Services;

use App\Models\Devotional;
use App\Models\DevotionalReaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class DevotionalService
{
    public function listPublished(
        ?string $search = null,
        ?int $categoryId = null,
        int $perPage = 12,
    ): LengthAwarePaginator {
        $query = Devotional::query()
            ->with('category')
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('title', $likeOp, $term)
                    ->orWhere('slug', $likeOp, $term)
                    ->orWhere('scripture_reference', $likeOp, $term)
                    ->orWhere('excerpt', $likeOp, $term)
                    ->orWhere('content', $likeOp, $term);
            });
        }

        if ($categoryId) {
            $query->where('devotional_category_id', $categoryId);
        }

        return $query->paginate(min($perPage, 100));
    }

    public function listForAdmin(
        ?string $search = null,
        ?int $categoryId = null,
        int $perPage = 15,
        ?string $status = null,
    ): LengthAwarePaginator {
        $query = Devotional::query()
            ->with('category')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('title', $likeOp, $term)
                    ->orWhere('slug', $likeOp, $term)
                    ->orWhere('scripture_reference', $likeOp, $term)
                    ->orWhere('excerpt', $likeOp, $term)
                    ->orWhere('content', $likeOp, $term);
            });
        }

        if ($categoryId) {
            $query->where('devotional_category_id', $categoryId);
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

    public function find(Devotional $devotional): Devotional
    {
        return $devotional->load('category');
    }

    public function findBySlugOrId(string|int $slugOrId): ?Devotional
    {
        if (is_numeric($slugOrId)) {
            return Devotional::query()->whereKey((int) $slugOrId)->first();
        }

        return Devotional::query()->where('slug', $slugOrId)->first();
    }

    public function create(array $data): Devotional
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title'] ?? 'devotional-' . uniqid());
        }

        $devotional = Devotional::create($data);

        return $this->find($devotional);
    }

    public function update(Devotional $devotional, array $data): Devotional
    {
        $devotional->update($data);

        return $this->find($devotional);
    }

    public function delete(Devotional $devotional): void
    {
        $devotional->delete();
    }

    public function publish(Devotional $devotional): Devotional
    {
        $devotional->forceFill([
            'is_published' => true,
            'published_at' => $devotional->published_at ?? now(),
        ])->save();

        return $this->find($devotional);
    }

    public function unpublish(Devotional $devotional): Devotional
    {
        $devotional->forceFill([
            'is_published' => false,
        ])->save();

        return $this->find($devotional);
    }

    public function incrementViews(Devotional $devotional): Devotional
    {
        $devotional->increment('views_count');

        return $devotional->refresh();
    }

    public function addReaction(Devotional $devotional, string $type, ?int $userId, ?string $ip): Devotional
    {
        $column = match ($type) {
            'beni' => 'beni_count',
            'edifiant' => 'edifiant_count',
            default => 'amen_count',
        };

        if (! in_array($type, ['amen', 'beni', 'edifiant'], true)) {
            return $devotional->refresh();
        }

        $query = DevotionalReaction::query()->where('devotional_id', $devotional->id);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($ip) {
            $query->where('ip_address', $ip);
        } else {
            $devotional->increment($column);

            return $devotional->refresh();
        }

        $existing = $query->first();

        if ($existing && $existing->type === $type) {
            return $devotional->refresh();
        }

        if ($existing) {
            $oldColumn = match ($existing->type) {
                'beni' => 'beni_count',
                'edifiant' => 'edifiant_count',
                default => 'amen_count',
            };
            if ($devotional->{$oldColumn} > 0) {
                $devotional->decrement($oldColumn);
            }
            $existing->type = $type;
            $existing->save();
        } else {
            DevotionalReaction::create([
                'devotional_id' => $devotional->id,
                'user_id' => $userId,
                'ip_address' => $userId ? null : $ip,
                'type' => $type,
            ]);
        }

        $devotional->increment($column);

        return $devotional->refresh();
    }
}
