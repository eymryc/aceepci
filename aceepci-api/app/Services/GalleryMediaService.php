<?php

namespace App\Services;

use App\Models\GalleryMedia;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GalleryMediaService
{
    /** Liste paginée pour l'admin (recherche + filtre statut) */
    public function listForAdmin(?string $search = null, int $perPage = 12, ?string $status = null): LengthAwarePaginator
    {
        $query = GalleryMedia::query()
            ->orderBy('display_order')
            ->orderBy('id');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('title', $likeOp, $term)
                    ->orWhere('category', $likeOp, $term);
            });
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

    /** Liste pour le site (page d'accueil, galerie) — uniquement publiées */
    public function listPublished(?int $limit = null): Collection
    {
        $query = GalleryMedia::query()
            ->where('is_published', true)
            ->orderBy('display_order')
            ->orderBy('id');

        if ($limit !== null && $limit > 0) {
            $query->limit(min($limit, 100));
        }

        return $query->get();
    }

    public function find(GalleryMedia $galleryMedia): GalleryMedia
    {
        return $galleryMedia;
    }

    public function create(array $data): GalleryMedia
    {
        $data['is_published'] = $data['is_published'] ?? false;
        return GalleryMedia::create($data);
    }

    public function publish(GalleryMedia $galleryMedia): GalleryMedia
    {
        $galleryMedia->update([
            'is_published' => true,
            'published_at' => $galleryMedia->published_at ?? now(),
        ]);
        return $galleryMedia->fresh();
    }

    public function unpublish(GalleryMedia $galleryMedia): GalleryMedia
    {
        $galleryMedia->update([
            'is_published' => false,
            'published_at' => null,
        ]);
        return $galleryMedia->fresh();
    }

    public function update(GalleryMedia $galleryMedia, array $data): GalleryMedia
    {
        $galleryMedia->update($data);
        return $galleryMedia->fresh();
    }

    public function delete(GalleryMedia $galleryMedia): void
    {
        if ($galleryMedia->image_path && !str_starts_with($galleryMedia->image_path, 'http')) {
            Storage::disk('public')->delete($galleryMedia->image_path);
        }
        $galleryMedia->delete();
    }
}
