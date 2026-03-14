<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle History (section Histoire).
 *
 * Bloc unique affiché sur la page À propos.
 */
class History extends Model
{
    use Auditable;

    /** @var list<string> Champs assignables en masse */
    protected $fillable = [
        'section_label',
        'title',
        'content',
        'image_url',
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
