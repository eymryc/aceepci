<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;

/**
 * Requête de validation pour la mise à jour d'une année académique.
 *
 * Si le nom est au format "2024-2025" ou "2024-25", year_start et year_end
 * sont automatiquement déduits lorsqu'ils ne sont pas fournis.
 */
class UpdateAcademicYearRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('parameters.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:20'],
            'year_start' => ['sometimes', 'required', 'integer', 'min:1900', 'max:2100'],
            'year_end' => ['nullable', 'integer', 'min:1900', 'max:2100', 'gte:year_start'],
            'is_current' => ['sometimes', 'boolean'],
        ];
    }

    /** Déduit year_start et year_end du nom si fourni au format "2024-2025" ou "2024-25". */
    protected function prepareForValidation(): void
    {
        $name = $this->input('name');
        if (is_string($name) && preg_match('/^(\d{4})\s*[-\/]\s*(\d{2}|\d{4})$/', trim($name), $m)) {
            $start = (int) $m[1];
            $end = strlen($m[2]) === 2 ? (int) ($m[1][0] . $m[1][1] . $m[2]) : (int) $m[2];
            if ($start >= 1900 && $start <= 2100 && $end >= 1900 && $end <= 2100 && $end >= $start) {
                if (! $this->has('year_start')) {
                    $this->merge(['year_start' => $start]);
                }
                if (! $this->has('year_end')) {
                    $this->merge(['year_end' => $end]);
                }
            }
        }
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'year_start.required' => 'L\'année de début est obligatoire.',
            'year_start.min' => 'L\'année de début doit être entre 1900 et 2100.',
            'year_start.max' => 'L\'année de début doit être entre 1900 et 2100.',
            'year_end.gte' => 'L\'année de fin doit être supérieure ou égale à l\'année de début.',
        ];
    }
}
