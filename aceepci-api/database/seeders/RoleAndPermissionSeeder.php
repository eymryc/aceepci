<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $guardName = 'api';

        // Permissions de base
        $permissions = [
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'roles.view',
            'roles.manage',
            'parameters.view',
            'parameters.manage',
            'slides.view',
            'slides.manage',
            'slides.publish',
            'gallery.view',
            'gallery.manage',
            'daily-verses.view',
            'daily-verses.manage',
            'daily-verses.publish',
            'president-message.view',
            'president-message.manage',
            'history.view',
            'history.manage',
            'members.view',
            'members.manage',
            'events.view',
            'events.manage',
            'event-registrations.view',
            'event-registrations.manage',
            'settings.manage',
            'vision-mission-values.view',
            'vision-mission-values.manage',
            'documents.view',
            'documents.manage',
            'organization.view',
            'organization.manage',
            'motto.view',
            'motto.manage',
            'contact.view',
            'contact.manage',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => $guardName]);
        }

        // Rôles et leurs permissions
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => $guardName]);
        $admin->givePermissionTo(Permission::where('guard_name', $guardName)->get());

        $membre = Role::firstOrCreate(['name' => 'membre', 'guard_name' => $guardName]);
        $membre->givePermissionTo(['users.view', 'users.update', 'parameters.view']);

        $invite = Role::firstOrCreate(['name' => 'invite', 'guard_name' => $guardName]);
        $invite->givePermissionTo(['users.view']);
    }
}
