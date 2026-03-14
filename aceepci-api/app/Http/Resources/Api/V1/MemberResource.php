<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour les membres.
 */
class MemberResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            // Identité
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'fullname' => $this->fullname,
            'birth_date' => $this->birth_date?->toDateString(),
            'birth_place' => $this->birth_place,
            'sex' => $this->sex,
            'nationality' => $this->nationality?->name ?? $this->getRawOriginal('nationality'),
            'nationality_id' => $this->nationality_id,
            'nationality_detail' => new NationalityResource($this->whenLoaded('nationality')),
            'identity_photo_url' => $this->resolveFileUrl($this->identity_photo_url),

            // Contact
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'city_id' => $this->city_id,
            'city' => new CityResource($this->whenLoaded('city')),
            'district_id' => $this->district_id,
            'district' => new DistrictResource($this->whenLoaded('district')),
            'desired_service_department_id' => $this->desired_service_department_id,
            'desired_service_department' => new ServiceDepartmentResource($this->whenLoaded('desiredServiceDepartment')),
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,

            // Type / niveau
            'member_type_id' => $this->member_type_id,
            'member_type' => new MemberTypeResource($this->whenLoaded('memberType')),
            'member_level' => $this->member_level,
            'member_level_id' => $this->member_level_id,
            'member_level_detail' => new MemberLevelResource($this->whenLoaded('memberLevel')),
            'academic_level_id' => $this->academic_level_id,
            'academic_level' => new AcademicLevelResource($this->whenLoaded('academicLevel')),

            // Académique / professionnel
            'institution' => $this->institution,
            'field_of_study' => $this->field_of_study,
            'profession' => $this->profession,
            'company' => $this->company,

            // Spirituel
            'local_church' => $this->local_church,
            'pastor_name' => $this->pastor_name,
            'is_born_again' => $this->is_born_again,
            'is_baptized' => $this->is_baptized,
            'church_service_experience' => $this->church_service_experience,

            // Domaines de service
            'service_domain_ids' => $this->whenLoaded('serviceDomains', fn () => $this->serviceDomains->pluck('id')->values()->all()),
            'service_domains' => ServiceDomainResource::collection($this->whenLoaded('serviceDomains')),

            // Divers
            'heard_about_aceepci' => $this->heard_about_aceepci,
            'heard_about_source_id' => $this->heard_about_source_id,
            'heard_about_source' => new HeardAboutSourceResource($this->whenLoaded('heardAboutSource')),
            'motivation' => $this->motivation,

            // Documents
            'identity_document_url' => $this->resolveFileUrl($this->identity_document_url),
            'pastor_attestation_url' => $this->resolveFileUrl($this->pastor_attestation_url),
            'student_certificate_url' => $this->resolveFileUrl($this->student_certificate_url),

            // Engagement
            'accept_charter' => $this->accept_charter,
            'accept_payment' => $this->accept_payment,

            // Gestion
            'member_status_id' => $this->member_status_id,
            'member_status' => new MemberStatusResource($this->whenLoaded('memberStatus')),
            'family_id' => $this->family_id,
            'family' => new FamilyResource($this->whenLoaded('family')),
            'group_id' => $this->group_id,
            'group' => new GroupResource($this->whenLoaded('group')),
            'source' => $this->source,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    private function resolveFileUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, 'http') ? $path : asset('storage/' . $path);
    }
}
