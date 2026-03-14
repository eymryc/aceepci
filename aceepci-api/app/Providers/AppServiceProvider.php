<?php

namespace App\Providers;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Macro Blueprint pour les colonnes d'audit (tables futures)
        Blueprint::macro('auditColumns', function () {
            /** @var Blueprint $this */
            $this->softDeletes();
            $this->unsignedBigInteger('created_by')->nullable();
            $this->unsignedBigInteger('updated_by')->nullable();
            $this->unsignedBigInteger('deleted_by')->nullable();
            $this->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $this->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $this->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();
        });

        // Documentation API : accessible en production (ou restreindre selon vos besoins)
        Gate::define('viewApiDocs', function (?object $user) {
            return true; // Accès public. Pour restreindre : return $user?->hasRole('admin') ?? false;
        });

        // Les utilisateurs avec le rôle admin ont toutes les permissions (@can, Gate::allows)
        Gate::before(function ($user, $ability) {
            return $user?->hasRole('admin') ? true : null;
        });
    }
}
