<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

class UpdateMealPreferenceRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('meal_preference')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('meal_preferences', 'name')->ignore($id)],
            'code' => ['nullable', 'string', 'max:20'],
        ];
    }
}
