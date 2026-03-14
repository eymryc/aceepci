<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

/**
 * Requête de validation pour la création d'un verset du jour.
 */
class StoreDailyVerseRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('daily-verses.manage') ?? false;
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
            'primary_text' => ['required', 'string', 'max:2000'],
            'primary_reference' => ['required', 'string', 'max:100'],
            'secondary_text' => ['nullable', 'string', 'max:2000'],
            'secondary_reference' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'],
            'image_label' => ['nullable', 'string', 'max:255'],
            'image_quote' => ['nullable', 'string', 'max:500'],
            'publish' => ['nullable', 'boolean'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'primary_text.required' => 'Le verset principal est obligatoire.',
            'primary_reference.required' => 'La référence du verset principal est obligatoire.',
            'image.image' => 'Le fichier doit être une image (jpeg, png, gif, webp).',
            'image.max' => 'L\'image ne peut pas dépasser 2 Mo.',
            'image.uploaded' => 'L\'image n\'a pas pu être envoyée. Vérifiez que le fichier ne dépasse pas 2 Mo et que le formulaire utilise multipart/form-data.',
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
