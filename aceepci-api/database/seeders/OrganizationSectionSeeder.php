<?php

namespace Database\Seeders;

use App\Models\OrganizationSection;
use Illuminate\Database\Seeder;

class OrganizationSectionSeeder extends Seeder
{
    public function run(): void
    {
        OrganizationSection::updateOrCreate(
            ['id' => 1],
            [
                'section_label' => 'ACEEPCI · Structure',
                'title' => 'NOTRE ORGANISATION',
                'subtitle' => 'Une structure efficace au service de notre mission',
                'cards' => [
                    ['title' => 'BUREAU NATIONAL', 'description' => 'Direction stratégique et coordination des activités nationales'],
                    ['title' => 'BUREAUX RÉGIONAUX', 'description' => 'Coordination des départements par zone géographique'],
                    ['title' => '88+ DÉPARTEMENTS', 'description' => 'Présents dans les établissements à travers le pays'],
                    ['title' => '5 000+ MEMBRES ACTIFS', 'description' => 'Élèves, étudiants et alumni engagés dans la mission'],
                ],
                'is_published' => true,
                'published_at' => now(),
            ]
        );
    }
}
