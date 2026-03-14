<?php

namespace App\Services;

use App\Models\AcademicLevel;
use App\Services\Concerns\HasPaginatedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des niveaux académiques.
 */
class AcademicLevelService
{
    use HasPaginatedSearch;

    public function listPaginated(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = AcademicLevel::query()->with('memberType')->orderBy('display_order')->orderBy('label');

        return $this->paginateWithSearch($query, ['value', 'label', 'code'], $search, $perPage);
    }

    public function list(?int $memberTypeId = null): Collection
    {
        return AcademicLevel::query()
            ->when($memberTypeId, fn ($q) => $q->where('member_type_id', $memberTypeId))
            ->orderBy('display_order')
            ->orderBy('label')
            ->get();
    }

    public function find(AcademicLevel $academicLevel): AcademicLevel
    {
        return $academicLevel->load('memberType');
    }

    public function create(array $data): AcademicLevel
    {
        $data['display_order'] ??= 0;

        return AcademicLevel::create($data);
    }

    public function update(AcademicLevel $academicLevel, array $data): AcademicLevel
    {
        $academicLevel->update($data);

        return $academicLevel->fresh();
    }

    public function delete(AcademicLevel $academicLevel): void
    {
        $academicLevel->delete();
    }
}
