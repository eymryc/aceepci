# Spécification API — Inscriptions aux événements

Document de référence pour implémenter les endpoints backend (Laravel).

---

## Modèle `Event` / `events`

| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `id` | integer | — | PK | Identifiant unique |
| `name` | string | Oui | max 255 | Nom interne (legacy) |
| `title` | string | Non | max 255 | Titre affiché (ex: "Camp Biblique National 2026") |
| `slug` | string | Oui | max 100, unique | URL-friendly (ex: "camp-biblique-national-2026") |
| `category` | string | Non | max 100 | Tag affiché (ex: "Camp", "Conférence") |
| `start_date` | date | Non | | Date de début |
| `end_date` | date | Non | | Date de fin |
| `expected_attendees` | string | Non | max 50 | Nombre attendu (ex: 500 ou "500+") |
| `image_url` | string | Non | — | Chemin de l'image (généré après upload) |
| `description` | text | Non | | Description complète |
| `location` | string | Non | max 255 | Lieu (ex: "Yamoussoukro") |
| `price` | string | Non | max 100 | Tarif (ex: "25 000 FCFA") |
| `is_published` | boolean | — | default false | Visible publiquement |
| `registration_open` | boolean | — | default true | Affiche le bouton "S'inscrire" |
| `created_at` | datetime | — | | Date de création |
| `updated_at` | datetime | — | | Date de mise à jour |

### Endpoints Event

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| GET | `/api/v1/events` | Public | Liste des événements publiés (pour le site) |
| GET | `/api/v1/events?published=0&search=&per_page=15` | Admin (auth) | Liste paginée de tous les événements |
| GET | `/api/v1/events/{id}` | Public | Détail d'un événement (si publié) |
| POST | `/api/v1/events` | Admin (auth, events.manage) | Création d'un événement |
| PUT/PATCH | `/api/v1/events/{id}` | Admin (auth, events.manage) | Mise à jour d'un événement |
| DELETE | `/api/v1/events/{id}` | Admin (auth, events.manage) | Suppression d'un événement |

**Exemple POST /api/v1/events (multipart/form-data) :**
- `image` : fichier image (jpeg, png, webp, max 5 Mo)
- Autres champs en JSON ou form-data

```json
{
  "name": "Camp Biblique National 2026",
  "title": "Camp Biblique National 2026",
  "slug": "camp-biblique-national-2026",
  "event_category_id": 1,
  "start_date": "2026-08-15",
  "end_date": "2026-08-22",
  "expected_attendees": "500+",
  "location": "Yamoussoukro",
  "price": "25 000 FCFA",
  "description": "Description complète...",
  "is_published": true,
  "registration_open": true
}
```

**Exemple de réponse GET /api/v1/events/1 :**
```json
{
  "status": "success",
  "message": "Item retrieved",
  "data": {
    "id": 1,
    "name": "Camp Biblique National 2026",
    "title": "Camp Biblique National 2026",
    "slug": "camp-biblique-national-2026",
    "category": "Camp",
    "start_date": "2026-08-15",
    "end_date": "2026-08-22",
    "expected_attendees": "500+",
    "image_url": "https://example.com/images/camp-2026.jpg",
    "description": "Description complète de l'événement...",
    "location": "Yamoussoukro",
    "price": "25 000 FCFA",
    "is_published": true,
    "registration_open": true,
    "created_at": "2026-03-11T10:00:00.000000Z",
    "updated_at": "2026-03-11T10:00:00.000000Z"
  }
}
```

---

## Modèle `EventRegistration` / `event_registrations`

### Champs générés côté serveur
| Champ | Type | Description |
|-------|------|-------------|
| `id` | integer (PK) | Identifiant unique |
| `created_at` | datetime | Date de création |
| `updated_at` | datetime | Date de mise à jour |

### Identité (étape 1)
| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `event_id` | string / integer | Oui | FK events | ID ou slug de l'événement |
| `event_name` | string | Non | max 255 | Nom de l'événement (dénormalisé) |
| `first_name` | string | Oui | max 255 | Prénom(s) |
| `last_name` | string | Oui | max 255 | Nom de famille |
| `email` | string | Oui | email, max 255 | Email |
| `phone` | string | Oui | max 20 | Téléphone |
| `birth_date` | date | Oui | | Date de naissance |
| `gender` | string | Oui | enum: masculin, féminin | Sexe |

