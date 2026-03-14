<?php

namespace Database\Seeders;

use App\Models\DailyVerse;
use Illuminate\Database\Seeder;

/**
 * Seed des versets du jour.
 */
class DailyVerseSeeder extends Seeder
{
    public function run(): void
    {
        $verses = [
            [
                'primary_text' => 'Connaître, Aimer, Servir : que ces mots guident vos pas chaque jour.',
                'primary_reference' => 'Inspiré de Matthieu 22.37-39',
                'secondary_text' => null,
                'secondary_reference' => null,
                'image_url' => null,
                'image_label' => null,
                'image_quote' => null,
            ],
            [
                'primary_text' => 'Tu aimeras le Seigneur ton Dieu de tout ton cœur, de toute ton âme et de toute ta pensée.',
                'primary_reference' => 'Matthieu 22.37',
                'secondary_text' => 'Tu aimeras ton prochain comme toi-même.',
                'secondary_reference' => 'Matthieu 22.39',
                'image_url' => null,
                'image_label' => null,
                'image_quote' => null,
            ],
            [
                'primary_text' => 'Applique-toi à te présenter devant Dieu comme un homme éprouvé, un ouvrier qui n’a pas à rougir.',
                'primary_reference' => '2 Timothée 2.15',
                'secondary_text' => null,
                'secondary_reference' => null,
                'image_url' => null,
                'image_label' => null,
                'image_quote' => null,
            ],
        ];

        foreach ($verses as $i => $data) {
            DailyVerse::firstOrCreate(
                [
                    'primary_reference' => $data['primary_reference'],
                    'primary_text' => $data['primary_text'],
                ],
                array_merge($data, [
                    'is_published' => true,
                    'published_at' => now()->addDays($i),
                ])
            );
        }
    }
}
