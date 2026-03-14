<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Modèle Member.
 *
 * Représente une demande / fiche membre complète.
 */
class Member extends Model
{
    use Auditable;

    /** @var list<string> */
    protected $fillable = [
        'firstname',
        'lastname',
        'fullname',
        'birth_date',
        'birth_place',
        'sex',
        'nationality',
        'nationality_id',
        'identity_photo_url',
        'phone',
        'email',
        'address',
        'city_id',
        'district_id',
        'desired_service_department_id',
        'emergency_contact_name',
        'emergency_contact_phone',
        'member_type_id',
        'member_level',
        'member_level_id',
        'academic_level_id',
        'institution',
        'field_of_study',
        'profession',
        'company',
        'local_church',
        'pastor_name',
        'is_born_again',
        'is_baptized',
        'church_service_experience',
        'heard_about_aceepci',
        'heard_about_source_id',
        'motivation',
        'identity_document_url',
        'pastor_attestation_url',
        'student_certificate_url',
        'accept_charter',
        'accept_payment',
        'member_status_id',
        'family_id',
        'group_id',
        'source',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'is_born_again' => 'boolean',
            'is_baptized' => 'boolean',
            'accept_charter' => 'boolean',
            'accept_payment' => 'boolean',
        ];
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function nationality(): BelongsTo
    {
        return $this->belongsTo(Nationality::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function desiredServiceDepartment(): BelongsTo
    {
        return $this->belongsTo(ServiceDepartment::class, 'desired_service_department_id');
    }

    public function memberType(): BelongsTo
    {
        return $this->belongsTo(MemberType::class);
    }

    public function memberLevel(): BelongsTo
    {
        return $this->belongsTo(MemberLevel::class);
    }

    public function academicLevel(): BelongsTo
    {
        return $this->belongsTo(AcademicLevel::class);
    }

    public function heardAboutSource(): BelongsTo
    {
        return $this->belongsTo(HeardAboutSource::class);
    }

    public function memberStatus(): BelongsTo
    {
        return $this->belongsTo(MemberStatus::class);
    }

    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function serviceDomains(): BelongsToMany
    {
        return $this->belongsToMany(ServiceDomain::class, 'member_service_domain')
            ->withTimestamps();
    }
}
