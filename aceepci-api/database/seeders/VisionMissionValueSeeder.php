<?php

namespace Database\Seeders;

use App\Models\VisionMissionValue;
use Illuminate\Database\Seeder;

class VisionMissionValueSeeder extends Seeder
{
    public function run(): void
    {
        VisionMissionValue::updateOrCreate(
            ['id' => 1],
            [
                'section_label' => 'ACEEPCI · Fondements',
                'title' => 'Vision, mission & valeurs',
                'subtitle' => 'Les piliers qui guident notre engagement',
                'vision_text' => "Gagner l'école ivoirienne à Christ et former les leaders intellectuels de demain, en établissant une génération de jeunes ancrés dans la foi et engagés pour la transformation de leur nation.",
                'mission_text' => "Évangéliser et former spirituellement les élèves et étudiants, développer leur leadership, et créer une communauté de foi vivante guidée par notre devise : Connaître, Aimer, Servir.",
                'values_text' => "Connaître la Parole, aimer Dieu et son prochain, servir l'Église et la société : des valeurs vécues au quotidien dans nos départements et au cœur de chaque activité.",
                'is_published' => true,
                'published_at' => now(),
            ]
        );
    }
}
