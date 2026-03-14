<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

class UpdateAccommodationTypeRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('accommodation_type')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('accommodation_types', 'name')->ignore($id)],
            'code' => ['nullable', 'string', 'max:20'],
        ];
    }
}
