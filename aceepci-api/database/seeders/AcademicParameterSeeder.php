<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\FieldOfStudy;
use Illuminate\Database\Seeder;

/**
 * Seed des paramètres académiques : années et domaines de formation.
 */
class AcademicParameterSeeder extends Seeder
{
    public function run(): void
    {
        $currentYear = (int) date('Y');
        $years = [
            ['name' => ($currentYear - 1) . '-' . $currentYear, 'year_start' => $currentYear - 1, 'year_end' => $currentYear, 'is_current' => false],
            ['name' => $currentYear . '-' . ($currentYear + 1), 'year_start' => $currentYear, 'year_end' => $currentYear + 1, 'is_current' => true],
        ];
        foreach ($years as $data) {
            $existing = AcademicYear::where('year_start', $data['year_start'])->first();
            if ($existing) {
                $existing->update(['is_current' => $data['is_current'], 'year_end' => $data['year_end'], 'name' => $data['name']]);
            } else {
                AcademicYear::firstOrCreate(
                    ['year_start' => $data['year_start']],
                    $data
                );
            }
        }

        $fields = [
            'Sciences',
            'Lettres et sciences humaines',
            'Droit et économie',
            'Médecine et santé',
            'Ingénierie',
            'Arts',
            'Autre',
        ];
        foreach ($fields as $name) {
            FieldOfStudy::firstOrCreate(['name' => $name]);
        }
    }
}
