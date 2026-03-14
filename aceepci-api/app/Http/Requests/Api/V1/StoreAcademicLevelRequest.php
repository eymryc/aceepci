<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Validation pour la création d'un niveau académique.
 */
class StoreAcademicLevelRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'value' => ['required', 'string', 'max:50', Rule::unique('academic_levels', 'value')],
            'label' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:20'],
            'member_type_id' => ['required', 'integer', Rule::exists('member_types', 'id')],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'value.required' => 'La valeur (code unique) est obligatoire.',
            'value.unique' => 'Cette valeur existe déjà.',
            'label.required' => 'Le libellé est obligatoire.',
            'member_type_id.required' => 'Le type de membre est obligatoire.',
            'member_type_id.exists' => 'Le type de membre sélectionné n\'existe pas.',
        ];
    }
}
