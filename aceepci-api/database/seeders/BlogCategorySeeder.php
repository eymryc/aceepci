<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

/**
 * Seed des catégories de blog.
 */
class BlogCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Vie de l\'association', 'code' => 'VIE', 'sort_order' => 0],
            ['name' => 'Réflexions', 'code' => 'REFLEX', 'sort_order' => 1],
            ['name' => 'Témoignages', 'code' => 'TEMOIG', 'sort_order' => 2],
            ['name' => 'Enseignements', 'code' => 'ENSEIGN', 'sort_order' => 3],
            ['name' => 'Événements', 'code' => 'EVT', 'sort_order' => 4],
            ['name' => 'Actualités', 'code' => 'ACTU', 'sort_order' => 5],
        ];

        foreach ($categories as $data) {
            BlogCategory::firstOrCreate(
                ['name' => $data['name']],
                $data
            );
        }
    }
}
