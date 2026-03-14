<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use App\Models\Event;
use Illuminate\Validation\Rule;

/**
 * Requête de validation pour une inscription à un événement.
 *
 * Accepte IDs ou noms pour : member_status, department, accommodation_type, meal_preference, workshop_choice.
 */
class StoreEventRegistrationRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'accept_terms' => $this->normalizeBoolean('accept_terms'),
            'accept_rules' => $this->normalizeBoolean('accept_rules'),
            'payment_confirm' => $this->normalizeBoolean('payment_confirm'),
            'workshop_choice' => $this->normalizeWorkshopChoice(),
            'workshop_option_ids' => $this->normalizeArrayIds('workshop_option_ids'),
        ]);
    }

    public function rules(): array
    {
        return [
            // Identité
            'event_id' => ['required', 'string', function ($attribute, $value, $fail) {
                $event = is_numeric($value)
                    ? Event::find((int) $value)
                    : Event::where('slug', $value)->first();
                if (! $event) {
                    $fail("L'événement sélectionné n'existe pas.");
                }
            }],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'birth_date' => ['required', 'date'],
            'gender' => ['required', 'string', Rule::in(['masculin', 'féminin'])],

            // Statut membre (ID ou nom, au moins un requis)
            'member_status' => ['required_without:member_type_id', 'nullable', 'string', 'max:255'],
            'member_type_id' => ['required_without:member_status', 'nullable', 'integer', Rule::exists('member_types', 'id')],
            'membership_number' => ['nullable', 'string', 'max:50'],
            'department' => ['nullable', 'string', 'max:255'],
            'service_department_id' => ['nullable', 'integer', Rule::exists('service_departments', 'id')],
            'local_church' => ['nullable', 'string', 'max:255'],

            // Logistique
            'needs_accommodation' => ['required', 'string', Rule::in(['Oui', 'Non'])],
            'accommodation_type' => ['nullable', 'required_if:needs_accommodation,Oui', 'string', 'max:255'],
            'accommodation_type_id' => ['nullable', 'integer', Rule::exists('accommodation_types', 'id')],
            'needs_transport' => ['required', 'string', Rule::in(['Oui', 'Non'])],
            'transport_departure' => ['nullable', 'string', 'max:255'],
            'meal_preference' => ['required', 'string', 'max:255'],
            'meal_preference_id' => ['nullable', 'integer', Rule::exists('meal_preferences', 'id')],
            'dietary_restrictions' => ['nullable', 'string', 'max:5000'],

            // Contact d'urgence
            'emergency_contact' => ['required', 'string', 'max:255'],
            'emergency_phone' => ['required', 'string', 'max:20'],
            'emergency_relation' => ['required', 'string', 'max:100'],

            // Médical
            'medical_conditions' => ['nullable', 'string', 'max:5000'],
            'allergies' => ['nullable', 'string', 'max:5000'],
            'medication' => ['nullable', 'string', 'max:5000'],
            'special_needs' => ['nullable', 'string', 'max:5000'],

            // Participation
            'workshop_choice' => ['nullable', 'array'],
            'workshop_choice.*' => ['string', 'max:255'],
            'workshop_option_ids' => ['nullable', 'array'],
            'workshop_option_ids.*' => ['integer', Rule::exists('workshop_options', 'id')],
            'motivation' => ['nullable', 'string', 'max:5000'],

            // Engagement
            'accept_terms' => ['required', 'accepted'],
            'accept_rules' => ['required', 'accepted'],
            'payment_confirm' => ['required', 'accepted'],
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

    private function normalizeWorkshopChoice(): mixed
    {
        $value = $this->input('workshop_choice');

        if (is_array($value)) {
            return $value;
        }

        if (is_string($value) && $value !== '') {
            return array_map('trim', explode(',', $value));
        }

        return [];
    }

    private function normalizeArrayIds(string $key): array
    {
        $value = $this->input($key);

        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter(array_map('intval', $value)));
    }
}
