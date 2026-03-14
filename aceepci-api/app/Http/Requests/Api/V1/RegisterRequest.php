<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour l'inscription (register).
 *
 * Valide les champs utilisateur avant création du compte.
 */
class RegisterRequest extends BaseApiRequest
{
    /**
     * Autorise l'accès à la requête (route publique).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour l'inscription.
     * - fullname : optionnel
     * - email ou username : au moins un des deux requis (les deux ne peuvent pas être vides)
     * - password, password_confirmation, role_id : obligatoires (id du rôle, liste via GET /roles)
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'fullname' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'required_without:username', 'email', 'unique:users,email'],
            'username' => ['nullable', 'required_without:email', 'string', 'max:50', 'alpha_dash', 'unique:users,username'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:20'],
            /** ID du rôle (sélectionner parmi GET /roles). @var int */
            'role_id' => ['required', 'integer', Rule::exists('roles', 'id')],
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
            'firstname.required' => 'Le prénom est obligatoire.',
            'lastname.required' => 'Le nom est obligatoire.',
            'email.required_without' => 'L\'email ou le nom d\'utilisateur est obligatoire.',
            'email.email' => 'L\'email doit être une adresse valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'username.required_without' => 'L\'email ou le nom d\'utilisateur est obligatoire.',
            'username.unique' => 'Ce nom d\'utilisateur est déjà utilisé.',
            'username.alpha_dash' => 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'password_confirmation.required' => 'La confirmation du mot de passe est obligatoire.',
            'role_id.required' => 'Le rôle est obligatoire.',
            'role_id.exists' => 'Le rôle sélectionné n\'existe pas.',
        ];
    }

}
