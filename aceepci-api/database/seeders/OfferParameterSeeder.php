<?php

namespace Database\Seeders;

use App\Models\OfferCategory;
use App\Models\OfferType;
use Illuminate\Database\Seeder;

class OfferParameterSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Emploi', 'code' => 'EMPLOI', 'sort_order' => 0],
            ['name' => 'Stage', 'code' => 'STAGE', 'sort_order' => 1],
            ['name' => 'Bourse', 'code' => 'BOURSE', 'sort_order' => 2],
            ['name' => 'Bénévolat', 'code' => 'BENEVOLAT', 'sort_order' => 3],
        ];

        foreach ($categories as $data) {
            OfferCategory::firstOrCreate(['name' => $data['name']], $data);
        }

        $types = [
            ['name' => 'CDI', 'code' => 'CDI', 'sort_order' => 0],
            ['name' => 'CDD', 'code' => 'CDD', 'sort_order' => 1],
            ['name' => 'Stage', 'code' => 'STAGE', 'sort_order' => 2],
            ['name' => 'Bénévolat', 'code' => 'BENEVOLAT', 'sort_order' => 3],
            ['name' => 'Bourse', 'code' => 'BOURSE', 'sort_order' => 4],
        ];

        foreach ($types as $data) {
            OfferType::firstOrCreate(['name' => $data['name']], $data);
        }
    }
}
