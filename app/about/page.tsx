import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { siteConfig } from "@/config/site";
import { heroImages } from "@/config/heroImages";
import { BookOpen, Target, Users, Globe, FileText, Download } from "lucide-react";

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
      <AnimateSection className="relative bg-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Histoire</p>
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6 uppercase tracking-tight">
                Depuis <em className="not-italic italic text-brand-primary">1961</em>
              </h2>
              <div className="w-12 h-[2px] bg-gradient-to-r from-brand-primary to-transparent mb-7" />
              <div className="space-y-4 text-sm font-bold text-muted-foreground leading-relaxed">
                <p>
                  L&apos;Association Chrétienne des Élèves et Étudiants Protestants de Côte d&apos;Ivoire (ACEEPCI) a été fondée le{" "}
                  <strong className="text-foreground font-medium">{siteConfig.founded}</strong>, avec pour mission de rassembler les jeunes chrétiens protestants des établissements scolaires et universitaires.
                </p>
                <p>
                  Née dans un contexte post-indépendance, l&apos;ACEEPCI s&apos;impose comme un acteur majeur de l&apos;évangélisation en milieu scolaire et estudiantin, tout en formant des leaders spirituels et intellectuels.
                </p>
                <p>
                  Aujourd&apos;hui, avec plus de{" "}
                  <strong className="text-foreground font-medium">5 000 membres actifs</strong>{" "}
                  répartis dans{" "}
                  <strong className="text-foreground font-medium">88 départements</strong>{" "}
                  à travers la Côte d&apos;Ivoire, l&apos;ACEEPCI continue de transformer des vies par l&apos;Évangile.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-primary rounded-tr-2xl z-10" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-brand-primary rounded-bl-2xl z-10" />
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl bg-brand-primary/10 border border-brand-primary/15" />
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(24,64,112,0.12)]">
                <ImageWithFallback src={STUDENTS_IMAGE} alt="Étudiants ACEEPCI" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Vision & Mission ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Fondements</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Vision & <em className="not-italic italic text-brand-primary">Mission</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: Target,
                label: "Notre Vision",
                text: "Gagner l'école ivoirienne à Christ et former les leaders intellectuels de demain, en établissant une génération de jeunes ancrés dans la foi et engagés pour la transformation de leur nation.",
              },
              {
                icon: BookOpen,
                label: "Notre Mission",
                text: `Évangéliser et former spirituellement les élèves et étudiants, développer leur leadership, et créer une communauté de foi vivante guidée par notre devise : ${siteConfig.tagline}.`,
              },
            ].map(({ icon: Icon, label, text }) => (
              <div key={label} className="group relative bg-white border border-border rounded-2xl p-8 overflow-hidden hover:border-brand-primary/25 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-4 right-5 font-serif text-[5rem] font-bold leading-none text-brand-primary/[0.06] select-none pointer-events-none">
                  {label === "Notre Vision" ? "01" : "02"}
                </span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_6px_18px_rgba(24,64,112,0.28)] flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">{label}</h3>
                <div className="w-8 h-[2px] bg-brand-primary mb-4 transition-all duration-300 group-hover:w-14" />
                <p className="text-sm font-bold text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Notre devise ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Devise</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Notre <em className="not-italic italic text-brand-primary">devise</em>
            </h2>
            <p className="text-sm font-bold text-muted-foreground">Les trois piliers de notre engagement</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Connaître", text: "Approfondir notre connaissance de Dieu et de sa Parole" },
              { num: "02", title: "Aimer",     text: "Cultiver l'amour de Dieu et du prochain dans la communion" },
              { num: "03", title: "Servir",    text: "Mettre nos talents au service du Royaume de Dieu" },
            ].map((item, i) => (
              <div
                key={item.num}
                className={`group relative rounded-xl border overflow-hidden p-8 text-center transition-all duration-300 hover:-translate-y-1 ${
                  i === 1
                    ? "bg-brand-primary-dark border-brand-primary/25 hover:shadow-[0_16px_48px_rgba(24,64,112,0.25)] md:-translate-y-3"
                    : "bg-white border-border hover:shadow-[0_16px_48px_rgba(24,64,112,0.12)]"
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent ${i === 1 ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`} />
                <span className={`absolute bottom-3 right-4 font-serif text-[4.5rem] font-bold leading-none select-none pointer-events-none ${i === 1 ? "text-white/[0.06]" : "text-brand-primary/8"}`}>
                  {item.num}
                </span>
                <div className="font-serif text-5xl font-bold text-brand-primary mb-4">{item.num}</div>
                <h3 className={`font-serif text-2xl font-bold mb-3 ${i === 1 ? "text-white" : "text-foreground"}`}>{item.title}</h3>
                <div className="w-8 h-[2px] bg-brand-primary mx-auto mb-4 transition-all duration-300 group-hover:w-14" />
                <p className={`text-sm font-bold leading-relaxed ${i === 1 ? "text-white" : "text-muted-foreground"}`}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Partenaires ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Affiliations</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Nos <em className="not-italic italic text-brand-primary">partenaires</em>
            </h2>
            <p className="text-sm font-bold text-muted-foreground">Nous sommes affiliés à des organisations reconnues</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "FUACE",    desc: "Fédération des Unions Chrétiennes d'Afrique de l'Ouest et du Centre",            icon: Globe    },
              { name: "FEMAJECI", desc: "Fédération des Ministères et Œuvres de Jeunesse Évangéliques de Côte d'Ivoire",  icon: Users    },
              { name: "ÉMU-CI",   desc: "Église Méthodiste Unie de Côte d'Ivoire",                                        icon: BookOpen },
            ].map(({ name, desc, icon: Icon }, i) => (
              <div key={name} className="group relative bg-white border border-border rounded-2xl p-8 text-center overflow-hidden hover:border-brand-primary/25 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-12 h-[2px] bg-brand-primary transition-all duration-300 rounded-full" />
                <span className="absolute bottom-3 right-4 font-serif text-[4rem] font-bold leading-none text-brand-primary/[0.06] select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-14 h-14 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-primary/15 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">{name}</h3>
                <div className="w-6 h-[2px] bg-brand-primary/40 mx-auto mb-3" />
                <p className="text-xs font-bold text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Organisation ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Structure</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Notre <em className="not-italic italic text-brand-primary">organisation</em>
            </h2>
            <p className="text-sm font-bold text-muted-foreground">Une structure efficace au service de notre mission</p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { num: "01", title: "Bureau National",     text: "Assure la direction stratégique et la coordination des activités nationales" },
              { num: "02", title: "Bureaux Régionaux",   text: "Coordonnent les départements de leur zone géographique" },
              { num: "03", title: "88+ Départements",    text: "Présents dans les établissements scolaires et universitaires à travers le pays" },
              { num: "04", title: "5 000+ Membres actifs", text: "Élèves, étudiants et alumni engagés dans la mission de l'ACEEPCI" },
            ].map((item) => (
              <div key={item.title} className="group flex items-start gap-5 bg-white border border-border rounded-xl p-5 hover:shadow-[0_8px_28px_rgba(24,64,112,0.1)] hover:border-brand-primary/25 transition-all duration-300">
                <span className="font-serif text-2xl font-bold text-brand-primary/40 flex-shrink-0 group-hover:text-brand-primary transition-colors duration-300 leading-none mt-0.5">
                  {item.num}
                </span>
                <div className="w-[2px] self-stretch bg-brand-primary/20 group-hover:bg-brand-primary transition-colors duration-300 flex-shrink-0 rounded-full" />
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm font-bold text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Documents officiels ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Ressources</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 uppercase tracking-tight">
              Documents <em className="not-italic italic text-brand-primary">officiels</em>
            </h2>
            <p className="text-sm font-bold text-muted-foreground">Téléchargez nos statuts et règlement intérieur</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Statuts de l'ACEEPCI",  meta: "PDF — Mise à jour 2025" },
              { title: "Règlement intérieur",    meta: "PDF — Mise à jour 2025" },
            ].map((doc) => (
              <a
                key={doc.title}
                href="#"
                className="group flex items-center gap-4 bg-white border border-border rounded-xl p-5 hover:border-brand-primary/25 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_4px_12px_rgba(24,64,112,0.28)] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground mb-0.5">{doc.title}</h3>
                  <p className="text-xs font-bold text-muted-foreground">{doc.meta}</p>
                </div>
                <Download className="w-4 h-4 text-brand-primary group-hover:text-brand-primary-dark transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Siège national ── */}
      <AnimateSection className="relative bg-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Adresse</p>
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4 uppercase tracking-tight">
                Siège <em className="not-italic italic text-brand-primary">national</em>
              </h2>
              <div className="pl-4 border-l-2 border-brand-primary/40 space-y-1">
                <p className="text-sm font-bold text-muted-foreground">MAPE, Boulevard de l&apos;Université</p>
                <p className="text-sm font-bold text-muted-foreground">Abidjan-Cocody, face CHU de Cocody</p>
                <p className="text-sm font-medium text-foreground mt-2">(+225) 27 22 44 43 78</p>
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>
    </>
  );
}