"use client";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { heroImages } from "@/config/heroImages";
import { BookOpen, Calendar, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useState, useEffect } from "react";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const devotionals = [
    {
      id: "1",
      title: "La foi qui déplace les montagnes",
      date: "4 Mars 2026",
      category: "Foi",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHN1bnJpc2UlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NzI0ODQxMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Découvrez comment la foi en Dieu peut transformer les impossibilités en réalités et surmonter tous les obstacles de la vie.",
      verse: "Matthieu 17:20"
    },
    {
      id: "2",
      title: "L'amour inconditionnel de Christ",
      date: "3 Mars 2026",
      category: "Amour",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1518176258769-f227c798150e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFydCUyMGhhbmRzJTIwbG92ZSUyMGNhcmV8ZW58MXx8fHwxNzMyNDg0MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Méditation sur l'amour sans limite que Jésus nous porte et comment cet amour doit se refléter dans nos relations.",
      verse: "Jean 3:16"
    },
    {
      id: "3",
      title: "La prière qui change tout",
      date: "2 Mars 2026",
      category: "Prière",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmF5ZXIlMjBoYW5kcyUyMGNsb3NlZHxlbnwxfHx8fDE3MzI0ODQxMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Comment développer une vie de prière puissante et constante qui transforme votre relation avec Dieu.",
      verse: "1 Thessaloniciens 5:17"
    },
    {
      id: "4",
      title: "Marcher dans la lumière",
      date: "1 Mars 2026",
      category: "Sainteté",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodCUyMHBhdGglMjBmb3Jlc3R8ZW58MXx8fHwxNzMyNDg0MTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Réflexion sur l'appel à vivre une vie de sainteté et de pureté dans un monde rempli de ténèbres.",
      verse: "1 Jean 1:7"
    },
    {
      id: "5",
      title: "La paix qui surpasse toute intelligence",
      date: "28 Février 2026",
      category: "Paix",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMGxha2UlMjBjYWxtfGVufDF8fHx8MTczMjQ4NDEyOHww&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Comment trouver et maintenir la paix de Dieu au milieu des tempêtes et des difficultés de la vie.",
      verse: "Philippiens 4:7"
    },
    {
      id: "6",
      title: "L'espérance qui ne déçoit point",
      date: "27 Février 2026",
      category: "Espérance",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXduJTIwaG9wZSUyMG5ldyUyMGJlZ2lubmluZ3xlbnwxfHx8fDE3MzI0ODQxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Méditation sur l'espérance que nous avons en Christ et comment elle nous soutient dans toutes nos épreuves.",
      verse: "Romains 5:5"
    },
    {
      id: "7",
      title: "Le pardon qui libère",
      date: "26 Février 2026",
      category: "Pardon",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1509909756405-be0199881695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVlZG9tJTIwYmlyZHMlMjBmbHlpbmd8ZW58MXx8fHwxNzMyNDg0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Comprendre le pouvoir libérateur du pardon et son importance dans notre marche chrétienne.",
      verse: "Matthieu 6:14-15"
    },
    {
      id: "8",
      title: "La joie du Seigneur est ma force",
      date: "25 Février 2026",
      category: "Joie",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3klMjBoYXBweSUyMHN1bnNldHxlbnwxfHx8fDE3MzI0ODQxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Découvrez comment cultiver la joie du Seigneur même dans les moments difficiles de votre vie.",
      verse: "Néhémie 8:10"
    },
    {
      id: "9",
      title: "Servir avec excellence",
      date: "24 Février 2026",
      category: "Service",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2aWNlJTIwaGVscGluZyUyMGhhbmRzfGVufDF8fHx8MTczMjQ4NDEzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Réflexion sur l'importance de servir Dieu et les autres avec excellence et dévouement.",
      verse: "Colossiens 3:23"
    },
    {
      id: "10",
      title: "La sagesse d'en haut",
      date: "23 Février 2026",
      category: "Sagesse",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXNkb20lMjBib29rJTIwbGlnaHR8ZW58MXx8fHwxNzMyNDg0MTMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Comment demander et recevoir la sagesse de Dieu pour prendre les bonnes décisions dans la vie.",
      verse: "Jacques 1:5"
    },
    {
      id: "11",
      title: "La patience dans l'épreuve",
      date: "22 Février 2026",
      category: "Patience",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXRpZW5jZSUyMHdhaXRpbmclMjBuYXR1cmV8ZW58MXx8fHwxNzMyNDg0MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Apprendre à cultiver la patience et la persévérance dans les moments d'attente et de difficulté.",
      verse: "Jacques 5:7-8"
    },
    {
      id: "12",
      title: "L'humilité qui élève",
      date: "21 Février 2026",
      category: "Humilité",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1ibGUlMjBuYXR1cmUlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3MzI0ODQxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      excerpt: "Méditation sur l'importance de l'humilité dans la vie chrétienne et comment elle nous rapproche de Dieu.",
      verse: "Jacques 4:10"
    }
  ];

  const categories = ["all", "Foi", "Amour", "Prière", "Sainteté", "Paix", "Espérance", "Pardon", "Joie", "Service", "Sagesse", "Patience", "Humilité"];

  const filteredDevotionals = devotionals.filter(devotional => {
    const matchesSearch = devotional.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         devotional.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || devotional.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredDevotionals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDevotionals = filteredDevotionals.slice(startIndex, endIndex);

  return (
    <div>
      <PageHero
        title="Dévotions quotidiennes"
        subtitle="Nourrissez votre âme chaque jour avec nos méditations bibliques inspirantes"
        background={heroImages.devotionals}
      />
      {/* Search and Filter */}
      <section className="py-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une dévotion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              >
                <option value="all">Toutes les catégories</option>
                {categories.filter(c => c !== "all").map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredDevotionals.length} dévotion{filteredDevotionals.length > 1 ? 's' : ''} trouvée{filteredDevotionals.length > 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Devotionals Grid */}
      <section className="py-16 bg-brand-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDevotionals.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentDevotionals.map((devotional) => (
                <Link
                  key={devotional.id}
                  href={`/devotion/${devotional.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={devotional.image}
                      alt={devotional.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-semibold rounded-full">
                        {devotional.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {devotional.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {devotional.readTime}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand-primary transition-colors">
                      {devotional.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {devotional.excerpt}
                    </p>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-brand-primary">
                          {devotional.verse}
                        </span>
                        <span className="text-sm font-semibold text-brand-primary group-hover:translate-x-1 transition-transform">
                          Lire →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Aucune dévotion trouvée
              </h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou votre filtre
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {filteredDevotionals.length > itemsPerPage && (
        <section className="py-8 bg-brand-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                  
                  // Show ellipsis
                  const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span key={pageNum} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold"
                          : "bg-white border border-border text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Results info */}
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Affichage de {startIndex + 1}-{Math.min(endIndex, filteredDevotionals.length)} sur {filteredDevotionals.length} dévotions
            </div>
          </div>
        </section>
      )}

      {/* Subscribe CTA */}
      <section className="py-16 bg-brand-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(24,64,112,0.18),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative">
          <h2 className="font-serif text-3xl font-bold uppercase tracking-tight mb-4">
            Recevez les dévotions dans votre boîte mail
          </h2>
          <p className="text-xl text-white mb-8">
            Inscrivez-vous pour recevoir chaque jour une nouvelle méditation biblique
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground bg-white/10 border border-white/20 placeholder:text-white focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-light"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg hover:opacity-95 transition-colors font-semibold"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}