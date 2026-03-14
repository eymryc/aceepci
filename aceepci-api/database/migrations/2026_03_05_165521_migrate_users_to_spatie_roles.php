<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Migre les utilisateurs de role_id vers model_has_roles (Spatie).
     */
    public function up(): void
    {
        $guardName = 'api';

        // Migrer les rôles : old_roles (slug) -> Spatie roles (name)
        $oldRoles = DB::table('old_roles')->get();
        $oldIdToSpatieName = [];

        foreach ($oldRoles as $old) {
            $role = Role::firstOrCreate(
                ['name' => $old->slug, 'guard_name' => $guardName],
                ['name' => $old->slug, 'guard_name' => $guardName]
            );
            $oldIdToSpatieName[$old->id] = $old->slug;
        }

        // Assigner les rôles aux utilisateurs via model_has_roles
        $users = DB::table('users')->whereNotNull('role_id')->get();
        foreach ($users as $user) {
            $roleName = $oldIdToSpatieName[$user->role_id] ?? null;
            if ($roleName) {
                DB::table('model_has_roles')->insertOrIgnore([
                    'role_id' => Role::where('name', $roleName)->where('guard_name', $guardName)->value('id'),
                    'model_type' => 'App\Models\User',
                    'model_id' => $user->id,
                ]);
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role_id');
        });

        Schema::dropIfExists('old_roles');
    }

    public function down(): void
    {
        // Rollback non supporté (migration unidirectionnelle)
    }
};
