<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

class StoreWorkshopOptionRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:20'],
            'event_id' => ['nullable', 'integer', Rule::exists('events', 'id')],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
