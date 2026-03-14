<?php

namespace Database\Seeders;

use App\Models\Nationality;
use Illuminate\Database\Seeder;

/**
 * Seed des nationalités courantes.
 */
class NationalitySeeder extends Seeder
{
    public function run(): void
    {
        $nationalities = [
            ['name' => 'Ivoirienne', 'display_order' => 1],
            ['name' => 'Ivoirien', 'display_order' => 2],
            ['name' => 'Française', 'display_order' => 3],
            ['name' => 'Français', 'display_order' => 4],
            ['name' => 'Sénégalaise', 'display_order' => 5],
            ['name' => 'Sénégalais', 'display_order' => 6],
            ['name' => 'Malienne', 'display_order' => 7],
            ['name' => 'Malien', 'display_order' => 8],
            ['name' => 'Burkinabè', 'display_order' => 9],
            ['name' => 'Béninoise', 'display_order' => 10],
            ['name' => 'Béninois', 'display_order' => 11],
            ['name' => 'Togolaise', 'display_order' => 12],
            ['name' => 'Togolais', 'display_order' => 13],
            ['name' => 'Ghanéenne', 'display_order' => 14],
            ['name' => 'Ghanéen', 'display_order' => 15],
            ['name' => 'Nigériane', 'display_order' => 16],
            ['name' => 'Nigérian', 'display_order' => 17],
            ['name' => 'Camerounaise', 'display_order' => 18],
            ['name' => 'Camerounais', 'display_order' => 19],
            ['name' => 'Congolaise', 'display_order' => 20],
            ['name' => 'Congolais', 'display_order' => 21],
            ['name' => 'Autre', 'display_order' => 99],
        ];

        foreach ($nationalities as $item) {
            Nationality::firstOrCreate(
                ['name' => $item['name']],
                ['display_order' => $item['display_order']]
            );
        }
    }
}
