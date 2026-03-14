<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Responses\ApiResponse;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur pour la liste des permissions (sélection lors de la gestion des rôles).
 */
#[Group('Rôles & Permissions', description: 'Gestion des rôles et permissions', weight: 6)]
class PermissionController extends Controller
{
    public function __construct(
        private PermissionService $permissionService
    ) {}

    /**
     * Liste des permissions disponibles.
     */
    public function index(): JsonResponse
    {
        $permissions = $this->permissionService->listNames();

        return ApiResponse::success(['permissions' => $permissions], 'Liste des permissions récupérée');
    }
}
