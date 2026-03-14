<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsComment extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'news_id',
        'author_name',
        'author_avatar_url',
        'content',
        'is_approved',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'is_approved' => 'boolean',
        ];
    }

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}

