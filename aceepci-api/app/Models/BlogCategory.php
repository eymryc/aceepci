<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle BlogCategory (catégorie de blog).
 */
class BlogCategory extends Model
{
    /** @var list<string> */
    protected $fillable = ['name', 'code', 'sort_order'];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }
}
