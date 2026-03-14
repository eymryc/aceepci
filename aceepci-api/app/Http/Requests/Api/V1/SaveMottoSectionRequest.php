<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

/**
 * Requête de validation pour l'enregistrement de la section Devise.
 */
class SaveMottoSectionRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('motto.manage') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'publish' => $this->normalizeBoolean('publish'),
        ]);
    }

    public function rules(): array
    {
        return [
            'section_label' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            'quote' => ['nullable', 'string', 'max:500'],
            'pillars' => ['nullable', 'array'],
            'pillars.*.icon' => ['required', 'string', 'max:255'],
            'pillars.*.title' => ['required', 'string', 'max:255'],
            'pillars.*.description' => ['nullable', 'string', 'max:2000'],
            'publish' => ['nullable', 'boolean'],
        ];
    }

    private function normalizeBoolean(string $key): mixed
    {
        $value = $this->input($key);

        return match ($value) {
            true, 'true', 1, '1' => true,
            false, 'false', 0, '0' => false,
            '', null => null,
            default => $value,
        };
    }
}

