<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle Event (événement).
 *
 * Représente un événement ACEEPCI (camp, conférence, retraite, etc.).
 */
class Event extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = [
        'name',
        'title',
        'slug',
        'category',
        'event_category_id',
        'start_date',
        'end_date',
        'expected_attendees',
        'image_url',
        'description',
        'location',
        'price',
        'is_published',
        'registration_open',
    ];

    /** @return array<string, string> Types de cast des attributs */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_published' => 'boolean',
            'registration_open' => 'boolean',
        ];
    }

    /** Accesseur : titre affiché (title ou name en fallback) */
    public function getDisplayTitleAttribute(): string
    {
        return $this->title ?? $this->name ?? '';
    }

    /** Relation : catégorie d'événement */
    public function eventCategory(): BelongsTo
    {
        return $this->belongsTo(EventCategory::class, 'event_category_id');
    }

    /** Relation : inscriptions à cet événement */
    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    /** Relation : options d'atelier proposées pour cet événement */
    public function workshopOptions(): HasMany
    {
        return $this->hasMany(WorkshopOption::class)->orderBy('sort_order');
    }
}
