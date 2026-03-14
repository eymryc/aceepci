<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour la mise à jour d'une offre.
 */
class UpdateOfferRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('requirements') && is_array($this->requirements)) {
            $this->merge([
                'requirements' => array_values(array_filter(array_map('trim', $this->requirements), fn (string $s) => $s !== '')),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'organization' => ['sometimes', 'required', 'string', 'max:255'],
            'offer_category_id' => ['sometimes', 'required', 'integer', Rule::exists('offer_categories', 'id')],
            'offer_type_id' => ['nullable', 'integer', Rule::exists('offer_types', 'id')],
            'location' => ['nullable', 'string', 'max:255'],
            'deadline' => ['sometimes', 'required', 'date'],
            'description' => ['nullable', 'string'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string', 'max:500'],
            'salary' => ['nullable', 'string', 'max:100'],
            'duration' => ['nullable', 'string', 'max:100'],
            'external_link' => ['sometimes', 'nullable', 'string', 'max:500', StoreOfferRequest::getExternalLinkRule()],
            'category' => ['nullable', 'string', 'max:50'],
            'type' => ['nullable', 'string', 'max:100'],
        ];
    }
}
