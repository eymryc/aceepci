"use client";
import { useState } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";
import {
  Briefcase, GraduationCap, DollarSign, Heart, MapPin, Clock,
  Calendar, Building, ChevronRight, ChevronLeft, ExternalLink, X, ArrowRight,
  Filter, CheckCircle
} from "lucide-react";

type OfferCategory = "all" | "emploi" | "stage" | "bourse" | "benevolat";

interface Offer {
  id: number;
  title: string;
  organization: string;
  category: Exclude<OfferCategory, "all">;
  location: string;
  type: string;
  deadline: string;
  description: string;
  requirements: string[];
  salary?: string;
  duration?: string;
  externalLink: string;
}

const categories = [
  { id: "all"       as const, name: "Toutes",    icon: Filter,        count: 24 },
  { id: "emploi"    as const, name: "Emplois",   icon: Briefcase,     count: 8  },
  { id: "stage"     as const, name: "Stages",    icon: GraduationCap, count: 6  },
  { id: "bourse"    as const, name: "Bourses",   icon: DollarSign,    count: 5  },
  { id: "benevolat" as const, name: "Bénévolat", icon: Heart,         count: 5  },
];

const offers: Offer[] = [
  { id: 1, title: "Chargé(e) de Communication Digitale",   organization: "ONG Vision Mondiale Côte d'Ivoire",       category: "emploi",    location: "Abidjan, Cocody",       type: "CDI - Temps plein",         deadline: "15 Avril 2026",  salary: "450 000 - 600 000 FCFA", description: "Nous recherchons un(e) chargé(e) de communication digitale pour gérer notre présence en ligne et créer du contenu engageant.", requirements: ["Licence en Communication ou Marketing", "2 ans d'expérience minimum", "Maîtrise des réseaux sociaux", "Compétences en design graphique"], externalLink: "https://www.visionmondiale.ci/carrieres" },
  { id: 2, title: "Stage en Comptabilité et Finance",       organization: "Cabinet d'Expertise Comptable FIDEXCO",   category: "stage",     location: "Abidjan, Plateau",      type: "Stage - 6 mois",            deadline: "30 Mars 2026",   duration: "6 mois",               description: "Stage professionnel dans un cabinet d'expertise comptable avec possibilité d'embauche à la fin du stage.", requirements: ["Étudiant en Comptabilité/Finance", "Maîtrise d'Excel", "Rigueur et sens de l'organisation", "Connaissance des logiciels comptables (atout)"], externalLink: "mailto:stages@fidexco.ci" },
  { id: 3, title: "Bourse d'Excellence Master - France",    organization: "Campus France & Ambassade de France",     category: "bourse",    location: "France (toutes villes)", type: "Bourse d'études",          deadline: "10 Avril 2026",  description: "Programme de bourses pour poursuivre un Master en France dans divers domaines. Couvre les frais de scolarité, logement et allocation mensuelle.", requirements: ["Licence avec mention Bien minimum", "Projet d'études cohérent", "Niveau B2 en français", "Dossier académique solide"], externalLink: "https://pastel.diplomatie.gouv.fr/etudesenfrance/" },
  { id: 4, title: "Coordinateur(trice) de Projet Jeunesse", organization: "Association Jeunesse et Développement",  category: "emploi",    location: "Yamoussoukro",          type: "CDD - 1 an renouvelable",  deadline: "20 Mars 2026",   salary: "350 000 - 450 000 FCFA", description: "Coordonner les projets de développement communautaire axés sur l'autonomisation des jeunes.", requirements: ["Master en Sciences Sociales ou équivalent", "Expérience en gestion de projet", "Capacité à travailler en équipe", "Permis de conduire"], externalLink: "mailto:rh@jeunessedev.org" },
  { id: 5, title: "Animateur(trice) Bénévole - Camp d'Été", organization: "ACEEPCI - Département Jeunesse",         category: "benevolat", location: "Grand-Bassam",          type: "Bénévolat - Été 2026",     deadline: "5 Avril 2026",   duration: "2 semaines (Juillet-Août)", description: "Encadrer et animer des activités spirituelles et ludiques pour les enfants et adolescents lors de notre camp d'été annuel.", requirements: ["Membre actif de l'ACEEPCI", "Expérience avec les jeunes", "Dynamisme et créativité", "Engagement chrétien"], externalLink: "mailto:benevolat@aceepci.org" },
  { id: 6, title: "Développeur Web Full Stack",              organization: "StartUp Tech Abidjan",                   category: "emploi",    location: "Abidjan, Marcory",      type: "CDI - Temps plein",         deadline: "25 Mars 2026",   salary: "600 000 - 900 000 FCFA", description: "Rejoignez notre équipe tech pour développer des solutions innovantes pour le marché ivoirien.", requirements: ["Licence en Informatique", "Maîtrise React/Node.js", "3 ans d'expérience", "Portfolio de projets"], externalLink: "https://techstartup.ci/careers" },
  { id: 7, title: "Stage en Ressources Humaines",            organization: "Groupe NSIA",                            category: "stage",     location: "Abidjan, Plateau",      type: "Stage - 3 mois",            deadline: "18 Mars 2026",   duration: "3 mois",               description: "Participer aux activités de recrutement, formation et gestion administrative du personnel.", requirements: ["Étudiant en RH/Psychologie", "Excellentes capacités rédactionnelles", "Sens du relationnel", "Discrétion"], externalLink: "https://recrutement.nsia.ci" },
  { id: 8, title: "Bourse de Recherche Doctorale",           organization: "Université Félix Houphouët-Boigny",     category: "bourse",    location: "Abidjan, Cocody",       type: "Bourse de recherche",       deadline: "30 Avril 2026",  description: "Financement pour recherche doctorale en Sciences Humaines et Sociales. Allocation mensuelle de 200 000 FCFA.", requirements: ["Master 2 avec mention Bien", "Proposition de recherche innovante", "Recommandations académiques", "Engagement temps plein"], externalLink: "mailto:doctorat@univ-fhb.edu.ci" },
];

