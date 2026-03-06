"use client";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";
import { Calendar, MapPin, Users, Music, Trophy, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";

const upcomingEvents = [
  {
    title: "Camp Biblique National 2026",
    date: "15-22 Août 2026",
    location: "Yamoussoukro",
    category: "Camp",
    participants: "500+ attendus",
    image: "https://images.unsplash.com/photo-1626303410150-44b5c9b065a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjBiaWJsZSUyMGNhbXAlMjB0ZW50cyUyMG91dGRvb3JzfGVufDF8fHx8MTc3MjQ3NTM3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Séminaire de Leadership",
    date: "5 Avril 2026",
    location: "Abidjan-Cocody",
    category: "Formation",
    participants: "150 places",
    image: "https://images.unsplash.com/photo-1765438863717-49fca900f861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHNlbWluYXIlMjB0cmFpbmluZyUyMHdvcmtzaG9wJTIwcHJlc2VudGF0aW9ufGVufDF8fHx8MTc3MjQ3NTM4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Concours National d'Hymnes",
    date: "20 Mai 2026",
    location: "Multiple villes",
    category: "Concours",
    participants: "30 départements",
    image: "https://images.unsplash.com/photo-1593678820334-91d5f99be314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9pciUyMHNpbmdpbmclMjBjb21wZXRpdGlvbiUyMGdvc3BlfGVufDF8fHx8MTc3MjQ3NTM4MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const partners = [
  { name: "Église Baptiste",      image: "https://images.unsplash.com/photo-1505427214476-47e71e07abfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { name: "Alliance Évangélique", image: "https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { name: "Jeunesse en Mission",  image: "https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { name: "Mission Bible",        image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { name: "Campus Crusade",       image: "https://images.unsplash.com/photo-1548544507-7de0e7a931d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { name: "Navigateurs",          image: "https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
];

const mainActivities = [
  {
    icon: Users,
    title: "Séminaires & Formations",
    desc: "Des sessions de formation régulières sur le leadership chrétien, la gestion administrative, et le développement personnel.",
    items: ["Leadership spirituel", "Gestion de projet", "Communication efficace", "Finances personnelles"],
    image: "https://images.unsplash.com/photo-1541697367348-dfc31a1611dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    icon: Heart,
    title: "Cultes & Prières",
    desc: "Des rencontres hebdomadaires de prière, d'adoration et d'enseignement dans chaque département.",
    items: ["Cultes hebdomadaires", "Groupes de prière", "Dévotions matinales", "Veillées de prière"],
    image: "https://images.unsplash.com/photo-1628716857016-198887e2bb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    icon: Trophy,
    title: "Concours & Prix",
    desc: "Des compétitions amicales pour encourager la créativité et l'excellence parmi nos membres.",
    items: ["Concours d'hymnes", "Concours de logo", "Prix d'excellence", "Palmarès annuel"],
    image: "https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    icon: Music,
    title: "Chorales & Louange",
    desc: "Des chorales nationales et départementales pour exprimer notre adoration à travers la musique.",
    items: ["Chorale nationale", "Chorales départementales", "Concerts spirituels", "Répétitions hebdomadaires"],
    image: "https://images.unsplash.com/photo-1761901219072-491a18f3ccd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    icon: Heart,
    title: "Évangélisation",
    desc: "Des campagnes d'évangélisation dans les écoles, universités et quartiers pour partager l'Évangile.",
    items: ["Missions scolaires", "Campagnes de rue", "Distribution de Bibles", "Témoignages publics"],
    image: "https://images.unsplash.com/photo-1548535520-c721c65e0d60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    icon: Calendar,
    title: "Activités culturelles",
    desc: "Des événements festifs et culturels pour renforcer les liens fraternels et célébrer ensemble.",
    items: ["Soirées culturelles", "Sorties éducatives", "Expositions", "Anniversaires"],
    image: "https://images.unsplash.com/photo-1761124739933-009df5603fbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
];

const calendarEvents = [
  { day: "15-22", month: "Août",  title: "Camp Biblique National",    location: "Yamoussoukro",  label: "S'inscrire"  },
  { day: "05",    month: "Avril", title: "Séminaire de Leadership",   location: "Abidjan-Cocody", label: "S'inscrire"  },
  { day: "20",    month: "Mai",   title: "Concours National d'Hymnes", location: "Multiple villes", label: "Participer" },
];

export default function Page() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000 })]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div>
      <PageHero
        title="Nos activités"
        subtitle="Des programmes variés pour grandir dans la foi"
        background={heroImages.activities}
      />

      {/* ── Événements à venir ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Agenda</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Événements <em className="not-italic italic text-brand-primary">à venir</em>
            </h2>
            <p className="text-base font-light text-muted-foreground mt-2">Inscrivez-vous dès maintenant à nos prochaines activités</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-[0_16px_48px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/70 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary to-brand-accent" />
                  <span className="absolute top-4 right-4 text-[0.65rem] font-medium tracking-[0.12em] uppercase bg-brand-primary/20 border border-brand-primary/40 text-white px-2.5 py-1 rounded-sm backdrop-blur-sm">
                    {event.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4 leading-snug">{event.title}</h3>
                  <div className="space-y-2 mb-6">
                    {[
                      { icon: Calendar, text: event.date },
                      { icon: MapPin,   text: event.location },
                      { icon: Users,    text: event.participants },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-xs font-light text-muted-foreground">
                        <Icon className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/event-registration"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_12px_rgba(24,64,112,0.25)] hover:shadow-[0_4px_18px_rgba(24,64,112,0.4)] hover:-translate-y-px transition-all group/btn"
                  >
                    S&apos;inscrire
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Camp Biblique National ── */}
      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.18)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.12)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-primary/20 border border-brand-primary/35 text-brand-light text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-sm mb-5">
                57+ éditions
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-1 rounded-full bg-brand-light" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">Événement phare</p>
                <span className="w-1 h-1 rounded-full bg-brand-light" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-6 uppercase tracking-tight">
                Camp Biblique <em className="not-italic italic text-brand-light">National</em>
              </h2>
              <div className="w-12 h-[2px] bg-gradient-to-r from-brand-primary to-transparent mb-6" />
              <div className="space-y-4 text-sm font-bold text-white leading-relaxed mb-8">
                <p>Le Camp Biblique National est l&apos;événement phare de l&apos;ACEEPCI. Chaque année, plus de <span className="text-brand-light font-medium">500 jeunes</span> se rassemblent pendant une semaine pour un temps intense d&apos;enseignement biblique, de louange et de communion fraternelle.</p>
                <p>Au programme : sessions d&apos;enseignement, ateliers thématiques, activités sportives, soirées culturelles et moments de prière collective.</p>
              </div>
              <div className="space-y-3">
                {["Enseignements bibliques quotidiens", "Ateliers de formation au leadership", "Activités sportives et culturelles", "Hébergement et restauration sur place"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(24,64,112,0.35)]">
                      <span className="text-white text-[0.6rem] font-bold">✓</span>
                    </div>
                    <p className="text-sm font-bold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-primary rounded-tr-2xl z-10" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-brand-primary rounded-bl-2xl z-10" />
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-xl bg-brand-primary/15 border border-brand-primary/20" />
              <div className="relative rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1750284743584-10142975ecd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Camp Biblique"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Activités principales ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Programmes</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Nos <em className="not-italic italic text-brand-primary">programmes</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainActivities.map(({ icon: Icon, title, desc, items, image }, i) => (
              <div key={title} className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-[0_16px_48px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <ImageWithFallback src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/70 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-3 right-3 font-serif text-3xl font-bold text-white select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_4px_12px_rgba(24,64,112,0.3)] flex items-center justify-center mb-4 -mt-10 relative z-10 group-hover:shadow-[0_6px_16px_rgba(24,64,112,0.45)] transition-shadow">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">{title}</h3>
                  <div className="w-6 h-[2px] bg-brand-primary mb-3 transition-all duration-300 group-hover:w-12" />
                  <p className="text-xs font-light text-muted-foreground leading-relaxed mb-4">{desc}</p>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs font-light text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-brand-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Calendrier 2026 ── */}
      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.18)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-light" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">ACEEPCI · Planning</p>
              <span className="w-1 h-1 rounded-full bg-brand-light" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight uppercase tracking-tight">
              Calendrier <em className="not-italic italic text-brand-light">2026</em>
            </h2>
            <p className="text-base font-bold text-white mt-2">Les grands rendez-vous de l&apos;année</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-brand-primary via-brand-accent to-transparent" />
            {calendarEvents.map((ev, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-4 p-6 hover:bg-white/[0.04] transition-colors ${i < calendarEvents.length - 1 ? "border-b border-white/10" : ""}`}
              >
                <div className="flex items-center gap-5">
                  <div className="text-center flex-shrink-0 w-14">
                    <div className="font-serif text-2xl font-bold text-brand-light leading-none">{ev.day}</div>
                    <div className="text-xs font-bold text-white mt-0.5">{ev.month}</div>
                  </div>
                  <div className="w-px h-10 bg-brand-primary/30" />
                  <div>
                    <h3 className="font-serif text-base font-semibold text-white">{ev.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-white">
                      <MapPin className="w-3 h-3" /> {ev.location}
                    </div>
                  </div>
                </div>
                <Link
                  href="/event-registration"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-medium rounded-sm shadow-[0_4px_12px_rgba(24,64,112,0.25)] hover:shadow-[0_4px_18px_rgba(24,64,112,0.4)] hover:-translate-y-px transition-all group"
                >
                  {ev.label}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Partenaires ── */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Écosystème</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Nos <em className="not-italic italic text-brand-primary">partenaires</em>
            </h2>
            <p className="text-base font-light text-muted-foreground mt-2">Nous sommes affiliés à des organisations reconnues</p>
          </div>

          <div className="relative">
            <button onClick={scrollPrev} className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-brand-primary-dark border border-brand-primary/35 text-brand-light flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollNext} className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-brand-primary-dark border border-brand-primary/35 text-brand-light flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-5">
                {partners.map((partner, i) => (
                  <div key={i} className="flex-[0_0_280px] min-w-0">
                    <div className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-[0_12px_36px_rgba(24,64,112,0.12)] hover:-translate-y-1 transition-all duration-300">
                      <div className="relative h-40 overflow-hidden">
                        <ImageWithFallback src={partner.image} alt={partner.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/60 to-transparent" />
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-serif text-base font-semibold text-foreground">{partner.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-14">
            <p className="text-sm font-bold text-muted-foreground mb-5">Vous souhaitez devenir partenaire ?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(24,64,112,0.3)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.45)] hover:-translate-y-0.5 transition-all group"
            >
              Contactez-nous
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </AnimateSection>

      {/* ── CTA final ── */}
      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.18)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-1 rounded-full bg-brand-light" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">Passez à l&apos;action</p>
            <span className="w-1 h-1 rounded-full bg-brand-light" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-4 uppercase tracking-tight">
            Participez à nos <em className="not-italic italic text-brand-light">activités</em>
          </h2>
          <div className="w-12 h-[2px] bg-gradient-to-r from-brand-primary to-transparent mb-6" />
          <p className="text-base font-bold text-white mb-8 max-w-xl leading-relaxed">
            Rejoignez-nous et vivez des expériences spirituelles inoubliables
          </p>
          <Link
            href="/members"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium rounded-sm shadow-[0_4px_20px_rgba(24,64,112,0.35)] hover:shadow-[0_6px_28px_rgba(24,64,112,0.5)] hover:-translate-y-0.5 transition-all group"
          >
            Devenir membre
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </AnimateSection>
    </div>
  );
}