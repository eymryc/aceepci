<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle DailyVerse (verset du jour).
 *
 * Représente un verset biblique affiché sur la page d'accueil,
 * avec verset principal, secondaire optionnel et image.
 */
class DailyVerse extends Model
{
    use Auditable;

    /** @var list<string> Champs assignables en masse */
    protected $fillable = [
        'primary_text',
        'primary_reference',
        'secondary_text',
        'secondary_reference',
        'image_url',
        'image_label',
        'image_quote',
        'is_published',
        'published_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}
