<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour les inscriptions aux événements.
 */
class EventRegistrationResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'event_name' => $this->event_name,
            'event' => new EventResource($this->whenLoaded('event')),

            // Identité
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'birth_date' => $this->birth_date?->toDateString(),
            'gender' => $this->gender,

            // Statut membre
            'member_status' => $this->member_status,
            'member_type_id' => $this->member_type_id,
            'member_type' => new MemberTypeResource($this->whenLoaded('memberType')),
            'membership_number' => $this->membership_number,
            'department' => $this->department,
            'service_department_id' => $this->service_department_id,
            'service_department' => new ServiceDepartmentResource($this->whenLoaded('serviceDepartment')),
            'local_church' => $this->local_church,

            // Logistique
            'needs_accommodation' => $this->needs_accommodation,
            'accommodation_type' => $this->accommodation_type,
            'accommodation_type_id' => $this->accommodation_type_id,
            'accommodation_type_detail' => new AccommodationTypeResource($this->whenLoaded('accommodationType')),
            'needs_transport' => $this->needs_transport,
            'transport_departure' => $this->transport_departure,
            'meal_preference' => $this->meal_preference,
            'meal_preference_id' => $this->meal_preference_id,
            'meal_preference_detail' => new MealPreferenceResource($this->whenLoaded('mealPreference')),
            'dietary_restrictions' => $this->dietary_restrictions,

            // Contact d'urgence
            'emergency_contact' => $this->emergency_contact,
            'emergency_phone' => $this->emergency_phone,
            'emergency_relation' => $this->emergency_relation,

            // Médical
            'medical_conditions' => $this->medical_conditions,
            'allergies' => $this->allergies,
            'medication' => $this->medication,
            'special_needs' => $this->special_needs,

            // Participation
            'workshop_choice' => $this->whenLoaded('workshopOptions', fn () => $this->workshopOptions->pluck('name')->values()->all()) ?? $this->workshop_choice,
            'workshop_option_ids' => $this->whenLoaded('workshopOptions', fn () => $this->workshopOptions->pluck('id')->values()->all()),
            'workshop_options' => WorkshopOptionResource::collection($this->whenLoaded('workshopOptions')),
            'motivation' => $this->motivation,

            // Engagement
            'accept_terms' => $this->accept_terms,
            'accept_rules' => $this->accept_rules,
            'payment_confirm' => $this->payment_confirm,

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
