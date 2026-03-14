<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SermonResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $coverPath = $this->cover_image_path;
        $coverUrl = $coverPath
            ? (str_starts_with($coverPath, 'http') ? $coverPath : asset('storage/' . $coverPath))
            : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'type' => $this->type,
            'speaker' => $this->speaker,
            'scripture_reference' => $this->scripture_reference,
            'verse_text' => $this->verse_text,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'cover_image_path' => $coverPath,
            'cover_image_url' => $coverUrl,
            'reading_time' => $this->reading_time,
            'video_url' => $this->video_url,
            'audio_url' => $this->audio_url,
            'is_published' => (bool) $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'comments_enabled' => (bool) $this->comments_enabled,
            'reactions_enabled' => (bool) $this->reactions_enabled,
            'views_count' => (int) $this->views_count,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
