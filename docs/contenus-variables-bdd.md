# Contenus variables à prévoir en base de données

Ce document recense tous les contenus dynamiques du site ACEEPCI qui doivent être stockés en base de données et gérés via l’interface d’administration.

---

## 1. Verset du jour (`/admin/verse`)

| Champ | Type | Description |
|-------|------|-------------|
| `text` | text | Texte du verset principal |
| `reference` | string | Référence biblique (ex. Jean 3:16) |
| `secondaryText` | text | Texte du verset secondaire (optionnel) |
| `secondaryReference` | string | Référence du verset secondaire |
| `date` | date | Date d’affichage (pour planification) |

**Où apparaît :**
- Page d’accueil — section « Parole du jour »
- Page Médias / Ressources — section « Verset du jour »

---

## 2. Galerie média (`/admin/gallery`)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | uuid | Identifiant unique |
| `title` | string | Titre de la photo |
| `image` | string | URL ou chemin de l’image |
| `category` | string | Catégorie (Formation, Réunion, Culture, etc.) |
| `order` | int | Ordre d’affichage |

**Où apparaît :**
- Page d’accueil — section « Nos activités en images » (PhotoGallerySection)
- Page Actualités — aperçu « Galerie photos & vidéos »

---

## 3. Actualités (`/admin/news`)

| Champ | Type | Description |
|-------|------|-------------|
| `id`, `title`, `excerpt`, `content`, `image` | — | Contenu principal |
| `category` | string | Événements, Projets, Formations, Galerie |
| `date`, `views`, `status` | — | Métadonnées |
| `gallery` | json/relation | Galerie photos liée à l’article |

---

## 4. Blog (`/admin/blog`)

| Champ | Type | Description |
|-------|------|-------------|
| `id`, `title`, `excerpt`, `content`, `author` | — | Contenu |
| `category` | string | Témoignages, Réflexions, etc. |
| `date`, `views`, `status` | — | Métadonnées |

---

## 5. Dévotions (`/admin/devotionals`)

| Champ | Type | Description |
|-------|------|-------------|
| `id`, `title`, `excerpt`, `content` | — | Contenu |
| `verse` | object | `{ text, reference }` — verset associé |
| `category` | string | Foi, Amour, Prière, etc. |
| `date`, `readTime`, `status` | — | Métadonnées |

---

## 6. Sermons (`/admin/sermons`)

| Champ | Type | Description |
|-------|------|-------------|
| `id`, `title`, `speaker`, `content` | — | Contenu |
| `type` | enum | Vidéo, Audio, Texte |
| `videoUrl`, `audioUrl` | string | URLs des médias |
| `verseText`, `verseReference` | string | Verset du sermon |
| `date`, `duration`, `readTime`, `status` | — | Métadonnées |

---

## 7. Offres (`/admin/offers`)

| Champ | Type | Description |
|-------|------|-------------|
| `id`, `title`, `organization`, `description` | — | Contenu |
| `category` | enum | emploi, stage, bourse, benevolat |
| `location`, `deadline`, `salary` | — | Détails |
| `requirements`, `externalLink`, `status` | — | Métadonnées |

---

## 8. Événements (`/admin/events`)

| Champ | Type | Description |
|-------|------|-------------|
| `id`, `name`, `description` | — | Contenu |
| `date`, `location`, `category` | — | Détails |
| `registrations` | int | Nombre d’inscriptions |
| `status` | — | Publié, Brouillon, etc. |

---

## 9. Adhésions / Membres (`/admin/members`)

| Champ | Type | Description |
|-------|------|-------------|
| `id`, `name`, `email`, `phone` | — | Identité |
| `type` | enum | Étudiant, Élève, Alumni |
| `department` | string | Département ACEEPCI |
| `status` | enum | En attente, Validé, Refusé |
| `formData` | json | Données du formulaire d’adhésion |

---

## 10. Paramètres du site (`/admin/settings`)

| Champ | Type | Description |
|-------|------|-------------|
| `contact.email` | string | Email de contact |
| `contact.phone` | string | Téléphone |
| `contact.address` | text | Adresse |
| `social.facebook` | string | URL Facebook |
| `social.instagram` | string | URL Instagram |
| `social.youtube` | string | URL YouTube |

---

## 11. Autres contenus variables (à prévoir)

| Page | Contenu | Emplacement actuel |
|------|---------|--------------------|
| **Accueil** | Stats (60+ ans, 88 départements, etc.) | `app/page.tsx` — `stats` |
| **Accueil** | Partenaires (logos) | `app/page.tsx` — `partners` |
| **Membres** | Types d’adhésion, Départements | `app/members/page.tsx` |
| **Activités** | Événements à venir, Partenaires, Calendrier | `app/activities/page.tsx` |
| **Paiements** | Types de dons, Cotisations, Modes de paiement | `app/payments/page.tsx` |
| **À propos** | Texte histoire, Vision, Mission, Partenaires | `app/about/page.tsx` |
| **Contact** | Coordonnées, Horaires | `config/site.ts`, `contactConfig` |

---

## Schéma recommandé (résumé)

```
verse_of_day (1 ligne active)
gallery_photos (n)
news (n) → news_gallery (n)
blog_posts (n)
devotionals (n)
sermons (n)
offers (n)
events (n)
memberships (n)
site_settings (1 ou clé-valeur)
```
