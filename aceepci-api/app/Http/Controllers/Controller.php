<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * Contrôleur de base de l'application.
 *
 * Fournit l'autorisation (authorize, Gate) via AuthorizesRequests.
 *
 * @mixin \Illuminate\Foundation\Auth\Access\AuthorizesRequests
 */
abstract class Controller
{
    use AuthorizesRequests;
}
