<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour les niveaux de membre.
 */
class MemberLevelResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'value' => $this->value,
            'label' => $this->label,
            'code' => $this->code,
            'member_type_id' => $this->member_type_id,
            'member_type' => new MemberTypeResource($this->whenLoaded('memberType')),
            'family_id' => $this->family_id,
            'family' => new FamilyResource($this->whenLoaded('family')),
            'display_order' => $this->display_order,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
