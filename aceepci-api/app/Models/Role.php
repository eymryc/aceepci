<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

/**
 * Modèle rôle (étend Spatie pour compatibilité autoload/Scramble).
 *
 * Utilise le guard 'api' pour l'authentification JWT.
 */
class Role extends SpatieRole
{
    /** Guard utilisé pour Spatie Permission (API JWT) */
    protected $guard_name = 'api';
}
