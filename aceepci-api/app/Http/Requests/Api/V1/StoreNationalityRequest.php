<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Validation pour la création d'une nationalité.
 */
class StoreNationalityRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', Rule::unique('nationalities', 'name')],
            'code' => ['nullable', 'string', 'max:20'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la nationalité est obligatoire.',
            'name.unique' => 'Cette nationalité existe déjà.',
        ];
    }
}
