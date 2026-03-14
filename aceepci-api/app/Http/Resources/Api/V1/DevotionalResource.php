<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DevotionalResource extends JsonResource
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
            'devotional_category_id' => $this->devotional_category_id,
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'code' => $this->category->code,
            ] : null),
            'scripture_reference' => $this->scripture_reference,
            'verse_text' => $this->verse_text,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'practical_application' => $this->practical_application,
            'reflection_questions' => $this->reflection_questions,
            'prayer' => $this->prayer,
            'cover_image_path' => $coverPath,
            'cover_image_url' => $coverUrl,
            'reading_time' => $this->reading_time,
            'is_published' => (bool) $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'comments_enabled' => (bool) $this->comments_enabled,
            'reactions_enabled' => (bool) $this->reactions_enabled,
            'views_count' => (int) $this->views_count,
            'amen_count' => (int) $this->amen_count,
            'beni_count' => (int) $this->beni_count,
            'edifiant_count' => (int) $this->edifiant_count,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
