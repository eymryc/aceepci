"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { heroImages } from "@/config/heroImages";
import { Calendar, Clock, User, Tag, ChevronRight, ChevronLeft, TrendingUp, Search } from "lucide-react";

type BlogCategory = "all" | "temoignages" | "reflexions" | "evenements" | "vie-spirituelle";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: Exclude<BlogCategory, "all">;
  readTime: string;
  image: string;
  views: number;
}

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const categories = [
    { id: "all" as const, name: "Tous les articles", count: 12 },
    { id: "temoignages" as const, name: "Témoignages", count: 4 },
    { id: "reflexions" as const, name: "Réflexions", count: 3 },
    { id: "evenements" as const, name: "Événements", count: 3 },
    { id: "vie-spirituelle" as const, name: "Vie Spirituelle", count: 2 },
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Comment Dieu a transformé ma vie universitaire",
      excerpt: "Mon témoignage sur la façon dont ma foi m'a aidé à surmonter les défis académiques et personnels pendant mes années d'études. Une histoire d'espoir et de persévérance.",
      author: "Sarah Kouadio",
      date: "28 Février 2026",
      category: "temoignages",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1714667109984-9602d193d1ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB5b3V0aCUyMHdvcnNoaXAlMjBiaWJsZXxlbnwxfHx8fDE3NzI1ODI0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 1245,
    },
    {
      id: 2,
      title: "L'importance de la communauté chrétienne à l'université",
      excerpt: "Réflexion sur le rôle essentiel de la fraternité et du soutien mutuel dans notre parcours spirituel et académique. Pourquoi s'entourer de frères et sœurs en Christ fait toute la différence.",
      author: "Koffi Mensah",
      date: "25 Février 2026",
      category: "reflexions",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1716654716581-3c92ba53de10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjU4MjQwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 987,
    },
    {
      id: 3,
      title: "Retour sur le Camp d'Été 2025 à Grand-Bassam",
      excerpt: "Moments forts, témoignages et enseignements marquants de notre camp d'été annuel. Plus de 300 jeunes réunis pour deux semaines inoubliables de louange, formation et communion fraternelle.",
      author: "Équipe Communication",
      date: "20 Février 2026",
      category: "evenements",
      readTime: "10 min",
      image: "https://images.unsplash.com/photo-1767327142314-f011bc951da9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlb3BsZSUyMGNodXJjaCUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzI1ODI0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 2134,
    },
    {
      id: 4,
      title: "5 clés pour une vie de prière efficace",
      excerpt: "Des conseils pratiques pour développer une relation profonde avec Dieu à travers la prière quotidienne. Découvrez comment transformer votre temps de prière en moment privilégié avec le Seigneur.",
      author: "Pasteur Jean Koné",
      date: "18 Février 2026",
      category: "vie-spirituelle",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1575516662637-99214ea59f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmF5ZXIlMjBoYW5kcyUyMGZhaXRofGVufDF8fHx8MTc3MjU4MjQwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 1567,
    },
    {
      id: 5,
      title: "De l'échec aux premiers de promotion : Mon parcours",
      excerpt: "Comment j'ai surmonté mes échecs académiques grâce à ma foi et la persévérance. Un témoignage inspirant qui prouve que rien n'est impossible avec Dieu.",
      author: "Marc Bamba",
      date: "15 Février 2026",
      category: "temoignages",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1639436926668-2f8b4f32e15a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIweY91dGglMjBsZWFkZXJzaGlwfGVufDF8fHx8MTc3MjQ5OTU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 1876,
    },
    {
      id: 6,
      title: "La Bible et les défis du 21ème siècle",
      excerpt: "Réflexion sur la pertinence de la Parole de Dieu face aux enjeux contemporains. Comment les principes bibliques nous guident dans un monde en constante évolution.",
      author: "Dr. Aïcha Traoré",
      date: "12 Février 2026",
      category: "reflexions",
      readTime: "9 min",
      image: "https://images.unsplash.com/photo-1555080681-ff429089eb14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWJsZSUyMHJlYWRpbmclMjBkZXZvdGlvbnxlbnwxfHx8fDE3NzI1ODI0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 1432,
    },
    {
      id: 7,
      title: "Séminaire de Formation des Leaders - Mars 2026",
      excerpt: "Rejoignez-nous pour trois jours de formation intensive sur le leadership chrétien. Inscriptions ouvertes jusqu'au 10 mars pour cet événement exceptionnel.",
      author: "Équipe Formation",
      date: "8 Février 2026",
      category: "evenements",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1762497403897-c105a5bc61e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjBjb25mZXJlbmNlJTIwZXZlbnR8ZW58MXx8fHwxNzcyNTgyNDA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 2341,
    },
    {
      id: 8,
      title: "Trouver sa vocation : Entre appel divin et passion",
      excerpt: "Comment discerner la volonté de Dieu pour votre carrière professionnelle. Des conseils pratiques pour aligner vos aspirations avec le plan de Dieu pour votre vie.",
      author: "Élise N'Guessan",
      date: "5 Février 2026",
      category: "vie-spirituelle",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1712844470225-94cbb5bd7dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JzaGlwJTIwdGVhbSUyMHByYWlzZXxlbnwxfHx8fDE3NzI1ODI0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 1654,
    },
    {
      id: 9,
      title: "Mission humanitaire à Bouaké : Témoignages",
      excerpt: "Les membres de l'ACEEPCI partagent leur expérience lors de la mission humanitaire dans les orphelinats de Bouaké. Des moments émouvants qui ont marqué nos cœurs.",
      author: "Équipe Mission",
      date: "1 Février 2026",
      category: "temoignages",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1567398724206-be8c8f0f8e41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGhlbHBpbmclMjB2b2x1bnRlZXJpbmd8ZW58MXx8fHwxNzcyNTgyNDA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 1789,
    },
    {
      id: 10,
      title: "Vivre sa foi au quotidien sur le campus",
      excerpt: "Stratégies et astuces pour rester fidèle à ses convictions chrétiennes dans l'environnement universitaire. Comment être un témoin efficace de Christ auprès de vos camarades.",
      author: "David Ouattara",
      date: "28 Janvier 2026",
      category: "reflexions",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1716654716581-3c92ba53de10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjU4MjQwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 1123,
    },
    {
      id: 11,
      title: "Journée Portes Ouvertes - 15 Mars 2026",
      excerpt: "Découvrez l'ACEEPCI lors de notre journée portes ouvertes. Programme : témoignages, concerts, ateliers spirituels et moment de convivialité. Venez nombreux !",
      author: "Équipe Communication",
      date: "25 Janvier 2026",
      category: "evenements",
      readTime: "3 min",
      image: "https://images.unsplash.com/photo-1767327142314-f011bc951da9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlb3BsZSUyMGNodXJjaCUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzI1ODI0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 2567,
    },
    {
      id: 12,
      title: "Guérie de la dépression par la grâce de Dieu",
      excerpt: "Un témoignage bouleversant de guérison intérieure. Comment Dieu m'a relevée dans mes moments les plus sombres et m'a redonné goût à la vie.",
      author: "Aminata Diallo",
      date: "20 Janvier 2026",
      category: "temoignages",
      readTime: "9 min",
      image: "https://images.unsplash.com/photo-1575516662637-99214ea59f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmF5ZXIlMjBoYW5kcyUyMGZhaXRofGVufDF8fHx8MTc3MjU4MjQwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 3012,
    },
  ];

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "temoignages": return "bg-brand-primary/10 text-brand-primary";
      case "reflexions": return "bg-brand-accent/10 text-brand-accent";
      case "evenements": return "bg-brand-primary/15 text-brand-primary";
      case "vie-spirituelle": return "bg-brand-primary/10 text-brand-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const popularPosts = [...blogPosts].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Blog ACEEPCI"
        subtitle="Articles, témoignages, réflexions spirituelles et actualités de notre communauté chrétienne étudiante"
        background={heroImages.blog}
      />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8">
            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg"
                        : "bg-white text-foreground hover:bg-brand-subtle border border-border"
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedCategory === category.id
                        ? "bg-white/20"
                        : "bg-muted"
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg hover:border-brand-primary/20 transition-all"
                >
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-72 md:flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                          <Tag className="w-3 h-3" />
                          {post.category === "temoignages" && "Témoignages"}
                          {post.category === "reflexions" && "Réflexions"}
                          {post.category === "evenements" && "Événements"}
                          {post.category === "vie-spirituelle" && "Vie Spirituelle"}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-foreground mb-3 hover:text-brand-primary transition-colors cursor-pointer">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h2>

                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime} de lecture</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <Link 
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center gap-2 text-brand-primary font-medium hover:text-brand-accent transition-colors"
                        >
                          Lire la suite
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-foreground text-sm font-medium rounded-lg hover:bg-brand-subtle hover:border-brand-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-md"
                          : "bg-white border border-border text-foreground hover:bg-brand-subtle hover:border-brand-primary/30"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-foreground text-sm font-medium rounded-lg hover:bg-brand-subtle hover:border-brand-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-border"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Search Box */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Rechercher</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Popular Posts */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-bold text-foreground">Articles Populaires</h3>
                </div>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <div key={post.id} className="flex gap-3 group cursor-pointer">
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-brand-primary transition-colors mb-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{post.views.toLocaleString()} vues</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Catégories</h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white"
                          : "bg-muted text-foreground hover:bg-brand-subtle"
                      }`}
                    >
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === category.id
                          ? "bg-white/20"
                          : "bg-white"
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Box */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl p-6 text-white">
                <h3 className="font-bold mb-2">Partagez votre témoignage</h3>
                <p className="text-sm text-white mb-4">
                  Votre histoire peut inspirer et encourager d'autres membres.
                </p>
                <button className="w-full px-4 py-2 bg-white text-brand-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
                  Écrire un article
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}