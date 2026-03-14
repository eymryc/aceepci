<?php

namespace App\Services;

use App\Models\History;
use Illuminate\Support\Facades\Storage;

/**
 * Service de gestion de la section Histoire.
 *
 * Un seul bloc éditable : enregistrer simple (brouillon) ou enregistrer et publier.
 */
class HistoryService
{
    /** Récupère le bloc pour édition (le plus récent, publié ou non) */
    public function getCurrent(): ?History
    {
        return History::query()->orderByDesc('updated_at')->first();
    }

    /** Récupère le bloc publié (affiché sur le site) */
    public function getPublished(): ?History
    {
        return History::query()
            ->where('is_published', true)
            ->first();
    }

    /** Enregistre (simple ou avec publication) */
    public function save(array $data, bool $publish = false): History
    {
        $current = $this->getCurrent();

        if ($current) {
            $current->update($data);
            $history = $current->fresh();
        } else {
            $history = History::create($data);
        }

        if ($publish) {
            History::query()
                ->where('id', '!=', $history->id)
                ->update(['is_published' => false, 'published_at' => null]);

            $history->update([
                'is_published' => true,
                'published_at' => now(),
            ]);
            $history = $history->fresh();
        }

        return $history;
    }

    /** Supprime l'image du serveur */
    public function deleteImage(History $history): void
    {
        if ($history->image_url && ! str_starts_with($history->image_url, 'http')) {
            Storage::disk('public')->delete($history->image_url);
        }
    }
}
