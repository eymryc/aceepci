<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Service de gestion des utilisateurs.
 */
class UserService
{
    /**
     * Met à jour un utilisateur.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(User $user, array $data, bool $canChangeRole = false): User
    {
        $allowed = ['firstname', 'lastname', 'name', 'email', 'username', 'phone'];
        $userData = array_intersect_key($data, array_flip($allowed));

        if (array_key_exists('fullname', $data)) {
            $userData['name'] = $data['fullname'];
        }

        if (! empty($data['password'])) {
            $userData['password'] = Hash::make($data['password']);
        }

        if ($canChangeRole && array_key_exists('role', $data)) {
            $user->syncRoles([$data['role']]);
        }

        $userData['updated_by'] = auth()->id();

        $user->update($userData);

        return $user->load(['roles', 'permissions']);
    }
}
