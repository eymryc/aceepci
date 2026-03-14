<?php

namespace App\Services;

use App\Models\MottoSection;

/**
 * Service de gestion de la section Devise.
 *
 * Un seul bloc éditable : enregistrer simple (brouillon) ou enregistrer et publier.
 */
class MottoSectionService
{
    /** Récupère le bloc pour édition (le plus récent, publié ou non) */
    public function getCurrent(): ?MottoSection
    {
        return MottoSection::query()->orderByDesc('updated_at')->first();
    }

    /** Récupère le bloc publié (affiché sur le site) */
    public function getPublished(): ?MottoSection
    {
        return MottoSection::query()
            ->where('is_published', true)
            ->first();
    }

    /** Enregistre (simple ou avec publication) */
    public function save(array $data, bool $publish = false): MottoSection
    {
        $current = $this->getCurrent();

        if ($current) {
            $current->update($data);
            $record = $current->fresh();
        } else {
            $record = MottoSection::create($data);
        }

        if ($publish) {
            MottoSection::query()
                ->where('id', '!=', $record->id)
                ->update(['is_published' => false, 'published_at' => null]);

            $record->update([
                'is_published' => true,
                'published_at' => now(),
            ]);
            $record = $record->fresh();
        }

        return $record;
    }
}

