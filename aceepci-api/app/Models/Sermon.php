<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Sermon (prédication vidéo, audio ou texte).
 * Même logique métier que Devotional : titre, slug, référence biblique, extrait, contenu, image, publication.
 */
class Sermon extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'title',
        'slug',
        'type',
        'speaker',
        'scripture_reference',
        'verse_text',
        'excerpt',
        'content',
        'cover_image_path',
        'reading_time',
        'video_url',
        'audio_url',
        'is_published',
        'published_at',
        'comments_enabled',
        'reactions_enabled',
        'views_count',
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
        ];
    }
}
