<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

class StoreEventCategoryRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('event_categories', 'name')],
            'code' => ['nullable', 'string', 'max:20'],
        ];
    }
}
