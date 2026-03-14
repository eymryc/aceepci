<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle OrganizationSection (section « Notre Organisation »).
 *
 * Bloc unique affiché sur le site avec en-tête de section et cartes dynamiques.
 */
class OrganizationSection extends Model
{
    protected $fillable = [
        'section_label',
        'title',
        'subtitle',
        'cards',
        'is_published',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'cards' => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}
