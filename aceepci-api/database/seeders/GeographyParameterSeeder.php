<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\District;
use Illuminate\Database\Seeder;

/**
 * Seed des paramètres géographiques : villes et districts.
 */
class GeographyParameterSeeder extends Seeder
{
    public function run(): void
    {
        $citiesWithDistricts = [
            'Abidjan' => ['Cocody', 'Yopougon', 'Marcory', 'Treichville', 'Plateau', 'Adjamé', 'Abobo'],
            'Yamoussoukro' => ['Centre-ville', 'Kossou'],
            'Bouaké' => ['Centre-ville'],
            'Daloa' => ['Centre-ville'],
            'San-Pedro' => ['Centre-ville'],
        ];

        foreach ($citiesWithDistricts as $cityName => $districtNames) {
            $city = City::firstOrCreate(
                ['name' => $cityName],
                ['code' => strtoupper(substr($cityName, 0, 3))]
            );
            foreach ($districtNames as $districtName) {
                District::firstOrCreate(
                    [
                        'name' => $districtName,
                        'city_id' => $city->id,
                    ],
                    ['code' => null]
                );
            }
        }
    }
}
