<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevotionalComment extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'devotional_id',
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

    public function devotional(): BelongsTo
    {
        return $this->belongsTo(Devotional::class);
    }
}
