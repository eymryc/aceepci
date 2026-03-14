"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, BookOpen, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { DatePicker } from "@/components/ui/date-picker";
import { devotionalCategoriesApi, devotionalsApi, formatApiErrorMessage } from "@/lib/api";

type DevotionalCategory = { id: number; name: string; code?: string | null; display_order?: number | null };

export default function AdminDevotionalsNewPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
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
          [...list].sort(
            (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
          )
        );
      })
      .catch(() => setCategoryOptions([]));
  }, [token]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
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
      await devotionalsApi.create(token, payload, { imageFile: imageFile ?? undefined });
      toast.success(status === "published" ? "Dévotion publiée." : "Brouillon enregistré.");
      router.push("/admin/devotionals");
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

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
        title="Nouvelle dévotion"
        description="Rédigez une méditation quotidienne"
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
                    title="Titre de la dévotion"
                    aria-label="Titre de la dévotion"
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
                    title="Slug ou URL de la dévotion"
                    aria-label="Slug ou URL de la dévotion"
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
                    title="Catégorie de la dévotion"
                    aria-label="Catégorie de la dévotion"
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
                      title="Référence du passage"
                      aria-label="Référence biblique"
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
                      title="Temps de lecture"
                      aria-label="Temps de lecture"
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
                    placeholder={"Ex: \"Les bontés de l'Éternel ne sont pas épuisées...\""}
                    title="Citation du verset"
                    aria-label="Texte du verset"
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
                    aria-label="Extrait ou résumé"
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
                    title="Contenu principal de la dévotion"
                    aria-label="Contenu principal"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </AdminCard>

            <div className="flex flex-wrap items-center gap-4">
              <AdminButton type="submit" icon={<Save className="w-4 h-4" />} disabled={saving}>
                {saving
                  ? "Enregistrement..."
                  : status === "published"
                    ? "Publier"
                    : "Enregistrer le brouillon"}
              </AdminButton>
              <AdminButton href="/admin/devotionals" variant="outline">
                Annuler
              </AdminButton>
              <AdminButton href="/devotion/1" target="_blank" variant="ghost" icon={<Eye className="w-4 h-4" />}>
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
              <div className="p-6">
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-brand-primary/30 transition-colors">
                  <p className="text-sm text-muted-foreground mb-2">
                    Glissez une image ici ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG ou WebP. Max 2 Mo.
                  </p>
                  <label className="sr-only" htmlFor="dev-cover">
                    Image de couverture
                  </label>
                  <input
                    id="dev-cover"
                    type="file"
                    className="mt-4 text-sm"
                    accept="image/*"
                    title="Fichier image de couverture"
                    aria-label="Fichier image de couverture"
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
                    aria-label="Application pratique"
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
                    aria-label="Questions de réflexion"
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
                    aria-label="Prière"
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
                          aria-label="Statut brouillon"
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
                          aria-label="Statut publié"
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
                      aria-label="Date de publication"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Interactions</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={commentsEnabled}
                          onChange={(e) => setCommentsEnabled(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                          aria-label="Autoriser les commentaires"
                        />
                        <span className="text-sm font-medium text-foreground">Autoriser les commentaires</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reactionsEnabled}
                          onChange={(e) => setReactionsEnabled(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                          aria-label="Autoriser les réactions"
                        />
                        <span className="text-sm font-medium text-foreground">Autoriser les réactions</span>
                      </label>
                    </div>
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
