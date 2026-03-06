# ACEEPCI - Site Next.js

Application Next.js (App Router) pour le site de l'Association Chrétienne des Élèves et Étudiants Protestants de Côte d'Ivoire.

Structure alignée sur la [doc Next.js](https://nextjs.org/docs/getting-started/project-structure) : **« Store project files outside of app »** — `app/` réservé au routage, composants et lib à la racine.

## Structure du projet (Next.js)

```
aceepci/
├── app/                    # App Router (routage uniquement)
│   ├── globals.css         # Styles globaux (Tailwind + thème)
│   ├── layout.tsx          # Layout racine
│   ├── page.tsx            # Page d'accueil
│   ├── client-layout.tsx   # Layout client (Header, Footer)
│   ├── styles/             # Fichiers CSS
│   │   ├── fonts.css       # Polices personnalisées
│   │   └── theme.css       # Variables CSS & thème
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── activities/
│   ├── members/
│   ├── news/
│   ├── offers/
│   ├── payments/
│   ├── resources/
│   ├── sermons/
│   ├── devotionals/
│   ├── devotion/
│   ├── membership/
│   ├── membership-form/
│   └── event-registration/
├── components/             # Composants partagés (racine)
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSlider.tsx
│   ├── figma/              # Composants Figma
│   └── ui/                 # Composants UI (shadcn-style)
├── lib/                     # Utilitaires partagés
│   └── utils.ts            # cn(), helpers
├── public/                  # Assets statiques (images, favicon)
├── docs/                    # Documentation
│   └── aceepci-cahier-des-charges.md
├── next.config.mjs
├── postcss.config.mjs       # Tailwind v4
└── tsconfig.json
```

## Technologies

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**

## Commandes

```bash
npm run dev    # Développement (http://localhost:3000)
npm run build  # Build production
npm run start  # Démarrer en production
npm run lint   # Linter
```

## Alias TypeScript

- `@/*` → racine du projet (ex. `@/components/...`, `@/lib/...`)
