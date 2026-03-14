<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle GalleryMediaCategory (catégorie de la galerie média).
 *
 * Catégories paramétrables pour les photos de la galerie (ex. Formation, Réunion, Culture).
 */
class GalleryMediaCategory extends Model
{
    /** @var list<string> */
    protected $fillable = ['name', 'code', 'display_order'];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
        ];
    }
}
