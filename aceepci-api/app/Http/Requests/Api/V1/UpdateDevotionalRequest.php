<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

class UpdateDevotionalRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();
        $merge = [];

        foreach (['devotional_category_id'] as $key) {
            if ($this->has($key)) {
                $v = $this->input($key);
                if ($v === '' || $v === null || (is_string($v) && trim($v) === '')) {
                    $merge[$key] = null;
                } elseif (is_numeric($v)) {
                    $merge[$key] = (int) $v;
                }
            }
        }

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
        /** @var \App\Models\Devotional|null $devotional */
        $devotional = $this->route('devotional');
        $id = $devotional?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:150', Rule::unique('devotionals', 'slug')->ignore($id)],
            'devotional_category_id' => ['nullable', 'integer', Rule::exists('devotional_categories', 'id')],
            'scripture_reference' => ['nullable', 'string', 'max:255'],
            'verse_text' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'practical_application' => ['nullable', 'string'],
            'reflection_questions' => ['nullable', 'string'],
            'prayer' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'remove_cover_image' => ['nullable', 'boolean'],
            'reading_time' => ['nullable', 'string', 'max:50'],
            'is_published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'comments_enabled' => ['nullable', 'boolean'],
            'reactions_enabled' => ['nullable', 'boolean'],
        ];
    }
}
