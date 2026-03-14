<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\UpdateUserRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur pour la gestion des utilisateurs.
 */
#[Group('Utilisateurs', description: 'Profil et gestion des comptes utilisateurs', weight: 5)]
class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    /**
     * Met à jour le profil de l'utilisateur connecté.
     */
    public function updateProfile(UpdateUserRequest $request): JsonResponse
    {
        $user = $this->userService->update(
            $request->user(),
            $request->validated(),
            false
        );

        return ApiResponse::success(new UserResource($user), 'Profil mis à jour');
    }

    /**
     * Met à jour un utilisateur (admin).
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->authorize('users.update');

        $user = $this->userService->update(
            $user,
            $request->validated(),
            true
        );

        return ApiResponse::success(new UserResource($user), 'Utilisateur mis à jour');
    }
}
