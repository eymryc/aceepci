<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle MemberType (type de membre).
 *
 * Représente un type de membre (ex. : étudiant, professeur, alumni).
 */
class MemberType extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'MT_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'created_by', 'updated_by', 'deleted_by'];

    public function memberLevels(): HasMany
    {
        return $this->hasMany(MemberLevel::class)->orderBy('display_order');
    }

    public function academicLevels(): HasMany
    {
        return $this->hasMany(AcademicLevel::class)->orderBy('display_order');
    }
}
