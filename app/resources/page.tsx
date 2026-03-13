"use client";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";
import { BookOpen, Headphones, Video, FileText, Heart, Download } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"Audio" | "Vidéo" | "Texte">("Vidéo");

  const allContent = [
    { id: "1", title: "Marcher par la foi, non par la vue", speaker: "Pasteur Jean-Marc", date: "28 Février 2026", duration: "45 min", type: "Audio" as const, image: "https://images.unsplash.com/photo-1624500055301-c62a900632f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcGFzdG9yJTIwcHJlYWNoaW5nJTIwY2h1cmNofGVufDF8fHx8MTc3MjQ3ODM0Mnww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "2", title: "Le leadership serviteur", speaker: "Rev. Marie Kouassi", date: "25 Février 2026", duration: "38 min", type: "Vidéo" as const, image: "https://images.unsplash.com/photo-1656577796253-589064aaf978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB3b21hbiUyMHdvcnNoaXAlMjBzaW5naW5nfGVufDF8fHx8MTc3MjQ3ODM0Mnww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "3", title: "Soyez la lumière du monde", speaker: "Pasteur David", date: "20 Février 2026", duration: "42 min", type: "Audio" as const, image: "https://images.unsplash.com/photo-1686354714854-88af03979e2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwcHJheWluZyUyMGJpYmxlfGVufDF8fHx8MTc3MjQ3ODM0M3ww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "4", title: "La puissance de la prière", speaker: "Pasteur Emmanuel", date: "18 Février 2026", duration: "35 min", type: "Vidéo" as const, image: "https://images.unsplash.com/photo-1642654877094-e8db202268de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBzZXJ2aWNlJTIwd29yc2hpcCUyMGhhbmRzJTIwcmFpc2VkfGVufDF8fHx8MTc3MjQ3ODM0M3ww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "5", title: "Vivre une vie de sainteté", speaker: "Rev. Aya Koné", date: "15 Février 2026", duration: "50 min", type: "Audio" as const, image: "https://images.unsplash.com/photo-1551677562-8df131950537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMHByYXllciUyMHlvdW5nJTIwYWR1bHRzfGVufDF8fHx8MTc3MjQ3ODM0N3ww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "3", title: "Le disciple et le discipulat", speaker: "Pasteur Jean-Marc", date: "12 Février 2026", excerpt: "Étude approfondie sur l'appel à faire des disciples selon Matthieu 28:19-20. Comment former et accompagner les nouveaux croyants dans leur croissance spirituelle.", type: "Texte" as const },
    { id: "3", title: "Gérer les conflits bibliquement", speaker: "Rev. Marie Kouassi", date: "10 Février 2026", excerpt: "Principes bibliques pour résoudre les conflits dans l'église et dans nos relations. Une approche pratique basée sur Matthieu 18.", type: "Texte" as const },
    { id: "3", title: "L'évangélisation dans le milieu scolaire", speaker: "Pasteur David", date: "8 Février 2026", excerpt: "Stratégies et méthodes pour partager l'Évangile efficacement dans les écoles et universités tout en respectant le contexte laïc.", type: "Texte" as const }
  ];

  const filteredContent = allContent.filter(item => item.type === activeTab);

  const devotionals = [
    {
      id: 1,
      date: "2 Mars 2026",
      title: "La fidélité de Dieu",
      verse: "Lamentations 3:22-23",
      excerpt: "Les bontés de l'Éternel ne sont pas épuisées...",
      image: "https://images.unsplash.com/photo-1645620549807-0aea79c18482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWl0aGZ1bCUyMHByYXllciUyMGhhbmRzJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzcyNDgwMDU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 2,
      date: "1er Mars 2026",
      title: "Marcher dans l'obéissance",
      verse: "Jacques 1:22",
      excerpt: "Mettez en pratique la parole, et ne vous bornez pas à l'écouter...",
      image: "https://images.unsplash.com/photo-1641336406848-529f063acff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxraW5nJTIwcGF0aCUyMG9iZWRpZW5jZSUyMGpvdXJuZXl8ZW58MXx8fHwxNzcyNDgwMDU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 3,
      date: "29 Février 2026",
      title: "La puissance de la prière",
      verse: "Philippiens 4:6-7",
      excerpt: "Ne vous inquiétez de rien; mais en toute chose...",
      image: "https://images.unsplash.com/photo-1761328386632-d777423bfe67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByYXlpbmclMjBzdW5yaXNlJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzcyNDgwMDU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const documents = [
    {
      title: "Guide d'étude biblique",
      description: "Méthodes pour une étude biblique approfondie",
      type: "PDF",
      size: "2.4 MB"
    },
    {
      title: "Manuel du leader chrétien",
      description: "Formation au leadership selon les principes bibliques",
      type: "PDF",
      size: "3.1 MB"
    },
    {
      title: "Recueil de cantiques ACEEPCI",
      description: "Paroles et partitions de nos cantiques",
      type: "PDF",
      size: "5.2 MB"
    },
    {
      title: "Plan de lecture biblique annuel",
      description: "Lire la Bible en un an",
      type: "PDF",
      size: "890 KB"
    }
  ];

  return (
    <div>
      <PageHero
        title="Ressources spirituelles"
        subtitle="Nourrissez votre foi avec nos enseignements et méditations"
        background={heroImages.resources}
      />

      {/* Prédications & Messages — première section */}
      <AnimateSection className="relative py-24 sm:py-28 bg-white overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-12 sm:mb-14">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Enseignements</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Prédications &amp; <em className="not-italic italic text-brand-primary">Messages</em>
            </h2>
            <p className="text-foreground/85 mt-3 text-sm sm:text-base max-w-xl mx-auto">
              Écoutez ou regardez les enseignements bibliques de nos pasteurs et prédicateurs invités.
            </p>
          </header>

          {/* Filtres avec icônes */}
          <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 mb-8 shadow-[0_2px_16px_rgba(24,64,112,0.04)]">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all font-semibold border ${
                  activeTab === "Vidéo"
                    ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-transparent shadow-[0_4px_14px_rgba(24,64,112,0.28)]"
                    : "bg-brand-subtle/50 border-border text-foreground hover:bg-brand-primary/10 hover:border-brand-primary/25"
                }`}
                onClick={() => setActiveTab("Vidéo")}
              >
                <Video className="w-5 h-5" />
                Vidéo
                <span className="ml-0.5 text-xs opacity-90">({allContent.filter(c => c.type === "Vidéo").length})</span>
              </button>
              <button
                className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all font-semibold border ${
                  activeTab === "Audio"
                    ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-transparent shadow-[0_4px_14px_rgba(24,64,112,0.28)]"
                    : "bg-brand-subtle/50 border-border text-foreground hover:bg-brand-primary/10 hover:border-brand-primary/25"
                }`}
                onClick={() => setActiveTab("Audio")}
              >
                <Headphones className="w-5 h-5" />
                Audio
                <span className="ml-0.5 text-xs opacity-90">({allContent.filter(c => c.type === "Audio").length})</span>
              </button>
              <button
                className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all font-semibold border ${
                  activeTab === "Texte"
                    ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-transparent shadow-[0_4px_14px_rgba(24,64,112,0.28)]"
                    : "bg-brand-subtle/50 border-border text-foreground hover:bg-brand-primary/10 hover:border-brand-primary/25"
                }`}
                onClick={() => setActiveTab("Texte")}
              >
                <FileText className="w-5 h-5" />
                Texte
                <span className="ml-0.5 text-xs opacity-90">({allContent.filter(c => c.type === "Texte").length})</span>
              </button>
            </div>
          </div>

          {/* Liste des contenus */}
          <div className="space-y-5">
            {filteredContent.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white border border-border rounded-2xl overflow-hidden hover:border-brand-primary/25 hover:shadow-[0_16px_48px_rgba(24,64,112,0.12)] transition-all duration-300"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-brand-primary to-brand-accent opacity-90 group-hover:opacity-100 transition-opacity z-10" />
                <div className="pl-6 sm:pl-7 flex flex-col sm:flex-row gap-0 sm:gap-6 p-5 sm:p-6">
                  {/* Visuel */}
                  {"image" in item ? (
                    <div className="relative w-full sm:w-40 h-40 sm:h-36 rounded-xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/50 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          {item.type === "Audio" ? (
                            <Headphones className="w-7 h-7 text-white" />
                          ) : (
                            <Video className="w-7 h-7 text-white" />
                          )}
                        </span>
                      </div>
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-foreground text-[0.7rem] font-semibold rounded-lg shadow-sm">
                        {item.type}
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-full sm:w-40 h-40 sm:h-36 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0 shadow-[0_8px_24px_rgba(24,64,112,0.25)] mb-4 sm:mb-0">
                      <FileText className="w-14 h-14 text-white" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-foreground text-[0.7rem] font-semibold rounded-lg shadow-sm">
                        {item.type}
                      </span>
                    </div>
                  )}

                  {/* Contenu */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">{item.date}</p>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-2 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium text-foreground/85 mb-1">
                        {item.speaker}
                        {"duration" in item && (
                          <span className="text-foreground/70 font-normal"> · {item.duration}</span>
                        )}
                      </p>
                      {"excerpt" in item && (
                        <p className="text-foreground/90 text-sm mt-2 line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        href={`/sermons/${item.id}`}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold text-sm shadow-[0_4px_16px_rgba(24,64,112,0.28)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.35)] hover:-translate-y-0.5 transition-all"
                      >
                        {item.type === "Audio" ? <Headphones className="w-4 h-4" /> : item.type === "Vidéo" ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        {item.type === "Audio" ? "Écouter" : item.type === "Vidéo" ? "Regarder" : "Lire"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* Verse of the Day */}
      <AnimateSection className="relative py-24 sm:py-28 bg-brand-subtle overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl p-8 md:p-12 text-center border border-border shadow-[0_4px_24px_rgba(24,64,112,0.06)]">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-primary via-brand-accent to-transparent" />
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Parole du jour</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl mb-6 shadow-[0_8px_24px_rgba(24,64,112,0.25)]">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4 uppercase tracking-tight">Verset du jour</h2>
            <blockquote className="text-lg sm:text-xl md:text-2xl text-foreground/90 italic mb-4 content-prose font-medium">
              &ldquo;Car Dieu a tant aimé le monde qu&apos;il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu&apos;il ait la vie éternelle.&rdquo;
            </blockquote>
            <p className="text-brand-primary font-bold text-lg">Jean 3:16</p>
          </div>
        </div>
      </AnimateSection>

      {/* Devotionals */}
      <AnimateSection className="relative py-24 sm:py-28 bg-white overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Méditation</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Dévotions <em className="not-italic italic text-brand-primary">quotidiennes</em>
            </h2>
            <p className="text-foreground/85 mt-3 text-sm sm:text-base">
              Méditez la Parole de Dieu chaque jour
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {devotionals.map((devotional, index) => (
              <div key={index} className="group relative bg-white border border-border rounded-2xl overflow-hidden hover:border-brand-primary/25 hover:shadow-[0_16px_48px_rgba(24,64,112,0.12)] transition-all">
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-primary to-transparent opacity-80 group-hover:opacity-100 transition-opacity z-10" />
                <div className="relative h-44">
                  <ImageWithFallback
                    src={devotional.image}
                    alt={devotional.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/50 to-transparent" />
                  <div className="absolute top-4 left-4 bg-brand-primary/95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                    {devotional.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2 leading-snug">
                    {devotional.title}
                  </h3>
                  <p className="text-sm text-brand-primary font-semibold mb-3">
                    {devotional.verse}
                  </p>
                  <p className="text-foreground/90 text-sm mb-4 leading-relaxed">
                    {devotional.excerpt}
                  </p>
                  <Link
                    href={`/devotion/${devotional.id}`}
                    className="inline-flex items-center gap-1.5 text-brand-primary font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Lire la suite <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/devotionals"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold shadow-[0_4px_16px_rgba(24,64,112,0.28)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.35)] hover:-translate-y-0.5 transition-all"
            >
              Voir toutes les dévotions
            </Link>
          </div>
        </div>
      </AnimateSection>

      {/* Library */}
      <AnimateSection className="relative py-24 sm:py-28 bg-brand-subtle overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Ressources</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Bibliothèque
            </h2>
            <p className="text-foreground/85 mt-3 text-sm sm:text-base max-w-xl mx-auto">
              Documents bibliques, guides et ressources téléchargeables
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {documents.map((doc, index) => (
              <div key={index} className="group relative bg-white border border-border rounded-2xl p-6 hover:border-brand-primary/25 hover:shadow-[0_12px_40px_rgba(24,64,112,0.1)] transition-all">
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-primary to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(24,64,112,0.25)]">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-sm text-foreground/90 mb-4 leading-relaxed">
                  {doc.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground/80">{doc.type} • {doc.size}</span>
                  <button className="p-2 rounded-lg text-brand-primary hover:bg-brand-primary/10 transition-colors" aria-label="Télécharger">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold shadow-[0_4px_16px_rgba(24,64,112,0.28)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.35)] hover:-translate-y-0.5 transition-all">
              Voir toute la bibliothèque
            </button>
          </div>
        </div>
      </AnimateSection>

      {/* Testimonials */}
      <AnimateSection className="relative py-24 sm:py-28 bg-white overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Témoignages</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight uppercase tracking-tight">
              Témoignages
            </h2>
            <p className="text-foreground/85 mt-3 text-sm sm:text-base">
              Des vies transformées par l&apos;Évangile
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            <div className="group relative bg-white rounded-2xl p-8 border border-border hover:border-brand-primary/25 hover:shadow-[0_12px_40px_rgba(24,64,112,0.1)] transition-all">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-primary to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center mr-4 shadow-[0_4px_12px_rgba(24,64,112,0.25)]">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">Aïssatou K.</h3>
                  <p className="text-sm font-medium text-foreground/85">Étudiante, Université d&apos;Abidjan</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-brand-primary mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground/80">Membre depuis 2023</span>
              </div>
              <p className="text-foreground/90 italic content-prose leading-relaxed font-medium">
                &ldquo;L&apos;ACEEPCI a complètement transformé ma vie. J&apos;ai découvert Christ et trouvé une famille
                spirituelle qui m&apos;a soutenue dans ma foi et mes études. Aujourd&apos;hui, je sers avec joie
                dans mon département.&rdquo;
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 border border-border hover:border-brand-primary/25 hover:shadow-[0_12px_40px_rgba(24,64,112,0.1)] transition-all">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-primary to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center mr-4 shadow-[0_4px_12px_rgba(24,64,112,0.25)]">
                  <span className="text-white font-bold">K</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">Kouadio M.</h3>
                  <p className="text-sm font-medium text-foreground/85">Alumni, Ingénieur</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-brand-primary mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground/80">Membre depuis 2015</span>
              </div>
              <p className="text-foreground/90 italic content-prose leading-relaxed font-medium">
                &ldquo;Mon passage à l&apos;ACEEPCI m&apos;a formé au leadership et m&apos;a donné des bases solides
                pour ma vie professionnelle et spirituelle. Aujourd&apos;hui, je mentorise les jeunes
                et je continue de servir dans le réseau alumni.&rdquo;
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold shadow-[0_4px_16px_rgba(24,64,112,0.28)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.35)] hover:-translate-y-0.5 transition-all">
              Lire plus de témoignages
            </button>
          </div>
        </div>
      </AnimateSection>

      {/* CTA */}
      <AnimateSection className="relative py-24 sm:py-28 bg-brand-subtle overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="relative bg-white border border-border rounded-2xl p-8 sm:p-10 md:p-12 shadow-[0_4px_24px_rgba(24,64,112,0.06)]">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-primary via-brand-accent to-transparent" />
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(24,64,112,0.25)]">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-center uppercase tracking-tight">
              Grandissez <em className="not-italic italic text-brand-primary">spirituellement</em>
            </h2>
            <p className="text-foreground/90 text-center text-base sm:text-lg mb-8 max-w-lg mx-auto font-medium">
              Explorez nos ressources et nourrissez votre foi quotidiennement
            </p>
            <div className="flex justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold shadow-[0_4px_20px_rgba(24,64,112,0.28)] hover:shadow-[0_6px_28px_rgba(24,64,112,0.35)] hover:-translate-y-0.5 transition-all">
                S&apos;abonner aux dévotions
              </button>
            </div>
          </div>
        </div>
      </AnimateSection>
    </div>
  );
}