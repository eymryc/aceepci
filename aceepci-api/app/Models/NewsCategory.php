<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle NewsCategory (catégorie d'article / actualité).
 *
 * Représente une catégorie d'article pour les actualités du site.
 */
class NewsCategory extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'sort_order'];

    /** @return array<string, string> Types de cast des attributs */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }
}

