<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle Family (famille).
 *
 * Représente une famille de services ou de catégories. Une famille contient plusieurs groupes.
 */
class Family extends Model
{
    use Auditable, HasParameterCode;

    /** Préfixe pour la génération du code */
    protected string $codePrefix = 'FA_';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = ['name', 'code', 'description', 'created_by', 'updated_by', 'deleted_by'];

    /** Relation : groupes appartenant à cette famille */
    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }
}
