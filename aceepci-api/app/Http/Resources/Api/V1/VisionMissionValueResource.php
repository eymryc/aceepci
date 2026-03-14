<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour la section Vision, Mission & Valeurs.
 */
class VisionMissionValueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'section_label' => $this->section_label,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'vision_text' => $this->vision_text,
            'mission_text' => $this->mission_text,
            'values_text' => $this->values_text,
            'is_published' => (bool) $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
