<?php

namespace App\Services;

use App\Models\DailyVerse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Service de gestion du verset du jour.
 */
class DailyVerseService
{
    /** Liste tous les versets (historique) avec pagination et recherche */
    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = DailyVerse::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('primary_text', $likeOp, $term)
                    ->orWhere('primary_reference', $likeOp, $term)
                    ->orWhere('secondary_text', $likeOp, $term)
                    ->orWhere('secondary_reference', $likeOp, $term);
            });
        }

        return $query->paginate(min($perPage, 100));
    }

    /** Liste tous les versets (historique), triés par date décroissante */
    public function list(): Collection
    {
        return DailyVerse::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();
    }

    /** Récupère le verset publié (affiché sur la page d'accueil) */
    public function getPublished(): ?DailyVerse
    {
        return DailyVerse::query()
            ->where('is_published', true)
            ->first();
    }

    /** Récupère un verset */
    public function find(DailyVerse $verse): DailyVerse
    {
        return $verse;
    }

    /** Crée un nouveau verset */
    public function create(array $data): DailyVerse
    {
        return DailyVerse::create($data);
    }

    /** Met à jour un verset */
    public function update(DailyVerse $verse, array $data): DailyVerse
    {
        $verse->update($data);

        return $verse->fresh();
    }

    /** Publie un verset (le rend visible sur la page d'accueil) */
    public function publish(DailyVerse $verse): DailyVerse
    {
        DailyVerse::query()->where('id', '!=', $verse->id)->update([
            'is_published' => false,
            'published_at' => null,
        ]);

        $verse->update([
            'is_published' => true,
            'published_at' => now(),
        ]);

        return $verse->fresh();
    }

    /** Supprime un verset */
    public function delete(DailyVerse $verse): void
    {
        if ($verse->image_url && ! str_starts_with($verse->image_url, 'http')) {
            Storage::disk('public')->delete($verse->image_url);
        }
        $verse->delete();
    }
}
