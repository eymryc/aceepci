<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modèle EventRegistration (inscription à un événement).
 *
 * Représente une inscription à un événement ACEEPCI (camp, conférence, etc.).
 */
class EventRegistration extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = [
        'event_id',
        'event_name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'birth_date',
        'gender',
        'member_status',
        'member_type_id',
        'membership_number',
        'department',
        'service_department_id',
        'local_church',
        'accommodation_type_id',
        'needs_accommodation',
        'accommodation_type',
        'needs_transport',
        'transport_departure',
        'meal_preference',
        'meal_preference_id',
        'dietary_restrictions',
        'emergency_contact',
        'emergency_phone',
        'emergency_relation',
        'medical_conditions',
        'allergies',
        'medication',
        'special_needs',
        'workshop_choice',
        'motivation',
        'accept_terms',
        'accept_rules',
        'payment_confirm',
    ];

    /** @return array<string, string> Types de cast des attributs */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'accept_terms' => 'boolean',
            'accept_rules' => 'boolean',
            'payment_confirm' => 'boolean',
            'workshop_choice' => 'array',
        ];
    }

    /** Relation : événement concerné */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /** Relation : type de membre du participant */
    public function memberType(): BelongsTo
    {
        return $this->belongsTo(MemberType::class, 'member_type_id');
    }

    /** Relation : département de service du participant */
    public function serviceDepartment(): BelongsTo
    {
        return $this->belongsTo(ServiceDepartment::class, 'service_department_id');
    }

    /** Relation : type d'hébergement choisi */
    public function accommodationType(): BelongsTo
    {
        return $this->belongsTo(AccommodationType::class, 'accommodation_type_id');
    }

    /** Relation : préférence alimentaire choisie */
    public function mealPreference(): BelongsTo
    {
        return $this->belongsTo(MealPreference::class, 'meal_preference_id');
    }

    /** Relation : options d'atelier sélectionnées (many-to-many) */
    public function workshopOptions(): BelongsToMany
    {
        return $this->belongsToMany(WorkshopOption::class, 'event_registration_workshop_option')
            ->withTimestamps();
    }
}
