<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle City (ville).
 *
 * Représente une ville. Une ville peut contenir plusieurs districts (quartiers).
 */
class City extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'CT_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'created_by', 'updated_by', 'deleted_by'];

    /** Relation : districts (quartiers) appartenant à cette ville */
    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }
}
