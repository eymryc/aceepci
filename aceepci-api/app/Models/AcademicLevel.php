<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle AcademicLevel (niveau académique).
 *
 * Chaque niveau académique est lié à un type de membre.
 */
class AcademicLevel extends Model
{
    use Auditable, HasParameterCode;

    protected string $codePrefix = 'AL_';

    /** @var list<string> */
    protected $fillable = [
        'value',
        'label',
        'code',
        'member_type_id',
        'display_order',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function memberType(): BelongsTo
    {
        return $this->belongsTo(MemberType::class);
    }
}
