<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

class UpdateEventCategoryRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('event_category')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('event_categories', 'name')->ignore($id)],
            'code' => ['nullable', 'string', 'max:20'],
        ];
    }
}
