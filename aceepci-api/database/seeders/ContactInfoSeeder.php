<?php

namespace Database\Seeders;

use App\Models\ContactInfo;
use Illuminate\Database\Seeder;

/**
 * Seed des informations de contact (singleton) pour la page contact.
 */
class ContactInfoSeeder extends Seeder
{
    public function run(): void
    {
        ContactInfo::updateOrCreate(
            ['id' => 1],
            [
                'phone' => '+225 27 22 44 43 78',
                'email' => 'contact@aceepci.org',
                'address' => "MAPE, Boulevard de l'Université\nAbidjan-Cocody",
                'map_embed_url' => null,
                'hours_mon_fri' => '8h00 - 17h00',
                'hours_saturday' => '9h00 - 13h00',
                'hours_sunday' => 'Fermé',
                'regional_contacts' => [
                    ['region' => 'Abidjan - Cocody', 'contact' => '+225 07 XX XX XX XX', 'email' => 'cocody@aceepci.org'],
                    ['region' => 'Abidjan - Yopougon', 'contact' => '+225 07 XX XX XX XX', 'email' => 'yopougon@aceepci.org'],
                    ['region' => 'Yamoussoukro', 'contact' => '+225 07 XX XX XX XX', 'email' => 'yamoussoukro@aceepci.org'],
                    ['region' => 'Bouaké', 'contact' => '+225 07 XX XX XX XX', 'email' => 'bouake@aceepci.org'],
                    ['region' => 'Daloa', 'contact' => '+225 07 XX XX XX XX', 'email' => 'daloa@aceepci.org'],
                    ['region' => 'San-Pedro', 'contact' => '+225 07 XX XX XX XX', 'email' => 'sanpedro@aceepci.org'],
                ],
                'facebook_url' => null,
                'instagram_url' => null,
                'youtube_url' => null,
            ]
        );
    }
}
