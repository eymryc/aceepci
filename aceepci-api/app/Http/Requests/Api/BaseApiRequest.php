<?php

namespace App\Http\Requests\Api;

use App\Http\Responses\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\App;

/**
 * Requête de base pour l'API avec format de réponse standard (status, message, data).
 * Les erreurs de validation sont renvoyées en français et dans un format lisible.
 */
abstract class BaseApiRequest extends FormRequest
{
    /** Utilise la locale française pour les messages de validation API */
    protected function prepareForValidation(): void
    {
        App::setLocale(config('app.api_locale', 'fr'));
    }

    /** Renvoie une erreur 422 avec messages lisibles (français) et structure claire pour le front. */
    protected function failedValidation(Validator $validator): void
    {
        $errors = $validator->errors();
        $messages = $errors->getMessages();
        $list = [];
        foreach ($messages as $field => $msgs) {
            foreach ((array) $msgs as $msg) {
                $list[] = ['field' => $field, 'message' => $msg];
            }
        }
        $summary = implode(' ', array_map(fn ($e) => $e['message'], $list));
        $message = count($list) > 1
            ? 'Plusieurs champs sont invalides.'
            : ($summary ?: 'Erreur de validation');

        throw new HttpResponseException(
            ApiResponse::error($message, [
                'errors' => $messages,
                'errors_list' => $list,
            ], 422)
        );
    }
}
