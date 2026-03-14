<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle OfferType (type/contrat d'offre).
 *
 * Représente un type ou contrat d'offre (ex. : CDI, CDD, Stage, Bénévolat, Bourse).
 */
class OfferType extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'sort_order'];

    /** @return array<string, string> Types de cast des attributs */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }
}
