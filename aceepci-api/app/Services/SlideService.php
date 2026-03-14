<?php

namespace App\Services;

use App\Models\Slide;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;

/**
 * Service de gestion des slides (carousel).
 */
class SlideService
{
    /** Liste tous les slides (admin), triés par ordre d'affichage */
    public function list(): Collection
    {
        return Slide::query()->orderBy('display_order')->orderBy('id')->get();
    }

    /** Liste les slides publiés uniquement (public) */
    public function listPublished(): Collection
    {
        return Slide::query()
            ->where('is_published', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();
    }

    /** Récupère un slide */
    public function find(Slide $slide): Slide
    {
        return $slide;
    }

    /** Crée un nouveau slide */
    public function create(array $data): Slide
    {
        return Slide::create($data);
    }

    /** Met à jour un slide */
    public function update(Slide $slide, array $data): Slide
    {
        $slide->update($data);

        return $slide->fresh();
    }

    /** Publie ou dépublie un slide */
    public function publish(Slide $slide, bool $publish = true): Slide
    {
        $slide->update([
            'is_published' => $publish,
            'published_at' => $publish ? now() : null,
        ]);

        return $slide->fresh();
    }

    /** Supprime un slide */
    public function delete(Slide $slide): void
    {
        if ($slide->image_url && ! str_starts_with($slide->image_url, 'http')) {
            Storage::disk('public')->delete($slide->image_url);
        }
        $slide->delete();
    }
}
