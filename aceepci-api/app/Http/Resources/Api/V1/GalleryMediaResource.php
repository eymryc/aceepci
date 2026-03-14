<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour les entrées de la galerie média.
 */
class GalleryMediaResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $imageUrl = $this->image_path
            ? (str_starts_with($this->image_path, 'http') ? $this->image_path : asset('storage/' . $this->image_path))
            : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'image_path' => $this->image_path,
            'image_url' => $imageUrl,
            'display_order' => $this->display_order,
            'order' => $this->display_order,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
