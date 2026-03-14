<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour les slides.
 */
class SlideResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $imageUrl = $this->image_url
            ? (str_starts_with($this->image_url, 'http') ? $this->image_url : asset('storage/' . $this->image_url))
            : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'short_subtitle' => $this->short_subtitle,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'image_url' => $imageUrl,
            'display_order' => $this->display_order,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
