# Spécification API — Inscriptions aux événements

Document de référence pour implémenter les endpoints backend (Laravel).

---

## Nouvelles tables paramétrées

### event_categories
Type d'événement (Camp, Conférence, Retraite, Évangélisation...).

| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint PK | |
| name | string | Ex: Camp, Conférence, Retraite |
| code | string nullable | Ex: CAMP, CONF |
| display_order | integer | Ordre d'affichage |
| created_at, updated_at | timestamps | |

### accommodation_types
Types d'hébergement proposés.

| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint PK | |
| name | string | Ex: Dortoir mixte, Chambre partagée |
| price_surcharge | decimal nullable | Supplément en FCFA (0 si inclus) |
| display_order | integer | |
| created_at, updated_at | timestamps | |

### meal_preferences
Préférences alimentaires.

| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint PK | |
| name | string | Ex: Standard, Végétarien, Végan |
| code | string nullable | |
| display_order | integer | |
| created_at, updated_at | timestamps | |

### workshop_options
Ateliers (peuvent être liés à un événement ou globaux).

| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint PK | |
| name | string | Ex: Leadership spirituel |
| event_id | bigint nullable FK | Si null = atelier global |
| display_order | integer | |
| created_at, updated_at | timestamps | |

### Table events (colonne à ajouter)
Si la table `events` existe déjà, ajouter :
- `event_category_id` (bigint nullable FK → event_categories)

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
| `event_id` | string / integer | Oui | FK events | ID de l'événement |
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
| `member_level_id` | integer | Oui | FK member_levels | ID du niveau membre (paramétré) |
| `member_status` | string | Non | max 255 | Libellé (dénormalisé, pour affichage) |
| `membership_number` | string | Non | max 50 | Ex: ACEE-AB-2024-001 |
| `department_id` | integer | Non | FK service_departments | ID du département (paramétré) |
| `department` | string | Non | max 255 | Libellé (dénormalisé, pour affichage) |
| `local_church` | string | Non | max 255 | Église locale |

### Options logistiques
| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `needs_accommodation` | string | Oui | enum: Oui, Non | Besoin d'hébergement |
| `accommodation_type_id` | integer | Conditionnel | FK accommodation_types | Si needs_accommodation=Oui |
| `accommodation_type` | string | Non | max 255 | Libellé (dénormalisé) |
| `needs_transport` | string | Oui | enum: Oui, Non | Besoin de transport organisé |
| `transport_departure` | string | Non | max 255 | Lieu de départ (si transport) |
| `meal_preference_id` | integer | Oui | FK meal_preferences | Préférence alimentaire |
| `meal_preference` | string | Non | max 255 | Libellé (dénormalisé) |
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
| `workshop_ids` | json / array | Non | FK workshop_options | IDs des ateliers choisis (max 3) |
| `workshop_choice` | json / array | Non | | Libellés (dénormalisés, pour affichage) |
| `motivation` | text | Non | max 5000 | Pourquoi participer |

### Engagement
| Champ | Type | Requis | Contraintes | Description |
|-------|------|--------|-------------|-------------|
| `accept_terms` | boolean | Oui | | Conditions générales acceptées |
| `accept_rules` | boolean | Oui | | Règlement intérieur accepté |
| `payment_confirm` | boolean | Oui | | Engagement paiement sous 48h |

---

## Endpoints suggérés

### POST /api/v1/event-registrations
Création d'une inscription.

**Body (JSON):**
```json
{
  "event_id": 1,
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean.dupont@exemple.com",
  "phone": "+225 07 00 00 00 00",
  "birth_date": "2000-05-15",
  "gender": "masculin",
  "member_level_id": 2,
  "membership_number": "ACEE-AB-2024-001",
  "department_id": 3,
  "local_church": "Église Baptiste",
  "needs_accommodation": "Oui",
  "accommodation_type_id": 1,
  "needs_transport": "Oui",
  "transport_departure": "Abidjan",
  "meal_preference_id": 2,
  "dietary_restrictions": "",
  "emergency_contact": "Marie Dupont",
  "emergency_phone": "+225 05 00 00 00 00",
  "emergency_relation": "Mère",
  "medical_conditions": "",
  "allergies": "",
  "medication": "",
  "special_needs": "",
  "workshop_ids": [1, 3],
  "motivation": "Développer ma foi...",
  "accept_terms": true,
  "accept_rules": true,
  "payment_confirm": true
}
```

### GET /api/v1/event-registrations
Liste paginée (admin). Query: `?event_id=camp-2026&page=1&per_page=25&search=`

