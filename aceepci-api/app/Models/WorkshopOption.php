<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modèle WorkshopOption (option d'atelier).
 *
 * Représente une option d'atelier proposée lors d'un événement (ex. : musique, danse).
 */
class WorkshopOption extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'event_id', 'sort_order'];

    /** @return array<string, string> Types de cast des attributs */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /** Relation : événement auquel appartient cette option */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /** Relation : inscriptions ayant sélectionné cette option (many-to-many) */
    public function eventRegistrations(): BelongsToMany
    {
        return $this->belongsToMany(EventRegistration::class, 'event_registration_workshop_option')
            ->withTimestamps();
    }
}
