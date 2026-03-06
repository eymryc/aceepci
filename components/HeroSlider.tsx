"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: { text: string; link: string };
  secondaryButton: { text: string; link: string };
}

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1750284743584-10142975ecd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB5b3V0aCUyMHdvcnNoaXAlMjBoYW5kcyUyMHJhaXNlZHxlbnwxfHx8fDE3NzI0NzE0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    eyebrow: "ACEEPCI · Depuis 1961",
    title: "Association Chrétienne des Élèves et Étudiants Protestants",
    subtitle: "Connaître — Aimer — Servir",
    description: "Gagner l'école ivoirienne à Christ et former les leaders intellectuels de demain",
    primaryButton: { text: "Devenir membre", link: "/members" },
    secondaryButton: { text: "Faire un don", link: "/payments" },
  },
  {
    image: "https://images.unsplash.com/photo-1766189790516-8878365618c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwY2hyaXN0aWFuJTIwY2FtcCUyMG5hdHVyZXxlbnwxfHx8fDE3NzI0NzE0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    eyebrow: "Événement · Août 2026",
    title: "Camp Biblique National 2026",
    subtitle: "Du 15 au 22 Août 2026",
    description: "Une semaine d'enseignement biblique, de louange et de communion fraternelle à Yamoussoukro",
    primaryButton: { text: "S'inscrire au camp", link: "/activities" },
    secondaryButton: { text: "En savoir plus", link: "/activities" },
  },
  {
    image: "https://images.unsplash.com/photo-1716654716581-3c92ba53de10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjQ3MTQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    eyebrow: "Communauté · Côte d'Ivoire",
    title: "Rejoignez plus de 5 000 jeunes",
    subtitle: "88+ départements à travers la Côte d'Ivoire",
    description: "Faites partie d'une communauté de jeunes chrétiens engagés pour transformer leur génération",
    primaryButton: { text: "Nous rejoindre", link: "/members" },
    secondaryButton: { text: "Trouver un département", link: "/contact" },
  },
];

export function HeroSlider() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 25 },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setProgress(0);
    };
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Progress bar animation
  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const duration = 6000;
    const raf = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed < duration) requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [selectedIndex]);

  return (
    <div className="relative overflow-hidden bg-brand-primary-dark" style={{ height: "100svh", minHeight: 600, maxHeight: 800 }}>

      {/* ── Embla carousel ── */}
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">

              {/* Image — pas d’overlay coloré, légère ombre en bas pour la lisibilité du texte */}
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Filtre gauche → droite : assombrit la zone du texte */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
                {/* Filtre bas → haut : renforce la lisibilité en bas */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-2xl">

                  {/* Eyebrow */}
                  <div
                    className="flex items-center gap-2 mb-5 opacity-0 translate-y-6"
                    style={{ animation: index === selectedIndex ? "heroUp 0.7s 0.1s ease forwards" : "none" }}
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-accent" />
                    <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">
                      {slide.eyebrow}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-brand-accent" />
                  </div>

                  {/* Title */}
                  <h1
                    className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-4 opacity-0 translate-y-6"
                    style={{ animation: index === selectedIndex ? "heroUp 0.7s 0.25s ease forwards" : "none" }}
                  >
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p
                    className="text-lg md:text-xl font-light text-brand-light mb-3 opacity-0 translate-y-6"
                    style={{ animation: index === selectedIndex ? "heroUp 0.7s 0.4s ease forwards" : "none" }}
                  >
                    {slide.subtitle}
                  </p>

                  {/* Description */}
                  <p
                    className="text-sm md:text-base font-bold text-white leading-relaxed mb-8 max-w-lg opacity-0 translate-y-6"
                    style={{ animation: index === selectedIndex ? "heroUp 0.7s 0.5s ease forwards" : "none" }}
                  >
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div
                    className="flex flex-col sm:flex-row gap-3 opacity-0 translate-y-6"
                    style={{ animation: index === selectedIndex ? "heroUp 0.7s 0.6s ease forwards" : "none" }}
                  >
                    <Link
                      href={slide.primaryButton.link}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_20px_rgba(24,64,112,0.35)] hover:shadow-[0_6px_28px_rgba(24,64,112,0.55)] hover:-translate-y-0.5 transition-all group"
                    >
                      {slide.primaryButton.text}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href={slide.secondaryButton.link}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white text-brand-primary text-sm font-medium rounded-sm border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:bg-brand-subtle hover:text-brand-primary-dark hover:-translate-y-0.5 transition-all"
                    >
                      {slide.secondaryButton.text}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Nav arrows ── */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all backdrop-blur-sm"
        aria-label="Précédent"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all backdrop-blur-sm"
        aria-label="Suivant"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Bottom controls ── */}
      <div className="absolute bottom-8 left-0 right-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Slide counter */}
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-brand-light leading-none">
            {String(selectedIndex + 1).padStart(2, "0")}
          </span>
          <div className="w-px h-5 bg-[rgba(245,240,232,0.2)]" />
          <span className="text-xs font-light text-[rgba(245,240,232,0.4)]">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* Dot indicators with progress */}
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="relative h-[3px] rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === selectedIndex ? 40 : 20, background: "rgba(245,240,232,0.2)" }}
              aria-label={`Slide ${i + 1}`}
            >
              {i === selectedIndex && (
                <div
                  className="absolute inset-y-0 left-0 bg-brand-accent rounded-full"
                  style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="hidden sm:flex items-center gap-2 text-[rgba(245,240,232,0.3)]">
          <div className="w-5 h-8 rounded-full border border-[rgba(245,240,232,0.2)] flex items-start justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-[rgba(245,240,232,0.4)] rounded-full animate-bounce" />
          </div>
          <span className="text-[0.65rem] tracking-[0.15em] uppercase">Défiler</span>
        </div>
      </div>

      {/* ── Gold bottom rule ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes heroUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}