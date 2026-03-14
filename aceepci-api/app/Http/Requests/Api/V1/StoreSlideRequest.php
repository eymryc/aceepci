<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

/**
 * Requête de validation pour la création d'un slide.
 */
class StoreSlideRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('slides.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'short_subtitle' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'],
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
}
