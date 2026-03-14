<?php

namespace App\Services;

use App\Models\AccommodationType;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\MealPreference;
use App\Models\MemberType;
use App\Models\ServiceDepartment;
use App\Models\WorkshopOption;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Service de gestion des inscriptions aux événements.
 */
class EventRegistrationService
{
    use HasPaginatedSearch;

    private const SEARCH_COLUMNS = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'member_status',
        'membership_number',
        'department',
        'local_church',
    ];

    private const EAGER_RELATIONS = [
        'event',
        'memberType',
        'serviceDepartment',
        'accommodationType',
        'mealPreference',
        'workshopOptions',
    ];

    public function __construct(
        private EventService $eventService
    ) {}

    public function listPaginated(?int $eventId = null, ?string $search = null, int $perPage = 25): LengthAwarePaginator
    {
        $query = EventRegistration::query()
            ->with(self::EAGER_RELATIONS)
            ->latest('id');

        if ($eventId) {
            $query->where('event_id', $eventId);
        }

        return $this->paginateWithSearch($query, self::SEARCH_COLUMNS, $search, $perPage);
    }

    public function find(EventRegistration $registration): EventRegistration
    {
        return $registration->load(self::EAGER_RELATIONS);
    }

    public function create(array $data): EventRegistration
    {
        $event = $this->resolveEvent($data['event_id'] ?? null);
        if (! $event) {
            throw ValidationException::withMessages([
                'event_id' => "L'événement sélectionné n'existe pas.",
            ]);
        }

        $data['event_id'] = $event->id;
        $data['event_name'] = $event->display_title;

        $data['member_type_id'] = $data['member_type_id'] ?? $this->resolveMemberTypeId($data['member_status'] ?? null);
        $data['member_status'] = $data['member_status'] ?? MemberType::find($data['member_type_id'] ?? null)?->name;

        $data['service_department_id'] ??= $this->resolveServiceDepartmentId($data['department'] ?? null);
        $data['department'] = $data['department'] ?? ServiceDepartment::find($data['service_department_id'] ?? null)?->name;

        $data['accommodation_type_id'] ??= $this->resolveAccommodationTypeId($data['accommodation_type'] ?? null, $data['needs_accommodation'] ?? 'Non');
        $data['accommodation_type'] = $data['accommodation_type'] ?? AccommodationType::find($data['accommodation_type_id'] ?? null)?->name;

        $data['meal_preference_id'] ??= $this->resolveMealPreferenceId($data['meal_preference'] ?? null);
        $data['meal_preference'] = $data['meal_preference'] ?? MealPreference::find($data['meal_preference_id'] ?? null)?->name ?? 'Standard';

        $workshopOptionIds = $data['workshop_option_ids'] ?? $this->resolveWorkshopOptionIds($data['workshop_choice'] ?? [], $event->id);
        unset($data['workshop_option_ids'], $data['workshop_choice']);

        $registration = EventRegistration::create($data);

        if (! empty($workshopOptionIds)) {
            $registration->workshopOptions()->sync($workshopOptionIds);
            $registration->update([
                'workshop_choice' => WorkshopOption::whereIn('id', $workshopOptionIds)->pluck('name')->values()->all(),
            ]);
        }

        return $this->find($registration);
    }

    private function resolveEvent(string|int|null $eventIdOrSlug): ?Event
    {
        if ($eventIdOrSlug === null || $eventIdOrSlug === '') {
            return null;
        }

        return $this->eventService->findBySlugOrId($eventIdOrSlug);
    }

    private function resolveMemberTypeId(string|int|null $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return MemberType::find((int) $value)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return MemberType::query()->where('name', $op, $value)->first()?->id;
    }

    private function resolveServiceDepartmentId(string|int|null $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return ServiceDepartment::find((int) $value)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return ServiceDepartment::query()->where('name', $op, $value)->first()?->id;
    }

    private function resolveAccommodationTypeId(string|int|null $value, string $needsAccommodation): ?int
    {
        if ($needsAccommodation !== 'Oui' || ($value === null || $value === '')) {
            return null;
        }

        if (is_numeric($value)) {
            return AccommodationType::find((int) $value)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return AccommodationType::query()->where('name', $op, $value)->first()?->id;
    }

    private function resolveMealPreferenceId(string|int|null $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return MealPreference::find((int) $value)?->id;
        }

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return MealPreference::query()->where('name', $op, $value)->first()?->id;
    }

    /** @param  array<string>  $names
     * @return int[]
     */
    private function resolveWorkshopOptionIds(array $names, ?int $eventId = null): array
    {
        if (empty($names)) {
            return [];
        }

        $query = WorkshopOption::query()
            ->where(function ($q) use ($eventId) {
                $q->whereNull('event_id')->orWhere('event_id', $eventId);
            });

        $op = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
        $ids = [];

        foreach ($names as $name) {
            $name = trim((string) $name);
            if ($name === '') {
                continue;
            }

            if (is_numeric($name)) {
                $opt = WorkshopOption::find((int) $name);
                if ($opt) {
                    $ids[] = $opt->id;
                }
            } else {
                $opt = (clone $query)->where('name', $op, $name)->first();
                if ($opt) {
                    $ids[] = $opt->id;
                }
            }
        }

        return array_unique($ids);
    }
}
