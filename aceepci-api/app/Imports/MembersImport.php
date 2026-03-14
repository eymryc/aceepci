<?php

namespace App\Imports;

use App\Models\AcademicLevel;
use App\Models\City;
use App\Models\District;
use App\Models\Nationality;
use App\Models\HeardAboutSource;
use App\Models\MemberLevel;
use App\Models\MemberType;
use App\Models\ServiceDepartment;
use App\Models\ServiceDomain;
use App\Services\MemberService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

/**
 * Import de membres depuis un fichier Excel.
 *
 * Colonnes attendues (première ligne = en-têtes) :
 * prenom, nom, date_naissance, lieu_naissance, sexe, nationalite, telephone, email, adresse,
 * ville, quartier, departement_souhaite, type_membre, niveau_membre, niveau_academique,
 * institution, filiere, profession, entreprise, eglise_locale, pasteur, ne_de_nouveau, baptise,
 * experience_service, comment_connu, motivation, domaines_service
 *
 * Les valeurs peuvent être des IDs ou des noms/libellés.
 */
class MembersImport implements ToCollection, WithHeadingRow, WithValidation
{
    public function __construct(
        private MemberService $memberService
    ) {}

    public function collection(Collection $rows): void
    {
        foreach ($rows as $row) {
            $data = $this->mapRowToArray($row);

            if (empty($data['firstname']) || empty($data['lastname']) || empty($data['phone'])) {
                continue;
            }

            if (empty($data['member_type_id']) || empty($data['member_level_id'])) {
                continue;
            }

            try {
                $this->memberService->create($data, false);
            } catch (\Throwable) {
                // Ignorer les lignes en erreur pour ne pas bloquer tout l'import
            }
        }
    }

    public function rules(): array
    {
        return [
            '*.prenom' => ['nullable', 'string', 'max:255'],
            '*.nom' => ['nullable', 'string', 'max:255'],
            '*.date_naissance' => ['nullable', 'date'],
            '*.sexe' => ['nullable', 'string', 'in:homme,femme,H,F,M'],
            '*.telephone' => ['nullable', 'string', 'max:20'],
        ];
    }

    /**
     * @param  Collection<string, mixed>  $row
     * @return array<string, mixed>
     */
    private function mapRowToArray(Collection $row): array
    {
        $data = [
            'firstname' => $this->str($row, 'prenom'),
            'lastname' => $this->str($row, 'nom'),
            'birth_date' => $this->date($row, 'date_naissance'),
            'birth_place' => $this->str($row, 'lieu_naissance'),
            'sex' => $this->normalizeSex($this->str($row, 'sexe')),
            'phone' => $this->str($row, 'telephone'),
            'email' => $this->str($row, 'email'),
            'address' => $this->str($row, 'adresse'),
            'emergency_contact_name' => $this->str($row, 'contact_urgence_nom'),
            'emergency_contact_phone' => $this->str($row, 'contact_urgence_tel'),
            'institution' => $this->str($row, 'institution'),
            'field_of_study' => $this->str($row, 'filiere'),
            'profession' => $this->str($row, 'profession'),
            'company' => $this->str($row, 'entreprise'),
            'local_church' => $this->str($row, 'eglise_locale'),
            'pastor_name' => $this->str($row, 'pasteur'),
            'is_born_again' => $this->bool($row, 'ne_de_nouveau'),
            'is_baptized' => $this->bool($row, 'baptise'),
            'church_service_experience' => $this->str($row, 'experience_service'),
            'motivation' => $this->str($row, 'motivation'),
        ];

        $data['city_id'] = $this->resolveCityId($row);
        $data['district_id'] = $this->resolveDistrictId($row);
        $data['nationality_id'] = $this->resolveNationalityId($row);
        $data['desired_service_department_id'] = $this->resolveServiceDepartmentId($row);
        $data['member_type_id'] = $this->resolveMemberTypeId($row);
        $data['member_level_id'] = $this->resolveMemberLevelId($row);
        $data['academic_level_id'] = $this->resolveAcademicLevelId($row);
        $data['heard_about_source_id'] = $this->resolveHeardAboutSourceId($row);
        $data['service_domain_ids'] = $this->resolveServiceDomainIds($row);

        return array_filter($data, fn ($v) => $v !== null && $v !== '');
    }

    private function str(Collection $row, string $key): ?string
    {
        $val = $row->get($key);

        if ($val === null || trim((string) $val) === '') {
            return null;
        }

        return trim((string) $val);
    }

