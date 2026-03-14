<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour le verset du jour.
 */
class DailyVerseResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $imageUrl = $this->image_url
            ? (str_starts_with($this->image_url, 'http') ? $this->image_url : asset('storage/' . $this->image_url))
            : null;

        return [
            'id' => $this->id,
            'primary_text' => $this->primary_text,
            'primary_reference' => $this->primary_reference,
            'secondary_text' => $this->secondary_text,
            'secondary_reference' => $this->secondary_reference,
            'image_url' => $imageUrl,
            'image_label' => $this->image_label,
            'image_quote' => $this->image_quote,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
