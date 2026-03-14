<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

class StoreDevotionalCommentRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'author_name' => ['required', 'string', 'max:255'],
            'author_avatar_url' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string', 'max:5000'],
            'captcha_token' => ['required', 'string'],
        ];
    }
}
