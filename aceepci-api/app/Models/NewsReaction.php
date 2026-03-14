<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsReaction extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'news_id',
        'user_id',
        'ip_address',
        'type',
    ];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}

