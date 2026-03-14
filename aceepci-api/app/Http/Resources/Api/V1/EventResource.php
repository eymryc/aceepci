<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour les événements.
 */
class EventResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->display_title,
            'slug' => $this->slug,
            'category' => $this->category ?? $this->eventCategory?->name,
            'event_category_id' => $this->event_category_id,
            'event_category' => new EventCategoryResource($this->whenLoaded('eventCategory')),
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'expected_attendees' => $this->expected_attendees,
            'image_url' => $this->image_url
                ? (str_starts_with($this->image_url, 'http') ? $this->image_url : asset('storage/' . $this->image_url))
                : null,
            'description' => $this->description,
            'location' => $this->location,
            'price' => $this->price,
            'is_published' => $this->is_published,
            'registration_open' => $this->registration_open,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
