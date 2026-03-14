<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle MottoSection (section « Notre devise »).
 *
 * Bloc unique affiché sur le site avec textes généraux et piliers.
 */
class MottoSection extends Model
{
    protected $fillable = [
        'section_label',
        'title',
        'subtitle',
        'quote',
        'pillars',
        'is_published',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'pillars' => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}

