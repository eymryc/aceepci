<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle EventCategory (catégorie d'événement).
 *
 * Représente une catégorie d'événement ACEEPCI (ex. : camp, conférence, retraite).
 */
class EventCategory extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code'];

    /** Relation : événements appartenant à cette catégorie */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'event_category_id');
    }
}
