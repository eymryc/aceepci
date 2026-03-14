<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\NewsCategory;

/**
 * Modèle Blog (article de blog).
 */
class Blog extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'title',
        'slug',
        'blog_category_id',
        'news_category_id',
        'excerpt',
        'content',
        'cover_image_path',
        'gallery',
        'is_published',
        'published_at',
        'comments_enabled',
        'reactions_enabled',
        'reading_time_minutes',
        'views_count',
        'initial_views',
        'likes_count',
        'loves_count',
        'interesting_count',
        'author_name',
        'author_role',
        'author_avatar_path',
        'event_id',
        'cta_label',
        'cta_link',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'comments_enabled' => 'boolean',
            'reactions_enabled' => 'boolean',
            'reading_time_minutes' => 'integer',
            'views_count' => 'integer',
            'initial_views' => 'integer',
            'likes_count' => 'integer',
            'loves_count' => 'integer',
            'interesting_count' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function newsCategory(): BelongsTo
    {
        return $this->belongsTo(NewsCategory::class, 'news_category_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class)->latest();
    }
}
