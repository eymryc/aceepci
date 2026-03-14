<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Validation pour la mise à jour d'une nationalité.
 */
class UpdateNationalityRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('nationality')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100', Rule::unique('nationalities', 'name')->ignore($id)],
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
