# Configuration des permissions événements

## Permissions requises

- **`events.view`** : Consulter la liste et le détail des événements (admin)
- **`events.manage`** : Créer, modifier et supprimer des événements

## Correction rapide (Docker)

```bash
make fix-events-permissions
```

Puis **déconnectez-vous et reconnectez-vous** dans l'interface admin. Les permissions sont stockées dans le token JWT à la connexion — un ancien token ne contient pas les nouvelles permissions.

## Attribution au rôle admin

Les permissions sont déjà définies dans `RoleAndPermissionSeeder`. Pour les appliquer :

```bash
make seed
# ou
docker compose exec laravel.test php artisan db:seed --class=RoleAndPermissionSeeder
```

Cela recrée les permissions et les attribue au rôle **admin**.

## Vérifier les permissions d'un utilisateur

```bash
php artisan tinker
```

Puis :

```php
$user = \App\Models\User::where('email', 'admin@aceepci.com')->first();
$user->getAllPermissions()->pluck('name');
// Doit inclure : events.view, events.manage
```

## Vider le cache (si besoin)

```bash
make fix-events-permissions
```

Cette commande exécute : `permission:cache-reset`, `cache:clear`, puis `permissions:fix-events`.

Ou manuellement dans le conteneur :

```bash
docker compose exec laravel.test php artisan permission:cache-reset
docker compose exec laravel.test php artisan cache:clear
```

## Si le rôle admin n'a pas les permissions

Réattribuer manuellement :

```php
$admin = \App\Models\Role::where('name', 'admin')->where('guard_name', 'api')->first();
$admin->givePermissionTo(['events.view', 'events.manage']);
```
