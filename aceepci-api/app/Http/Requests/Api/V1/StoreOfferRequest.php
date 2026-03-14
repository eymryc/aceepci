<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour la création d'une offre.
 */
class StoreOfferRequest extends BaseApiRequest
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

        if ($this->has('external_link') && $this->external_link === '') {
            $this->merge([
                'external_link' => null,
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'organization' => ['required', 'string', 'max:255'],
            'offer_category_id' => [
                Rule::requiredIf(fn () => ! $this->filled('category')),
                'nullable',
                'integer',
                Rule::exists('offer_categories', 'id'),
            ],
            'offer_type_id' => ['nullable', 'integer', Rule::exists('offer_types', 'id')],
            'location' => ['nullable', 'string', 'max:255'],
            'deadline' => ['required', 'date', 'after_or_equal:today'],
            'description' => ['nullable', 'string'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string', 'max:500'],
            'salary' => ['nullable', 'string', 'max:100'],
            'duration' => ['nullable', 'string', 'max:100'],
            'external_link' => ['nullable', 'string', 'max:500', $this->getExternalLinkRule()],
            // Fallback rétrocompatibilité
            'category' => ['nullable', 'string', 'max:50'],
            'type' => ['nullable', 'string', 'max:100'],
        ];
    }

    public static function getExternalLinkRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            if ($value === null || $value === '') {
                return;
            }

            if (! is_string($value)) {
                $fail('Le lien doit être une URL valide.');
                return;
            }

            if (str_starts_with($value, 'mailto:')) {
                $email = trim(substr($value, 7));
                if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $fail('Le mailto doit contenir une adresse email valide.');
                }
            } elseif (! filter_var($value, FILTER_VALIDATE_URL)) {
                $fail('Le lien doit être une URL valide.');
            }
        };
    }
}
