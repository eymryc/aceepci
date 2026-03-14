<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle ServiceDepartment (département de service).
 *
 * Représente un département de service (ex. : communication, finances).
 */
class ServiceDepartment extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'SD_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'slug', 'description', 'created_by', 'updated_by', 'deleted_by'];
}
