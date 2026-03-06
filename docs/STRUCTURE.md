# Structure du projet ACEEPCI (Next.js)

## Organisation (bonnes pratiques Next.js)

```
aceepci/
├── app/                    # App Router (routes, layouts, styles)
│   ├── layout.tsx          # Layout racine + metadata
│   ├── globals.css         # Styles globaux + Tailwind
│   ├── styles/             # theme.css, fonts.css
│   └── [routes]/page.tsx   # Une page par route
├── components/             # Composants réutilisables
│   ├── sections/           # PageHero, Section, Container
│   ├── ui/                 # Composants UI (shadcn, etc.)
│   ├── figma/              # ImageWithFallback
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── config/                 # Configuration centralisée
│   └── site.ts             # siteConfig, navConfig, contactConfig
├── lib/                    # Utilitaires
│   └── utils.ts            # cn()
├── public/                 # Assets statiques
└── docs/                   # Documentation
```

## Charte graphique (ACEEPCI)

Définie dans `app/styles/theme.css` :

| Variable / classe      | Usage |
|------------------------|--------|
| `--brand-primary`       | Bleu principal (boutons, liens) |
| `--brand-primary-dark`  | Bleu foncé (header, footer, titres) |
| `--brand-light`         | Texte sur fond bleu |
| `--brand-subtle`        | Fond léger (sections, badges) |
| `--brand-accent`        | Ambre / or (CTA, soulignés) |
| `--brand-accent-light`  | Fond ambre très clair |

Couleurs sémantiques Tailwind : `bg-brand-primary`, `text-brand-primary-dark`, `bg-brand-subtle`, etc.

## Composants de page

- **PageHero** : bannière de page avec titre, sous-titre, image de fond optionnelle.
- **Section** : bloc avec titre optionnel, variantes `default` | `muted` | `brand` | `brand-subtle`.
- **Container** : `max-w-7xl` (ou `max-w-4xl` si `narrow`), padding horizontal cohérent.

## Configuration centralisée

- **config/site.ts** : nom, devise, slogan, navigation, contact. Utilisé par Header, Footer et metadata.
- Modifier la nav ou les infos de contact à un seul endroit.
