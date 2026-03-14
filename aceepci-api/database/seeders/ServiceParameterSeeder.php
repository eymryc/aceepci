<?php

namespace Database\Seeders;

use App\Models\ServiceDepartment;
use App\Models\ServiceDomain;
use Illuminate\Database\Seeder;

/**
 * Seed des paramètres service : départements et domaines de service.
 */
class ServiceParameterSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Communication', 'code' => 'COM'],
            ['name' => 'Finances', 'code' => 'FIN'],
            ['name' => 'Évangélisation', 'code' => 'EVAN'],
            ['name' => 'Prière et intercession', 'code' => 'PRI'],
            ['name' => 'Louange et adoration', 'code' => 'LOU'],
            ['name' => 'Accueil', 'code' => 'ACC'],
            ['name' => 'Enfants', 'code' => 'ENF'],
        ];
        foreach ($departments as $data) {
            ServiceDepartment::firstOrCreate(['name' => $data['name']], $data);
        }

        $domains = [
            'Enseignement biblique',
            'Témoignage et évangélisation',
            'Prière',
            'Louange',
            'Médias et communication',
            'Administration',
            'Autre',
        ];
        foreach ($domains as $name) {
            ServiceDomain::firstOrCreate(['name' => $name]);
        }
    }
}
