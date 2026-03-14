<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle MealPreference (préférence alimentaire).
 *
 * Représente une préférence alimentaire pour les repas lors des événements (ex. : végétarien, sans gluten).
 */
class MealPreference extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code'];

    /** Relation : inscriptions aux événements ayant choisi cette préférence */
    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class, 'meal_preference_id');
    }
}
