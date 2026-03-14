<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour la mise à jour d'une famille.
 */
class UpdateFamilyRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('family')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('families', 'name')->ignore($id)],
            'code' => ['nullable', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'name.unique' => 'Cette famille existe déjà.',
        ];
    }
}
