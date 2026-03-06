"use client";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  const news = [
    {
      id: 1,
      title: "Lancement du Camp Biblique National 2026 : Inscriptions ouvertes",
      excerpt: "Les inscriptions pour la 58ème édition du Camp Biblique National sont officiellement ouvertes. Cette année, le thème est 'Marcher par la foi'.",
      date: "2 Mars 2026",
      category: "Événements",
      image: "https://images.unsplash.com/photo-1750284743584-10142975ecd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB5b3V0aCUyMHdvcnNoaXAlMjBoYW5kcyUyMHJhaXNlZHxlbnwxfHx8fDE3NzI0NzE0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      views: "1.2k"
    },
    {
      id: 2,
      title: "Nouveau centre d'accueil à Yamoussoukro : Les travaux avancent",
      excerpt: "Le projet de construction du centre d'accueil à Yamoussoukro progresse bien. Découvrez l'état d'avancement des travaux.",
      date: "28 Février 2026",
      category: "Projets",
      image: "https://images.unsplash.com/photo-1761477104708-b1c0281e698c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZSUyMG1vZGVybnxlbnwxfHx8fDE3NzI0NzE0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      views: "856"
    },
    {
      id: 3,
      title: "Témoignages : Comment l'ACEEPCI a changé nos vies",
      excerpt: "Découvrez les témoignages inspirants d'anciens membres qui partagent comment leur passage à l'ACEEPCI a transformé leur vie.",
      date: "25 Février 2026",
      category: "Témoignages",
      image: "https://images.unsplash.com/photo-1716654716581-3c92ba53de10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjQ3MTQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      views: "2.1k"
    },
    {
      id: 4,
      title: "Attribution de 15 bourses d'études à des élèves méritants",
      excerpt: "L'ACEEPCI a remis 15 bourses d'études à des élèves et étudiants en situation difficile mais aux résultats académiques excellents.",
      date: "20 Février 2026",
      category: "Social",
      image: "https://images.unsplash.com/photo-1758599668337-58bfa42683ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlb3BsZSUyMGNvbW11bml0eSUyMHNlcnZpY2UlMjBoZWxwaW5nfGVufDF8fHx8MTc3MjQ3MTQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      views: "1.5k"
    },
    {
      id: 5,
      title: "Séminaire national sur le leadership chrétien en avril",
      excerpt: "Un séminaire de trois jours sur le leadership chrétien se tiendra à Abidjan en avril. Inscriptions en cours.",
      date: "15 Février 2026",
      category: "Formations",
      image: "https://images.unsplash.com/photo-1766189790516-8878365618c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwY2hyaXN0aWFuJTIwY2FtcCUyMG5hdHVyZXxlbnwxfHx8fDE3NzI0NzE0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      views: "945"
    },
    {
      id: 6,
      title: "Retour en images sur le Camp de Noël 2025",
      excerpt: "Revivez les meilleurs moments du Camp de Noël 2025 qui a rassemblé plus de 300 jeunes à Bouaké.",
      date: "10 Février 2026",
      category: "Galerie",
      image: "https://images.unsplash.com/photo-1722962674485-d34e69a9a406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWJsZSUyMHN0dWR5JTIwZ3JvdXAlMjB5b3VuZyUyMGFkdWx0c3xlbnwxfHx8fDE3NzI0NzE0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      views: "3.2k"
    }
  ];

  // Filtrer les actualités selon le filtre actif
  const filteredNews = activeFilter === "Tous"
    ? news
    : news.filter((article) => article.category === activeFilter);

  return (
    <div>
      <PageHero
        title="Actualités"
        subtitle="Restez informés de nos dernières nouvelles et événements"
        background={heroImages.news}
      />
      {/* Featured Article */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Actualités</p>
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-xl overflow-hidden border border-border shadow-[0_20px_60px_rgba(24,64,112,0.12)]">
              <ImageWithFallback
                src={news[0].image}
                alt={news[0].title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-brand-accent" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-brand-primary/10 border border-brand-primary/25 text-brand-primary text-[0.65rem] font-medium tracking-[0.12em] uppercase rounded-sm mb-4">
                {news[0].category}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 uppercase tracking-tight">
                {news[0].title}
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                {news[0].excerpt}
              </p>
              <div className="flex items-center text-sm text-muted-foreground mb-6 gap-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-brand-primary" />{news[0].date}</span>
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-brand-primary" />{news[0].views} vues</span>
              </div>
              <Link
                href={`/news/${news[0].id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(24,64,112,0.3)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.45)] hover:-translate-y-0.5 transition-all group"
              >
                Lire l&apos;article <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* News Grid */}
      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.18)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-1 rounded-full bg-brand-light" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">Dernières actualités</p>
                <span className="w-1 h-1 rounded-full bg-brand-light" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
                Toute l&apos;<em className="not-italic italic text-brand-light">actualité</em>
              </h2>
            </div>
            <div className="flex gap-2">
              {["Tous", "Événements", "Projets"].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2.5 text-sm font-medium rounded-sm border transition-all ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-transparent shadow-[0_4px_12px_rgba(24,64,112,0.3)]"
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-brand-primary/30"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.slice(1).map((article) => (
              <article key={article.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-primary/30 hover:bg-white/8 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/70 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-[0.65rem] font-medium tracking-[0.1em] uppercase rounded-sm">
                    {article.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-xs text-white mb-3 gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-brand-light" />{article.date}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-brand-light" />{article.views}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-white text-sm mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/news/${article.id}`}
                    className="inline-flex items-center gap-1.5 text-brand-light hover:text-brand-accent font-medium text-sm transition-colors group/link"
                  >
                    Lire plus <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(24,64,112,0.3)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.45)] hover:-translate-y-0.5 transition-all">
              Charger plus d&apos;articles
            </button>
          </div>
        </div>
      </AnimateSection>

      {/* Newsletter Subscription */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Newsletter</p>
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3 uppercase tracking-tight">
            Ne manquez aucune <em className="not-italic italic text-brand-primary">actualité</em>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Inscrivez-vous à notre newsletter mensuelle
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-sm border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-sm shadow-[0_4px_16px_rgba(24,64,112,0.3)] hover:shadow-[0_6px_24px_rgba(24,64,112,0.45)] transition-all"
            >
              S&apos;abonner
            </button>
          </form>
        </div>
      </AnimateSection>

      {/* Media Gallery Preview */}
      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">ACEEPCI · Galerie</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
              Galerie <em className="not-italic italic text-brand-primary">photos & vidéos</em>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Les moments forts de notre communauté
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {news.slice(0, 4).map((item, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-border hover:border-brand-primary/30 transition-all">
                <ImageWithFallback
                  src={item.image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-brand-primary-dark/0 group-hover:bg-brand-primary-dark/50 transition-colors flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-primary-dark to-transparent text-white text-sm font-semibold px-3 py-2">
                  {item.category}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-dark font-medium transition-colors group"
            >
              Voir toute la galerie <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </AnimateSection>
    </div>
  );
}