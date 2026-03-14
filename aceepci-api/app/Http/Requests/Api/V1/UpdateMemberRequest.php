<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Requête admin pour modifier un membre.
 *
 * Tous les champs sont 'sometimes' pour permettre des mises à jour partielles.
 */
class UpdateMemberRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('members.manage') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_born_again' => $this->normalizeBoolean('is_born_again'),
            'is_baptized' => $this->normalizeBoolean('is_baptized'),
            'accept_charter' => $this->normalizeBoolean('accept_charter'),
            'accept_payment' => $this->normalizeBoolean('accept_payment'),
            'remove_identity_photo' => $this->normalizeBoolean('remove_identity_photo'),
            'remove_identity_document' => $this->normalizeBoolean('remove_identity_document'),
            'remove_pastor_attestation' => $this->normalizeBoolean('remove_pastor_attestation'),
            'remove_student_certificate' => $this->normalizeBoolean('remove_student_certificate'),
            'service_domain_ids' => $this->normalizeArray('service_domain_ids'),
        ]);
    }

    public function rules(): array
    {
        return [
            // Critique
            'firstname' => ['sometimes', 'required', 'string', 'max:255'],
            'lastname' => ['sometimes', 'required', 'string', 'max:255'],
            'sex' => ['sometimes', 'required', Rule::in(['homme', 'femme'])],
            'phone' => ['sometimes', 'required', 'string', 'max:20'],
            'member_type_id' => ['sometimes', 'required', 'integer', Rule::exists('member_types', 'id')],
            'member_level_id' => ['sometimes', 'required', 'integer', Rule::exists('member_levels', 'id')],

            // Identité
            'birth_date' => ['nullable', 'date'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'nationality_id' => ['nullable', 'integer', Rule::exists('nationalities', 'id')],
            'identity_photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],

            // Contact
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'city_id' => ['nullable', 'integer', Rule::exists('cities', 'id')],
            'district_id' => ['nullable', 'integer', Rule::exists('districts', 'id')],
            'desired_service_department_id' => ['nullable', 'integer', Rule::exists('service_departments', 'id')],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],

            // Académique / professionnel
            'academic_level_id' => ['nullable', 'integer', Rule::exists('academic_levels', 'id')],
            'institution' => ['nullable', 'string', 'max:255'],
            'field_of_study' => ['nullable', 'string', 'max:255'],
            'profession' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],

            // Spirituel
            'local_church' => ['nullable', 'string', 'max:255'],
            'pastor_name' => ['nullable', 'string', 'max:255'],
            'is_born_again' => ['nullable', 'boolean'],
            'is_baptized' => ['nullable', 'boolean'],
            'church_service_experience' => ['nullable', 'string', 'max:5000'],

            // Divers
            'service_domain_ids' => ['nullable', 'array'],
            'service_domain_ids.*' => ['integer', Rule::exists('service_domains', 'id')],
            'heard_about_source_id' => ['nullable', 'integer', Rule::exists('heard_about_sources', 'id')],
            'motivation' => ['nullable', 'string', 'max:5000'],

            // Documents
            'identity_document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'pastor_attestation' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'remove_identity_photo' => ['nullable', 'boolean'],
            'remove_identity_document' => ['nullable', 'boolean'],
            'remove_pastor_attestation' => ['nullable', 'boolean'],
            'remove_student_certificate' => ['nullable', 'boolean'],
            'student_certificate' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],

            // Engagement
            'accept_charter' => ['nullable', 'boolean'],
            'accept_payment' => ['nullable', 'boolean'],

            // Admin
            'member_status_id' => ['sometimes', 'nullable', 'integer', Rule::exists('member_statuses', 'id')],
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
        if (! $this->has($key)) {
            return $this->input($key);
        }

        $value = $this->input($key);

        if (is_array($value)) {
            return $value;
        }

        return $value === null || $value === '' ? [] : [$value];
    }
}
