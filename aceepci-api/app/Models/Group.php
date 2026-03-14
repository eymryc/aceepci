<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle Group (groupe).
 *
 * Représente un groupe rattaché à une famille (ex. : groupe de travail, commission).
 */
class Group extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'GR_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'family_id', 'description', 'created_by', 'updated_by', 'deleted_by'];

    /** Relation : famille à laquelle appartient ce groupe */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }
}
