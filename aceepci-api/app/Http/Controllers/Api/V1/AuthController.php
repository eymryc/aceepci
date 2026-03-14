<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Resources\Api\V1\TokenResource;
use App\Http\Resources\Api\V1\UserResource;
use App\Http\Responses\ApiResponse;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur d'authentification API (JWT).
 *
 * Gère la connexion, l'inscription, la déconnexion et le rafraîchissement des tokens.
 */
#[Group('Authentification', description: 'Connexion, inscription, déconnexion, rafraîchissement du token', weight: 0)]
class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Connexion d'un utilisateur.
     *
     * @return TokenResource|JsonResponse Token JWT en cas de succès, erreur 401 sinon
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $token = $this->authService->attempt($request->only('login', 'password'));

        if (! $token) {
            return ApiResponse::error('Identifiants invalides', null, 401);
        }

        $payload = $this->authService->getTokenPayload($token);

        return ApiResponse::success(new TokenResource($payload), 'Connexion réussie');
    }

    /**
     * Inscription d'un nouvel utilisateur.
     *
     * @return TokenResource Token JWT + données utilisateur
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->register($request->validated());
        $token = $this->authService->login($user);
        $payload = $this->authService->getTokenPayload($token);

        return ApiResponse::success(new TokenResource($payload), 'Inscription réussie', 201);
    }

    /**
     * Retourne l'utilisateur actuellement authentifié.
     * Charge les rôles et permissions pour @can, Gate::allows(), etc.
     *
     * @return UserResource Données de l'utilisateur connecté
     */
    public function me(): JsonResponse
    {
        $user = $this->authService->getAuthenticatedUser();

        return ApiResponse::success(new UserResource($user), 'Utilisateur récupéré');
    }

    /**
     * Déconnexion de l'utilisateur (invalidation du token).
     *
     * @return JsonResponse Message de confirmation
     */
    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return ApiResponse::success(null, 'Déconnexion réussie');
    }

    /**
     * Rafraîchit le token JWT.
     *
     * Accepte un token expiré (dans la fenêtre JWT_REFRESH_TTL).
     * Le token doit être fourni dans le header Authorization.
     *
     * @return TokenResource Nouveau token + données utilisateur
     */
    public function refresh(\Illuminate\Http\Request $request): JsonResponse
    {
        $token = $request->attributes->get('refreshed_token');
        $payload = $this->authService->getTokenPayload($token);

        return ApiResponse::success(new TokenResource($payload), 'Token rafraîchi');
    }
}
