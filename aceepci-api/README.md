# ACEEPCI API

API REST Laravel pour l'application ACEEPCI (Phase 3 - Développement Backend).

## Démarrage avec Docker Compose

### Prérequis
- Docker Desktop (ou Docker Engine + Docker Compose)

### Lancement

```bash
# Démarrer les conteneurs (PostgreSQL + Laravel)
docker compose up -d

# Ou avec Make
make up
```

### Commandes utiles

| Commande | Description |
|----------|-------------|
| `docker compose up -d` | Démarrer les conteneurs |
| `docker compose down` | Arrêter les conteneurs |
| `make migrate` | Exécuter les migrations |
| `make fresh` | Réinitialiser la base de données |
| `make test` | Lancer les tests |
| `make shell` | Shell dans le conteneur Laravel |

### Accès à l'API

- **API** : http://localhost (port 80)
- **Documentation Swagger/OpenAPI** : http://localhost/docs/api
- **Health check** : http://localhost/api/v1/health
- **Adminer** : http://localhost:8080 (Système: PostgreSQL, Serveur: pgsql, User: sail, Password: password, Base: aceepci)
- **PostgreSQL** : localhost:5432 (user: sail, password: password, db: aceepci)

### Première installation

```bash
docker compose up -d
docker compose exec laravel.test php artisan migrate
```

---

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
