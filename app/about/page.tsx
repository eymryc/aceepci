import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { siteConfig } from "@/config/site";
import { heroImages } from "@/config/heroImages";
import { BookOpen, Target, Users, Globe, FileText, Download, Heart } from "lucide-react";

const STUDENTS_IMAGE =
  "https://images.unsplash.com/photo-1716654716581-3c92ba53de10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export default function Page() {
  return (
    <>
      <PageHero
        title="Qui sommes-nous"
        subtitle={siteConfig.description}
        background={heroImages.about}
      />

      {/* ── Notre histoire ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 lg:gap-24 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Histoire</p>
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3 uppercase tracking-tight">
                Depuis <em className="not-italic italic text-brand-primary">1961</em>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-7">Plus de six décennies au service de la jeunesse chrétienne</p>
              <div className="w-12 h-[2px] bg-gradient-to-r from-brand-primary to-transparent mb-7" />
              <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                <p>
                  L&apos;Association Chrétienne des Élèves et Étudiants Protestants de Côte d&apos;Ivoire (ACEEPCI) a été fondée le{" "}
                  <span className="text-foreground font-semibold">{siteConfig.founded}</span>, avec pour mission de rassembler les jeunes chrétiens protestants des établissements scolaires et universitaires.
                </p>
                <p>
                  Née dans un contexte post-indépendance, l&apos;ACEEPCI s&apos;impose comme un acteur majeur de l&apos;évangélisation en milieu scolaire et estudiantin, tout en formant des leaders spirituels et intellectuels.
                </p>
                <p>
                  Aujourd&apos;hui, avec plus de{" "}
                  <span className="text-brand-primary font-semibold">5 000 membres actifs</span>{" "}
                  répartis dans{" "}
                  <span className="text-brand-primary font-semibold">88 départements</span>{" "}
                  à travers la Côte d&apos;Ivoire, l&apos;ACEEPCI continue de transformer des vies par l&apos;Évangile.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-primary rounded-tr-2xl z-10" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-brand-primary rounded-bl-2xl z-10" />
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl bg-brand-primary/10 border border-brand-primary/15" />
              <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(24,64,112,0.14)]">
                <ImageWithFallback src={STUDENTS_IMAGE} alt="Étudiants ACEEPCI" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Vision, Mission & Valeurs ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Fondements</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Vision, mission & <em className="not-italic italic text-brand-primary">valeurs</em>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-xl mx-auto">
              Les piliers qui guident notre engagement
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Target,
                label: "Notre Vision",
                num: "01",
                text: "Gagner l'école ivoirienne à Christ et former les leaders intellectuels de demain, en établissant une génération de jeunes ancrés dans la foi et engagés pour la transformation de leur nation.",
              },
              {
                icon: BookOpen,
                label: "Notre Mission",
                num: "02",
                text: `Évangéliser et former spirituellement les élèves et étudiants, développer leur leadership, et créer une communauté de foi vivante guidée par notre devise : ${siteConfig.tagline}.`,
              },
              {
                icon: Heart,
                label: "Nos Valeurs",
                num: "03",
                text: "Connaître la Parole, aimer Dieu et son prochain, servir l'Église et la société : des valeurs vécues au quotidien dans nos départements et au cœur de chaque activité.",
              },
            ].map(({ icon: Icon, label, num, text }) => (
              <div
                key={label}
                className="group relative flex flex-col bg-white border border-border rounded-2xl p-8 sm:p-9 overflow-hidden hover:border-brand-primary/30 hover:shadow-[0_20px_50px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-primary via-brand-accent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-6 right-6 font-serif text-5xl font-bold leading-none text-brand-primary/[0.07] select-none pointer-events-none">
                  {num}
                </span>
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_6px_18px_rgba(24,64,112,0.28)] flex items-center justify-center mb-6 group-hover:shadow-[0_8px_24px_rgba(24,64,112,0.35)] transition-shadow">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-2 uppercase tracking-tight">
                  {label}
                </h3>
                <div className="w-10 h-[2px] bg-brand-primary/60 mb-4 group-hover:w-14 transition-all duration-300" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Notre devise ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Devise</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Notre <em className="not-italic italic text-brand-primary">devise</em>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base">Les trois piliers de notre engagement</p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { num: "01", title: "Connaître", text: "Approfondir notre connaissance de Dieu et de sa Parole" },
              { num: "02", title: "Aimer",     text: "Cultiver l'amour de Dieu et du prochain dans la communion" },
              { num: "03", title: "Servir",    text: "Mettre nos talents au service du Royaume de Dieu" },
            ].map((item, i) => (
              <div
                key={item.num}
                className={`group relative flex flex-col rounded-2xl border overflow-hidden p-8 sm:p-9 text-center transition-all duration-300 hover:-translate-y-1 ${
                  i === 1
                    ? "bg-brand-subtle border-brand-primary/25 shadow-[0_8px_32px_rgba(24,64,112,0.12)] hover:shadow-[0_20px_50px_rgba(24,64,112,0.18)] md:-translate-y-2"
                    : "bg-white border-border hover:border-brand-primary/25 hover:shadow-[0_20px_50px_rgba(24,64,112,0.12)]"
                }`}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-primary via-brand-accent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-6 right-6 font-serif text-5xl font-bold leading-none text-brand-primary/[0.07] select-none pointer-events-none">
                  {item.num}
                </span>
                <div className="font-serif text-4xl sm:text-5xl font-bold text-brand-primary mb-5">{item.num}</div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3 uppercase tracking-tight">{item.title}</h3>
                <div className="w-10 h-[2px] bg-brand-primary/60 mx-auto mb-4 group-hover:w-14 transition-all duration-300" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Partenaires ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Affiliations</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Nos <em className="not-italic italic text-brand-primary">partenaires</em>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-xl mx-auto">Nous sommes affiliés à des organisations reconnues</p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { name: "FUACE",    desc: "Fédération des Unions Chrétiennes d'Afrique de l'Ouest et du Centre",            icon: Globe    },
              { name: "FEMAJECI", desc: "Fédération des Ministères et Œuvres de Jeunesse Évangéliques de Côte d'Ivoire",  icon: Users    },
              { name: "ÉMU-CI",   desc: "Église Méthodiste Unie de Côte d'Ivoire",                                        icon: BookOpen },
            ].map(({ name, desc, icon: Icon }, i) => (
              <div
                key={name}
                className="group relative flex flex-col bg-white border border-border rounded-2xl p-8 sm:p-9 text-center overflow-hidden hover:border-brand-primary/30 hover:shadow-[0_20px_50px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-primary to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-6 right-6 font-serif text-5xl font-bold leading-none text-brand-primary/[0.07] select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary/15 to-brand-accent/10 border border-brand-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:from-brand-primary/25 group-hover:scale-105 transition-all duration-300">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">{name}</h3>
                <div className="w-10 h-[2px] bg-brand-primary/60 mx-auto mb-4 group-hover:w-14 transition-all duration-300" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Organisation ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Structure</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Notre <em className="not-italic italic text-brand-primary">organisation</em>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-xl mx-auto">Une structure efficace au service de notre mission</p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              { num: "01", title: "Bureau National",       text: "Direction stratégique et coordination des activités nationales" },
              { num: "02", title: "Bureaux Régionaux",     text: "Coordination des départements par zone géographique" },
              { num: "03", title: "88+ Départements",      text: "Présents dans les établissements à travers le pays" },
              { num: "04", title: "5 000+ Membres actifs", text: "Élèves, étudiants et alumni engagés dans la mission" },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative flex flex-col bg-brand-subtle/60 border border-border rounded-2xl p-6 sm:p-7 overflow-hidden hover:border-brand-primary/25 hover:shadow-[0_12px_40px_rgba(24,64,112,0.1)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-serif text-3xl font-bold text-brand-primary/30 group-hover:text-brand-primary/50 transition-colors leading-none mb-4">
                  {item.num}
                </span>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2 uppercase tracking-tight">{item.title}</h3>
                <div className="w-8 h-[2px] bg-brand-primary/50 mb-3 group-hover:w-12 transition-all duration-300" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Documents officiels ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Ressources</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Documents <em className="not-italic italic text-brand-primary">officiels</em>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base">Téléchargez nos statuts et règlement intérieur</p>
          </header>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Statuts de l'ACEEPCI",  meta: "PDF — Mise à jour 2025" },
              { title: "Règlement intérieur",    meta: "PDF — Mise à jour 2025" },
            ].map((doc) => (
              <a
                key={doc.title}
                href="#"
                className="group flex items-center gap-5 bg-white border border-border rounded-2xl p-6 sm:p-7 hover:border-brand-primary/30 hover:shadow-[0_16px_48px_rgba(24,64,112,0.12)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_6px_18px_rgba(24,64,112,0.28)] flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_8px_24px_rgba(24,64,112,0.35)] transition-shadow">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base font-bold text-foreground mb-1">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground">{doc.meta}</p>
                </div>
                <Download className="w-5 h-5 text-brand-primary group-hover:translate-y-[-2px] transition-transform flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Siège national ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-brand-subtle border border-border rounded-2xl p-8 sm:p-10 md:p-12 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary via-brand-accent to-transparent rounded-t-2xl" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-1 rounded-full bg-brand-primary" />
                  <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Adresse</p>
                  <span className="w-1 h-1 rounded-full bg-brand-primary" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4 uppercase tracking-tight">
                  Siège <em className="not-italic italic text-brand-primary">national</em>
                </h2>
                <div className="pl-4 border-l-4 border-brand-primary/30 space-y-2">
                  <p className="text-sm text-muted-foreground">MAPE, Boulevard de l&apos;Université</p>
                  <p className="text-sm text-muted-foreground">Abidjan-Cocody, face CHU de Cocody</p>
                  <a href="tel:+22527224443478" className="inline-block text-sm font-semibold text-brand-primary mt-3 hover:underline">
                    (+225) 27 22 44 43 78
                  </a>
                </div>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-lg font-semibold text-foreground hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 self-start md:self-center"
              >
                Nous contacter
                <span className="text-lg">→</span>
              </a>
            </div>
          </div>
        </div>
      </AnimateSection>
    </>
  );
}