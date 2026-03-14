<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;

/**
 * Service de gestion des permissions.
 */
class PermissionService
{
    private const GUARD_NAME = 'api';

    /**
     * Liste des noms de permissions disponibles.
     *
     * @return Collection<int, string>
     */
    public function listNames(): Collection
    {
        return Permission::where('guard_name', self::GUARD_NAME)
            ->orderBy('name')
            ->pluck('name');
    }
}
