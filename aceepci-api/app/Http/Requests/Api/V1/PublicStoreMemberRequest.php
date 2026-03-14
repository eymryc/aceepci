<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour une soumission membre depuis le site.
 *
 * Champs critiques obligatoires : firstname, lastname, sex, phone, member_type_id, member_level_id.
 * Tous les autres champs sont optionnels.
 */
class PublicStoreMemberRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_born_again' => $this->normalizeBoolean('is_born_again'),
            'is_baptized' => $this->normalizeBoolean('is_baptized'),
            'accept_charter' => $this->normalizeBoolean('accept_charter'),
            'accept_payment' => $this->normalizeBoolean('accept_payment'),
            'service_domain_ids' => $this->normalizeArray('service_domain_ids'),
        ]);
    }

    public function rules(): array
    {
        return [
            // Critique
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'sex' => ['required', Rule::in(['homme', 'femme'])],
            'phone' => ['required', 'string', 'max:20'],
            'member_type_id' => ['required', 'integer', Rule::exists('member_types', 'id')],
            'member_level_id' => ['required', 'integer', Rule::exists('member_levels', 'id')],

            // Identité (optionnel)
            'birth_date' => ['nullable', 'date'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'nationality_id' => ['nullable', 'integer', Rule::exists('nationalities', 'id')],
            'identity_photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],

            // Contact (optionnel)
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'city_id' => ['nullable', 'integer', Rule::exists('cities', 'id')],
            'district_id' => ['nullable', 'integer', Rule::exists('districts', 'id')],
            'desired_service_department_id' => ['nullable', 'integer', Rule::exists('service_departments', 'id')],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],

            // Académique / professionnel (optionnel)
            'academic_level_id' => ['nullable', 'integer', Rule::exists('academic_levels', 'id')],
            'institution' => ['nullable', 'string', 'max:255'],
            'field_of_study' => ['nullable', 'string', 'max:255'],
            'profession' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],

            // Spirituel (optionnel)
            'local_church' => ['nullable', 'string', 'max:255'],
            'pastor_name' => ['nullable', 'string', 'max:255'],
            'is_born_again' => ['nullable', 'boolean'],
            'is_baptized' => ['nullable', 'boolean'],
            'church_service_experience' => ['nullable', 'string', 'max:5000'],

            // Divers (optionnel)
            'service_domain_ids' => ['nullable', 'array'],
            'service_domain_ids.*' => ['integer', Rule::exists('service_domains', 'id')],
            'heard_about_source_id' => ['nullable', 'integer', Rule::exists('heard_about_sources', 'id')],
            'motivation' => ['nullable', 'string', 'max:5000'],

            // Documents (optionnel)
            'identity_document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'pastor_attestation' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'student_certificate' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],

            // Engagement (optionnel)
            'accept_charter' => ['nullable', 'boolean'],
            'accept_payment' => ['nullable', 'boolean'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'firstname.required' => 'Le prénom est obligatoire.',
            'lastname.required' => 'Le nom est obligatoire.',
            'sex.required' => 'Le sexe est obligatoire.',
            'phone.required' => 'Le téléphone est obligatoire.',
            'member_type_id.required' => 'Le type de membre est obligatoire.',
            'member_type_id.exists' => 'Le type de membre sélectionné n\'existe pas.',
            'member_level_id.required' => 'Le niveau du membre est obligatoire.',
            'member_level_id.exists' => 'Le niveau de membre sélectionné n\'existe pas.',
            'academic_level_id.exists' => 'Le niveau académique sélectionné n\'existe pas.',
            'heard_about_source_id.exists' => 'La source sélectionnée n\'existe pas.',
            'city_id.exists' => 'La ville sélectionnée n\'existe pas.',
            'district_id.exists' => 'Le quartier sélectionné n\'existe pas.',
            'nationality_id.exists' => 'La nationalité sélectionnée n\'existe pas.',
            'desired_service_department_id.exists' => 'Le département sélectionné n\'existe pas.',
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

    private function normalizeArray(string $key): mixed
    {
        $value = $this->input($key);

        if (is_array($value)) {
            return $value;
        }

        return $value === null || $value === '' ? [] : [$value];
    }
}
