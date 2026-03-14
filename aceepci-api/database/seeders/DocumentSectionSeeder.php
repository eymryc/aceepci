<?php

namespace Database\Seeders;

use App\Models\DocumentSection;
use Illuminate\Database\Seeder;

class DocumentSectionSeeder extends Seeder
{
    public function run(): void
    {
        DocumentSection::updateOrCreate(
            ['id' => 1],
            [
                'section_label' => 'ACEEPCI · Ressources',
                'title' => 'DOCUMENTS OFFICIELS',
                'subtitle' => 'Téléchargez nos statuts et règlement intérieur',
                'documents' => [
                    ['title' => 'Statuts de l\'ACEEPCI', 'description' => 'PDF – Mise à jour 2025', 'file_url' => null],
                    ['title' => 'Règlement intérieur', 'description' => 'PDF – Mise à jour 2025', 'file_url' => null],
                ],
                'is_published' => true,
                'published_at' => now(),
            ]
        );
    }
}
