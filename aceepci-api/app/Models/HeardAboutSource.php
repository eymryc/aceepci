<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasParameterCode;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle HeardAboutSource (comment avez-vous connu l'ACEEPCI).
 */
class HeardAboutSource extends Model
{
    use Auditable, HasParameterCode;

    protected string $codePrefix = 'HS_';

    /** @var list<string> */
    protected $fillable = [
        'value',
        'label',
        'code',
        'display_order',
        'created_by',
        'updated_by',
        'deleted_by',
    ];
}
