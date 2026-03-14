<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $coverPath = $this->cover_image_path;
        $coverUrl = $coverPath
            ? (str_starts_with($coverPath, 'http') ? $coverPath : asset('storage/' . $coverPath))
            : null;

        $authorAvatarPath = $this->author_avatar_path;
        $authorAvatarUrl = $authorAvatarPath
            ? (str_starts_with($authorAvatarPath, 'http') ? $authorAvatarPath : asset('storage/' . $authorAvatarPath))
            : null;

        $gallery = $this->gallery ?? [];
        $galleryUrls = array_map(function ($item) {
            if (! is_string($item) || $item === '') {
                return null;
            }

            return str_starts_with($item, 'http') ? $item : asset('storage/' . $item);
        }, $gallery);
        $galleryUrls = array_values(array_filter($galleryUrls));

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'category_id' => $this->news_category_id,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'code' => $this->category?->code,
            ]),
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'cover_image_path' => $coverPath,
            'cover_image_url' => $coverUrl,
            'gallery' => $gallery,
            'gallery_urls' => $galleryUrls,
            'is_published' => (bool) $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'comments_enabled' => (bool) $this->comments_enabled,
            'reactions_enabled' => (bool) $this->reactions_enabled,
            'reading_time_minutes' => $this->reading_time_minutes,
            'views_count' => $this->views_count,
            'initial_views' => $this->initial_views,
            'likes_count' => $this->likes_count,
            'loves_count' => $this->loves_count,
            'interesting_count' => $this->interesting_count,
            'author_name' => $this->author_name,
            'author_role' => $this->author_role,
            'author_avatar_path' => $authorAvatarPath,
            'author_avatar_url' => $authorAvatarUrl,
            'event_id' => $this->event_id,
            'event' => $this->whenLoaded('event', function () {
                $event = $this->event;
                if (! $event) {
                    return null;
                }
                $displayTitle = $event->display_title ?? $event->title ?? $event->name ?? '';

                return [
                    'id' => $event->id,
                    'name' => $event->name ?? $displayTitle,
                    'title' => $displayTitle,
                    'slug' => $event->slug,
                ];
            }),
            'cta_label' => $this->cta_label,
            'cta_link' => $this->cta_link,
            'comments' => NewsCommentResource::collection($this->whenLoaded('comments')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

