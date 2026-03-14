<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Slide (carousel / bannière d'accueil).
 *
 * Représente un slide du carousel avec image, titres et description.
 */
class Slide extends Model
{
    use Auditable;

    /** @var list<string> Champs assignables en masse */
    protected $fillable = [
        'title',
        'short_subtitle',
        'subtitle',
        'description',
        'image_url',
        'display_order',
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
            'display_order' => 'integer',
        ];
    }
}
