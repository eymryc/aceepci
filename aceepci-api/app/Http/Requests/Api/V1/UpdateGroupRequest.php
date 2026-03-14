<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

/**
 * Requête de validation pour la mise à jour d'un groupe.
 */
class UpdateGroupRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:20'],
            'family_id' => ['sometimes', 'required', 'integer', 'exists:families,id'],
            'description' => ['nullable', 'string'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'family_id.required' => 'La famille est obligatoire.',
            'family_id.exists' => 'La famille sélectionnée n\'existe pas.',
        ];
    }
}
