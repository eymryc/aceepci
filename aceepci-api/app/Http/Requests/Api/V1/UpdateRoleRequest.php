<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour la mise à jour d'un rôle.
 */
class UpdateRoleRequest extends BaseApiRequest
{
    /** Vérifie que l'utilisateur a la permission roles.manage */
    public function authorize(): bool
    {
        return $this->user()?->can('roles.manage') ?? false;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $role = $this->route('role');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('roles', 'name')->where('guard_name', 'api')->ignore($role?->id),
            ],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')->where('guard_name', 'api')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du rôle est obligatoire.',
            'name.max' => 'Le nom du rôle ne peut pas dépasser 255 caractères.',
            'name.alpha_dash' => 'Le nom du rôle ne peut contenir que des lettres, chiffres, tirets et underscores.',
            'name.unique' => 'Ce nom de rôle existe déjà.',
            'permissions.*.exists' => 'Une ou plusieurs permissions sont invalides.',
        ];
    }

}
