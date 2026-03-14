<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle DevotionalCategory (catégorie de dévotionnel).
 *
 * Représente une catégorie pour les dévotionnels (ex. Dévotion quotidienne, Foi, Prière).
 */
class DevotionalCategory extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'display_order'];

    /** @return array<string, string> Types de cast des attributs */
    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
        ];
    }
}
