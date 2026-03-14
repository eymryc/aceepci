<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle MemberLevel (niveau de membre).
 *
 * Chaque niveau est lié à un type de membre et (optionnellement) à une famille
 * pour l'affectation automatique.
 */
class MemberLevel extends Model
{
    use Auditable, HasParameterCode;

    protected string $codePrefix = 'ML_';

    /** @var list<string> */
    protected $fillable = [
        'value',
        'label',
        'code',
        'member_type_id',
        'family_id',
        'display_order',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function memberType(): BelongsTo
    {
        return $this->belongsTo(MemberType::class);
    }

    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }
}
