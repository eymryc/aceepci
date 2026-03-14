<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevotionalReaction extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'devotional_id',
        'user_id',
        'ip_address',
        'type',
    ];

    public function devotional(): BelongsTo
    {
        return $this->belongsTo(Devotional::class);
    }
}
