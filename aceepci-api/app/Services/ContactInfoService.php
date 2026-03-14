<?php

namespace App\Services;

use App\Models\ContactInfo;

/**
 * Service pour les informations de contact (page contact).
 * Un seul enregistrement (singleton).
 */
class ContactInfoService
{
    /** Récupère l'enregistrement courant (pour édition ou affichage). Crée un enregistrement par défaut si vide. */
    public function get(): ContactInfo
    {
        $record = ContactInfo::query()->first();

        if ($record) {
            return $record;
        }

        return ContactInfo::create([
            'phone' => null,
            'email' => null,
            'address' => null,
            'map_embed_url' => null,
            'hours_mon_fri' => '8h00 - 17h00',
            'hours_saturday' => '9h00 - 13h00',
            'hours_sunday' => 'Fermé',
            'regional_contacts' => [],
        ]);
    }

    /** Enregistre les informations de contact. */
    public function save(array $data): ContactInfo
    {
        $record = $this->get();
        $record->update($data);

        return $record->fresh();
    }
}
