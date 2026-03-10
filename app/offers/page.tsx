"use client";
import { useState } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";
import {
  Briefcase, GraduationCap, DollarSign, Heart, MapPin, Clock,
  Calendar, Building, ChevronRight, Filter, ChevronLeft, ExternalLink, X, ArrowRight
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
      <AnimateSection className="relative bg-white overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(1).map(({ id, icon: Icon, name, count }, i) => (
              <div key={id} className="group relative text-center overflow-hidden">
                <span className="absolute bottom-0 right-2 font-serif text-[3.5rem] font-bold leading-none text-brand-primary/[0.06] select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="font-serif text-2xl font-bold text-foreground">{count}</div>
                <div className="text-xs font-light tracking-wider uppercase text-muted-foreground">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Main content ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">

        {/* Category filters */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {categories.map(({ id, icon: Icon, name, count }) => (
            <button
              key={id}
              onClick={() => { setSelectedCategory(id); setCurrentPage(1); }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-sm border transition-all ${
                selectedCategory === id
                  ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-brand-primary shadow-[0_4px_12px_rgba(24,64,112,0.26)]"
                  : "bg-white border-border text-foreground hover:bg-brand-primary/5 hover:border-brand-primary/30"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {name}
              <span className={`px-1.5 py-0.5 rounded-sm text-[0.65rem] font-medium ${
                selectedCategory === id ? "bg-white/20" : "bg-brand-subtle"
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Offers grid */}
        {currentOffers.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {currentOffers.map((offer) => {
              const Icon = getCategoryIcon(offer.category);
              const meta = categoryMeta[offer.category];
              return (
                <div
                  key={offer.id}
                  className="group bg-white border border-border rounded-2xl overflow-hidden hover:border-brand-primary/30 hover:shadow-[0_12px_36px_rgba(24,64,112,0.1)] transition-all duration-300"
                >
                  <div className="h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-6">
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-1.5 text-[0.65rem] font-medium tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm border mb-3 ${meta.bg} ${meta.text} ${meta.border}`}>
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-foreground mb-1.5 leading-snug">{offer.title}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Building className="w-3.5 h-3.5 flex-shrink-0" />
                        {offer.organization}
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {[
                        { icon: MapPin,   text: offer.location },
                        { icon: Clock,    text: offer.type },
                        ...(offer.salary   ? [{ icon: DollarSign, text: offer.salary }]            : []),
                        ...(offer.duration ? [{ icon: Calendar,   text: `Durée : ${offer.duration}` }] : []),
                      ].map(({ icon: I, text }) => (
                        <div key={text} className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <I className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                          {text}
                        </div>
                      ))}
                    </div>

                    <p className="text-xs font-bold text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {offer.description}
                    </p>

                    <div className="mb-5">
                      <p className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-2">Exigences</p>
                      <ul className="space-y-1.5">
                        {offer.requirements.slice(0, 2).map((req) => (
                          <li key={req} className="flex items-start gap-2 text-xs font-bold text-muted-foreground">
                            <ChevronRight className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                        {offer.requirements.length > 2 && (
                          <li className="text-[0.65rem] font-bold text-muted-foreground pl-5">
                            +{offer.requirements.length - 2} autres exigences
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                        Échéance : <span className="font-medium text-brand-primary ml-1">{offer.deadline}</span>
                      </div>
                      <button
                        onClick={() => setSelectedOffer(offer)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-medium rounded-sm shadow-[0_4px_10px_rgba(24,64,112,0.25)] hover:opacity-95 hover:-translate-y-px transition-all group/btn flex-shrink-0"
                      >
                        Voir détails
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-brand-subtle border border-border flex items-center justify-center mx-auto mb-4">
              <Filter className="w-7 h-7 text-brand-primary" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">Aucune offre disponible</h3>
            <p className="text-sm font-bold text-muted-foreground">Aucune offre ne correspond à votre sélection pour le moment.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredOffers.length > offersPerPage && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border border-border text-foreground rounded-sm hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-sm border transition-all ${
                    currentPage === n
                      ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-brand-primary shadow-[0_4px_10px_rgba(24,64,112,0.28)]"
                      : "bg-white border-border text-foreground hover:border-brand-primary/30 hover:bg-brand-primary/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border border-border text-foreground rounded-sm hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        </div>
      </AnimateSection>

      {/* ── CTA ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Partagez</p>
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3 uppercase tracking-tight">
            Vous avez une opportunité à <em className="not-italic italic text-brand-primary">partager ?</em>
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Si vous êtes une organisation souhaitant publier une offre ou un membre avec une opportunité à partager, contactez-nous.
          </p>
          <button className="inline-flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_14px_rgba(24,64,112,0.35)] hover:opacity-95 hover:-translate-y-0.5 transition-all group">
            Soumettre une offre
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </AnimateSection>

      {/* ── Detail Modal ── */}
      {selectedOffer && (
        <div
          className="fixed inset-0 bg-[rgba(10,8,3,0.8)] backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOffer(null)}
        >
          <div
            className="bg-brand-primary-dark border border-[rgba(24,64,112,0.25)] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-brand-primary-dark border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="h-[2px] absolute top-0 left-0 right-0 bg-gradient-to-r from-brand-primary to-transparent rounded-t-2xl" />
              <h2 className="font-serif text-xl font-bold text-[white]">Détails de l&apos;offre</h2>
              <button
                onClick={() => setSelectedOffer(null)}
                className="w-9 h-9 rounded-sm bg-[rgba(245,240,232,0.06)] border border-white/10 text-white flex items-center justify-center hover:bg-[rgba(24,64,112,0.2)] hover:border-brand-primary/40 hover:text-brand-light transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {/* Category badge */}
              {(() => {
                const meta = categoryMeta[selectedOffer.category];
                const Icon = getCategoryIcon(selectedOffer.category);
                return (
                  <span className={`inline-flex items-center gap-1.5 text-[0.65rem] font-medium tracking-[0.1em] uppercase px-3 py-1 rounded-sm border mb-5 ${meta.bg} ${meta.text} ${meta.border}`}>
                    <Icon className="w-3 h-3" />
                    {meta.label}
                  </span>
                );
              })()}

              <h3 className="font-serif text-3xl font-bold text-[white] mb-2 leading-tight">{selectedOffer.title}</h3>
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-6">
                <Building className="w-4 h-4" /> {selectedOffer.organization}
              </div>

              {/* Details grid */}
              <div className="grid md:grid-cols-2 gap-3 mb-7 bg-white/5 border border-white/10 rounded-xl p-4">
                {[
                  { icon: MapPin,    label: "Lieu",                               value: selectedOffer.location,  color: false },
                  { icon: Clock,     label: "Type",                               value: selectedOffer.type,      color: false },
                  ...(selectedOffer.salary   ? [{ icon: DollarSign, label: "Salaire",  value: selectedOffer.salary,   color: false }] : []),
                  ...(selectedOffer.duration ? [{ icon: Calendar,   label: "Durée",    value: selectedOffer.duration, color: false }] : []),
                  { icon: Calendar,  label: "Date limite de candidature",         value: selectedOffer.deadline,  color: true,  span: true },
                ].map(({ icon: Icon, label, value, color, span }) => (
                  <div key={label} className={`flex items-start gap-3 ${span ? "md:col-span-2" : ""}`}>
                    <div className="w-8 h-8 rounded-lg bg-[rgba(24,64,112,0.15)] border border-[rgba(24,64,112,0.25)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-brand-light" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-bold text-white mb-0.5">{label}</p>
                      <p className={`text-sm font-medium ${color ? "text-brand-light" : "text-white"}`}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-brand-light mb-3">Description</p>
                <p className="text-sm font-bold text-white leading-relaxed">{selectedOffer.description}</p>
              </div>

              {/* Requirements */}
              <div className="mb-7">
                <p className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-brand-light mb-3">Exigences</p>
                <ul className="space-y-2.5">
                  {selectedOffer.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-3 text-sm font-bold text-white">
                      <ChevronRight className="w-4 h-4 text-brand-light flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* External CTA */}
              <div className="bg-[rgba(180,130,60,0.07)] border border-[rgba(24,64,112,0.25)] rounded-xl p-6">
                <h4 className="font-serif text-base font-bold text-[white] mb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-brand-light" />
                  Postuler à cette offre
                </h4>
                <p className="text-xs font-bold text-white mb-5 leading-relaxed">
                  Cette offre est hébergée sur le site de l&apos;organisation. Cliquez ci-dessous pour accéder au formulaire de candidature ou aux coordonnées de contact.
                </p>
                <a
                  href={selectedOffer.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_14px_rgba(24,64,112,0.35)] hover:shadow-[0_6px_22px_rgba(180,130,60,0.5)] hover:-translate-y-0.5 transition-all group"
                >
                  <ExternalLink className="w-4 h-4" />
                  Accéder à l&apos;offre sur le site externe
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}