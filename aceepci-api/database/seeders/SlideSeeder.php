<?php

namespace Database\Seeders;

use App\Models\Slide;
use Illuminate\Database\Seeder;

/**
 * Seed des slides bannière (carousel d'accueil).
 */
class SlideSeeder extends Seeder
{
    public function run(): void
    {
        $slides = [
            [
                'title' => 'Bienvenue à l\'ACEEPCI',
                'short_subtitle' => 'Connaître, Aimer, Servir',
                'subtitle' => 'Alliance des Cercles d\'Étudiants et d\'Élèves Protestants de Côte d\'Ivoire',
                'description' => 'Un mouvement d\'étudiants et d\'élèves chrétiens engagés pour l\'évangélisation de l\'école ivoirienne et la formation de leaders selon la Parole.',
                'image_url' => null,
                'display_order' => 0,
            ],
            [
                'title' => 'Vie de cercle',
                'short_subtitle' => 'Cultes · Études bibliques · Communion',
                'subtitle' => 'Rejoignez un cercle près de chez vous',
                'description' => 'Dans chaque établissement, nos cercles proposent cultes, études bibliques et activités pour grandir ensemble dans la foi.',
                'image_url' => null,
                'display_order' => 1,
            ],
            [
                'title' => 'Événements 2026',
                'short_subtitle' => 'Camps · Conférences · Retraites',
                'subtitle' => 'Des temps forts pour se former et servir',
                'description' => 'Camp Biblique National, conférences leadership, retraites de prière : découvrez les prochains rendez-vous ACEEPCI.',
                'image_url' => null,
                'display_order' => 2,
            ],
        ];

        foreach ($slides as $data) {
            Slide::firstOrCreate(
                ['title' => $data['title']],
                array_merge($data, [
                    'is_published' => true,
                    'published_at' => now(),
                ])
            );
        }
    }
}
