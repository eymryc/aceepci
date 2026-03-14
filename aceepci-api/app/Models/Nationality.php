<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Nationality (nationalité).
 *
 * Représente une nationalité (ex. : Ivoirienne, Française).
 */
class Nationality extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'NT_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = [
        'name',
        'code',
        'display_order',
        'created_by',
        'updated_by',
        'deleted_by',
    ];
}
