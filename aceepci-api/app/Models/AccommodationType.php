<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle AccommodationType (type d'hébergement).
 *
 * Représente un type d'hébergement proposé lors des événements (ex. : chambre partagée, tente).
 */
class AccommodationType extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code'];

    /** Relation : inscriptions aux événements ayant choisi ce type d'hébergement */
    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class, 'accommodation_type_id');
    }
}
