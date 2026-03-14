# ACEEPCI API - Commandes Docker Compose

.PHONY: up down build restart migrate fresh seed seed-offers fix-events-permissions test shell logs queue

# Démarrer les conteneurs (détaché)
up:
	docker compose up -d

# Arrêter les conteneurs
down:
	docker compose down

# Construire les images
build:
	docker compose build --no-cache

# Redémarrer
restart: down up

# Exécuter les migrations
migrate:
	docker compose exec laravel.test php artisan migrate

# Reset DB + migrations
fresh:
	docker compose exec laravel.test php artisan migrate:fresh

# Exécuter les seeders
seed:
	docker compose exec laravel.test php artisan db:seed --class=RoleAndPermissionSeeder

# Seed des paramètres offres (catégories et types)
seed-offers:
	docker compose exec laravel.test php artisan db:seed --class=OfferParameterSeeder

# Corriger les permissions événements (puis se déconnecter/reconnecter)
fix-events-permissions:
	docker compose exec laravel.test php artisan permission:cache-reset
	docker compose exec laravel.test php artisan cache:clear
	docker compose exec laravel.test php artisan permissions:fix-events

# Lancer les tests
test:
	docker compose exec laravel.test php artisan test

# Shell dans le conteneur Laravel
shell:
	docker compose exec laravel.test bash

# Voir les logs
logs:
	docker compose logs -f

# Lancer le worker de file d'attente (emails en arrière-plan)
queue:
	docker compose exec laravel.test php artisan queue:work

# Installer les dépendances (première fois)
install: up
	docker compose exec laravel.test composer install
	docker compose exec laravel.test php artisan migrate



En ligne

php artisan migrate --force 
php artisan db:seed --force

ou

php artisan migrate:fresh --seed --force

cd ~/Documents/XSEL-SERVICES/PROJETS/REACT/aceepci/aceepci-api