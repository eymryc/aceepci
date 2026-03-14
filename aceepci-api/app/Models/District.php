<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle District (quartier).
 *
 * Représente un quartier ou district, rattaché à une ville.
 */
class District extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'DS_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'city_id', 'created_by', 'updated_by', 'deleted_by'];

    /** Relation : ville à laquelle appartient ce district */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
