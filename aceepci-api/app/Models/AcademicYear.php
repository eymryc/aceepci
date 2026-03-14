<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle AcademicYear (année académique).
 *
 * Représente une année scolaire (ex. : 2024-2025).
 */
class AcademicYear extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'AY_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'year_start', 'year_end', 'is_current', 'created_by', 'updated_by', 'deleted_by'];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['is_current' => 'boolean'];
    }
}
