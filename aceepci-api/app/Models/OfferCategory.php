<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle OfferCategory (catégorie d'offre).
 *
 * Représente une catégorie d'offre (ex. : Emploi, Stage, Bourse, Bénévolat).
 */
class OfferCategory extends Model
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
