<?php

namespace Database\Seeders;

use App\Models\MottoSection;
use Illuminate\Database\Seeder;

class MottoSectionSeeder extends Seeder
{
    public function run(): void
    {
        MottoSection::updateOrCreate(
            ['id' => 1],
            [
                'section_label' => 'ACEEPCI · Devise',
                'title' => 'NOTRE DEVISE',
                'subtitle' => 'Les trois piliers de notre engagement',
                'quote' => '« Connaître, Aimer, Servir – telle est notre vocation »',
                'pillars' => [
                    [
                        'icon' => 'book',
                        'title' => 'Connaître',
                        'description' => 'Approfondir notre connaissance de Dieu et de sa Parole.',
                    ],
                    [
                        'icon' => 'heart',
                        'title' => 'Aimer',
                        'description' => "Cultiver l\'amour de Dieu et du prochain au sein de la communauté.",
                    ],
                    [
                        'icon' => 'target',
                        'title' => 'Servir',
                        'description' => 'Mettre nos talents au service du Royaume de Dieu et de la société.',
                    ],
                ],
                'is_published' => true,
                'published_at' => now(),
            ]
        );
    }
}

