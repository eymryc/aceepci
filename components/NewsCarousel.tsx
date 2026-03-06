"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, Tag } from "lucide-react";
import Link from "next/link";

type CarouselDir = "left" | "right";

export type NewsCarouselArticle = {
  id: number | string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  slug?: string;
};

type NewsCarouselProps = {
  articles?: NewsCarouselArticle[];
};

const defaultArticles: NewsCarouselArticle[] = [
  {
    id: 1,
    title: "Assemblée générale annuelle 2024 : un bilan positif pour l'ACEEPCI",
    excerpt: "Retour sur les temps forts de notre assemblée générale qui a réuni plus de 200 membres cette année.",
    date: "15 mars 2024",
    category: "Événement",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    slug: "/news/assemblee-generale-2024",
  },
  {
    id: 2,
    title: "Nouveau programme de formation professionnelle pour les jeunes",
    excerpt: "L'ACEEPCI lance un programme inédit pour accompagner les jeunes vers l'emploi et l'entrepreneuriat.",
    date: "2 mars 2024",
    category: "Formation",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    slug: "/news/formation-jeunes",
  },
  {
    id: 3,
    title: "Journée culturelle : célébrons nos racines ensemble",
    excerpt: "Une journée haute en couleurs pour célébrer la richesse culturelle de notre communauté ivoirienne.",
    date: "20 févr. 2024",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
    slug: "/news/journee-culturelle",
  },
  {
    id: 4,
    title: "Partenariat avec la Mairie : des actions concrètes pour notre quartier",
    excerpt: "L'ACEEPCI signe un accord de coopération avec la Mairie pour améliorer le cadre de vie local.",
    date: "10 févr. 2024",
    category: "Partenariat",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
    slug: "/news/partenariat-mairie",
  },
  {
    id: 5,
    title: "Collecte de fonds solidaire : merci pour votre générosité",
    excerpt: "Grâce à votre soutien, nous avons pu réunir 12 000 € pour les familles dans le besoin.",
    date: "1 févr. 2024",
    category: "Solidarité",
    image: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&q=80",
    slug: "/news/collecte-solidaire",
  },
];

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Événement:   { bg: "rgba(24,64,112,0.12)", text: "var(--brand-primary)", border: "rgba(24,64,112,0.28)" },
  Formation:   { bg: "rgba(24,64,112,0.12)", text: "var(--brand-primary)", border: "rgba(24,64,112,0.28)" },
  Culture:     { bg: "rgba(24,64,112,0.12)", text: "var(--brand-primary)", border: "rgba(24,64,112,0.28)" },
  Partenariat: { bg: "rgba(24,64,112,0.12)", text: "var(--brand-primary)", border: "rgba(24,64,112,0.28)" },
  Solidarité:  { bg: "rgba(24,64,112,0.12)", text: "var(--brand-primary)", border: "rgba(24,64,112,0.28)" },
};

function Badge({ category, small = false }: { category: string; small?: boolean }) {
  const s = CATEGORY_STYLES[category] || { bg: "rgba(24,64,112,0.10)", text: "var(--brand-primary)", border: "rgba(24,64,112,0.22)" };
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium tracking-[0.15em] uppercase border rounded-sm ${small ? "text-[0.6rem] px-2 py-0.5" : "text-[0.65rem] px-2.5 py-1"}`}
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      {!small && <Tag className="w-2 h-2" />}
      {category}
    </span>
  );
}

export default function NewsCarousel({ articles = defaultArticles }: NewsCarouselProps) {
  if (!articles || articles.length === 0) return null;

  const [active, setActive] = useState(0);
  const [animDir, setAnimDir] = useState<CarouselDir | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (dir: CarouselDir) => {
    if (isAnimating) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setActive((prev) =>
        dir === "right"
          ? (prev + 1) % articles.length
          : (prev - 1 + articles.length) % articles.length
      );
      setIsAnimating(false);
      setAnimDir(null);
    }, 300);
  };

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go("right"), 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, isAnimating]);

  const resetTimer = (dir: CarouselDir) => {
    if (timerRef.current) clearInterval(timerRef.current);
    go(dir);
  };

  const featured = articles[active];
  const side = [
    articles[(active + 1) % articles.length],
    articles[(active + 2) % articles.length],
  ];

  const bodyAnim = animDir === "left"
    ? "opacity-0 -translate-x-5"
    : animDir === "right"
    ? "opacity-0 translate-x-5"
    : "opacity-100 translate-x-0";

  return (
    <section className="relative bg-brand-subtle overflow-hidden py-20 px-4 sm:px-6 lg:px-8">

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary mb-2">
              ACEEPCI · Presse
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-1">
              Actualités <em className="not-italic italic text-brand-primary">récentes</em>
            </h2>
            <p className="text-base font-light text-muted-foreground">
              Découvrez les dernières nouvelles de l&apos;ACEEPCI
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] uppercase text-brand-primary border border-brand-primary/45 px-5 py-2.5 rounded-sm hover:bg-brand-primary hover:text-white transition-all group"
          >
            Toutes les actualités
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-stretch">

          {/* Featured */}
          <Link
            href={featured.slug ?? "/news"}
            className="relative rounded-[6px] overflow-hidden bg-brand-primary-dark cursor-pointer min-h-[480px] flex flex-col justify-end group"
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Nav buttons */}
            <div className="absolute top-4 right-4 z-20 flex gap-2" onClick={(e) => e.preventDefault()}>
              <button
                onClick={() => resetTimer("left")}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => resetTimer("right")}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 right-6 z-20 flex gap-1.5">
              {articles.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isAnimating || i === active) return;
                    if (timerRef.current) clearInterval(timerRef.current);
                    setAnimDir(i > active ? "right" : "left");
                    setIsAnimating(true);
                    setTimeout(() => { setActive(i); setIsAnimating(false); setAnimDir(null); }, 300);
                  }}
                  className={`h-[3px] rounded-full transition-all duration-300 ${i === active ? "w-8 bg-brand-accent" : "w-[18px] bg-white/30"}`}
                />
              ))}
            </div>

            {/* Body */}
            <div className={`relative z-10 p-8 transition-all duration-300 ${bodyAnim}`}>
              <div className="mb-3">
                <Badge category={featured.category} />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white leading-snug mb-3 max-w-xl">
                {featured.title}
              </h3>
              <p className="text-sm font-bold text-[rgba(245,240,232,0.65)] leading-relaxed mb-5 max-w-lg">
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[rgba(245,240,232,0.4)]">
                  <Calendar className="w-3.5 h-3.5" /> {featured.date}
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-light hover:gap-2.5 transition-all">
                  Lire l&apos;article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Side cards */}
          <div className="hidden lg:flex flex-col gap-3">
            {side.map((article, i) => (
              <Link
                key={i}
                href={article.slug ?? "/news"}
                className="flex gap-4 bg-white rounded-[6px] overflow-hidden border border-[rgba(26,18,8,0.08)] hover:shadow-[0_8px_32px_rgba(26,18,8,0.12)] hover:-translate-y-0.5 transition-all flex-1"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-28 object-cover flex-shrink-0"
                />
                <div className="py-4 pr-4 flex flex-col justify-between">
                  <div>
                    <div className="mb-2">
                      <Badge category={article.category} small />
                    </div>
                    <h4 className="font-serif text-base font-semibold text-foreground leading-snug">
                      {article.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[0.7rem] text-[#a09080]">
                    <Calendar className="w-3 h-3" /> {article.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}