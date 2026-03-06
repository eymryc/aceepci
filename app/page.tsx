import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import Link from "next/link";
import {
  Users,
  Calendar,
  MapPin,
  Heart,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Target,
  Quote,
} from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";
import NewsCarousel from "@/components/NewsCarousel";
import { PartnersCarousel } from "@/components/PartnersCarousel";
import PhotoGallerySection from "@/components/PhotoGallerySection";
import NewsletterSection from "@/components/NewsletterSection";
import { AnimateSection } from "@/components/AnimateSection";

export default function Page() {
  const stats = [
    { icon: Calendar, label: "Années d'existence", value: "60+" },
    { icon: Users, label: "Membres actifs", value: "5 000+" },
    { icon: MapPin, label: "Départements", value: "88+" },
    { icon: BookOpen, label: "Éditions du Camp", value: "57+" },
  ];

  const recentPhotos = [
    {
      image: "https://images.unsplash.com/photo-1750284743584-10142975ecd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB5b3V0aCUyMHdvcnNoaXAlMjBoYW5kcyUyMHJhaXNlZHxlbnwxfHx8fDE3NzI0NzE0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Louange et Adoration"
    },
    {
      image: "https://images.unsplash.com/photo-1716654716581-3c92ba53de10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjQ3MTQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Étude Biblique"
    },
    {
      image: "https://images.unsplash.com/photo-1766189790516-8878365618c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwY2hyaXN0aWFuJTIwY2FtcCUyMG5hdHVyZXxlbnwxfHx8fDE3NzI0NzE0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Camp Biblique"
    },
    {
      image: "https://images.unsplash.com/photo-1722962674485-d34e69a9a406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWJsZSUyMHN0dWR5JTIwZ3JvdXAlMjB5b3VuZyUyMGFkdWx0c3xlbnwxfHx8fDE3NzI0NzE0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Groupe de Prière"
    }
  ];

  const newsArticles = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1677981263393-c63c5470d247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBhbm5vdW5jZW1lbnQlMjBuZXdzJTIwYnVsbGV0aW4lMjBib2FyZHxlbnwxfHx8fDE3NzI0NzU3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Ouverture des inscriptions Camp 2026",
      date: "28 Février 2026",
      category: "Annonce",
      excerpt: "Les inscriptions pour le Camp Biblique National 2026 sont ouvertes. Ne manquez pas cette opportunité unique de croissance spirituelle.",
      slug: "/news/ouverture-inscriptions-camp-2026"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjBjb25mZXJlbmNlJTIwc3BlYWtlciUyMGV2ZW50fGVufDF8fHx8MTc3MjQ3NTc2OHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Nouveau Bureau Exécutif National élu",
      date: "15 Février 2026",
      category: "Actualité",
      excerpt: "L'ACEEPCI a élu son nouveau Bureau Exécutif National pour le mandat 2026-2028. Découvrez la nouvelle équipe dirigeante.",
      slug: "/news/nouveau-bureau-executif-national"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1763517777039-68b938508a6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMG1pbmlzdHJ5JTIwY29tbXVuaXR5JTIwZ2aérinnfGVufDF8fHx8MTc3MjQ3NTc3MHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Journée d'évangélisation dans 50 écoles",
      date: "1 Février 2026",
      category: "Événement",
      excerpt: "Une grande campagne d'évangélisation a touché plus de 10 000 élèves à travers la Côte d'Ivoire. Témoignages inspirants.",
      slug: "/news/journee-evangelisation-50-ecoles"
    }
  ];

  const partners = [
    { name: "Église Baptiste", logo: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=200&h=100&fit=crop" },
    { name: "Alliance Évangélique", logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=100&fit=crop" },
    { name: "Jeunesse en Mission", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=100&fit=crop" },
    { name: "Mission Bible", logo: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=200&h=100&fit=crop" },
    { name: "Campus Crusade", logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=100&fit=crop" },
    { name: "Navigators", logo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=100&fit=crop" },
  ];

  return (
    <div>
      <HeroSlider />



      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">

        {/* Top rule */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        {/* Dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ── Text column ── */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">
                  Parole du jour
                </p>
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
              </div>

              {/* Title */}
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-8 uppercase tracking-tight">
                Verset du <em className="not-italic italic text-brand-primary">jour</em>
              </h2>

              {/* Verse 1 */}
              <div className="relative mb-8 pl-6 border-l-2 border-brand-primary">
                {/* Big decorative quote mark */}
                <span className="absolute -top-4 -left-3 font-serif text-[5rem] leading-none text-brand-primary/15 select-none pointer-events-none">&ldquo;</span>
                <blockquote className="font-serif text-lg md:text-xl italic text-foreground leading-relaxed mb-3 relative z-10">
                  Car Dieu a tant aimé le monde qu&apos;il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu&apos;il ait la vie éternelle.
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-brand-primary" />
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-primary">Jean 3:16</p>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-brand-primary/30 to-transparent" />
                <BookOpen className="w-4 h-4 text-brand-primary/50" strokeWidth={1.5} />
                <div className="flex-1 h-px bg-gradient-to-l from-brand-primary/30 to-transparent" />
              </div>

              {/* Verse 2 */}
              <div className="relative pl-6 border-l-2 border-brand-primary/35">
                <span className="absolute -top-4 -left-3 font-serif text-[5rem] leading-none text-brand-primary/10 select-none pointer-events-none">&ldquo;</span>
                <blockquote className="font-serif text-base italic text-muted-foreground leading-relaxed mb-3 relative z-10">
                  Ne sois pas de ceux qui se détournent et qui sont perdus.
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-brand-primary/50" />
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-primary/80">Luc 13:23</p>
                </div>
              </div>
            </div>

            {/* ── Image column ── */}
            <div className="relative">
              {/* Decorative corner frames */}
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-primary rounded-tr-2xl z-10" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-brand-primary rounded-bl-2xl z-10" />
              {/* Shadow frame */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl bg-brand-primary/10 border border-brand-primary/15" />

              <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(11,27,46,0.12)]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWJsZSUyMG9wZW4lMjByZWFkaW5nfGVufDF8fHx8MTc3MjQ3MTQ3NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Bible ouverte"
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent" />
                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(11,27,46,0.75)] to-transparent px-6 py-5">
                  <p className="text-xs font-medium tracking-[0.18em] uppercase text-white mb-0.5">La Parole</p>
                  <p className="font-serif text-base font-semibold text-white">« Ta parole est une lampe à mes pieds »</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </AnimateSection>



      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-24 px-4 sm:px-6 lg:px-8">

        {/* Orbs */}
        <div className="pointer-events-none absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.18)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.12)_0%,transparent_70%)]" />
        {/* Top rule */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(245,240,232,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(245,240,232,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-1 rounded-full bg-brand-accent" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">
                  ACEEPCI · Depuis 1961
                </p>
                <span className="w-1 h-1 rounded-full bg-brand-accent" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight uppercase tracking-tight">
                60 ans d&apos;<em className="not-italic italic text-brand-light">impact</em>{" "}
                <span className="block text-white">en Côte d&apos;Ivoire</span>
              </h2>
            </div>
            <p className="text-sm font-bold text-white max-w-xs leading-relaxed sm:text-right">
              Depuis 1961, l&apos;ACEEPCI transforme des vies et forme des leaders
            </p>
          </div>

          {/* ── Stats grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.07] rounded-2xl overflow-hidden border-2 border-white/50">
            {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={index}
                className={`group relative bg-brand-primary-dark flex flex-col items-center justify-center gap-4 px-6 py-10 hover:bg-brand-primary/10 transition-colors duration-300 overflow-hidden border-r-2 border-white/40 ${index % 2 === 1 ? "max-lg:border-r-0" : ""} ${index % 4 === 3 ? "lg:border-r-0" : ""}`}
              >
                {/* Hover top accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-12 h-[2px] bg-brand-accent transition-all duration-300 rounded-full" />

                {/* Big bg number */}
                <span className="absolute bottom-2 right-4 font-serif text-[4rem] font-bold leading-none text-white/[0.07] select-none pointer-events-none">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-brand-primary/15 border-2 border-brand-primary/50 flex items-center justify-center group-hover:bg-brand-primary/25 group-hover:border-brand-primary/60 group-hover:scale-110 transition-all duration-300">
                  <StatIcon className="w-6 h-6 text-brand-light" />
                </div>

                {/* Value */}
                <div className="font-serif text-4xl font-bold text-brand-light leading-none">
                  {stat.value}
                </div>

                {/* Label */}
                <p className="text-xs font-light tracking-wider text-center text-white group-hover:text-white transition-colors uppercase leading-snug">
                  {stat.label}
                </p>
              </div>
            );
          })}
          </div>

          {/* ── Bottom timeline hint ── */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-white/50" />
            <p className="font-serif text-sm italic text-white px-4 text-center">
              Une histoire d&apos;engagement depuis 1961
            </p>
            <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent to-white/50" />
          </div>

        </div>
      </AnimateSection>



      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">

        {/* Top rule */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        {/* Dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ── Image column ── */}
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-brand-primary/20" />
              {/* Corner accent */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-brand-primary rounded-tl-2xl" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-brand-primary rounded-br-2xl" />

              <div className="relative rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758599668337-58bfa42683ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlb3BsZSUyMGNvbW11bml0eSUyMHNlcnZpY2UlMjBoZWxwaW5nfGVufDF8fHx8MTc3MjQ3MTQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Président ACEEPCI"
                  className="w-full h-[480px] object-cover"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[rgba(11,27,46,0.65)] to-transparent" />
                {/* Label on image */}
                <div className="absolute bottom-5 left-5">
                  <p className="text-xs font-medium tracking-[0.15em] uppercase text-white mb-0.5">Le Président</p>
                  <p className="font-serif text-lg font-semibold text-white">ACEEPCI</p>
                </div>
                {/* Experience badge */}
                <div className="absolute top-5 right-5 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-brand-primary shadow-[0_6px_20px_rgba(24,64,112,0.4)]">
                  <span className="font-serif text-lg font-bold text-white leading-none">60+</span>
                  <span className="text-[0.55rem] font-medium text-white uppercase tracking-wide">ans</span>
                </div>
              </div>
            </div>

            {/* ── Text column ── */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">
                  Message du Président
                </p>
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
              </div>

              {/* Title */}
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6 uppercase tracking-tight">
                Bienvenue à <em className="not-italic italic text-brand-primary">l&apos;ACEEPCI</em>
              </h2>

              {/* Divider */}
              <div className="w-12 h-[2px] bg-gradient-to-r from-brand-primary to-transparent mb-7" />

              {/* Quote icon */}
              <div className="mb-5">
                <Quote className="w-8 h-8 text-brand-primary/30" strokeWidth={1.5} />
              </div>

              {/* Body text */}
              <div className="space-y-4 text-sm font-bold text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground">Chers frères et sœurs, chers amis de l&apos;ACEEPCI,</p>
                <p>
                  C&apos;est avec une grande joie que je vous accueille sur notre plateforme digitale.
                  Depuis plus de 60 ans, l&apos;ACEEPCI s&apos;engage à gagner l&apos;école ivoirienne à Christ
                  et à former des leaders spirituels et intellectuels.
                </p>
                <p>
                  Notre vision reste inchangée : transformer des vies par l&apos;Évangile,
                  équiper les jeunes pour un leadership d&apos;excellence, et bâtir une communauté
                  de foi vivante et engagée.
                </p>
              </div>

              {/* Featured quote */}
              <div className="mt-6 pl-5 border-l-2 border-brand-primary">
                <p className="font-serif text-lg italic text-brand-primary leading-snug">
                  « Ma jeunesse pour Jésus-Christ »
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(24,64,112,0.28)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.45)] hover:-translate-y-0.5 transition-all group"
                >
                  En savoir plus
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </AnimateSection>


      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">

        {/* Top rule */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        {/* Subtle dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">
                  ACEEPCI · Vision
                </p>
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
                Notre <em className="not-italic italic text-brand-primary">mission</em>
              </h2>
            </div>
            <p className="text-sm font-bold text-muted-foreground max-w-xs leading-relaxed sm:text-right">
              Trois piliers fondamentaux guident notre action quotidienne
            </p>
          </div>

          {/* ── Cards ── */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 – Connaître */}
            <div className="group relative bg-white rounded-xl border border-border p-8 hover:shadow-[0_16px_48px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Background number */}
              <span className="absolute top-4 right-5 font-serif text-[5rem] font-bold leading-none text-brand-primary/8 select-none pointer-events-none">01</span>
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary to-transparent rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_6px_18px_rgba(24,64,112,0.28)] flex items-center justify-center mb-6">
                <BookOpen className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Connaître</h3>
              <div className="w-8 h-[2px] bg-brand-primary mb-4 transition-all duration-300 group-hover:w-14" />
              <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                Approfondir la connaissance de Dieu à travers l&apos;étude biblique,
                les formations spirituelles et l&apos;enseignement de la Parole.
              </p>
            </div>

            {/* Card 2 – Aimer (featured, dark) */}
            <div className="group relative bg-brand-primary-dark rounded-xl border border-brand-primary/25 p-8 hover:shadow-[0_16px_48px_rgba(24,64,112,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden md:-translate-y-3">
              {/* Orb */}
              <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.2)_0%,transparent_70%)]" />
              {/* Background number */}
              <span className="absolute top-4 right-5 font-serif text-[5rem] font-bold leading-none text-brand-primary/12 select-none pointer-events-none">02</span>
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary to-brand-accent rounded-t-xl" />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_6px_18px_rgba(24,64,112,0.4)] flex items-center justify-center mb-6">
                <Heart className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Aimer</h3>
              <div className="w-8 h-[2px] bg-brand-light mb-4 transition-all duration-300 group-hover:w-14" />
              <p className="text-sm font-bold text-white leading-relaxed">
                Cultiver l&apos;amour de Dieu et du prochain à travers la communion fraternelle,
                le service et l&apos;entraide communautaire.
              </p>
            </div>

            {/* Card 3 – Servir */}
            <div className="group relative bg-white rounded-xl border border-border p-8 hover:shadow-[0_16px_48px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Background number */}
              <span className="absolute top-4 right-5 font-serif text-[5rem] font-bold leading-none text-brand-primary/8 select-none pointer-events-none">03</span>
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary to-transparent rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_6px_18px_rgba(24,64,112,0.28)] flex items-center justify-center mb-6">
                <Target className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Servir</h3>
              <div className="w-8 h-[2px] bg-brand-primary mb-4 transition-all duration-300 group-hover:w-14" />
              <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                Mettre nos talents au service du Royaume à travers l&apos;évangélisation,
                les missions et l&apos;engagement social.
              </p>
            </div>

          </div>

          {/* ── Bottom quote ── */}
          <div className="mt-16 flex items-center gap-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
            <p className="font-serif text-sm italic text-muted-foreground text-center px-4">
              « Connaître, Aimer, Servir — telle est notre vocation »
            </p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
          </div>

        </div>
      </AnimateSection>



      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-20 px-4 sm:px-6 lg:px-8">

        {/* Orbs */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.18)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.12)_0%,transparent_70%)]" />
        {/* Top rule */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(245,240,232,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(245,240,232,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ── Eyebrow ── */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-light" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">
                Passez à l&apos;action
              </p>
              <span className="w-1 h-1 rounded-full bg-brand-light" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* ── Card 1 : Rejoignez-nous ── */}
            <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 overflow-hidden hover:border-brand-primary/35 hover:bg-white/8 transition-all duration-300">
              {/* Card glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top-left,rgba(24,64,112,0.12)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-brand-primary via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Big background number */}
              <span className="absolute bottom-4 right-6 font-serif text-[7rem] font-bold leading-none text-white/[0.04] select-none pointer-events-none">01</span>

              <div className="relative flex items-start gap-5">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                    Rejoignez-nous
                  </h3>
                  <div className="w-8 h-[2px] bg-brand-light mb-4 transition-all duration-300 group-hover:w-14" />
                  <p className="text-sm font-bold text-white leading-relaxed mb-6">
                    Devenez membre de l&apos;ACEEPCI et faites partie d&apos;une communauté
                    de plus de <span className="text-brand-light font-medium">5 000 jeunes</span> engagés pour Christ.
                  </p>
                  <Link
                    href="/members"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-brand-primary text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-brand-subtle hover:text-brand-primary-dark hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all group/btn"
                  >
                    Adhérer maintenant
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Card 2 : Soutenez ── */}
            <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 overflow-hidden hover:border-brand-primary/35 hover:bg-white/8 transition-all duration-300">
              {/* Card glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top-left,rgba(24,64,112,0.12)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-brand-primary via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Big background number */}
              <span className="absolute bottom-4 right-6 font-serif text-[7rem] font-bold leading-none text-white/[0.04] select-none pointer-events-none">02</span>

              <div className="relative flex items-start gap-5">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-brand-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                    Soutenez notre mission
                  </h3>
                  <div className="w-8 h-[2px] bg-brand-light mb-4 transition-all duration-300 group-hover:w-14" />
                  <p className="text-sm font-bold text-white leading-relaxed mb-6">
                    Votre don aide à financer nos activités, nos camps bibliques
                    et le soutien aux <span className="text-brand-light font-medium">élèves défavorisés</span>.
                  </p>
                  <Link
                    href="/payments"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-brand-primary text-sm font-medium rounded-sm border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-brand-subtle hover:text-brand-primary-dark hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all group/btn"
                  >
                    Faire un don
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </AnimateSection>

      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="section-title-left text-foreground">Nos activités en images</h2>
            <p className="text-lg text-muted-foreground">Découvrez les moments forts de notre communauté</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentPhotos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                <ImageWithFallback
                  src={photo.image}
                  alt={`Activité ACEEPCI ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-sm font-semibold px-2 py-1 rounded-b-xl">
                  {photo.title}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/news" className="inline-flex items-center text-brand-primary hover:text-brand-primary-dark font-semibold transition-colors">
              Voir toutes les photos <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section> */}
      <PhotoGallerySection />

      {/* <section className="py-16 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary rounded-2xl mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="section-title-left text-foreground">Restez informés</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Inscrivez-vous à notre newsletter mensuelle pour recevoir nos actualités,
            événements et ressources spirituelles
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary bg-background"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-brand-primary text-white rounded-xl hover:opacity-90 transition-opacity font-semibold"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section> */}

      <NewsletterSection />

      <AnimateSection className="py-16" as="div">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight pl-4 border-l-4 border-brand-primary mb-4">Actualités récentes</h2>
            <p className="text-lg text-muted-foreground">Découvrez les dernières nouvelles de l&apos;ACEEPCI</p>
          </div>
          {/* <NewsCarousel articles={newsArticles} /> */}
          <NewsCarousel articles={newsArticles} />
        </div>
      </AnimateSection>

      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-20 px-4 sm:px-6 lg:px-8">

        {/* Top rule */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">
                  ACEEPCI · Écosystème
                </p>
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
                Nos <em className="not-italic italic text-brand-primary">partenaires</em>
              </h2>
              <p className="text-base font-light text-muted-foreground mt-2">
                Ils nous accompagnent dans notre mission
              </p>
            </div>
            {/* Count badge */}
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/25 text-brand-primary text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-sm self-start sm:self-auto">
              {partners.length} partenaires
            </div>
          </div>

          {/* ── Logo grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[1px] bg-border/50 rounded-xl overflow-hidden border border-border">
            {partners.map((p) => (
              <div
                key={p.name}
                className="group relative bg-background flex flex-col items-center justify-center gap-3 px-6 py-8 hover:bg-brand-primary/5 transition-colors duration-300 cursor-default"
              >
                {/* Logo */}
                <div className="w-16 h-10 flex items-center justify-center">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-w-full max-h-full object-contain opacity-50 grayscale group-hover:opacity-90 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                {/* Name */}
                <p className="text-[0.65rem] font-light tracking-wide text-center text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-snug">
                  {p.name}
                </p>
                {/* Bottom accent on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-8 h-[2px] bg-brand-primary transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5">
            <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-r from-transparent to-border" />
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-sm font-bold text-muted-foreground">
                Vous souhaitez devenir partenaire ?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_20px_rgba(24,64,112,0.25)] hover:shadow-[0_6px_28px_rgba(24,64,112,0.4)] hover:-translate-y-0.5 transition-all group"
              >
                Contactez-nous
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-l from-transparent to-border" />
          </div>

        </div>
      </AnimateSection>
    </div>
  );
}
