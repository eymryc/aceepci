"use client";
import {
  Heart, Building2, GraduationCap, Church, Users,
  CreditCard, Globe, CheckCircle, TrendingUp, DollarSign, ArrowRight, Lock
} from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";

const donationTypes = [
  { title: "Don libre",        desc: "Soutenez notre mission globale",          icon: Heart,         suggested: ["5 000", "10 000", "25 000", "50 000"],           num: "01" },
  { title: "Camp biblique",    desc: "Financez des places pour cas sociaux",    icon: Users,         suggested: ["15 000", "30 000", "50 000", "100 000"],          num: "02" },
  { title: "Construction",     desc: "Centre d'accueil Yamoussoukro",           icon: Building2,     suggested: ["20 000", "50 000", "100 000", "200 000"],         num: "03" },
  { title: "Bourses d'études", desc: "Soutien aux élèves défavorisés",          icon: GraduationCap, suggested: ["10 000", "25 000", "50 000", "100 000"],          num: "04" },
  { title: "Missions",         desc: "Évangélisation scolaire",                 icon: Church,        suggested: ["5 000", "15 000", "30 000", "75 000"],            num: "05" },
];

const memberships = [
  { title: "Élève",       subtitle: "Lycée",          amount: "À définir" },
  { title: "Étudiant",    subtitle: "Université",     amount: "À définir" },
  { title: "Alumni",      subtitle: "Ancien membre",  amount: "À définir" },
  { title: "Département", subtitle: "Collectif",      amount: "À définir" },
];

const paymentMethods = [
  {
    name: "Orange Money",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Orange_logo.svg",
    priority: "INDISPENSABLE",
    desc: "Paiement via Orange Money CI",
  },
  {
    name: "Wave",
    logoSrc: "https://upload.wikimedia.org/wikipedia/fr/2/2a/Wave_logo.svg",
    priority: "INDISPENSABLE",
    desc: "Transactions rapides et sécurisées",
  },
  {
    name: "MTN Mobile Money",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/0/02/MTN_Logo.svg",
    priority: "RECOMMANDÉ",
    desc: "Mobile Money MTN",
  },
  {
    name: "Visa / Mastercard",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
    priority: "RECOMMANDÉ",
    desc: "Cartes bancaires internationales",
  },
];

const features = [
  { icon: CheckCircle, title: "Reçus automatiques",        desc: "Recevez votre reçu PDF par email immédiatement" },
  { icon: Globe,       title: "Paiements internationaux",  desc: "Soutenez-nous depuis n'importe où dans le monde" },
  { icon: Heart,       title: "Dons récurrents",           desc: "Programmez des dons mensuels ou annuels" },
  { icon: CreditCard,  title: "Historique complet",        desc: "Consultez tous vos paiements dans votre espace" },
];

const eventCards = [
  {
    title: "Camp Biblique National",
    desc: "Inscription + hébergement + repas",
    icon: Users,
    image: "https://images.unsplash.com/photo-1772130454817-d56b44ae056a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    options: [{ label: "Paiement total (À définir)" }, { label: "Acompte 50%" }],
  },
  {
    title: "Séminaires & Formations",
    desc: "Formation leadership et développement",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1759922378187-11a435837df8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    amount: "À définir",
  },
  {
    title: "Retraites spirituelles",
    desc: "Moments de ressourcement spirituel",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1766932189849-cc7d29444457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    options: [{ label: "Paiement total" }, { label: "Acompte" }],
  },
];

