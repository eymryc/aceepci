<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour la mise à jour d'un événement.
 */
class UpdateEventRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'remove_image' => $this->boolean('remove_image'),
        ]);
    }

    public function rules(): array
    {
        $event = $this->route('event');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:100', Rule::unique('events', 'slug')->ignore($event?->id)],
            'category' => ['nullable', 'string', 'max:100'],
            'event_category_id' => ['nullable', 'integer', Rule::exists('event_categories', 'id')],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'expected_attendees' => ['nullable', 'string', 'max:50'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'remove_image' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'string', 'max:100'],
            'is_published' => ['nullable', 'boolean'],
            'registration_open' => ['nullable', 'boolean'],
        ];
    }
}
