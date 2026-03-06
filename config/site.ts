/**
 * Configuration du site ACEEPCI
 * Une seule source de vérité pour le nom, la devise, la navigation et les contacts.
 */

export const siteConfig = {
  name: "ACEEPCI",
  fullName: "Association Chrétienne des Élèves et Étudiants Protestants de Côte d'Ivoire",
  tagline: "Connaître — Aimer — Servir",
  slogan: "Ma jeunesse pour Jésus-Christ",
  founded: "1er novembre 1961",
  description: "Plus de 60 ans au service de la jeunesse ivoirienne. Évangélisation et formation en milieu scolaire et estudiantin.",
} as const;

export const navConfig = [
  { name: "Accueil", href: "/" },
  { name: "Qui sommes-nous", href: "/about" },
  { name: "Activités", href: "/activities" },
  {
    name: "Espace Membres",
    subItems: [
      { name: "Adhésion", href: "/members" },
      { name: "Paiements", href: "/payments" },
      { name: "Offres", href: "/offers" },
    ],
  },
  {
    name: "Actualités & Blog",
    subItems: [
      { name: "Actualités", href: "/news" },
      { name: "Blog", href: "/blog" },
    ],
  },
  { name: "Médias", href: "/resources" },
  { name: "Contact", href: "/contact" },
] as const;

export const contactConfig = {
  address: "MAPE, Abidjan-Cocody, Boulevard de l'Université, face CHU",
  phone: "+225 27 22 44 43 78",
  email: "contact@aceepci.org",
  social: [
    { name: "Facebook", href: "#", icon: "Facebook" },
    { name: "Instagram", href: "#", icon: "Instagram" },
    { name: "YouTube", href: "#", icon: "Youtube" },
  ],
} as const;
