# Configuration de la permission événements

L'accès aux événements en admin nécessite la permission `events.manage`. Si vous voyez « Accès refusé », ajoutez cette permission au rôle admin sur le backend Laravel.

## Option 1 : Seeder (recommandé)

Créez ou modifiez un seeder (ex. `database/seeders/EventsPermissionSeeder.php`) :

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class EventsPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permission = Permission::firstOrCreate(
            ['name' => 'events.manage'],
            ['guard_name' => 'web']
        );

        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['guard_name' => 'web']
        );

        $adminRole->givePermissionTo($permission);
    }
}
```

Puis exécutez :

```bash
php artisan db:seed --class=EventsPermissionSeeder
```

## Option 2 : Tinker (rapide)

```bash
php artisan tinker
```

```php
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

$permission = Permission::firstOrCreate(['name' => 'events.manage', 'guard_name' => 'web']);
$admin = Role::where('name', 'admin')->first();
if ($admin) {
    $admin->givePermissionTo($permission);
    echo "Permission events.manage ajoutée au rôle admin.";
}
```

## Option 3 : Si vous n'utilisez pas Spatie

Si votre backend utilise un autre système de permissions, vérifiez :

1. Que la permission `events.manage` existe
2. Que le rôle admin (ou super_admin) a cette permission
3. Que le middleware ou la policy sur les routes `/api/v1/events` vérifie bien cette permission

## Vérification

Après la configuration :

1. **Déconnectez-vous puis reconnectez-vous** — Le token JWT contient vos permissions au moment de la connexion. Une reconnexion est nécessaire pour obtenir un token à jour.
2. Rechargez la page admin des événements. L'erreur « Accès refusé » ne devrait plus apparaître.

Si l'erreur persiste après reconnexion, vérifiez sur le backend :
- `php artisan permission:cache-reset` (si vous utilisez Spatie)
- `php artisan cache:clear`
