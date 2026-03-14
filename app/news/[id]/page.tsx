"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ChevronRight, 
  ThumbsUp, 
  Heart, 
  Lightbulb,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Send,
  MapPin,
  Eye
} from "lucide-react";
import { 
  createNewsSiteComment, 
  fetchNewsSiteComments, 
  type NewsSiteComment 
} from "@/lib/api";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

interface Reaction {
  id: string;
  icon: typeof Heart;
  label: string;
  count: number;
  active: boolean;
}

function formatViews(views: number): string {
  if (!Number.isFinite(views)) return "0";
  const str = String(Math.floor(views));
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function Page() {
  const params = useParams();
  const slugOrId = Array.isArray(params.id) ? params.id[0] : (params.id as string | undefined);
  const [reactions, setReactions] = useState<Reaction[]>([
    { id: "like", icon: ThumbsUp, label: "J'aime", count: 67, active: false },
    { id: "love", icon: Heart, label: "J'adore", count: 43, active: false },
    { id: "insightful", icon: Lightbulb, label: "Intéressant", count: 21, active: false },
  ]);

  const [comments, setComments] = useState<NewsSiteComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugOrId) return;
    let cancelled = false;
    setLoadingComments(true);
    fetchNewsSiteComments(slugOrId)
      .then((data) => {
        if (!cancelled) {
          setComments(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Impossible de charger les commentaires pour le moment.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingComments(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slugOrId]);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    if (typeof window === "undefined") return;
    if (document.querySelector('script[data-recaptcha="true"]')) return;

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = "true";
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const getRecaptchaToken = async (): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY) return null;
    if (typeof window === "undefined") return null;
    const grecaptcha = (window as any).grecaptcha;
    if (!grecaptcha || typeof grecaptcha.ready !== "function") return null;

    return new Promise((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: "comment" })
          .then((token: string) => resolve(token))
          .catch((err: unknown) => reject(err));
      });
    });
  };

  // Données de l'actualité (normalement récupérées via l'API avec l'ID)
  const news = {
    id: 1,
    title: "Lancement du Camp Biblique National 2026 : Inscriptions ouvertes",
    category: "Événements",
    author: {
      name: "Équipe Communication ACEEPCI",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      role: "Équipe de communication",
    },
    date: "2 Mars 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1750284743584-10142975ecd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB5b3V0aCUyMHdvcnNoaXAlMjBoYW5kcyUyMHJhaXNlZHxlbnwxfHx8fDE3NzI0NzE0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    views: 1234,
    location: "Grand-Bassam, Côte d'Ivoire",
    eventDate: "15-20 Juillet 2026",
    content: [
      {
        type: "paragraph",
        text: "C'est avec une grande joie que nous annonçons l'ouverture des inscriptions pour la 58ème édition du Camp Biblique National de l'ACEEPCI. Cet événement phare de notre association se tiendra du 15 au 20 juillet 2026 dans la magnifique ville côtière de Grand-Bassam.",
      },
      {
        type: "heading",
        text: "Un thème porteur d'espérance",
      },
      {
        type: "paragraph",
        text: "Cette année, le thème retenu est 'Marcher par la foi, et non par la vue' inspiré de 2 Corinthiens 5:7. Dans un monde marqué par l'incertitude et les défis multiples, ce thème rappelle aux jeunes chrétiens l'importance de fonder leur vie sur la foi en Dieu plutôt que sur ce que leurs yeux voient.",
      },
      {
        type: "quote",
        text: "\"Car nous marchons par la foi et non par la vue.\" - 2 Corinthiens 5:7",
      },
      {
        type: "heading",
        text: "Un programme riche et varié",
      },
      {
        type: "paragraph",
        text: "Le camp proposera un programme diversifié conçu pour nourrir spirituellement, intellectuellement et socialement les participants :",
      },
      {
        type: "list",
        items: [
          "Enseignements bibliques profonds animés par des prédicateurs renommés de Côte d'Ivoire et d'Afrique",
          "Séminaires thématiques sur le leadership, la vocation, les relations et la vie spirituelle",
          "Moments de louange et d'adoration puissants avec des groupes de worship",
          "Ateliers pratiques : théâtre chrétien, musique, art oratoire, médias",
          "Temps de prière et d'intercession en petits groupes",
          "Activités sportives et récréatives pour favoriser la communion fraternelle",
          "Soirées culturelles célébrant la diversité de notre communauté",
        ],
      },
      {
        type: "heading",
        text: "Informations pratiques",
      },
      {
        type: "paragraph",
        text: "Le camp se déroulera au Centre de Conférences de Grand-Bassam, un espace moderne et confortable situé à proximité de la plage. Les participants seront logés dans des dortoirs climatisés avec toutes les commodités nécessaires.",
      },
      {
        type: "subheading",
        text: "Tarifs et modalités d'inscription",
      },
      {
        type: "paragraph",
        text: "Les frais de participation sont fixés à 45 000 FCFA pour les étudiants et 55 000 FCFA pour les travailleurs. Ce montant couvre l'hébergement, tous les repas, le matériel pédagogique et les activités du camp. Un système de paiement échelonné est disponible pour faciliter l'accès à tous.",
      },
      {
        type: "paragraph",
        text: "Des bourses partielles ou complètes seront accordées aux étudiants en situation financière difficile. Les demandes de bourse doivent être déposées avant le 30 avril 2026 accompagnées d'une lettre de motivation.",
      },
      {
        type: "heading",
        text: "Comment s'inscrire ?",
      },
      {
        type: "paragraph",
        text: "Les inscriptions se font exclusivement en ligne via notre plateforme sécurisée. Suivez ces étapes simples :",
      },
      {
        type: "list",
        items: [
          "Créez votre compte membre sur notre site web si ce n'est pas déjà fait",
          "Remplissez le formulaire d'inscription au camp en fournissant toutes les informations requises",
          "Effectuez le paiement en ligne ou en présentiel dans l'un de nos bureaux régionaux",
          "Recevez votre confirmation d'inscription par email avec toutes les informations complémentaires",
        ],
      },
      {
        type: "paragraph",
        text: "Date limite d'inscription : 30 juin 2026. Les places sont limitées à 500 participants, nous vous encourageons donc à vous inscrire rapidement.",
      },
      {
        type: "heading",
        text: "Un rendez-vous à ne pas manquer",
      },
      {
        type: "paragraph",
        text: "Le Camp Biblique National est bien plus qu'un simple événement ; c'est un moment de rencontre avec Dieu, de ressourcement spirituel, de formation et de création de liens fraternels durables. Chaque année, des centaines de jeunes témoignent d'une transformation de leur vie suite à leur participation au camp.",
      },
      {
        type: "paragraph",
        text: "Que vous soyez membre de longue date de l'ACEEPCI ou nouveau venu, que vous soyez au lycée ou à l'université, ce camp est pour vous. Venez vivre une expérience unique qui marquera votre parcours spirituel et votre vie !",
      },
      {
        type: "paragraph",
        text: "Pour plus d'informations, contactez notre équipe au +225 07 00 00 00 00 ou par email à camp2026@aceepci.org. Suivez également nos réseaux sociaux pour les dernières actualités concernant le camp.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1750284743584-10142975ecd9?w=800",
      "https://images.unsplash.com/photo-1769755449051-5e90bc9cd691?w=800",
      "https://images.unsplash.com/photo-1716654716581-3c92ba53de10?w=800",
    ],
  };

  const relatedNews = [
    {
      id: 2,
      title: "Nouveau centre d'accueil à Yamoussoukro : Les travaux avancent",
      image: "https://images.unsplash.com/photo-1768926968986-a88590ce5025?w=400",
      date: "28 Février 2026",
    },
    {
      id: 5,
      title: "Séminaire national sur le leadership chrétien en avril",
      image: "https://images.unsplash.com/photo-1766189790516-8878365618c0?w=400",
      date: "15 Février 2026",
    },
    {
      id: 6,
      title: "Retour en images sur le Camp de Noël 2025",
      image: "https://images.unsplash.com/photo-1722962674485-d34e69a9a406?w=400",
      date: "10 Février 2026",
    },
  ];

  const handleReaction = (reactionId: string) => {
    setReactions(reactions.map(r => 
      r.id === reactionId 
        ? { ...r, active: !r.active, count: r.active ? r.count - 1 : r.count + 1 }
        : r
    ));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !slugOrId) return;

    setError(null);
    setCaptchaError(null);
    setSubmitting(true);

    try {
      const captchaToken = await getRecaptchaToken();
      if (!captchaToken) {
        setCaptchaError("Vérification CAPTCHA indisponible. Merci de réessayer plus tard.");
        return;
      }

      const response = await createNewsSiteComment(slugOrId, {
        author_name: "Visiteur du site",
        content: commentText.trim(),
        captcha_token: captchaToken,
      });

      if (response?.data) {
        setComments((prev) => [response.data, ...prev]);
        setCommentText("");
      }
    } catch (err: any) {
      if (err?.errors?.captcha || err?.errors?.captcha_token) {
        setCaptchaError(
          err?.errors?.captcha?.[0] ||
            err?.errors?.captcha_token?.[0] ||
            "Vérification CAPTCHA échouée. Merci de réessayer."
        );
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("Impossible d'envoyer votre commentaire pour le moment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = (content: typeof news.content[0], index: number) => {
    switch (content.type) {
      case "paragraph":
        return (
          <p key={index} className="text-foreground leading-relaxed mb-6">
            {content.text}
          </p>
        );
      case "heading":
        return (
          <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
            {content.text}
          </h2>
        );
      case "subheading":
        return (
          <h3 key={index} className="text-xl font-bold text-foreground mt-6 mb-3">
            {content.text}
          </h3>
        );
      case "quote":
        return (
          <blockquote key={index} className="border-l-4 border-brand-primary bg-brand-subtle pl-6 pr-4 py-4 my-6 italic text-foreground">
            {content.text}
          </blockquote>
        );
      case "list":
        return (
          <ul key={index} className="space-y-3 mb-6">
            {content.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <ChevronRight className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-subtle">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand-primary transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/news" className="hover:text-brand-primary transition-colors">Actualités</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Article</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="inline-block px-3 py-1 bg-brand-primary rounded-full text-xs font-medium mb-4">
                    {news.category}
                  </span>
                  <h1 className="text-4xl font-bold mb-4">
                    {news.title}
                  </h1>
                </div>
              </div>

              {/* Article Meta */}
              <div className="p-8 border-b border-border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={news.author.avatar}
                      alt={news.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{news.author.name}</div>
                      <div className="text-sm text-muted-foreground">{news.author.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{news.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{news.readTime} de lecture</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>{formatViews(news.views)} vues</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Info (si applicable) */}
              <div className="px-8 py-6 bg-brand-subtle border-b border-border">
                <h3 className="font-semibold text-foreground mb-4">Informations sur l'événement</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Date</div>
                      <div className="text-sm text-muted-foreground">{news.eventDate}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Lieu</div>
                      <div className="text-sm text-muted-foreground">{news.location}</div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/payments"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:bg-brand-primary transition-colors"
                >
                  S'inscrire maintenant
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Article Content */}
              <div className="p-8 prose prose-lg max-w-none">
                {news.content.map((content, index) => renderContent(content, index))}
              </div>

              {/* Photo Gallery */}
              {news.gallery && news.gallery.length > 0 && (
                <div className="px-8 py-6 border-t border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Galerie photos</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {news.gallery.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Galerie ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reactions */}
              <div className="px-8 py-6 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Votre avis sur cet article</h3>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {reactions.map((reaction) => {
                    const Icon = reaction.icon;
                    return (
                      <button
                        key={reaction.id}
                        onClick={() => handleReaction(reaction.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          reaction.active
                            ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-brand-primary"
                            : "bg-white text-foreground border-border hover:border-brand-primary/40 hover:bg-brand-subtle"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{reaction.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          reaction.active ? "bg-white/20" : "bg-muted"
                        }`}>
                          {reaction.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Share Section */}
              <div className="px-8 py-6 border-t border-border bg-brand-subtle">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Partager cette actualité</h3>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 flex items-center justify-center bg-brand-primary text-white rounded-lg hover:opacity-90 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-brand-primary text-white rounded-lg hover:opacity-90 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-foreground/80 text-white rounded-lg hover:bg-foreground transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-border mt-8">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Commentaires ({comments.length})
                </h3>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <div className="flex gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                      alt="Votre avatar"
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Partagez votre avis ou posez vos questions..."
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none"
                        rows={3}
                      />
                      {captchaError && (
                        <p className="mt-2 text-sm text-red-600">{captchaError}</p>
                      )}
                      {error && !captchaError && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                      )}
                      <div className="flex justify-end mt-3">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!commentText.trim() || submitting}
                        >
                          <Send className="w-4 h-4" />
                          {submitting ? "Publication..." : "Publier"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                {loadingComments ? (
                  <p className="text-sm text-muted-foreground">Chargement des commentaires...</p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Soyez le premier à commenter cette actualité.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-subtle flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-brand-subtle rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-foreground">
                                {comment.author_name || "Visiteur"}
                              </h4>
                              {comment.created_at && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleString("fr-FR", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="text-foreground whitespace-pre-line">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <Link
                    href="/payments"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-center font-medium rounded-lg hover:opacity-95 transition-colors"
                  >
                    S'inscrire au camp
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full px-4 py-3 bg-white border-2 border-brand-primary text-brand-primary text-center font-medium rounded-lg hover:bg-brand-subtle transition-colors"
                  >
                    Poser une question
                  </Link>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl p-6 text-white">
                <h3 className="font-bold mb-4">Détails de l'événement</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{news.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{news.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Places limitées : 500</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-brand-primary/30">
                  <div className="text-sm mb-1">Tarif étudiant</div>
                  <div className="text-2xl font-bold">45 000 FCFA</div>
                </div>
              </div>

              {/* Related News */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Actualités similaires</h3>
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-3 group-hover:text-brand-primary transition-colors mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl p-6 text-white">
                <h3 className="font-bold mb-2">Restez informé</h3>
                <p className="text-sm text-white mb-4">
                  Ne manquez aucune actualité ! Recevez nos dernières nouvelles par email.
                </p>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-2 rounded-lg mb-3 text-foreground"
                />
                <button className="w-full px-4 py-2 bg-white text-brand-primary font-semibold rounded-lg hover:bg-brand-subtle transition-colors">
                  S'abonner
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
