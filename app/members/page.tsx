"use client";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";
import { UserPlus, Users, MapPin, FileText, Award, Download, CheckCircle, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

const membershipTypes = [
  {
    name: "Élève (Lycée)",
    price: "5 000 FCFA",
    description: "Pour les lycéens membres actifs",
    benefits: ["Participation à toutes les activités", "Accès au camp biblique national", "Formation spirituelle continue", "Carte de membre officielle"],
    link: "/membership/student",
    num: "01",
  },
  {
    name: "Étudiant (Université)",
    price: "10 000 FCFA",
    description: "Pour les étudiants universitaires",
    benefits: ["Tous les avantages élève", "Formations leadership avancées", "Réseau estudiantin national", "Opportunités de service"],
    link: "/membership/university",
    num: "02",
    featured: true,
  },
  {
    name: "Alumni / Ancien membre",
    price: "20 000 FCFA",
    description: "Pour les anciens de l'ACEEPCI",
    benefits: ["Réseau des anciens", "Événements exclusifs alumni", "Mentorat des jeunes", "Témoignages et partages"],
    link: "/membership/alumni",
    num: "03",
  },
];

const whyJoin = [
  { icon: Users,    title: "Communauté",  desc: "Rejoignez 5 000+ jeunes chrétiens à travers la Côte d'Ivoire" },
  { icon: Award,    title: "Formation",   desc: "Bénéficiez de formations spirituelles et en leadership" },
  { icon: MapPin,   title: "Activités",   desc: "Participez au camp biblique et à de nombreux événements" },
  { icon: FileText, title: "Ressources",  desc: "Accédez à des ressources spirituelles et académiques" },
];

const departments = ["Abidjan - Cocody", "Abidjan - Yopougon", "Abidjan - Adjamé", "Yamoussoukro", "Bouaké", "Daloa", "San-Pedro", "Korhogo", "Man"];

const accountItems = [
  { icon: Users,    title: "Mon profil",  desc: "Gérez vos informations personnelles" },
  { icon: FileText, title: "Historique",  desc: "Consultez vos paiements et activités" },
  { icon: Download, title: "Certificat", desc: "Téléchargez votre certificat de membre" },
];

export default function Page() {
  return (
    <div>
      <PageHero
        title="Espace Membres"
        subtitle="Rejoignez une communauté de 5 000+ jeunes engagés"
        background={heroImages.members}
      />

      {/* ── Pourquoi devenir membre ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Adhésion</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Pourquoi devenir <em className="not-italic italic text-brand-primary">membre ?</em>
            </h2>
            <p className="text-base font-light text-muted-foreground max-w-2xl">
              L&apos;adhésion à l&apos;ACEEPCI vous ouvre les portes d&apos;une expérience spirituelle enrichissante
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border rounded-2xl overflow-hidden border border-border">
            {whyJoin.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="group relative bg-brand-subtle/50 flex flex-col items-start gap-4 p-7 hover:bg-white transition-colors duration-300 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-10 h-[2px] bg-brand-primary transition-all duration-300 rounded-full" />
                <span className="absolute bottom-3 right-4 font-serif text-[4rem] font-bold leading-none text-brand-primary/[0.07] select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-1">{title}</h3>
                  <p className="text-xs font-light text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Types d'adhésion ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Formules</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Types <em className="not-italic italic text-brand-primary">d&apos;adhésion</em>
            </h2>
            <p className="text-base font-bold text-muted-foreground">Choisissez la formule qui vous correspond</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {membershipTypes.map((type) => (
              <div
                key={type.num}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white border ${
                  type.featured
                    ? "border-brand-primary/30 hover:shadow-[0_16px_48px_rgba(24,64,112,0.15)] md:-translate-y-3"
                    : "border-border hover:border-brand-primary/25"
                }`}
              >
                <div className={`h-[3px] bg-gradient-to-r from-brand-primary to-brand-accent ${type.featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`} />
                <span className="absolute top-5 right-5 font-serif text-[4rem] font-bold leading-none text-brand-primary/[0.06] select-none pointer-events-none">{type.num}</span>

                <div className="p-8">
                  {type.featured && (
                    <div className="inline-flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/25 text-brand-primary text-[0.65rem] font-medium tracking-widest uppercase px-3 py-1 rounded-sm mb-4">
                      Populaire
                    </div>
                  )}
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">{type.name}</h3>
                  <div className="font-serif text-3xl font-bold text-brand-primary mb-1">{type.price}</div>
                  <p className="text-xs font-bold text-muted-foreground mb-6">{type.description}</p>
                  <div className="w-8 h-[2px] bg-brand-primary/50 mb-6 group-hover:w-14 transition-all duration-300" />
                  <ul className="space-y-3 mb-8">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <span className="text-xs font-bold text-muted-foreground leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={type.link}
                    className={`flex items-center justify-center gap-2 w-full py-3 text-sm font-medium rounded-sm transition-all group/btn ${
                      type.featured
                        ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-[0_4px_16px_rgba(24,64,112,0.28)] hover:opacity-95 hover:-translate-y-px"
                        : "bg-brand-subtle border border-border text-foreground hover:bg-brand-primary/10 hover:border-brand-primary/30"
                    }`}
                  >
                    Adhérer maintenant
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Adhésion en ligne ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="relative bg-brand-subtle rounded-2xl overflow-hidden border border-border">
            <div className="h-[3px] bg-gradient-to-r from-brand-primary via-brand-accent to-transparent" />
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_8px_28px_rgba(24,64,112,0.3)] flex items-center justify-center">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1 h-1 rounded-full bg-brand-primary" />
                  <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">En ligne · Sécurisé</p>
                  <span className="w-1 h-1 rounded-full bg-brand-primary" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-3 uppercase tracking-tight">
                  Adhésion <em className="not-italic italic text-brand-primary">en ligne</em>
                </h2>
                <p className="text-sm font-bold text-muted-foreground leading-relaxed mb-6">
                  Remplissez le formulaire d&apos;adhésion en ligne et effectuez votre paiement de manière sécurisée via Orange Money, Wave ou carte bancaire.
                </p>
                <Link
                  href="/membership-form"
                  className="inline-flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(24,64,112,0.28)] hover:opacity-95 hover:-translate-y-0.5 transition-all group"
                >
                  Commencer l&apos;adhésion
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Répertoire des départements ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Réseau</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Répertoire des <em className="not-italic italic text-brand-primary">départements</em>
            </h2>
            <p className="text-base font-bold text-muted-foreground">88+ départements à travers la Côte d&apos;Ivoire</p>
          </div>

          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-brand-primary to-transparent" />
            <div className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher un département (ville, établissement...)"
                  className="w-full pl-11 pr-4 py-3 bg-brand-subtle/50 border border-border rounded-md text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {departments.map((dept) => (
                  <div key={dept} className="group flex items-center gap-3 p-4 bg-brand-subtle/30 border border-border rounded-lg hover:bg-brand-subtle hover:border-brand-primary/25 transition-all cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary/15 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{dept}</h3>
                      <p className="text-xs font-bold text-muted-foreground">Voir les contacts</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:opacity-90 transition-colors group">
                  Voir tous les départements (88+)
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Alumni Network ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-primary rounded-tr-2xl z-10" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-brand-primary rounded-bl-2xl z-10" />
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-xl bg-brand-primary/15 border border-brand-primary/20" />
              <div className="relative rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(24,64,112,0.15)]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758599668337-58bfa42683ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Alumni Network"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Réseau Alumni</p>
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6 uppercase tracking-tight">
                Anciens <em className="not-italic italic text-brand-primary">membres</em>
              </h2>
              <div className="w-12 h-[2px] bg-gradient-to-r from-brand-primary to-transparent mb-6" />
              <p className="text-sm font-bold text-muted-foreground leading-relaxed mb-6">
                Vous êtes un ancien de l&apos;ACEEPCI ? Restez connecté avec votre famille spirituelle ! Le réseau Alumni vous permet de maintenir le lien, de mentorer les jeunes, et de continuer à contribuer à la mission.
              </p>
              <ul className="space-y-3 mb-8">
                {["Réseau professionnel et spirituel", "Événements exclusifs alumni", "Opportunités de mentorat", "Témoignages et partages d'expériences"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(24,64,112,0.35)]">
                      <CheckCircle className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/membership/alumni"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(24,64,112,0.35)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.5)] hover:-translate-y-0.5 transition-all group"
              >
                Rejoindre le réseau Alumni
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Espace Diaspora ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · International</p>
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4 uppercase tracking-tight">
            Espace <em className="not-italic italic text-brand-primary">Diaspora</em>
          </h2>
          <div className="w-12 h-[2px] bg-gradient-to-r from-brand-primary to-transparent mb-6" />
          <p className="text-base font-bold text-muted-foreground mb-8 max-w-xl leading-relaxed">
            Vous êtes à l&apos;étranger ? Restez connecté avec l&apos;ACEEPCI et soutenez la mission depuis n&apos;importe où dans le monde.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/payments"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(24,64,112,0.28)] hover:opacity-95 hover:-translate-y-0.5 transition-all group"
            >
              Devenir membre diaspora
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/payments"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-white border border-border text-foreground text-sm font-medium rounded-sm hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all"
            >
              Faire un don
            </Link>
          </div>
        </div>
      </AnimateSection>

      {/* ── Mon Compte ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="bg-brand-subtle/50 border border-border rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-brand-primary via-brand-accent to-transparent" />
            <div className="p-8 md:p-10">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1 h-1 rounded-full bg-brand-primary" />
                  <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Espace personnel</p>
                  <span className="w-1 h-1 rounded-full bg-brand-primary" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-1 uppercase tracking-tight">
                  Mon <em className="not-italic italic text-brand-primary">Compte</em>
                </h2>
                <p className="text-sm font-bold text-muted-foreground">Déjà membre ? Accédez à votre espace personnel</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {accountItems.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="group flex flex-col gap-3 p-5 bg-white border border-border rounded-xl hover:shadow-[0_8px_24px_rgba(24,64,112,0.08)] hover:border-brand-primary/20 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/15 transition-colors">
                      <Icon className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-0.5">{title}</h3>
                      <p className="text-xs font-bold text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="inline-flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(24,64,112,0.28)] hover:opacity-95 hover:-translate-y-0.5 transition-all group">
                Se connecter
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </AnimateSection>
    </div>
  );
}