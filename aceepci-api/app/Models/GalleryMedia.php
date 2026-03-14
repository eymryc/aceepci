<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle GalleryMedia (galerie photos — page d'accueil, section galerie).
 */
class GalleryMedia extends Model
{
    use Auditable;

    protected $table = 'gallery_media';

    /** @var list<string> */
    protected $fillable = [
        'title',
        'category',
        'image_path',
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
            'display_order' => 'integer',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}
