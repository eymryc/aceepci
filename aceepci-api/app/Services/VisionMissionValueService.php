<?php

namespace App\Services;

use App\Models\VisionMissionValue;

/**
 * Service de gestion de la section Vision, Mission & Valeurs.
 *
 * Un seul bloc éditable : enregistrer simple (brouillon) ou enregistrer et publier.
 */
class VisionMissionValueService
{
    /** Récupère le bloc pour édition (le plus récent, publié ou non) */
    public function getCurrent(): ?VisionMissionValue
    {
        return VisionMissionValue::query()->orderByDesc('updated_at')->first();
    }

    /** Récupère le bloc publié (affiché sur le site) */
    public function getPublished(): ?VisionMissionValue
    {
        return VisionMissionValue::query()
            ->where('is_published', true)
            ->first();
    }

    /** Enregistre (simple ou avec publication) */
    public function save(array $data, bool $publish = false): VisionMissionValue
    {
        $current = $this->getCurrent();

        if ($current) {
            $current->update($data);
            $record = $current->fresh();
        } else {
            $record = VisionMissionValue::create($data);
        }

        if ($publish) {
            VisionMissionValue::query()
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
