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
  { name: "Orange Money",    logo: "🟠", priority: "INDISPENSABLE", desc: "Paiement via Orange Money CI" },
  { name: "Wave",            logo: "💙", priority: "INDISPENSABLE", desc: "Transactions rapides et sécurisées" },
  { name: "MTN Mobile Money",logo: "💛", priority: "RECOMMANDÉ",    desc: "Mobile Money MTN" },
  { name: "Visa / Mastercard",logo: "💳",priority: "RECOMMANDÉ",    desc: "Cartes bancaires internationales" },
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
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-accent) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-brand-primary-dark rounded-2xl overflow-hidden border border-brand-primary/25">
            <div className="h-[3px] bg-gradient-to-r from-brand-primary via-brand-accent to-transparent" />
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.16)_0%,transparent_70%)]" />
            <div className="p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_8px_28px_rgba(24,64,112,0.35)] flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-1 rounded-full bg-brand-accent" />
                  <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">Campagne 2026</p>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">
                  Construction du Centre d&apos;Accueil
                </h3>
                <div className="mb-3">
                  <div className="flex justify-between text-xs font-light mb-2">
                    <span className="text-brand-light font-medium">42 millions FCFA collectés</span>
                    <span className="text-white">Objectif : 100 millions FCFA</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-brand-primary to-brand-accent h-2.5 rounded-full shadow-[0_0_10px_rgba(24,64,112,0.55)]" style={{ width: "42%" }} />
                  </div>
                  <p className="text-right text-[0.7rem] text-brand-light mt-1 font-medium">42%</p>
                </div>
                <p className="text-sm font-bold text-white leading-relaxed">
                  Aidez-nous à construire le centre d&apos;accueil de Yamoussoukro pour héberger nos camps bibliques et activités nationales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Types de dons ── */}
      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.18)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.12)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-accent" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">ACEEPCI · Dons</p>
              <span className="w-1 h-1 rounded-full bg-brand-accent" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
              Types de <em className="not-italic italic text-brand-light">dons</em>
            </h2>
            <p className="text-base font-bold text-white">Choisissez comment vous souhaitez soutenir notre mission</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {donationTypes.map(({ title, desc, icon: Icon, suggested, num }) => (
              <div key={num} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-primary/45 hover:bg-white/10 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-4 right-5 font-serif text-[4.5rem] font-bold leading-none text-white/[0.04] select-none pointer-events-none">{num}</span>

                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_4px_12px_rgba(24,64,112,0.25)] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-1">{title}</h3>
                  <div className="w-6 h-[2px] bg-brand-accent/60 mb-3 group-hover:w-12 transition-all duration-300" />
                  <p className="text-xs font-bold text-white mb-5">{desc}</p>

                  <p className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-white mb-2">Montants suggérés (FCFA)</p>
                  <div className="grid grid-cols-4 gap-1.5 mb-5">
                    {suggested.map((amount) => (
                      <button key={amount} className="px-1.5 py-2 text-[0.65rem] font-medium bg-white/5 border border-white/10 text-white rounded-sm hover:bg-brand-primary/20 hover:border-brand-primary/35 hover:text-brand-light transition-all">
                        {amount}
                      </button>
                    ))}
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_12px_rgba(24,64,112,0.25)] hover:shadow-[0_4px_18px_rgba(24,64,112,0.4)] hover:-translate-y-px transition-all group/btn">
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
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Membres</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Cotisations <em className="not-italic italic text-brand-primary">annuelles</em>
            </h2>
            <p className="text-base font-light text-muted-foreground">Devenez membre ou renouvelez votre cotisation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {memberships.map(({ title, subtitle, amount }, i) => (
              <div key={title} className="group bg-white rounded-xl border border-border p-6 hover:shadow-[0_12px_36px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 right-4 font-serif text-[4rem] font-bold leading-none text-brand-primary/[0.07] select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground mb-0.5">{title}</h3>
                <p className="text-xs font-light text-muted-foreground mb-4">{subtitle}</p>
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
      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.18)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-light" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">ACEEPCI · Inscriptions</p>
              <span className="w-1 h-1 rounded-full bg-brand-light" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-2 uppercase tracking-tight">
              Inscriptions aux <em className="not-italic italic text-brand-light">activités</em>
            </h2>
            <p className="text-base font-bold text-white">Inscrivez-vous et payez en ligne pour nos événements</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {eventCards.map(({ title, desc, icon: Icon, image, amount, options }) => (
              <div key={title} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-primary/35 transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <ImageWithFallback src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/80 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_4px_12px_rgba(24,64,112,0.4)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold text-white mb-1">{title}</h3>
                  <p className="text-xs font-bold text-white mb-4">{desc}</p>

                  {amount && (
                    <div className="font-serif text-2xl font-bold text-brand-light mb-4">{amount}</div>
                  )}

                  {options && (
                    <div className="mb-4 space-y-2">
                      <p className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-white">Options de paiement</p>
                      {options.map((opt) => (
                        <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group/radio">
                          <div className="w-4 h-4 rounded-full border border-brand-primary/45 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-brand-light opacity-0 group-hover/radio:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-xs font-bold text-white group-hover/radio:text-white transition-colors">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_12px_rgba(24,64,112,0.25)] hover:shadow-[0_4px_18px_rgba(24,64,112,0.4)] hover:-translate-y-px transition-all group/btn mt-2">
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
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Paiement</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Modes de <em className="not-italic italic text-brand-primary">paiement</em>
            </h2>
            <p className="text-base font-light text-muted-foreground">Payez en toute sécurité avec votre méthode préférée</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {paymentMethods.map(({ name, logo, priority, desc }) => (
              <div key={name} className="group bg-white rounded-xl border border-border p-6 text-center hover:shadow-[0_12px_36px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-4xl mb-3">{logo}</div>
                <h3 className="font-serif text-base font-bold text-foreground mb-2">{name}</h3>
                <span className={`inline-block text-[0.65rem] font-medium tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-sm border mb-3 ${
                  priority === "INDISPENSABLE"
                    ? "bg-brand-primary/10 text-brand-primary border-brand-primary/30"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                }`}>
                  {priority}
                </span>
                <p className="text-xs font-light text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-light text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-brand-primary" />
            Tous les paiements sont sécurisés et conformes aux normes PCI-DSS
          </div>
        </div>
      </AnimateSection>

      {/* ── Fonctionnalités ── */}
      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.12)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-light" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">ACEEPCI · Plateforme</p>
              <span className="w-1 h-1 rounded-full bg-brand-light" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight uppercase tracking-tight">
              Nos <em className="not-italic italic text-brand-light">fonctionnalités</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.04] rounded-2xl overflow-hidden border border-white/10">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="group relative bg-brand-primary-dark flex flex-col items-center text-center gap-4 px-6 py-10 hover:bg-brand-primary/10 transition-colors duration-300 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-10 h-[2px] bg-brand-primary transition-all duration-300 rounded-full" />
                <span className="absolute bottom-2 right-3 font-serif text-[3.5rem] font-bold leading-none text-white/[0.04] select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 rounded-full bg-brand-primary/15 border border-brand-primary/25 flex items-center justify-center group-hover:bg-brand-primary/25 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 text-brand-light" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                  <p className="text-xs font-bold text-white leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── CTA Final ── */}
      <AnimateSection className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1737045597777-059fbc5a8e3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Chaque don compte"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-dark/95 via-brand-primary-dark/80 to-brand-primary-dark/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/60 to-transparent" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_8px_28px_rgba(24,64,112,0.4)] mb-8">
            <DollarSign className="w-8 h-8 text-white" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1 h-1 rounded-full bg-brand-light" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">Agissez maintenant</p>
            <span className="w-1 h-1 rounded-full bg-brand-light" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-4 uppercase tracking-tight">
            Chaque don <em className="not-italic italic text-brand-light">compte</em>
          </h2>
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent mx-auto mb-6" />
          <p className="text-base font-bold text-white mb-10 max-w-2xl mx-auto leading-relaxed">
            Votre générosité nous permet de continuer à transformer des vies par l&apos;Évangile et à former les leaders de demain.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium rounded-sm shadow-[0_4px_20px_rgba(24,64,112,0.4)] hover:shadow-[0_6px_28px_rgba(24,64,112,0.55)] hover:-translate-y-0.5 transition-all group">
              Faire un don maintenant
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent border border-white/30 text-white font-medium rounded-sm hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 transition-all backdrop-blur-sm"
            >
              En savoir plus sur notre mission
            </Link>
          </div>
        </div>
      </AnimateSection>
    </div>
  );
}