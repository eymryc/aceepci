<?php

namespace Database\Seeders;

use App\Models\AcademicLevel;
use App\Models\Family;
use App\Models\Group;
use App\Models\HeardAboutSource;
use App\Models\MemberLevel;
use App\Models\MemberStatus;
use App\Models\MemberType;
use Illuminate\Database\Seeder;

/**
 * Seed des paramètres membres : types, statuts, familles, groupes, niveaux, sources de connaissance.
 */
class MemberParameterSeeder extends Seeder
{
    public function run(): void
    {
        $memberTypes = [
            ['name' => 'Étudiant', 'code' => 'ETU'],
            ['name' => 'Lycéen', 'code' => 'LYC'],
            ['name' => 'Collégien', 'code' => 'COL'],
            ['name' => 'Alumni', 'code' => 'ALUM'],
        ];
        foreach ($memberTypes as $data) {
            MemberType::firstOrCreate(['name' => $data['name']], $data);
        }

        $memberStatuses = [
            ['name' => 'Actif', 'code' => 'ACTIF'],
            ['name' => 'Ancien', 'code' => 'ANCIEN'],
            ['name' => 'En attente', 'code' => 'ATTENTE'],
        ];
        foreach ($memberStatuses as $data) {
            MemberStatus::firstOrCreate(['name' => $data['name']], $data);
        }

        $families = [
            ['name' => 'Communication', 'code' => 'COM'],
            ['name' => 'Finances', 'code' => 'FIN'],
            ['name' => 'Évangélisation', 'code' => 'EVAN'],
            ['name' => 'Prière et intercession', 'code' => 'PRI'],
            ['name' => 'Louange', 'code' => 'LOU'],
        ];
        foreach ($families as $data) {
            Family::firstOrCreate(['name' => $data['name']], $data);
        }

        foreach (Family::all() as $family) {
            Group::firstOrCreate(
                ['name' => $family->name . ' – Groupe 1', 'family_id' => $family->id],
                ['code' => $family->code . '_1']
            );
        }

        $studentType = MemberType::firstWhere('name', 'Étudiant');
        $lyceenType = MemberType::firstWhere('name', 'Lycéen');
        if ($studentType) {
            MemberLevel::firstOrCreate(
                ['value' => 'membre'],
                ['label' => 'Membre', 'member_type_id' => $studentType->id, 'display_order' => 0]
            );
            MemberLevel::firstOrCreate(
                ['value' => 'responsable'],
                ['label' => 'Responsable', 'member_type_id' => $studentType->id, 'display_order' => 1]
            );
            AcademicLevel::firstOrCreate(
                ['value' => 'licence'],
                ['label' => 'Licence', 'member_type_id' => $studentType->id, 'display_order' => 0]
            );
            AcademicLevel::firstOrCreate(
                ['value' => 'master'],
                ['label' => 'Master', 'member_type_id' => $studentType->id, 'display_order' => 1]
            );
        }
        if ($lyceenType) {
            AcademicLevel::firstOrCreate(
                ['value' => 'seconde'],
                ['label' => 'Seconde', 'member_type_id' => $lyceenType->id, 'display_order' => 0]
            );
            AcademicLevel::firstOrCreate(
                ['value' => 'premiere'],
                ['label' => 'Première', 'member_type_id' => $lyceenType->id, 'display_order' => 1]
            );
            AcademicLevel::firstOrCreate(
                ['value' => 'terminale'],
                ['label' => 'Terminale', 'member_type_id' => $lyceenType->id, 'display_order' => 2]
            );
        }

        $heardAbout = [
            ['value' => 'ami', 'label' => 'Un ami / une connaissance', 'display_order' => 1],
            ['value' => 'reseaux', 'label' => 'Réseaux sociaux', 'display_order' => 2],
            ['value' => 'affiche', 'label' => 'Affiche / flyer', 'display_order' => 3],
            ['value' => 'culte', 'label' => 'Culte ou activité', 'display_order' => 4],
            ['value' => 'autre', 'label' => 'Autre', 'display_order' => 99],
        ];
        foreach ($heardAbout as $data) {
            HeardAboutSource::firstOrCreate(
                ['value' => $data['value']],
                ['label' => $data['label'], 'display_order' => $data['display_order']]
            );
        }
    }
}