### Statut membre ACEEPCI
| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `member_status` | string | Oui | max 255 | Ex: Élève (Lycée), Étudiant, Travailleur |
| `membership_number` | string | Non | max 50 | Ex: ACEE-AB-2024-001 |
| `department` | string | Non | max 255 | Département ACEEPCI |
| `local_church` | string | Non | max 255 | Église locale |

### Options logistiques
| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `needs_accommodation` | string | Oui | enum: Oui, Non | Besoin d'hébergement |
| `accommodation_type` | string | Conditionnel | max 255 | Type si needs_accommodation=Oui |
| `needs_transport` | string | Oui | enum: Oui, Non | Besoin de transport organisé |
| `transport_departure` | string | Non | max 255 | Lieu de départ (si transport) |
| `meal_preference` | string | Oui | max 255 | Ex: Standard, Végétarien, Végan |
| `dietary_restrictions` | text | Non | max 5000 | Allergies, intolérances |

### Contact d'urgence
| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `emergency_contact` | string | Oui | max 255 | Nom complet du contact |
| `emergency_phone` | string | Oui | max 20 | Téléphone du contact |
| `emergency_relation` | string | Oui | max 100 | Lien de parenté |

### Informations médicales
| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `medical_conditions` | text | Non | max 5000 | Asthme, diabète, épilepsie... |
| `allergies` | text | Non | max 5000 | Pénicilline, arachides... |
| `medication` | text | Non | max 5000 | Médicaments réguliers |
| `special_needs` | text | Non | max 5000 | Mobilité réduite, assistance... |

### Participation
| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `workshop_choice` | json / array | Non | | IDs ou noms des ateliers choisis |
| `motivation` | text | Non | max 5000 | Pourquoi participer |

### Engagement
| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `accept_terms` | boolean | Oui | | Conditions générales acceptées |
| `accept_rules` | boolean | Oui | | Règlement intérieur accepté |
| `payment_confirm` | boolean | Oui | | Engagement paiement sous 48h |

---

## Endpoints

### POST /api/v1/event-registrations (public)
Création d'une inscription.

### GET /api/v1/event-registrations (admin, auth)
Liste paginée. Query: `?event_id=1&page=1&per_page=25&search=`

### GET /api/v1/event-registrations/{id} (admin, auth)
Détail d'une inscription.

### GET /api/v1/events (public)
Liste des événements publiés (pour le formulaire). Query: `?published=1` (défaut)

### GET /api/v1/events?published=0 (admin, auth)
Liste paginée de tous les événements.

### GET /api/v1/events/{id} (public)
Détail d'un événement.

---

## Paramètres (options configurables)

Les valeurs suivantes sont paramétrables via l'API. Utiliser les endpoints `/options` pour les listes.

| Paramètre | Endpoint options | Description |
|-----------|------------------|-------------|
| Catégories d'événement | `GET /api/v1/event-categories/options` | Camp, Conférence, Séminaire, etc. |
| Types d'hébergement | `GET /api/v1/accommodation-types/options` | Chambre partagée, Tente, etc. |
| Préférences repas | `GET /api/v1/meal-preferences/options` | Standard, Végétarien, Végan |
| Ateliers | `GET /api/v1/workshop-options/options?event_id=1` | Leadership, Évangélisation, etc. |
| Départements | `GET /api/v1/service-departments/options` | Abidjan - Cocody, Bouaké, etc. |
| Types de membre | `GET /api/v1/member-types/options` | Élève, Étudiant, Travailleur, etc. |

L'API accepte **IDs ou noms** pour : `member_status`, `department`, `accommodation_type`, `meal_preference`, `workshop_choice` / `workshop_option_ids`.

### Valeurs par défaut (seeders)

- **Catégories** : Camp, Conférence, Séminaire, Retraite, Autre
- **Hébergement** : Chambre partagée, Chambre individuelle, Tente, Sans hébergement
- **Repas** : Standard, Végétarien, Végan
- **Ateliers** : Leadership spirituel, Évangélisation et mission, Vie de prière et intercession, etc.

### Sexe (gender)
masculin, féminin

### Hébergement / Transport
Oui, Non
