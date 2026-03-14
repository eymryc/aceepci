<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Format standard des réponses API : status, message, data.
 */
class ApiResponse
{
    /** Retourne une réponse JSON de succès (status, message, data) */
    public static function success(
        mixed $data,
        string $message = 'Opération réussie',
        int $code = 200
    ): JsonResponse {
        $payload = $data instanceof JsonResource
            ? $data->resolve(request())
            : $data;

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $payload,
        ], $code);
    }

    /** Retourne une réponse JSON d'erreur (status, message, data) */
    public static function error(
        string $message,
        mixed $data = null,
        int $code = 400
    ): JsonResponse {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'data' => $data,
        ], $code);
    }
}
