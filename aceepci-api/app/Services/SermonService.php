<?php

namespace App\Services;

use App\Models\Sermon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class SermonService
{
    public function listPublished(?string $search = null, ?string $type = null, int $perPage = 12): LengthAwarePaginator
    {
        $query = Sermon::query()
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('title', $likeOp, $term)
                    ->orWhere('slug', $likeOp, $term)
                    ->orWhere('speaker', $likeOp, $term)
                    ->orWhere('scripture_reference', $likeOp, $term)
                    ->orWhere('excerpt', $likeOp, $term)
                    ->orWhere('content', $likeOp, $term);
            });
        }

        if ($type && in_array($type, ['video', 'audio', 'text'], true)) {
            $query->where('type', $type);
        }

        return $query->paginate(min($perPage, 100));
    }

    public function listForAdmin(
        ?string $search = null,
        ?string $type = null,
        int $perPage = 15,
        ?string $status = null,
    ): LengthAwarePaginator {
        $query = Sermon::query()
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('title', $likeOp, $term)
                    ->orWhere('slug', $likeOp, $term)
                    ->orWhere('speaker', $likeOp, $term)
                    ->orWhere('scripture_reference', $likeOp, $term)
                    ->orWhere('excerpt', $likeOp, $term)
                    ->orWhere('content', $likeOp, $term);
            });
        }

        if ($type && in_array($type, ['video', 'audio', 'text'], true)) {
            $query->where('type', $type);
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

    public function find(Sermon $sermon): Sermon
    {
        return $sermon;
    }

    public function findBySlugOrId(string|int $slugOrId): ?Sermon
    {
        if (is_numeric($slugOrId)) {
            return Sermon::query()->whereKey((int) $slugOrId)->first();
        }

        return Sermon::query()->where('slug', $slugOrId)->first();
    }

    public function create(array $data): Sermon
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title'] ?? 'sermon-' . uniqid());
        }

        $sermon = Sermon::create($data);

        return $this->find($sermon);
    }

    public function update(Sermon $sermon, array $data): Sermon
    {
        $sermon->update($data);

        return $this->find($sermon);
    }

    public function delete(Sermon $sermon): void
    {
        $sermon->delete();
    }

    public function publish(Sermon $sermon): Sermon
    {
        $sermon->forceFill([
            'is_published' => true,
            'published_at' => $sermon->published_at ?? now(),
        ])->save();

        return $this->find($sermon);
    }

    public function unpublish(Sermon $sermon): Sermon
    {
        $sermon->forceFill([
            'is_published' => false,
        ])->save();

        return $this->find($sermon);
    }

    public function incrementViews(Sermon $sermon): Sermon
    {
        $sermon->increment('views_count');

        return $sermon->refresh();
    }
}
