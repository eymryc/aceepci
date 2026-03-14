"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, BookOpen, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { DatePicker } from "@/components/ui/date-picker";
import { devotionalCategoriesApi, devotionalsApi, formatApiErrorMessage, type Devotional } from "@/lib/api";

type DevotionalCategory = { id: number; name: string; code?: string | null; display_order?: number | null };

function parseDate(iso: string | undefined | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
}

export default function AdminDevotionalsEditPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<DevotionalCategory[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [scriptureReference, setScriptureReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [practicalApplication, setPracticalApplication] = useState("");
  const [reflectionQuestions, setReflectionQuestions] = useState("");
  const [prayer, setPrayer] = useState("");
  const [readingTime, setReadingTime] = useState("5 min");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeCoverImage, setRemoveCoverImage] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [reactionsEnabled, setReactionsEnabled] = useState(true);

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  useEffect(() => {
    if (!token) return;
    devotionalCategoriesApi
      .list(token, { per_page: 500 })
      .then((res) => {
        const list = res.data ?? [];
        setCategoryOptions(
          [...list].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        );
      })
      .catch(() => setCategoryOptions([]));
  }, [token]);

  useEffect(() => {
    if (!token || !id || Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    devotionalsApi
      .get(token, id)
      .then((d) => {
        if (cancelled) return;
        setDevotional(d);
        setTitle(d.title ?? "");
        setSlug(d.slug ?? "");
        setCategoryId(d.devotional_category_id != null ? String(d.devotional_category_id) : "");
        setScriptureReference(d.scripture_reference ?? "");
        setVerseText(d.verse_text ?? "");
        setExcerpt(d.excerpt ?? "");
        setContent(d.content ?? "");
        setPracticalApplication(d.practical_application ?? "");
        setReflectionQuestions(d.reflection_questions ?? "");
        setPrayer(d.prayer ?? "");
        setReadingTime(d.reading_time ?? "5 min");
        setStatus(d.is_published ? "published" : "draft");
        setPublishedAt(parseDate(d.published_at));
        setCommentsEnabled(d.comments_enabled ?? true);
        setReactionsEnabled(d.reactions_enabled ?? true);
      })
      .catch((err) => {
        if (!cancelled) toast.error(formatApiErrorMessage(err));
        router.push("/admin/devotionals");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, id, router]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !devotional) return;
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error("Titre, extrait et contenu principal sont requis.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        devotional_category_id: categoryId.trim() ? Number(categoryId) : undefined,
        scripture_reference: scriptureReference.trim() || undefined,
        verse_text: verseText.trim() || undefined,
        excerpt: excerpt.trim(),
        content: content.trim(),
        practical_application: practicalApplication.trim() || undefined,
        reflection_questions: reflectionQuestions.trim() || undefined,
        prayer: prayer.trim() || undefined,
        reading_time: readingTime.trim() || undefined,
        published_at: publishedAt || undefined,
        is_published: status === "published",
        comments_enabled: commentsEnabled,
        reactions_enabled: reactionsEnabled,
      };
      await devotionalsApi.update(token, id, payload, {
        imageFile: imageFile ?? undefined,
        remove_cover_image: removeCoverImage,
      });
      toast.success("Dévotion enregistrée.");
      router.push("/admin/devotionals");
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!devotional) {
    return null;
  }

  const previewHref = `/devotion/${devotional.slug || devotional.id}`;

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link
          href="/admin/devotionals"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux dévotions
        </Link>
      </div>

      <AdminPageHeader
        title="Modifier la dévotion"
        description={devotional.title}
        action={
          <AdminButton href="/admin/devotionals" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Annuler
          </AdminButton>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)] gap-6 xl:gap-8 items-start w-full">
          <div className="space-y-6 min-w-0">
            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Contenu</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Titre, référence biblique et texte principal
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-title">
                    Titre *
                  </label>
                  <input
                    id="dev-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: La fidélité de Dieu ne faillit jamais"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-slug">
                    Slug (URL)
                  </label>
                  <input
                    id="dev-slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="la-fidelite-de-dieu"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-category">
                    Catégorie
                  </label>
                  <select
                    id="dev-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-reference">
                      Référence biblique
                    </label>
                    <input
                      id="dev-reference"
                      type="text"
                      value={scriptureReference}
                      onChange={(e) => setScriptureReference(e.target.value)}
                      placeholder="Ex: Lamentations 3:22-23"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-reading">
                      Temps de lecture
                    </label>
                    <input
                      id="dev-reading"
                      type="text"
                      value={readingTime}
                      onChange={(e) => setReadingTime(e.target.value)}
                      placeholder="Ex: 5 min"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-verse">
                    Texte du verset (citation)
                  </label>
                  <textarea
                    id="dev-verse"
                    rows={3}
                    value={verseText}
                    onChange={(e) => setVerseText(e.target.value)}
                    placeholder={'Ex: "Les bontés de l\'Éternel ne sont pas épuisées..."'}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-excerpt">
                    Extrait * (résumé pour les cartes)
                  </label>
                  <textarea
                    id="dev-excerpt"
                    rows={2}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Court résumé affiché dans la liste des dévotions..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-content">
                    Contenu principal *
                  </label>
                  <textarea
                    id="dev-content"
                    rows={10}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Méditation, commentaire et développement..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </AdminCard>

            <div className="flex flex-wrap items-center gap-4">
              <AdminButton type="submit" icon={<Save className="w-4 h-4" />} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </AdminButton>
              <AdminButton href="/admin/devotionals" variant="outline">
                Annuler
              </AdminButton>
              <AdminButton href={previewHref} target="_blank" variant="ghost" icon={<Eye className="w-4 h-4" />}>
                Aperçu
              </AdminButton>
            </div>
          </div>

          <div className="space-y-6 min-w-0">
            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Média</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Image de couverture (bannière ou carte)
                </p>
              </div>
              <div className="p-6 space-y-4">
                {devotional.cover_image_url && !removeCoverImage && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={devotional.cover_image_url}
                      alt="Couverture actuelle"
                      className="w-full h-40 object-cover"
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={removeCoverImage}
                        onChange={(e) => setRemoveCoverImage(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-sm text-muted-foreground">Supprimer l’image à l’enregistrement</span>
                    </label>
                  </div>
                )}
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-brand-primary/30 transition-colors">
                  <p className="text-sm text-muted-foreground mb-2">
                    Glissez une image ici ou cliquez pour remplacer
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG ou WebP. Max 2 Mo.</p>
                  <input
                    id="dev-cover"
                    type="file"
                    className="mt-4 text-sm"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                  {imageFile && (
                    <p className="text-xs text-muted-foreground mt-2">{imageFile.name}</p>
                  )}
                </div>
              </div>
            </AdminCard>

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Sections complémentaires</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Application pratique, questions de réflexion et prière
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-practical">
                    Application pratique
                  </label>
                  <textarea
                    id="dev-practical"
                    rows={4}
                    value={practicalApplication}
                    onChange={(e) => setPracticalApplication(e.target.value)}
                    placeholder="Conseils pour mettre en pratique le message..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-questions">
                    Questions de réflexion (une par ligne)
                  </label>
                  <textarea
                    id="dev-questions"
                    rows={5}
                    value={reflectionQuestions}
                    onChange={(e) => setReflectionQuestions(e.target.value)}
                    placeholder={"Quand avez-vous expérimenté la fidélité de Dieu ?\nY a-t-il un domaine où vous doutez actuellement ?"}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="dev-prayer">
                    Prière
                  </label>
                  <textarea
                    id="dev-prayer"
                    rows={4}
                    value={prayer}
                    onChange={(e) => setPrayer(e.target.value)}
                    placeholder="Prière de conclusion..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </AdminCard>

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-brand-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Publication</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Statut et date de publication
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Statut</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="dev-status"
                          checked={status === "draft"}
                          onChange={() => setStatus("draft")}
                          className="text-brand-primary"
                        />
                        <span className="text-sm">Brouillon</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="dev-status"
                          checked={status === "published"}
                          onChange={() => setStatus("published")}
                          className="text-brand-primary"
                        />
                        <span className="text-sm">Publier</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date de publication
                    </label>
                    <DatePicker
                      value={publishedAt}
                      onChange={(v) => setPublishedAt(v)}
                      placeholder="jj / mm / aaaa"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Interactions</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={commentsEnabled}
                        onChange={(e) => setCommentsEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-sm font-medium text-foreground">Autoriser les commentaires</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reactionsEnabled}
                        onChange={(e) => setReactionsEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-sm font-medium text-foreground">Autoriser les réactions</span>
                    </label>
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </form>
    </div>
  );
}
