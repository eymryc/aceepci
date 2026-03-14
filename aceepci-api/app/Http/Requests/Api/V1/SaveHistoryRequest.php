<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

/**
 * Requête de validation pour l'enregistrement de la section Histoire.
 */
class SaveHistoryRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('history.manage') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'remove_image' => $this->normalizeBoolean('remove_image'),
            'publish' => $this->normalizeBoolean('publish'),
        ]);
    }

    public function rules(): array
    {
        return [
            'section_label' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:10000'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'remove_image' => ['nullable', 'boolean'],
            'publish' => ['nullable', 'boolean'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'image.image' => 'Le fichier doit être une image (jpeg, png, webp).',
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
