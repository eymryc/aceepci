<?php

namespace Database\Seeders;

use App\Models\History;
use Illuminate\Database\Seeder;

/**
 * Seed de la section Histoire (À propos).
 */
class HistorySeeder extends Seeder
{
    public function run(): void
    {
        History::updateOrCreate(
            ['id' => 1],
            [
                'section_label' => 'À propos · Notre histoire',
                'title' => 'Notre histoire',
                'content' => "L'Alliance des Cercles d'Étudiants et d'Élèves Protestants de Côte d'Ivoire (ACEEPCI) est née de la vision commune d'étudiants et d'élèves chrétiens désireux de vivre et partager leur foi dans le milieu scolaire et universitaire. Depuis nos débuts, nous œuvrons pour évangéliser l'école ivoirienne et former une génération de leaders ancrés dans la Parole, selon notre devise : Connaître, Aimer, Servir.",
                'image_url' => null,
                'is_published' => true,
                'published_at' => now(),
            ]
        );
    }
}
