<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour le mot du président.
 */
class PresidentMessageResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $imageUrl = $this->image_url
            ? (str_starts_with($this->image_url, 'http') ? $this->image_url : asset('storage/' . $this->image_url))
            : null;

        return [
            'id' => $this->id,
            'section_label' => $this->section_label,
            'badge' => $this->badge,
            'title' => $this->title,
            'salutation' => $this->salutation,
            'message' => $this->message,
            'quote' => $this->quote,
            'image_url' => $imageUrl,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
