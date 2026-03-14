<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

class SaveContactInfoRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'map_embed_url' => ['nullable', 'string', 'max:2000'],
            'hours_mon_fri' => ['nullable', 'string', 'max:100'],
            'hours_saturday' => ['nullable', 'string', 'max:100'],
            'hours_sunday' => ['nullable', 'string', 'max:100'],
            'regional_contacts' => ['nullable', 'array'],
            'regional_contacts.*.region' => ['required', 'string', 'max:255'],
            'regional_contacts.*.contact' => ['nullable', 'string', 'max:50'],
            'regional_contacts.*.email' => ['nullable', 'email', 'max:255'],
            'facebook_url' => ['nullable', 'string', 'url', 'max:500'],
            'instagram_url' => ['nullable', 'string', 'url', 'max:500'],
            'youtube_url' => ['nullable', 'string', 'url', 'max:500'],
        ];
    }
}
