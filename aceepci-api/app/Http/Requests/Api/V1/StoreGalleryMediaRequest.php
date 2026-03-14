<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

/**
 * Requête de validation pour la création d'une entrée galerie média.
 */
class StoreGalleryMediaRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('gallery.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'image.required' => 'L\'image est obligatoire.',
            'image.image' => 'Le fichier doit être une image (jpeg, png, gif, webp).',
            'image.max' => 'L\'image ne peut pas dépasser 2 Mo.',
        ];
    }
}
