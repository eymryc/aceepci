<?php

namespace App\Services;

use App\Models\OrganizationSection;

/**
 * Service de gestion de la section Organisation.
 *
 * Un seul bloc éditable : enregistrer simple (brouillon) ou enregistrer et publier.
 */
class OrganizationSectionService
{
    /** Récupère le bloc pour édition (le plus récent, publié ou non) */
    public function getCurrent(): ?OrganizationSection
    {
        return OrganizationSection::query()->orderByDesc('updated_at')->first();
    }

    /** Récupère le bloc publié (affiché sur le site) */
    public function getPublished(): ?OrganizationSection
    {
        return OrganizationSection::query()
            ->where('is_published', true)
            ->first();
    }

    /** Enregistre (simple ou avec publication) */
    public function save(array $data, bool $publish = false): OrganizationSection
    {
        $current = $this->getCurrent();

        if ($current) {
            $current->update($data);
            $record = $current->fresh();
        } else {
            $record = OrganizationSection::create($data);
        }

        if ($publish) {
            OrganizationSection::query()
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