    private function date(Collection $row, string $key): ?string
    {
        $val = $this->str($row, $key);

        if (! $val) {
            return null;
        }

        try {
            $d = \Carbon\Carbon::parse($val);

            return $d->format('Y-m-d');
        } catch (\Throwable) {
            return null;
        }
    }

    private function bool(Collection $row, string $key): ?bool
    {
        $val = $this->str($row, $key);

        if ($val === null || $val === '') {
            return null;
        }

        return in_array(strtolower($val), ['1', 'oui', 'yes', 'true', 'vrai', 'o'], true);
    }

    private function normalizeSex(?string $val): ?string
    {
        if (! $val) {
            return null;
        }

        return match (strtoupper(substr(trim($val), 0, 1))) {
            'H', 'M' => 'homme',
            'F' => 'femme',
            default => in_array(strtolower($val), ['homme', 'femme'], true) ? strtolower($val) : null,
        };
    }

    private function resolveNationalityId(Collection $row): ?int
    {
        $val = $this->str($row, 'nationalite');

        if (! $val) {
            return null;
        }

        if (is_numeric($val)) {
            return Nationality::find((int) $val)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return Nationality::query()->where('name', $op, $val)->first()?->id;
    }

    private function resolveCityId(Collection $row): ?int
    {
        $val = $this->str($row, 'ville');

        if (! $val) {
            return null;
        }

        if (is_numeric($val)) {
            return City::find((int) $val)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return City::query()->where('name', $op, $val)->first()?->id;
    }

    private function resolveDistrictId(Collection $row): ?int
    {
        $val = $this->str($row, 'quartier');

        if (! $val) {
            return null;
        }

        if (is_numeric($val)) {
            return District::find((int) $val)?->id;
        }

        $cityId = $this->resolveCityId($row);

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return District::query()
            ->when($cityId, fn ($q) => $q->where('city_id', $cityId))
            ->where('name', $op, $val)
            ->first()?->id;
    }

    private function resolveServiceDepartmentId(Collection $row): ?int
    {
        $val = $this->str($row, 'departement_souhaite');

        if (! $val) {
            return null;
        }

        if (is_numeric($val)) {
            return ServiceDepartment::find((int) $val)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return ServiceDepartment::query()->where('name', $op, $val)->first()?->id;
    }

    private function resolveMemberTypeId(Collection $row): ?int
    {
        $val = $this->str($row, 'type_membre');

        if (! $val) {
            return null;
        }

        if (is_numeric($val)) {
            return MemberType::find((int) $val)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return MemberType::query()->where('name', $op, $val)->first()?->id;
    }

    private function resolveMemberLevelId(Collection $row): ?int
    {
        $val = $this->str($row, 'niveau_membre');

        if (! $val) {
            return null;
        }

        if (is_numeric($val)) {
            return MemberLevel::find((int) $val)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return MemberLevel::query()
            ->where('label', $op, $val)
            ->orWhere('value', $op, $val)
            ->first()?->id;
    }

    private function resolveAcademicLevelId(Collection $row): ?int
    {
        $val = $this->str($row, 'niveau_academique');

        if (! $val) {
            return null;
        }

        if (is_numeric($val)) {
            return AcademicLevel::find((int) $val)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return AcademicLevel::query()
            ->where('label', $op, $val)
            ->orWhere('value', $op, $val)
            ->first()?->id;
    }

    private function resolveHeardAboutSourceId(Collection $row): ?int
    {
        $val = $this->str($row, 'comment_connu');

        if (! $val) {
            return null;
        }

        if (is_numeric($val)) {
            return HeardAboutSource::find((int) $val)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return HeardAboutSource::query()
            ->where('label', $op, $val)
            ->orWhere('value', $op, $val)
            ->first()?->id;
    }

    /**
     * @return int[]
     */
    private function resolveServiceDomainIds(Collection $row): array
    {
        $val = $this->str($row, 'domaines_service');

        if (! $val) {
            return [];
        }

        $parts = array_map('trim', preg_split('/[,;|]/', $val) ?: []);
        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
        $ids = [];

        foreach ($parts as $p) {
            if ($p === '') {
                continue;
            }

            if (is_numeric($p)) {
                $domain = ServiceDomain::find((int) $p);
                if ($domain) {
                    $ids[] = $domain->id;
                }
            } else {
                $domain = ServiceDomain::query()->where('name', $op, $p)->first();
                if ($domain) {
                    $ids[] = $domain->id;
                }
            }
        }

        return array_unique($ids);
    }
}
