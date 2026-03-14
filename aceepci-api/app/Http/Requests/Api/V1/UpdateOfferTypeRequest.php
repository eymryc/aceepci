<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

class UpdateOfferTypeRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('offer_type')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('offer_types', 'name')->ignore($id)],
            'code' => ['nullable', 'string', 'max:20'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
