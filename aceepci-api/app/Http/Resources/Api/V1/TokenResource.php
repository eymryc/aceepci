<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour la réponse d'authentification JWT.
 *
 * Formate le token + données utilisateur (login, register, refresh).
 */
class TokenResource extends JsonResource
{
    /** Désactive l'enveloppe "data" dans la réponse JSON */
    public static $wrap = null;

    /**
     * Transforme le payload token en tableau pour la réponse API.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'access_token' => $this->resource['access_token'],
            'token_type' => $this->resource['token_type'],
            'expires_in' => $this->resource['expires_in'],
            'user' => new UserResource(auth('api')->user()),
        ];
    }
}
