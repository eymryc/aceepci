<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\OfferCategory;
use App\Models\OfferType;
use Illuminate\Database\Seeder;

/**
 * Seed des offres d'emploi / stage / bénévolat (style ACEEPCI).
 */
class OfferSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(OfferParameterSeeder::class);

        $emploi = OfferCategory::firstWhere('code', 'EMPLOI') ?? OfferCategory::first();
        $stage = OfferCategory::firstWhere('code', 'STAGE') ?? OfferCategory::skip(1)->first();
        $benevolat = OfferCategory::firstWhere('code', 'BENEVOLAT') ?? OfferCategory::skip(3)->first();

        $cdi = OfferType::firstWhere('code', 'CDI') ?? OfferType::first();
        $stageType = OfferType::firstWhere('code', 'STAGE') ?? OfferType::skip(2)->first();
        $benevolatType = OfferType::firstWhere('code', 'BENEVOLAT') ?? OfferType::skip(3)->first();

        $offers = [
            [
                'title' => 'Chargé(e) de communication et partenariats',
                'organization' => 'ACEEPCI',
                'offer_category_id' => $emploi->id,
                'offer_type_id' => $cdi->id,
                'location' => 'Abidjan',
                'deadline' => now()->addMonths(2),
                'description' => "Dans le cadre du renforcement de son équipe, l'ACEEPCI recherche un(e) chargé(e) de communication et partenariats pour animer la visibilité du mouvement et développer les partenariats (Églises, ONG, institutions).",
                'requirements' => ['Bac+3 minimum en communication ou équivalent', 'Maîtrise des réseaux sociaux et des outils numériques', 'Sens du relationnel et de l\'organisation'],
                'salary' => 'À définir selon profil',
                'duration' => null,
                'external_link' => null,
                'is_published' => true,
            ],
            [
                'title' => 'Stage en appui à la coordination des cercles',
                'organization' => 'ACEEPCI',
                'offer_category_id' => $stage->id,
                'offer_type_id' => $stageType->id,
                'location' => 'Abidjan / terrain',
                'deadline' => now()->addMonth(),
                'description' => 'Stage de 3 à 6 mois pour accompagner la coordination nationale des cercles (suivi des activités, logistique, reporting). Idéal pour un(e) étudiant(e) en gestion, communication ou travail social.',
                'requirements' => ['Étudiant(e) en cours de formation', 'Disponibilité et mobilité', 'Adhésion aux valeurs de l\'ACEEPCI'],
                'salary' => 'Indemnité de stage',
                'duration' => '3 à 6 mois',
                'external_link' => null,
                'is_published' => true,
            ],
            [
                'title' => 'Bénévolat : animation et enseignement biblique',
                'organization' => 'ACEEPCI',
                'offer_category_id' => $benevolat->id,
                'offer_type_id' => $benevolatType->id,
                'location' => 'Selon les cercles',
                'deadline' => now()->addMonths(6),
                'description' => "Nous recherchons des bénévoles pour animer des études bibliques et des temps de formation dans nos cercles (lycées et universités). Engagement régulier selon votre disponibilité.",
                'requirements' => ['Engagement chrétien et connaissance de la Bible', 'Pédagogie et bienveillance', 'Disponibilité régulière'],
                'salary' => null,
                'duration' => 'Ponctuel ou régulier',
                'external_link' => null,
                'is_published' => true,
            ],
        ];

        foreach ($offers as $data) {
            Offer::firstOrCreate(
                [
                    'title' => $data['title'],
                    'organization' => $data['organization'],
                ],
                $data
            );
        }
    }
}