export default function Page() {
  return (
    <div>
      <PageHero
        title="Paiements en ligne"
        subtitle="Soutenez la mission de l'ACEEPCI de manière sécurisée via Orange Money, Wave, Mobile Money ou carte bancaire"
        background={heroImages.payments}
      />

      {/* ── Campagne Progress ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-brand-subtle rounded-2xl overflow-hidden border border-border">
            <div className="h-[3px] bg-gradient-to-r from-brand-primary via-brand-accent to-transparent" />
            <div className="p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_8px_28px_rgba(24,64,112,0.3)] flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-1 rounded-full bg-brand-primary" />
                  <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Campagne 2026</p>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Construction du Centre d&apos;Accueil
                </h3>
                <div className="mb-3">
                  <div className="flex justify-between text-xs sm:text-sm font-medium mb-2">
                    <span className="text-brand-primary">42 millions FCFA collectés</span>
                    <span className="text-foreground/80">Objectif : 100 millions FCFA</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2.5 border border-border">
                    <div className="bg-gradient-to-r from-brand-primary to-brand-accent h-2.5 rounded-full shadow-[0_0_10px_rgba(24,64,112,0.35)]" style={{ width: "42%" }} />
                  </div>
                  <p className="text-right text-[0.7rem] sm:text-xs text-brand-primary mt-1 font-semibold">42%</p>
                </div>
                <p className="text-sm sm:text-base font-medium text-foreground/90 leading-relaxed">
                  Aidez-nous à construire le centre d&apos;accueil de Yamoussoukro pour héberger nos camps bibliques et activités nationales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Types de dons ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Dons</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Types de <em className="not-italic italic text-brand-primary">dons</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base font-medium text-foreground/90 max-w-2xl mx-auto">
              Choisissez comment vous souhaitez soutenir notre mission
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {donationTypes.map(({ title, desc, icon: Icon, suggested, num }) => (
              <div key={num} className="group relative bg-white border border-border rounded-2xl overflow-hidden hover:border-brand-primary/30 hover:shadow-[0_16px_48px_rgba(24,64,112,0.12)] transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-4 right-5 font-serif text-[4.5rem] font-bold leading-none text-brand-primary/[0.05] select-none pointer-events-none">{num}</span>

                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_4px_12px_rgba(24,64,112,0.25)] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-1">{title}</h3>
                  <div className="w-6 h-[2px] bg-brand-primary/60 mb-3 group-hover:w-12 transition-all duration-300" />
                  <p className="text-sm font-medium text-foreground/90 mb-5">{desc}</p>

                  <p className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-foreground/70 mb-2">Montants suggérés (FCFA)</p>
                  <div className="grid grid-cols-4 gap-1.5 mb-5">
                    {suggested.map((amount) => (
                      <button key={amount} className="px-1.5 py-2 text-[0.7rem] font-semibold bg-brand-subtle border border-border text-foreground rounded-sm hover:bg-brand-primary/10 hover:border-brand-primary/25 hover:text-brand-primary transition-all">
                        {amount}
                      </button>
                    ))}
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_12px_rgba(24,64,112,0.25)] hover:opacity-95 hover:-translate-y-px transition-all group/btn">
                    Faire un don
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Cotisations annuelles ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Membres</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Cotisations <em className="not-italic italic text-brand-primary">annuelles</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base font-medium text-foreground/90">
              Devenez membre ou renouvelez votre cotisation
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {memberships.map(({ title, subtitle, amount }, i) => (
              <div key={title} className="group bg-white rounded-xl border border-border p-6 hover:shadow-[0_12px_36px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 right-4 font-serif text-[4rem] font-bold leading-none text-brand-primary/[0.07] select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground mb-0.5">{title}</h3>
                <p className="text-sm font-medium text-foreground/85 mb-4">{subtitle}</p>
                <div className="font-serif text-3xl font-bold text-brand-primary mb-5">{amount}</div>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_10px_rgba(24,64,112,0.25)] hover:shadow-[0_4px_16px_rgba(24,64,112,0.4)] hover:-translate-y-px transition-all group/btn">
                  Payer
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Inscriptions aux activités ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Inscriptions</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Inscriptions aux <em className="not-italic italic text-brand-primary">activités</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base font-medium text-foreground/90">
              Inscrivez-vous et payez en ligne pour nos événements
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-5">
            {eventCards.map(({ title, desc, icon: Icon, image, amount, options }) => (
              <div key={title} className="group bg-white border border-border rounded-2xl overflow-hidden hover:border-brand-primary/25 hover:shadow-[0_12px_36px_rgba(24,64,112,0.1)] transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <ImageWithFallback src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/60 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_4px_12px_rgba(24,64,112,0.35)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold text-foreground mb-1">{title}</h3>
                  <p className="text-sm font-medium text-foreground/90 mb-4">{desc}</p>

                  {amount && (
                    <div className="font-serif text-2xl font-bold text-brand-primary mb-4">{amount}</div>
                  )}

                  {options && (
                    <div className="mb-4 space-y-2">
                      <p className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-foreground/70">Options de paiement</p>
                      {options.map((opt) => (
                        <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group/radio">
                          <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-brand-primary opacity-0 group-hover/radio:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-xs font-medium text-foreground/90 group-hover/radio:text-foreground transition-colors">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_12px_rgba(24,64,112,0.25)] hover:opacity-95 hover:-translate-y-px transition-all group/btn mt-2">
                    S&apos;inscrire
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Modes de paiement ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Paiement</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Modes de <em className="not-italic italic text-brand-primary">paiement</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base font-medium text-foreground/90">
              Payez en toute sécurité avec votre méthode préférée
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {paymentMethods.map(({ name, logoSrc, priority, desc }) => (
              <div key={name} className="group bg-white rounded-xl border border-border p-6 text-center hover:shadow-[0_12px_36px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-white border border-border flex items-center justify-center overflow-hidden shadow-sm">
                    <ImageWithFallback
                      src={logoSrc}
                      alt={name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
                <h3 className="font-serif text-base font-bold text-foreground mb-2">{name}</h3>
                <span className={`inline-block text-[0.65rem] font-medium tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-sm border mb-3 ${
                  priority === "INDISPENSABLE"
                    ? "bg-brand-primary/10 text-brand-primary border-brand-primary/30"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                }`}>
                  {priority}
                </span>
                <p className="text-sm font-medium text-foreground/90">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-foreground/85 mt-4">
            <Lock className="w-3.5 h-3.5 text-brand-primary" />
            Tous les paiements sont sécurisés et conformes aux normes PCI-DSS
          </div>
        </div>
      </AnimateSection>

      {/* ── Fonctionnalités ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Plateforme</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Nos <em className="not-italic italic text-brand-primary">fonctionnalités</em>
            </h2>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border rounded-2xl overflow-hidden border border-border">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="group relative bg-white flex flex-col items-center text-center gap-4 px-6 py-10 hover:bg-brand-subtle/50 transition-colors duration-300 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-10 h-[2px] bg-brand-primary transition-all duration-300 rounded-full" />
                <span className="absolute bottom-2 right-3 font-serif text-[3.5rem] font-bold leading-none text-brand-primary/[0.05] select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/15 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm font-medium text-foreground/90 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── CTA Final ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_8px_28px_rgba(24,64,112,0.3)] mb-8">
            <DollarSign className="w-8 h-8 text-white" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Agissez maintenant</p>
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4 uppercase tracking-tight">
            Chaque don <em className="not-italic italic text-brand-primary">compte</em>
          </h2>
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent mx-auto mb-6" />
          <p className="text-base font-medium text-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Votre générosité nous permet de continuer à transformer des vies par l&apos;Évangile et à former les leaders de demain.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium rounded-sm shadow-[0_4px_20px_rgba(24,64,112,0.28)] hover:opacity-95 hover:-translate-y-0.5 transition-all group">
              Faire un don maintenant
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white border border-border text-foreground font-medium rounded-sm hover:bg-brand-subtle hover:border-brand-primary/30 transition-all"
            >
              En savoir plus sur notre mission
            </Link>
          </div>
        </div>
      </AnimateSection>
    </div>
  );
}