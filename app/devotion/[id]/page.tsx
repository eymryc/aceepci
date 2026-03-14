"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  ThumbsUp,
  Heart,
  Bookmark,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Send,
  BookOpen,
  Lightbulb,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  devotionalsSiteApi,
  type Devotional,
  type DevotionalSiteComment,
  formatApiErrorMessage,
} from "@/lib/api";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function formatCommentDate(iso?: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function formatPublishedDate(iso?: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function Page() {
  const params = useParams();
  const slugOrId = (Array.isArray(params.id) ? params.id[0] : params.id) as string | undefined;

  const [devotion, setDevotion] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<DevotionalSiteComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const [userReaction, setUserReaction] = useState<"amen" | "beni" | "edifiant" | null>(null);
  const [reacting, setReacting] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!slugOrId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    devotionalsSiteApi
      .getBySlugOrId(slugOrId)
      .then((d) => {
        if (!cancelled) setDevotion(d);
      })
      .catch((err) => {
        if (!cancelled) setError(formatApiErrorMessage(err) || "Dévotion introuvable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slugOrId]);

  useEffect(() => {
    if (!slugOrId || !devotion?.comments_enabled) return;
    let cancelled = false;
    setLoadingComments(true);
    devotionalsSiteApi
      .getComments(slugOrId)
      .then(({ data }) => {
        if (!cancelled) setComments(data);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingComments(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slugOrId, devotion?.comments_enabled]);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY || typeof window === "undefined") return;
    if (document.querySelector('script[data-recaptcha="true"]')) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = "true";
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  const getRecaptchaToken = async (): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY || typeof window === "undefined") return null;
    const grecaptcha = (window as unknown as { grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha;
    if (!grecaptcha || typeof grecaptcha.ready !== "function") return null;
    return new Promise((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "comment" }).then(resolve).catch(reject);
      });
    });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slugOrId || !commentText.trim() || !devotion?.comments_enabled) return;
    setCommentError(null);
    setCaptchaError(null);
    const token = await getRecaptchaToken();
    if (!token) {
      setCaptchaError("Vérification CAPTCHA indisponible. Merci de réessayer plus tard.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await devotionalsSiteApi.addComment(slugOrId, {
        author_name: "Visiteur",
        author_avatar_url: null,
        content: commentText.trim(),
        captcha_token: token,
      });
      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (err: unknown) {
      const apiErr = err as { errors?: Record<string, string[]> };
      if (apiErr?.errors?.captcha_token?.[0] || apiErr?.errors?.captcha?.[0]) {
        setCaptchaError(apiErr?.errors?.captcha_token?.[0] || apiErr?.errors?.captcha?.[0] || "Vérification CAPTCHA échouée.");
      } else {
        setCommentError(formatApiErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (type: "amen" | "beni" | "edifiant") => {
    if (!slugOrId || !devotion?.reactions_enabled || reacting) return;
    setReacting(true);
    try {
      const updated = await devotionalsSiteApi.react(slugOrId, { type });
      setDevotion((prev) =>
        prev ? { ...prev, amen_count: updated.amen_count ?? 0, beni_count: updated.beni_count ?? 0, edifiant_count: updated.edifiant_count ?? 0 } : null
      );
      setUserReaction((prev) => (prev === type ? null : type));
    } catch {
      // keep counts as is
    } finally {
      setReacting(false);
    }
  };

  const reflectionList = devotion?.reflection_questions
    ? devotion.reflection_questions.split(/\r?\n/).filter((s) => s.trim())
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-subtle flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error || !devotion) {
    return (
      <div className="min-h-screen bg-brand-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error ?? "Dévotion introuvable."}</p>
          <Link href="/resources" className="text-brand-primary font-medium hover:underline">
            Retour aux ressources
          </Link>
        </div>
      </div>
    );
  }

  const reactionRows = [
    { id: "amen" as const, icon: ThumbsUp, label: "Amen", count: devotion.amen_count ?? 0 },
    { id: "beni" as const, icon: Heart, label: "Béni", count: devotion.beni_count ?? 0 },
    { id: "edifiant" as const, icon: Lightbulb, label: "Édifiant", count: devotion.edifiant_count ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-brand-subtle">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand-primary transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/resources" className="hover:text-brand-primary transition-colors">Ressources</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Dévotion</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Hero Section */}
              <div className="relative h-80">
                <img
                  src={devotion.cover_image_url || "/placeholder-devotion.jpg"}
                  alt={devotion.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm font-medium">Dévotion quotidienne</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-3">
                    {devotion.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{formatPublishedDate(devotion.published_at)}</span>
                    </div>
                    {devotion.reading_time && (
                      <>
                        <span>•</span>
                        <span>{devotion.reading_time} de lecture</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-8 py-4 bg-brand-subtle border-b border-border flex items-center justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCompleted(!isCompleted)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-brand-primary"
                        : "bg-white text-foreground border-border hover:border-brand-primary/40"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isCompleted ? "Complété" : "Marquer comme lu"}
                    </span>
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      isBookmarked
                        ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-brand-primary"
                        : "bg-white text-foreground border-border hover:border-brand-primary/40"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                    <span className="text-sm font-medium">
                      {isBookmarked ? "Sauvegardé" : "Sauvegarder"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Bible Verse */}
              {(devotion.scripture_reference || devotion.verse_text) && (
                <div className="p-8 border-b border-border bg-brand-subtle">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-brand-primary" />
                    <h3 className="font-bold text-foreground">{devotion.scripture_reference}</h3>
                  </div>
                  {devotion.verse_text && (
                    <blockquote className="text-lg text-foreground italic leading-relaxed">
                      &quot;{devotion.verse_text}&quot;
                    </blockquote>
                  )}
                </div>
              )}

              {/* Content */}
              {devotion.content && (
                <div
                  className="p-8 prose prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: devotion.content }}
                />
              )}

              {/* Reflection Questions */}
              {reflectionList.length > 0 && (
                <div className="px-8 py-6 border-t border-border bg-gradient-to-br from-brand-subtle to-brand-primary/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-xl font-bold text-foreground">Questions de réflexion</h3>
                  </div>
                  <ul className="space-y-3">
                    {reflectionList.map((question, index) => (
                      <li key={index} className="flex items-start gap-3 text-foreground">
                        <ChevronRight className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prayer */}
              {devotion.prayer && (
                <div className="px-8 py-6 border-t border-border bg-brand-subtle">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-xl font-bold text-foreground">Prière</h3>
                  </div>
                  <p className="text-foreground italic leading-relaxed">{devotion.prayer}</p>
                </div>
              )}

              {/* Reactions */}
              {devotion.reactions_enabled && (
                <div className="px-8 py-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Votre réaction</h3>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {reactionRows.map((row) => {
                      const Icon = row.icon;
                      const active = userReaction === row.id;
                      return (
                        <button
                          key={row.id}
                          onClick={() => handleReaction(row.id)}
                          disabled={reacting}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                            active
                              ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-brand-primary"
                              : "bg-white text-foreground border-border hover:border-brand-primary/40 hover:bg-brand-subtle"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{row.label}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${active ? "bg-white/20" : "bg-muted"}`}>
                            {row.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="px-8 py-6 border-t border-border bg-brand-subtle">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Partager cette dévotion</h3>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 flex items-center justify-center bg-brand-primary text-white rounded-lg hover:opacity-90 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-foreground/80 text-white rounded-lg hover:bg-foreground transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Link
                href={devotion.id > 1 ? `/devotion/${devotion.id - 1}` : "/resources"}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border hover:border-brand-primary/40 hover:shadow-md transition-all group"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground mb-1">Précédent</div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-brand-primary">
                    Dévotion précédente
                  </div>
                </div>
              </Link>
              <Link
                href={`/devotion/${devotion.id + 1}`}
                className="flex items-center justify-end gap-3 p-4 bg-white rounded-xl border border-border hover:border-brand-primary/40 hover:shadow-md transition-all group"
              >
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Suivant</div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-brand-primary">
                    Dévotion suivante
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary" />
              </Link>
            </div>

            {/* Comments Section */}
            {devotion.comments_enabled && (
              <div className="bg-white rounded-xl shadow-sm border border-border mt-8">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    Témoignages et réflexions ({comments.length})
                  </h3>

                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mb-8">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Partagez comment cette dévotion vous a touché..."
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none"
                          rows={3}
                        />
                        {(captchaError || commentError) && (
                          <p className="mt-2 text-sm text-red-600">{captchaError || commentError}</p>
                        )}
                        <div className="flex justify-end mt-3">
                          <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!commentText.trim() || submitting}
                          >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Publier
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Comments List */}
                  {loadingComments ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <img
                            src={comment.author_avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                            alt={comment.author_name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="bg-brand-subtle rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-foreground">{comment.author_name}</h4>
                                <span className="text-xs text-muted-foreground">{formatCommentDate(comment.created_at)}</span>
                              </div>
                              <p className="text-foreground">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Verse of the day (this devotion) */}
              {(devotion.verse_text || devotion.scripture_reference) && (
                <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="font-bold">Verset</h3>
                  </div>
                  {devotion.verse_text && (
                    <blockquote className="text-sm italic mb-2">&quot;{devotion.verse_text}&quot;</blockquote>
                  )}
                  {devotion.scripture_reference && (
                    <p className="text-xs text-white">— {devotion.scripture_reference}</p>
                  )}
                </div>
              )}

              {/* Recent Devotions */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Dévotions</h3>
                <Link
                  href="/resources"
                  className="block pt-2 text-center text-sm font-medium text-brand-primary hover:opacity-90"
                >
                  Voir toutes les dévotions
                </Link>
              </div>

              {/* Subscribe CTA */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl p-6 text-white">
                <h3 className="font-bold mb-2">Recevoir les dévotions</h3>
                <p className="text-sm text-white mb-4">
                  Recevez la dévotion quotidienne directement dans votre boîte mail chaque matin.
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
