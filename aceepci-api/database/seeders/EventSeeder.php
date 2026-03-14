<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(EventParameterSeeder::class);

        $camp = EventCategory::firstOrCreate(['name' => 'Camp']);
        $conference = EventCategory::firstOrCreate(['name' => 'Conférence']);
        $retraite = EventCategory::firstOrCreate(['name' => 'Retraite']);
        $seminaire = EventCategory::firstOrCreate(['name' => 'Séminaire']);

        $events = [
            [
                'slug' => 'camp-biblique-national-2026',
                'name' => 'Camp Biblique National 2026',
                'title' => 'Camp Biblique National 2026',
                'category' => 'Camp',
                'event_category_id' => $camp->id,
                'start_date' => now()->addMonths(5)->setDay(15),
                'end_date' => now()->addMonths(5)->setDay(22),
                'expected_attendees' => '500+',
                'description' => 'Camp annuel des étudiants et élèves chrétiens. Une semaine de formation, de communion et de service selon notre devise : Connaître, Aimer, Servir.',
                'location' => 'Yamoussoukro',
                'price' => '25 000 FCFA',
                'is_published' => true,
                'registration_open' => true,
            ],
            [
                'slug' => 'conference-nationale-leadership-2026',
                'name' => 'Conférence nationale leadership 2026',
                'title' => 'Conférence nationale : Leadership et engagement',
                'category' => 'Conférence',
                'event_category_id' => $conference->id,
                'start_date' => now()->addMonths(2)->setDay(1),
                'end_date' => now()->addMonths(2)->setDay(2),
                'expected_attendees' => '200+',
                'description' => 'Deux jours de conférences et d\'ateliers sur le leadership chrétien en milieu scolaire et universitaire. Ouvert aux responsables de cercles et aux membres actifs.',
                'location' => 'Abidjan',
                'price' => '10 000 FCFA',
                'is_published' => true,
                'registration_open' => true,
            ],
            [
                'slug' => 'retraite-priere-intercession-2026',
                'name' => 'Retraite de prière et intercession 2026',
                'title' => 'Retraite de prière et intercession',
                'category' => 'Retraite',
                'event_category_id' => $retraite->id,
                'start_date' => now()->addMonths(3)->setDay(10),
                'end_date' => now()->addMonths(3)->setDay(12),
                'expected_attendees' => '80',
                'description' => 'Un week-end dédié à la prière, à l\'écoute de Dieu et à l\'intercession pour l\'école ivoirienne et les cercles ACEEPCI.',
                'location' => 'Abidjan',
                'price' => '5 000 FCFA',
                'is_published' => true,
                'registration_open' => true,
            ],
            [
                'slug' => 'seminaire-evangelisation-campus-2026',
                'name' => 'Séminaire évangélisation campus 2026',
                'title' => 'Séminaire : Évangéliser sur le campus',
                'category' => 'Séminaire',
                'event_category_id' => $seminaire->id,
                'start_date' => now()->addMonths(4)->setDay(20),
                'end_date' => now()->addMonths(4)->setDay(21),
                'expected_attendees' => '120',
                'description' => 'Formation pratique à l\'évangélisation et au témoignage en milieu étudiant. Outils, témoignages et mises en situation.',
                'location' => 'Bouaké',
                'price' => '3 000 FCFA',
                'is_published' => true,
                'registration_open' => false,
            ],
        ];

        foreach ($events as $data) {
            Event::firstOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
