<?php

namespace Database\Seeders;

use App\Models\PresidentMessage;
use Illuminate\Database\Seeder;

/**
 * Seed du mot du président (À propos).
 */
class PresidentMessageSeeder extends Seeder
{
    public function run(): void
    {
        PresidentMessage::updateOrCreate(
            ['id' => 1],
            [
                'section_label' => 'À propos · Mot du président',
                'badge' => 'Mot du président',
                'title' => 'Bienvenue au sein de l\'ACEEPCI',
                'salutation' => 'Chers frères et sœurs, chers partenaires,',
                'message' => "Au nom de l'Alliance des Cercles d'Étudiants et d'Élèves Protestants de Côte d'Ivoire, je vous souhaite la bienvenue. Notre mouvement existe pour que chaque élève et étudiant puisse Connaître la Parole, Aimer Dieu et son prochain, et Servir l'Église et la société. Merci de marcher avec nous dans cette mission.",
                'quote' => 'Connaître, Aimer, Servir.',
                'image_url' => null,
                'is_published' => true,
                'published_at' => now(),
            ]
        );
    }
}
