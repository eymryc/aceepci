<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreRoleRequest;
use App\Http\Requests\Api\V1\UpdateRoleRequest;
use App\Http\Resources\Api\V1\RoleResource;
use App\Http\Responses\ApiResponse;
use App\Models\Role;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

/**
 * Contrôleur CRUD pour les rôles.
 */
#[Group('Rôles & Permissions', description: 'Gestion des rôles et permissions', weight: 6)]
class RoleController extends Controller
{
    public function __construct(
        private RoleService $roleService
    ) {}

    /**
     * Liste des rôles.
     */
    public function index(): JsonResponse
    {
        $withPermissions = Gate::allows('roles.view');

        $roles = $this->roleService->list($withPermissions);

        return ApiResponse::success(RoleResource::collection($roles), 'Liste des rôles récupérée');
    }

    /**
     * Détail d'un rôle.
     */
    public function show(Role $role): JsonResponse
    {
        $this->authorize('roles.view');

        $role = $this->roleService->find($role);

        return ApiResponse::success(new RoleResource($role), 'Rôle récupéré');
    }

    /**
     * Création d'un rôle.
     */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = $this->roleService->create($request->validated());

        return ApiResponse::success(new RoleResource($role), 'Rôle créé', Response::HTTP_CREATED);
    }

    /**
     * Mise à jour d'un rôle.
     */
    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        $role = $this->roleService->update($role, $request->validated());

        return ApiResponse::success(new RoleResource($role), 'Rôle mis à jour');
    }

    /**
     * Suppression d'un rôle.
     */
    public function destroy(Role $role): JsonResponse
    {
        $this->authorize('roles.manage');

        $this->roleService->delete($role);

        return ApiResponse::success(null, 'Rôle supprimé');
    }
}
