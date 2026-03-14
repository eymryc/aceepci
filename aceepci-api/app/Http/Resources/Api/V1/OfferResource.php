<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour les offres.
 */
class OfferResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'organization' => $this->organization,
            'offer_category_id' => $this->offer_category_id,
            'offer_type_id' => $this->offer_type_id,
            'offer_category' => $this->whenLoaded('offerCategory', fn () => [
                'id' => $this->offerCategory->id,
                'name' => $this->offerCategory->name,
                'code' => $this->offerCategory->code,
            ]),
            'offer_type' => $this->whenLoaded('offerType', function () {
                if (! $this->offerType) {
                    return null;
                }
                return [
                    'id' => $this->offerType->id,
                    'name' => $this->offerType->name,
                    'code' => $this->offerType->code,
                ];
            }),
            'location' => $this->location,
            'deadline' => $this->deadline?->toDateString(),
            'is_published' => (bool) $this->is_published,
            'description' => $this->description,
            'requirements' => $this->requirements ?? [],
            'salary' => $this->salary,
            'duration' => $this->duration,
            'external_link' => $this->external_link,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
