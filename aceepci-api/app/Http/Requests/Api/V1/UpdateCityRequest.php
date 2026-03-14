<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour la mise à jour d'une ville.
 */
class UpdateCityRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('city')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('cities', 'name')->ignore($id)],
            'code' => ['nullable', 'string', 'max:20'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'name.unique' => 'Cette ville existe déjà.',
            'code.max' => 'Le code ne peut pas dépasser 20 caractères.',
        ];
    }
}
