<?php

namespace App\Services;

use App\Models\PresidentMessage;
use Illuminate\Support\Facades\Storage;

/**
 * Service de gestion du mot du président.
 *
 * Un seul bloc éditable : enregistrer simple (brouillon) ou enregistrer et publier.
 */
class PresidentMessageService
{
    /** Récupère le bloc pour édition (le plus récent, publié ou non) */
    public function getCurrent(): ?PresidentMessage
    {
        return PresidentMessage::query()->orderByDesc('updated_at')->first();
    }

    /** Récupère le bloc publié (affiché sur le site) */
    public function getPublished(): ?PresidentMessage
    {
        return PresidentMessage::query()
            ->where('is_published', true)
            ->first();
    }

    /** Enregistre (simple ou avec publication) */
    public function save(array $data, bool $publish = false): PresidentMessage
    {
        $current = $this->getCurrent();

        if ($current) {
            $current->update($data);
            $message = $current->fresh();
        } else {
            $message = PresidentMessage::create($data);
        }

        if ($publish) {
            PresidentMessage::query()
                ->where('id', '!=', $message->id)
                ->update(['is_published' => false, 'published_at' => null]);

            $message->update([
                'is_published' => true,
                'published_at' => now(),
            ]);
            $message = $message->fresh();
        }

        return $message;
    }

    /** Supprime l'image du serveur */
    public function deleteImage(PresidentMessage $message): void
    {
        if ($message->image_url && ! str_starts_with($message->image_url, 'http')) {
            Storage::disk('public')->delete($message->image_url);
        }
    }
}
