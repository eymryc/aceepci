<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour les rôles.
 */
class RoleResource extends JsonResource
{
    /** @var array<string, string> Libellés des rôles par défaut */
    private const LABELS = [
        'admin' => 'Administrateur',
        'membre' => 'Membre',
        'invite' => 'Invité',
    ];

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'label' => self::LABELS[$this->name] ?? $this->name,
        ];

        if ($this->relationLoaded('permissions')) {
            $data['permissions'] = $this->permissions->pluck('name')->values()->all();
        }

        return $data;
    }
}
