<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle VisionMissionValue (vision, mission & valeurs).
 *
 * Bloc unique affiché sur le site.
 */
class VisionMissionValue extends Model
{
    protected $fillable = [
        'section_label',
        'title',
        'subtitle',
        'vision_text',
        'mission_text',
        'values_text',
        'is_published',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}
