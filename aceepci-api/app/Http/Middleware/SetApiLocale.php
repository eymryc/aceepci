<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetApiLocale
{
    /** Force la locale des messages de validation API (ex. français). */
    public function handle(Request $request, Closure $next): Response
    {
        App::setLocale(config('app.api_locale', 'fr'));

        return $next($request);
    }
}
