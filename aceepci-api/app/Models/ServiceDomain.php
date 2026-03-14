<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle ServiceDomain (domaine de service).
 *
 * Représente un domaine de service offert par l'association.
 */
class ServiceDomain extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'SDO_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'created_by', 'updated_by', 'deleted_by'];
}
