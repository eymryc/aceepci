<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour la modification d'un utilisateur.
 */
class UpdateUserRequest extends BaseApiRequest
{
    /** Autorise : profil propre (tout user connecté) ou autre user (permission users.update) */
    public function authorize(): bool
    {
        $currentUser = $this->user();
        if (! $currentUser) {
            return false;
        }

        // Mise à jour du profil (sans {user} dans la route) : tout utilisateur connecté
        if (! $this->route('user')) {
            return true;
        }

        // Mise à jour d'un autre utilisateur : permission users.update requise
        return $currentUser->can('users.update');
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $userId = $this->route('user')?->id ?? $this->user()?->id;

        return [
            'firstname' => ['sometimes', 'string', 'max:255'],
            'lastname' => ['sometimes', 'string', 'max:255'],
            'fullname' => ['nullable', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'nullable',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'username' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
                'alpha_dash',
                Rule::unique('users', 'username')->ignore($userId),
            ],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'password' => ['sometimes', 'nullable', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['sometimes', 'nullable', 'string', 'min:8'],
            'role' => ['sometimes', 'string', Rule::exists('roles', 'name')->where('guard_name', 'api')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.email' => 'L\'email doit être une adresse valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'username.unique' => 'Ce nom d\'utilisateur est déjà utilisé.',
            'username.alpha_dash' => 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'role.exists' => 'Le rôle sélectionné n\'existe pas.',
        ];
    }

}
