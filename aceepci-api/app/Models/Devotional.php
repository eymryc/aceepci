<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle Devotional (dévotion / méditation quotidienne).
 */
class Devotional extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'title',
        'slug',
        'devotional_category_id',
        'scripture_reference',
        'verse_text',
        'excerpt',
        'content',
        'practical_application',
        'reflection_questions',
        'prayer',
        'cover_image_path',
        'reading_time',
        'is_published',
        'published_at',
        'comments_enabled',
        'reactions_enabled',
        'views_count',
        'amen_count',
        'beni_count',
        'edifiant_count',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'comments_enabled' => 'boolean',
            'reactions_enabled' => 'boolean',
            'views_count' => 'integer',
            'amen_count' => 'integer',
            'beni_count' => 'integer',
            'edifiant_count' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(DevotionalCategory::class, 'devotional_category_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(DevotionalComment::class)->latest();
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(DevotionalReaction::class);
    }
}