const categoryMeta: Record<string, { label: string; bg: string; text: string; border: string }> = {
  emploi:    { label: "Emploi",    bg: "bg-[rgba(59,130,246,0.1)]",  text: "text-[#60a5fa]",  border: "border-[rgba(59,130,246,0.3)]"  },
  stage:     { label: "Stage",     bg: "bg-[rgba(168,85,247,0.1)]",  text: "text-[#c084fc]",  border: "border-[rgba(168,85,247,0.3)]"  },
  bourse:    { label: "Bourse",    bg: "bg-brand-primary/15",        text: "text-brand-light", border: "border-brand-primary/35"           },
  benevolat: { label: "Bénévolat", bg: "bg-[rgba(52,199,89,0.1)]",   text: "text-[#4ade80]",  border: "border-[rgba(52,199,89,0.3)]"   },
};

const getCategoryIcon = (cat: string) => {
  if (cat === "emploi")    return Briefcase;
  if (cat === "stage")     return GraduationCap;
  if (cat === "bourse")    return DollarSign;
  if (cat === "benevolat") return Heart;
  return Briefcase;
};

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory>("all");
  const [currentPage, setCurrentPage]           = useState(1);
  const [selectedOffer, setSelectedOffer]       = useState<Offer | null>(null);
  const offersPerPage = 6;

  const filteredOffers = selectedCategory === "all"
    ? offers
    : offers.filter((o) => o.category === selectedCategory);

  const totalPages      = Math.ceil(filteredOffers.length / offersPerPage);
  const currentOffers   = filteredOffers.slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage);

  return (
    <div className="min-h-screen">
      <PageHero
        title="Offres & Opportunités"
        subtitle="Découvrez les dernières offres d'emploi, stages, bourses et opportunités de bénévolat pour les membres de l'ACEEPCI"
        background={heroImages.offers}
      />

      {/* ── Stats bar ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-brand-subtle/60 border border-border rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {categories.slice(1).map(({ id, icon: Icon, name, count }, i) => (
                <div key={id} className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center mx-auto sm:mx-0 flex-shrink-0 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-foreground">{count}</div>
                    <div className="text-xs sm:text-sm font-medium tracking-wide text-foreground/75">{name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Main content ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section header */}
        <header className="text-center mb-12 sm:mb-14">
          <div className="flex justify-center gap-2 mb-4">
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Offres</p>
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
            Offres &amp; <em className="not-italic italic text-brand-primary">opportunités</em>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-foreground/85 max-w-2xl mx-auto">
            Filtrez et explorez les dernières offres d&apos;emploi, de stages, de bourses et de bénévolat.
          </p>
        </header>

        {/* Category filters + summary */}
        <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 mb-6 shadow-[0_2px_12px_rgba(24,64,112,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map(({ id, icon: Icon, name, count }) => (
                <button
                  key={id}
                  onClick={() => { setSelectedCategory(id); setCurrentPage(1); }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 ${
                    selectedCategory === id
                      ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-transparent shadow-[0_4px_14px_rgba(24,64,112,0.25)]"
                      : "bg-brand-subtle/50 border-border text-foreground hover:bg-brand-primary/10 hover:border-brand-primary/25"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {name}
                  <span className={`min-w-[1.25rem] px-1.5 py-0.5 rounded-md text-[0.7rem] font-semibold ${
                    selectedCategory === id ? "bg-white/20" : "bg-white/80 text-foreground/80"
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
            <div className="text-sm text-foreground/80 font-medium">
              <span className="text-foreground font-semibold">{filteredOffers.length}</span>
              {" "}opportunité{filteredOffers.length > 1 ? "s" : ""}
              {selectedCategory !== "all" && " dans cette catégorie"}
            </div>
          </div>
        </div>

        {/* Offers list (full-width cards) */}
        {currentOffers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {currentOffers.map((offer) => {
              const Icon = getCategoryIcon(offer.category);
              const meta = categoryMeta[offer.category];
              return (
                <div
                  key={offer.id}
                  className="group relative bg-white border border-border rounded-2xl overflow-hidden hover:border-brand-primary/25 hover:shadow-[0_12px_40px_rgba(24,64,112,0.1)] transition-all duration-300"
                >
                  {/* Accent bar (category color) */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl border-l-4 ${meta.border} bg-transparent`} aria-hidden />
                  <div className="pl-5 sm:pl-6 pr-4 sm:pr-5 py-4 md:py-5 flex flex-col md:flex-row md:items-center gap-4">
                    {/* Left: category + title + org + meta pills */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-lg border ${meta.bg} ${meta.text} ${meta.border}`}>
                          <Icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-subtle/80 text-xs font-medium text-brand-primary border border-brand-primary/15">
                          <Calendar className="w-3 h-3" />
                          {offer.deadline}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-bold text-foreground leading-snug line-clamp-2 pr-2">
                        {offer.title}
                      </h3>
                      <p className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 flex-shrink-0" />
                        {offer.organization}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/75 bg-white border border-border rounded-md px-2 py-1">
                          <MapPin className="w-3 h-3 text-brand-primary" />
                          {offer.location}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/75 bg-white border border-border rounded-md px-2 py-1">
                          <Clock className="w-3 h-3 text-brand-primary" />
                          {offer.type}
                        </span>
                        {offer.salary && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/75 bg-white border border-border rounded-md px-2 py-1">
                            <DollarSign className="w-3 h-3 text-brand-primary" />
                            {offer.salary}
                          </span>
                        )}
                        {offer.duration && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/75 bg-white border border-border rounded-md px-2 py-1">
                            <Calendar className="w-3 h-3 text-brand-primary" />
                            {offer.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/85 line-clamp-2 leading-relaxed">
                        {offer.description}
                      </p>
                      <p className="text-xs text-foreground/70">
                        <span className="font-semibold">Exigences :</span> {offer.requirements.slice(0, 2).join(" · ")}
                        {offer.requirements.length > 2 && " …"}
                      </p>
                    </div>
                    {/* Right: CTA */}
                    <div className="flex-shrink-0 flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-border md:border-0">
                      <span className="text-[0.7rem] text-foreground/60 md:hidden">
                        {offer.organization.split(" ")[0]}
                      </span>
                      <button
                        onClick={() => setSelectedOffer(offer)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-xl shadow-[0_4px_14px_rgba(24,64,112,0.28)] hover:shadow-[0_6px_20px_rgba(24,64,112,0.35)] hover:-translate-y-0.5 transition-all group/btn"
                      >
                        Voir détails
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-border rounded-2xl p-12 sm:p-16 text-center shadow-[0_2px_12px_rgba(24,64,112,0.04)]">
            <div className="w-16 h-16 rounded-2xl bg-brand-subtle border border-brand-primary/15 flex items-center justify-center mx-auto mb-5">
              <Filter className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-2">Aucune offre disponible</h3>
            <p className="text-sm text-foreground/85 max-w-sm mx-auto">Aucune offre ne correspond à votre sélection. Essayez un autre filtre.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredOffers.length > offersPerPage && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border border-border text-foreground rounded-xl hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`min-w-[2.25rem] h-9 flex items-center justify-center text-sm font-medium rounded-xl border transition-all ${
                    currentPage === n
                      ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-transparent shadow-[0_4px_12px_rgba(24,64,112,0.28)]"
                      : "bg-white border-border text-foreground hover:border-brand-primary/25 hover:bg-brand-primary/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border border-border text-foreground rounded-xl hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        </div>
      </AnimateSection>

      {/* ── CTA ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="bg-brand-subtle/60 border border-border rounded-2xl p-8 sm:p-10 text-center shadow-[0_2px_16px_rgba(24,64,112,0.04)]">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Partagez</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3 uppercase tracking-tight">
              Vous avez une opportunité à <em className="not-italic italic text-brand-primary">partager ?</em>
            </h2>
            <p className="text-sm sm:text-base text-foreground/90 mb-8 max-w-xl mx-auto leading-relaxed">
              Si vous êtes une organisation souhaitant publier une offre ou un membre avec une opportunité à partager, contactez-nous.
            </p>
            <button className="inline-flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-xl shadow-[0_4px_16px_rgba(24,64,112,0.3)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.4)] hover:-translate-y-0.5 transition-all group">
              Soumettre une offre
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </AnimateSection>

      {/* ── Detail panel (slide-over) ── */}
      {selectedOffer && (
        <>
          <div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-[2px] z-40 transition-opacity"
            onClick={() => setSelectedOffer(null)}
            aria-hidden
          />
          <aside
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-lg bg-white border-l border-border shadow-[-8px_0_32px_rgba(24,64,112,0.12)] flex flex-col translate-x-0"
            role="dialog"
            aria-labelledby="offer-panel-title"
            aria-modal="true"
          >
            {/* Panel header */}
            <div className="flex-shrink-0 flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-border bg-brand-subtle/30">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-foreground hover:bg-brand-primary/10 hover:border-brand-primary/30 hover:text-brand-primary transition-all"
                  aria-label="Fermer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-foreground/80 truncate">Détails de l&apos;offre</span>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-foreground hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6">
                {(() => {
                  const meta = categoryMeta[selectedOffer.category];
                  const Icon = getCategoryIcon(selectedOffer.category);
                  return (
                    <>
                      <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-lg border mb-4 ${meta.bg} ${meta.text} ${meta.border}`}>
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </span>
                      <h2 id="offer-panel-title" className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-2 leading-tight">
                        {selectedOffer.title}
                      </h2>
                      <p className="flex items-center gap-2 text-sm font-medium text-foreground/85 mb-5">
                        <Building className="w-4 h-4 flex-shrink-0" />
                        {selectedOffer.organization}
                      </p>

                      {/* Infos bloc */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {[
                          { icon: MapPin,    label: "Lieu",     value: selectedOffer.location },
                          { icon: Clock,     label: "Type",     value: selectedOffer.type },
                          ...(selectedOffer.salary   ? [{ icon: DollarSign, label: "Salaire",  value: selectedOffer.salary }] : []),
                          ...(selectedOffer.duration ? [{ icon: Calendar,   label: "Durée",    value: selectedOffer.duration }] : []),
                          { icon: Calendar,  label: "Échéance", value: selectedOffer.deadline, highlight: true },
                        ].map(({ icon: I, label, value, highlight }) => (
                          <div key={label} className={`flex items-start gap-3 p-3 rounded-xl border ${highlight ? "border-brand-primary/25 bg-brand-subtle/60 sm:col-span-2" : "border-border bg-brand-subtle/30"}`}>
                            <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0">
                              <I className={`w-4 h-4 ${highlight ? "text-brand-primary" : "text-foreground/70"}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[0.7rem] font-medium uppercase tracking-wider text-foreground/60">{label}</p>
                              <p className={`text-sm font-semibold ${highlight ? "text-brand-primary" : "text-foreground"}`}>{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-foreground/60 mb-2">Description</p>
                        <p className="text-sm text-foreground/90 leading-relaxed">{selectedOffer.description}</p>
                      </div>

                      {/* Requirements */}
                      <div className="mb-6">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-foreground/60 mb-3">Exigences</p>
                        <ul className="space-y-2">
                          {selectedOffer.requirements.map((req) => (
                            <li key={req} className="flex items-start gap-2 text-sm text-foreground/90">
                              <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Postuler */}
                      <div className="rounded-2xl border border-brand-primary/20 bg-brand-subtle/50 p-5">
                        <h3 className="font-serif text-base font-bold text-foreground mb-2 flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-brand-primary" />
                          Postuler à cette offre
                        </h3>
                        <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                          Cette offre est publiée par l&apos;organisation. Cliquez ci-dessous pour accéder au formulaire ou aux coordonnées.
                        </p>
                        <a
                          href={selectedOffer.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2.5 w-full px-5 py-3.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-semibold rounded-xl shadow-[0_4px_16px_rgba(24,64,112,0.3)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.4)] hover:-translate-y-0.5 transition-all group"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Accéder à l&apos;offre
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}