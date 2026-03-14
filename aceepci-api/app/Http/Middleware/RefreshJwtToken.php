<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\JWTAuth;

/**
 * Middleware pour rafraîchir le token JWT.
 *
 * Accepte les tokens expirés (dans la fenêtre refresh_ttl) et génère un nouveau token.
 * Le nouveau token est ajouté à la requête pour le contrôleur.
 */
class RefreshJwtToken
{
    public function __construct(
        private JWTAuth $auth
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->auth->parser()->setRequest($request)->hasToken()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token non fourni',
                'data' => null,
            ], 401);
        }

        try {
            $token = $this->auth->parseToken()->refresh();
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'data' => null,
            ], 401);
        }

        $request->attributes->set('refreshed_token', $token);
        $request->headers->set('Authorization', 'Bearer ' . $token);

        $response = $next($request);

        $response->headers->set('Authorization', 'Bearer ' . $token);

        return $response;
    }
}
