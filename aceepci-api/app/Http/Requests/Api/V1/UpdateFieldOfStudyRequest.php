<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour la mise à jour d'un domaine de formation.
 */
class UpdateFieldOfStudyRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('field_of_study')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('fields_of_study', 'name')->ignore($id)],
            'code' => ['nullable', 'string', 'max:20'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'name.unique' => 'Ce domaine de formation existe déjà.',
        ];
    }
}
