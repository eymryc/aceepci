<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

class UpdateNewsRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** Normalise les champs avant validation (camelCase → snake_case, vides → null). */
    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();
        $merge = [];

        $camelToSnake = [
            'newsCategoryId' => 'news_category_id',
            'eventId' => 'event_id',
            'readingTimeMinutes' => 'reading_time_minutes',
            'initialViews' => 'initial_views',
            'isPublished' => 'is_published',
            'publishedAt' => 'published_at',
            'commentsEnabled' => 'comments_enabled',
            'reactionsEnabled' => 'reactions_enabled',
            'authorName' => 'author_name',
            'authorRole' => 'author_role',
            'ctaLabel' => 'cta_label',
            'ctaLink' => 'cta_link',
        ];
        foreach ($camelToSnake as $camel => $snake) {
            if ($this->has($camel) && ! $this->has($snake)) {
                $merge[$snake] = $this->input($camel);
            }
        }

        foreach (['news_category_id', 'event_id'] as $key) {
            if ($this->has($key)) {
                $v = $this->input($key);
                if ($v === '' || $v === null || (is_string($v) && trim($v) === '')) {
                    $merge[$key] = null;
                } elseif (is_numeric($v)) {
                    $merge[$key] = (int) $v;
                }
            }
        }

        foreach (['reading_time_minutes', 'initial_views'] as $key) {
            if ($this->has($key)) {
                $v = $this->input($key);
                if ($v === '' || $v === null || (is_string($v) && trim((string) $v) === '')) {
                    $merge[$key] = null;
                } elseif (is_numeric($v)) {
                    $merge[$key] = (int) $v;
                } elseif (is_string($v) && preg_match('/\d+/', $v, $m)) {
                    $merge[$key] = (int) $m[0];
                }
            }
        }

        foreach (['cta_label', 'cta_link', 'author_name', 'author_role', 'excerpt'] as $key) {
            if ($this->has($key)) {
                $v = $this->input($key);
                if ($v === '' || (is_string($v) && trim($v) === '')) {
                    $merge[$key] = null;
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
                if ($v === '' || $v === null || (is_string($v) && trim($v) === '')) {
                    $merge[$key] = null;
                } elseif (in_array($v, [true, 'true', '1', 1], true)) {
                    $merge[$key] = true;
                } elseif (in_array($v, [false, 'false', '0', 0], true)) {
                    $merge[$key] = false;
                }
            }
        }

        if ($this->has('gallery') && is_array($this->input('gallery'))) {
            $hasFiles = $this->hasFile('gallery');
            if (! $hasFiles) {
                $gallery = [];
                foreach ($this->input('gallery') as $item) {
                    if (is_string($item)) {
                        $gallery[] = $item;
                    } elseif (is_array($item)) {
                        $v = $item['url'] ?? $item['path'] ?? $item['file'] ?? null;
                        $gallery[] = is_string($v) ? $v : '';
                    } else {
                        $gallery[] = '';
                    }
                }
                $merge['gallery'] = $gallery;
            }
        }

        if ($merge !== []) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        /** @var \App\Models\News|null $news */
        $news = $this->route('news');
        $id = $news?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:150', Rule::unique('news', 'slug')->ignore($id)],
            'news_category_id' => ['nullable', 'integer', Rule::exists('news_categories', 'id')],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'remove_cover_image' => ['nullable', 'boolean'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['nullable', function (string $attribute, mixed $value, \Closure $fail): void {
                if ($value instanceof \Illuminate\Http\UploadedFile) {
                    $v = \Illuminate\Support\Facades\Validator::make(
                        [$attribute => $value],
                        [$attribute => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120']]
                    );
                    if ($v->fails()) {
                        $fail($v->errors()->first());
                    }
                } elseif (! is_string($value) || strlen($value) > 255) {
                    $fail(__('validation.string'));
                }
            }],
            'is_published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'comments_enabled' => ['nullable', 'boolean'],
            'reactions_enabled' => ['nullable', 'boolean'],
            'reading_time_minutes' => ['nullable', 'integer', 'min:0', 'max:600'],
            'initial_views' => ['nullable', 'integer', 'min:0'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'author_role' => ['nullable', 'string', 'max:255'],
            'author_avatar' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'remove_author_avatar' => ['nullable', 'boolean'],
            'event_id' => ['nullable', 'integer', Rule::exists('events', 'id')],
            'cta_label' => ['nullable', 'string', 'max:255'],
            'cta_link' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'gallery.*.string' => 'Chaque élément de la galerie doit être une URL ou un chemin (texte).',
            'gallery.*.max' => 'Chaque élément de la galerie ne doit pas dépasser :max caractères.',
        ];
    }
}

