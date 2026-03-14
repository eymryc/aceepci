<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle MemberStatus (statut de membre).
 *
 * Représente un statut de membre (ex. : actif, inactif, suspendu).
 */
class MemberStatus extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'MS_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'created_by', 'updated_by', 'deleted_by'];
}
