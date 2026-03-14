<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

/**
 * Requête de validation pour la mise à jour d'un slide.
 */
class UpdateSlideRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('slides.manage') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'remove_image' => $this->normalizeBoolean('remove_image'),
        ]);
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'short_subtitle' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'],
            'remove_image' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
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
