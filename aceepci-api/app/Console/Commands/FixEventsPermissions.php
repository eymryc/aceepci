<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;

class FixEventsPermissions extends Command
{
    protected $signature = 'permissions:fix-events';

    protected $description = 'Vérifie et corrige les permissions events.view et events.manage pour le rôle admin';

    public function handle(): int
    {
        $guardName = 'api';

        $this->info('Vérification des permissions événements...');

        Permission::firstOrCreate(['name' => 'events.view', 'guard_name' => $guardName]);
        Permission::firstOrCreate(['name' => 'events.manage', 'guard_name' => $guardName]);

        $admin = Role::where('name', 'admin')->where('guard_name', $guardName)->first();

        if (! $admin) {
            $this->error('Le rôle "admin" n\'existe pas. Exécutez : php artisan db:seed --class=RoleAndPermissionSeeder');

            return self::FAILURE;
        }

        $admin->givePermissionTo(['events.view', 'events.manage']);

        $this->info('Permissions events.view et events.manage attribuées au rôle admin.');

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $usersWithAdmin = User::role('admin', $guardName)->get();
        $this->info("{$usersWithAdmin->count()} utilisateur(s) avec le rôle admin.");

        $this->newLine();
        $this->warn('IMPORTANT : Les permissions sont stockées dans le token JWT à la connexion.');
        $this->warn('Vous devez vous DÉCONNECTER puis vous RECONNECTER pour obtenir un nouveau token.');

        return self::SUCCESS;
    }
}
