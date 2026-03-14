<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle DocumentSection (documents officiels).
 *
 * Bloc unique affiché sur le site avec en-tête de section et documents téléchargeables.
 */
class DocumentSection extends Model
{
    protected $fillable = [
        'section_label',
        'title',
        'subtitle',
        'documents',
        'is_published',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'documents' => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}
