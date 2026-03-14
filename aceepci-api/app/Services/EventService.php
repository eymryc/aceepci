<?php

namespace App\Services;

use App\Models\Event;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Service de gestion des événements.
 */
class EventService
{
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Event::query()
            ->with('eventCategory')
            ->orderBy('start_date', 'desc');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('name', $likeOp, $term)
                    ->orWhere('title', $likeOp, $term)
                    ->orWhere('slug', $likeOp, $term)
                    ->orWhere('location', $likeOp, $term);
            });
        }

        return $query->paginate(min($perPage, 100));
    }

    public function listPublished(): Collection
    {
        return Event::query()
            ->with('eventCategory')
            ->where('is_published', true)
            ->orderBy('start_date', 'desc')
            ->get();
    }

    public function find(Event $event): Event
    {
        return $event->load('eventCategory');
    }

    public function findBySlugOrId(string|int $slugOrId): ?Event
    {
        if (is_numeric($slugOrId)) {
            return Event::find((int) $slugOrId);
        }

        return Event::query()->where('slug', $slugOrId)->first();
    }

    public function create(array $data): Event
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title'] ?? $data['name'] ?? 'event-' . uniqid());
        }

        $event = Event::create($data);

        return $this->find($event);
    }

    public function update(Event $event, array $data): Event
    {
        $event->update($data);

        return $this->find($event);
    }

    public function delete(Event $event): void
    {
        if ($event->image_url && ! str_starts_with($event->image_url, 'http')) {
            Storage::disk('public')->delete($event->image_url);
        }
        $event->delete();
    }
}
