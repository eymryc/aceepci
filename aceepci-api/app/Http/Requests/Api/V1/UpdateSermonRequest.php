<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

class UpdateSermonRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();
        $merge = [];

        if ($this->has('published_at')) {
            $v = $this->input('published_at');
            if ($v === '' || $v === null || (is_string($v) && trim($v) === '')) {
                $merge['published_at'] = null;
            }
        }

        foreach (['is_published', 'comments_enabled', 'reactions_enabled'] as $key) {
            if ($this->has($key)) {
                $v = $this->input($key);
                if ($v === '' || $v === null) {
                    $merge[$key] = false;
                } elseif (in_array($v, [true, 'true', '1', 1], true)) {
                    $merge[$key] = true;
                } elseif (in_array($v, [false, 'false', '0', 0], true)) {
                    $merge[$key] = false;
                }
            }
        }

        if ($merge !== []) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        /** @var \App\Models\Sermon|null $sermon */
        $sermon = $this->route('sermon');
        $id = $sermon?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:150', Rule::unique('sermons', 'slug')->ignore($id)],
            'type' => ['required', 'string', Rule::in(['video', 'audio', 'text'])],
            'speaker' => ['nullable', 'string', 'max:255'],
            'scripture_reference' => ['nullable', 'string', 'max:255'],
            'verse_text' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'remove_cover_image' => ['nullable', 'boolean'],
            'reading_time' => ['nullable', 'string', 'max:50'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'audio_url' => ['nullable', 'string', 'max:500'],
            'is_published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'comments_enabled' => ['nullable', 'boolean'],
            'reactions_enabled' => ['nullable', 'boolean'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $type = $this->input('type', 'text');
            if ($type === 'text' && ! $this->filled('content')) {
                $validator->errors()->add('content', __('validation.required', ['attribute' => 'content']));
            }
            if ($type === 'video' && ! $this->filled('video_url')) {
                $validator->errors()->add('video_url', __('validation.required', ['attribute' => 'video_url']));
            }
            if ($type === 'audio' && ! $this->filled('audio_url')) {
                $validator->errors()->add('audio_url', __('validation.required', ['attribute' => 'audio_url']));
            }
        });
    }
}
