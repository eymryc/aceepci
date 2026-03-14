<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle PresidentMessage (mot du président).
 *
 * Bloc unique affiché sur la page d'accueil.
 */
class PresidentMessage extends Model
{
    use Auditable;

    /** @var list<string> Champs assignables en masse */
    protected $fillable = [
        'section_label',
        'badge',
        'title',
        'salutation',
        'message',
        'quote',
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
