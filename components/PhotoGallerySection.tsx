"use client";
import { useState } from "react";
import { ArrowRight, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Link from "next/link";

const recentPhotos = [
  { title: "Formation communautaire", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", category: "Formation" },
  { title: "Réunion des membres",      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80", category: "Réunion" },
  { title: "Journée culturelle",       image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80", category: "Culture" },
  { title: "Atelier jeunesse",         image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=600&q=80", category: "Jeunesse" },
  { title: "Célébration annuelle",     image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80", category: "Événement" },
  { title: "Solidarité & entraide",    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", category: "Solidarité" },
  { title: "Rencontre interculturelle",image: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=600&q=80", category: "Culture" },
  { title: "Sorties & loisirs",        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", category: "Loisirs" },
];

// Mosaic spans per index
const spans = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

export default function PhotoGallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () =>
    setLightbox((l) =>
      l === null ? 0 : (l - 1 + recentPhotos.length) % recentPhotos.length
    );
  const next = () =>
    setLightbox((l) => (l === null ? 0 : (l + 1) % recentPhotos.length));

  return (
    <>
      <section className="relative bg-brand-subtle overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
            <div>
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary mb-2">
                ACEEPCI · Communauté
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-1">
                Nos activités <em className="not-italic italic text-brand-primary">en images</em>
              </h2>
              <p className="text-base font-light text-muted-foreground">
                Découvrez les moments forts de notre communauté
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] uppercase text-brand-primary border border-brand-primary/50 px-5 py-2.5 rounded-sm hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all group"
            >
              Voir toutes les photos
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mosaic */}
          <div className="relative">
            <div className="grid grid-cols-4 grid-rows-3 gap-[10px]" style={{ gridAutoRows: "220px" }}>
              {recentPhotos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i)}
                  className={`${spans[i]} relative rounded-[4px] overflow-hidden cursor-pointer bg-[#1a1a1a] group`}
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-all duration-500 brightness-[0.85] saturate-90 group-hover:scale-[1.07] group-hover:brightness-60"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <p className="text-[0.65rem] font-medium tracking-[0.18em] uppercase text-brand-light mb-1">
                      {photo.category}
                    </p>
                    <p className="text-sm font-medium text-white leading-snug">{photo.title}</p>
                  </div>
                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Count badge */}
            <div className="absolute bottom-4 right-4 bg-brand-primary/10 border border-brand-primary/25 text-brand-primary text-xs font-medium px-3 py-1.5 rounded-sm tracking-wide">
              {recentPhotos.length} photos
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            {/* Image */}
            <div className="relative w-full rounded-[4px] overflow-hidden bg-[#111]">
              <img
                src={recentPhotos[lightbox].image.replace("w=600", "w=1200")}
                alt={recentPhotos[lightbox].title}
                className="w-full max-h-[75vh] object-contain block"
              />
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-colors backdrop-blur-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-colors backdrop-blur-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Meta */}
            <div className="text-center">
              <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-3" />
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-brand-light mb-1">
                {recentPhotos[lightbox].category}
              </p>
              <p className="font-serif text-xl text-white">{recentPhotos[lightbox].title}</p>
              <p className="text-xs text-[rgba(245,240,232,0.35)] tracking-wider mt-1">
                {lightbox + 1} / {recentPhotos.length}
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="fixed top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-red-500/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}