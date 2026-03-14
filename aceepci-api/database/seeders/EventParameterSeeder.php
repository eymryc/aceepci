<?php

namespace Database\Seeders;

use App\Models\AccommodationType;
use App\Models\EventCategory;
use App\Models\MealPreference;
use App\Models\WorkshopOption;
use Illuminate\Database\Seeder;

class EventParameterSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Camp', 'Conférence', 'Séminaire', 'Retraite', 'Autre'];
        foreach ($categories as $name) {
            EventCategory::firstOrCreate(['name' => $name]);
        }

        $accommodations = ['Chambre partagée', 'Chambre individuelle', 'Tente', 'Sans hébergement'];
        foreach ($accommodations as $name) {
            AccommodationType::firstOrCreate(['name' => $name]);
        }

        $meals = ['Standard', 'Végétarien', 'Végan'];
        foreach ($meals as $name) {
            MealPreference::firstOrCreate(['name' => $name]);
        }

        $workshops = [
            'Leadership spirituel',
            'Évangélisation et mission',
            'Vie de prière et intercession',
            'Étude biblique approfondie',
            'Louange et adoration',
            'Mentorat et discipulat',
            'Gestion des finances personnelles',
            'Relation et mariage chrétien',
        ];

        $sortOrder = 0;
        foreach ($workshops as $name) {
            WorkshopOption::firstOrCreate(
                ['name' => $name, 'event_id' => null],
                ['sort_order' => $sortOrder++]
            );
        }
    }
}
