<?php

namespace App\Services;

use App\Models\Role;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service de gestion des rôles.
 */
class RoleService
{
    private const GUARD_NAME = 'api';

    /**
     * Liste des rôles (avec ou sans permissions selon le contexte).
     */
    public function list(bool $withPermissions = false): Collection
    {
        return Role::where('guard_name', self::GUARD_NAME)
            ->when($withPermissions, fn ($q) => $q->with('permissions'))
            ->orderBy('name')
            ->get();
    }

    /**
     * Récupère un rôle par ID.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     */
    public function find(Role $role): Role
    {
        $this->ensureApiGuard($role);

        return $role->load('permissions');
    }

    /**
     * Crée un rôle.
     *
     * @param  array{name: string, permissions?: array<string>}  $data
     */
    public function create(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => self::GUARD_NAME,
        ]);

        if (! empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions');
    }

    /**
     * Met à jour un rôle.
     *
     * @param  array{name?: string, permissions?: array<string>}  $data
     */
    public function update(Role $role, array $data): Role
    {
        $this->ensureApiGuard($role);

        if (array_key_exists('name', $data)) {
            $role->update(['name' => $data['name']]);
        }

        if (array_key_exists('permissions', $data)) {
            $role->syncPermissions($data['permissions'] ?? []);
        }

        return $role->load('permissions');
    }

    /**
     * Supprime un rôle.
     */
    public function delete(Role $role): void
    {
        $this->ensureApiGuard($role);
        $role->delete();
    }

    private function ensureApiGuard(Role $role): void
    {
        if ($role->guard_name !== self::GUARD_NAME) {
            abort(404);
        }
    }
}
