<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

/**
 * Export du modèle Excel pour l'import de membres.
 */
class MembersImportTemplateExport implements FromArray, WithHeadings
{
    public function array(): array
    {
        return [
            [
                'Jean',
                'Dupont',
                '2000-05-15',
                'Abidjan',
                'homme',
                'Ivoirienne',
                '+225 07 00 00 00 00',
                'jean.dupont@example.com',
                'Cocody Angré',
                'Abidjan',
                'Angré 7ème tranche',
                'Communication',
                'Marie Dupont',
                '+225 05 00 00 00 00',
                'Étudiant',
                'Université',
                'Licence 2',
                'Université FHB',
                'Informatique',
                '',
                '',
                'Église Baptiste',
                'Pasteur Martin',
                'oui',
                'oui',
                'Chant',
                'Réseaux sociaux',
                'Motivation pour rejoindre l\'ACEEPCI',
                '1,2',
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'prenom',
            'nom',
            'date_naissance',
            'lieu_naissance',
            'sexe',
            'nationalite',
            'telephone',
            'email',
            'adresse',
            'ville',
            'quartier',
            'departement_souhaite',
            'contact_urgence_nom',
            'contact_urgence_tel',
            'type_membre',
            'niveau_membre',
            'niveau_academique',
            'institution',
            'filiere',
            'profession',
            'entreprise',
            'eglise_locale',
            'pasteur',
            'ne_de_nouveau',
            'baptise',
            'experience_service',
            'comment_connu',
            'motivation',
            'domaines_service',
        ];
    }
}
