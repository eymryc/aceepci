<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle FieldOfStudy (domaine de formation).
 *
 * Représente un domaine ou filière d'études (ex. : informatique, gestion).
 */
class FieldOfStudy extends Model
{
    use Auditable, HasParameterCode;

    /** Nom de la table (Laravel pluralise incorrectement "field_of_studies") */
    protected $table = 'fields_of_study';

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'FS_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'created_by', 'updated_by', 'deleted_by'];
}
