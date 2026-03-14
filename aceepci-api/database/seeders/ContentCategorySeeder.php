<?php

namespace Database\Seeders;

use App\Models\DevotionalCategory;
use App\Models\GalleryMediaCategory;
use App\Models\NewsCategory;
use Illuminate\Database\Seeder;

/**
 * Seed des catégories de contenu : actualités, dévotionnels, galerie.
 */
class ContentCategorySeeder extends Seeder
{
    public function run(): void
    {
        $newsCategories = ['Vie de l\'association', 'Témoignages', 'Événements', 'Spirituel', 'Communiqué'];
        foreach ($newsCategories as $name) {
            NewsCategory::firstOrCreate(['name' => $name]);
        }

        $devotionalCategories = ['Méditation', 'Prière du jour', 'Enseignement', 'Témoignage'];
        foreach ($devotionalCategories as $name) {
            DevotionalCategory::firstOrCreate(['name' => $name]);
        }

        $galleryCategories = ['Événements', 'Cultes', 'Activités', 'Autres'];
        foreach ($galleryCategories as $name) {
            GalleryMediaCategory::firstOrCreate(['name' => $name]);
        }
    }
}
