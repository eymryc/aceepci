<?php

namespace App\Services;

use App\Mail\CredentialsMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\JWTGuard;

/**
 * Service d'authentification JWT.
 *
 * Centralise la logique métier : tentative de connexion (email ou username),
 * inscription, envoi des identifiants par email, gestion des tokens.
 */
class AuthService
{
    private function guard(): JWTGuard
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        return $guard;
    }
    /**
     * Tente une authentification avec les identifiants fournis.
     * Le login peut être l'email OU le nom d'utilisateur.
     *
     * @param  array{login: string, password: string}  $credentials
     * @return string|null Token JWT si succès, null sinon
     */
    public function attempt(array $credentials): ?string
    {
        $login = $credentials['login'] ?? null;
        $password = $credentials['password'] ?? null;

        if (! $login || ! $password) {
            return null;
        }

        // Recherche par email ou username
        $user = User::query()
            ->where('email', $login)
            ->orWhere('username', $login)
            ->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            return null;
        }

        return $this->login($user);
    }

    /**
     * Crée un nouvel utilisateur, envoie l'email avec les identifiants (si email fourni).
     *
     * @param  array{firstname: string, lastname: string, email?: string, username?: string, fullname?: string, password: string, phone?: string, role_id: int}  $data
     * @return User L'utilisateur créé
     */
    public function register(array $data): User
    {
        $plainPassword = $data['password'];

        // Nom : fullname si fourni, sinon firstname + lastname
        $name = $data['fullname'] ?? trim("{$data['firstname']} {$data['lastname']}");

        $user = User::create([
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'name' => $name,
            'email' => $data['email'] ?? null,
            'username' => $data['username'] ?? null,
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($plainPassword),
        ]);

        $role = Role::where('id', $data['role_id'])->where('guard_name', 'api')->firstOrFail();
        $user->assignRole($role->name);

        // Envoi des identifiants par email uniquement si l'utilisateur a un email
        if ($user->email) {
            Mail::to($user->email)->send(new CredentialsMail($user, $plainPassword));
        }

        return $user;
    }

    /**
     * Génère un token JWT pour l'utilisateur donné.
     *
     * @return string Token JWT
     */
    public function login(User $user): string
    {
        return $this->guard()->login($user);
    }

    /**
     * Déconnecte l'utilisateur (invalide le token actuel).
     */
    public function logout(): void
    {
        $this->guard()->logout();
    }

    /**
     * Génère un nouveau token JWT (rafraîchissement).
     *
     * @return string Nouveau token JWT
     */
    public function refresh(): string
    {
        return $this->guard()->refresh();
    }

    /**
     * Construit le payload de réponse standard pour un token JWT.
     *
     * @return array{access_token: string, token_type: string, expires_in: int}
     */
    public function getTokenPayload(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $this->guard()->factory()->getTTL() * 60,
        ];
    }

    /**
     * Retourne l'utilisateur authentifié avec rôles et permissions chargés.
     */
    public function getAuthenticatedUser(): ?User
    {
        /** @var User|null $user */
        $user = $this->guard()->user();
        if ($user) {
            $user->load(['roles', 'permissions']);
        }

        return $user;
    }
}
