<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

/**
 * Requête de validation pour la connexion (login).
 *
 * Valide les champs email et password avant tentative d'authentification.
 */
class LoginRequest extends BaseApiRequest
{
    /**
     * Autorise l'accès à la requête (route publique).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour la connexion.
     * Le champ "login" accepte l'email OU le nom d'utilisateur.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Messages d'erreur personnalisés en français.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'login.required' => 'L\'identifiant (email ou nom d\'utilisateur) est obligatoire.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ];
    }

}