### GET /api/v1/event-registrations/{id}
Détail d'une inscription (admin).

### GET /api/v1/events
Liste des événements (pour le formulaire public).

### GET /api/v1/events/{id}
Détail d'un événement.

---

## Migrations Laravel (exemples)

### Tables paramétrées
```php
// event_categories
Schema::create('event_categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('code')->nullable();
    $table->integer('display_order')->default(0);
    $table->timestamps();
});

// accommodation_types
Schema::create('accommodation_types', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->decimal('price_surcharge', 12, 2)->nullable();
    $table->integer('display_order')->default(0);
    $table->timestamps();
});

// meal_preferences
Schema::create('meal_preferences', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('code')->nullable();
    $table->integer('display_order')->default(0);
    $table->timestamps();
});

// workshop_options
Schema::create('workshop_options', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
    $table->integer('display_order')->default(0);
    $table->timestamps();
});
```

### Table event_registrations
```php
Schema::create('event_registrations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
    $table->string('event_name')->nullable();
    $table->string('first_name');
    $table->string('last_name');
    $table->string('email');
    $table->string('phone', 20);
    $table->date('birth_date');
    $table->string('gender', 50);
    $table->foreignId('member_level_id')->constrained('member_levels');
    $table->string('member_status')->nullable();
    $table->string('membership_number', 50)->nullable();
    $table->foreignId('department_id')->nullable()->constrained('service_departments')->nullOnDelete();
    $table->string('department')->nullable();
    $table->string('local_church')->nullable();
    $table->string('needs_accommodation', 10)->default('Non');
    $table->foreignId('accommodation_type_id')->nullable()->constrained('accommodation_types')->nullOnDelete();
    $table->string('accommodation_type')->nullable();
    $table->string('needs_transport', 10)->default('Non');
    $table->string('transport_departure')->nullable();
    $table->foreignId('meal_preference_id')->constrained('meal_preferences');
    $table->string('meal_preference')->nullable();
    $table->text('dietary_restrictions')->nullable();
    $table->string('emergency_contact');
    $table->string('emergency_phone', 20);
    $table->string('emergency_relation', 100);
    $table->text('medical_conditions')->nullable();
    $table->text('allergies')->nullable();
    $table->text('medication')->nullable();
    $table->text('special_needs')->nullable();
    $table->json('workshop_ids')->nullable();
    $table->json('workshop_choice')->nullable();
    $table->text('motivation')->nullable();
    $table->boolean('accept_terms')->default(false);
    $table->boolean('accept_rules')->default(false);
    $table->boolean('payment_confirm')->default(false);
    $table->timestamps();
});
```

---

## Mapping frontend → backend (snake_case)

| Frontend (camelCase) | Backend (snake_case) |
|---------------------|----------------------|
| eventId | event_id |
| eventName | event_name |
| firstName | first_name |
| lastName | last_name |
| birthDate | birth_date |
| memberLevelId | member_level_id |
| memberStatus | member_status |
| membershipNumber | membership_number |
| departmentId | department_id |
| department | department |
| localChurch | local_church |
| needsAccommodation | needs_accommodation |
| accommodationTypeId | accommodation_type_id |
| accommodationType | accommodation_type |
| needsTransport | needs_transport |
| transportDeparture | transport_departure |
| mealPreferenceId | meal_preference_id |
| mealPreference | meal_preference |
| dietaryRestrictions | dietary_restrictions |
| emergencyContact | emergency_contact |
| emergencyPhone | emergency_phone |
| emergencyRelation | emergency_relation |
| medicalConditions | medical_conditions |
| workshopIds | workshop_ids |
| workshopChoice | workshop_choice |
| specialNeeds | special_needs |
| acceptTerms | accept_terms |
| acceptRules | accept_rules |
| paymentConfirm | payment_confirm |

---

## Endpoints options (paramètres)

| Paramètre | Endpoint | Champ FK |
|-----------|----------|----------|
| Départements | `GET /api/v1/service-departments/options` | department_id |
| Niveaux membre | `GET /api/v1/member-levels/options` | member_level_id |
| Types d'hébergement | `GET /api/v1/accommodation-types/options` | accommodation_type_id |
| Préférences repas | `GET /api/v1/meal-preferences/options` | meal_preference_id |
| Ateliers | `GET /api/v1/workshop-options/options?event_id={id}` | workshop_ids |
| Catégories événement | `GET /api/v1/event-categories/options` | event_category_id (table events) |

### Sexe (gender)
masculin, féminin

### Hébergement / Transport (Oui/Non)
Oui, Non
