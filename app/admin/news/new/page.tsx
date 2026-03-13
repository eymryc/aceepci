"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, ImagePlus, User, Link2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { eventsApi, newsApi, NEWS_CATEGORIES, publicOptionsApi } from "@/lib/api";
import { DatePicker } from "@/components/ui/date-picker";

export default function AdminNewsNewPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [eventOptions, setEventOptions] = useState<{ id: number; label: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<string>("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [authorName, setAuthorName] = useState("Équipe Communication ACEEPCI");
  const [authorRole, setAuthorRole] = useState("Équipe de communication");
  const [authorAvatarFile, setAuthorAvatarFile] = useState<File | null>(null);
  const [readingTime, setReadingTime] = useState("4 min");
  const [viewsCount, setViewsCount] = useState<string>("0");
  const [publishedAt, setPublishedAt] = useState("");
  const [linkedEventId, setLinkedEventId] = useState<string>("");
  const [customCtaLabel, setCustomCtaLabel] = useState("");
  const [customCtaUrl, setCustomCtaUrl] = useState("");
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [reactionsEnabled, setReactionsEnabled] = useState(true);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(slugify(value));
    }
  };

  useEffect(() => {
    if (!token) return;
    eventsApi
      .list(token, { per_page: 100 })
      .then((res) => {
        const options = (res.data ?? []).map((event) => ({
          id: event.id,
          label: event.name || event.title || `Événement #${event.id}`,
        }));
        setEventOptions(options);
      })
      .catch(() => setEventOptions([]));
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    publicOptionsApi
      .newsCategories()
      .then((items) => {
        if (cancelled) return;
        const names = (items ?? []).map((c) => c.name).filter(Boolean);
        setCategoryOptions(names);
      })
      .catch(() => {
        if (cancelled) return;
        setCategoryOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRemoveGalleryFile = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Vous devez être connecté.");
      return;
    }
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error("Titre, extrait et contenu sont requis.");
      return;
    }
    setSaving(true);
    try {
      const res = await newsApi.create(
        token,
        {
          title: title.trim(),
          slug: slug.trim() || undefined,
          category: category || undefined,
          excerpt: excerpt.trim(),
          content: content.trim(),
          author_name: authorName.trim() || undefined,
          author_role: authorRole.trim() || undefined,
          reading_time: readingTime.trim() || undefined,
          views_count: viewsCount === "" ? "" : Number(viewsCount),
          published_at: publishedAt || undefined,
          linked_event_id: linkedEventId === "" ? "" : Number(linkedEventId),
          custom_cta_label: customCtaLabel.trim() || undefined,
          custom_cta_url: customCtaUrl.trim() || undefined,
          comments_enabled: commentsEnabled,
          reactions_enabled: reactionsEnabled,
          publish: status === "published",
        },
        {
          imageFile,
          authorAvatarFile,
          galleryFiles,
        }
      );
      toast.success(res.message || (status === "published" ? "Actualité publiée." : "Brouillon enregistré."));
      router.push("/admin/news");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Erreur lors de l'enregistrement.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link
          href="/admin/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux actualités
        </Link>
      </div>

      <AdminPageHeader
        title="Nouvelle actualité"
        description="Rédigez et publiez une nouvelle actualité"
        action={
          <AdminButton href="/admin/news" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
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
                  Titre, extrait et contenu de l&apos;article
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Titre *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Lancement du Camp Biblique National 2026"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="lancement-du-camp-biblique-national-2026"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {(categoryOptions.length ? categoryOptions : NEWS_CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Extrait *</label>
                  <textarea
                    rows={3}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Court résumé affiché dans la liste..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Contenu *</label>
                  <textarea
                    rows={10}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Contenu complet de l'article..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </AdminCard>

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <User className="w-4 h-4 text-brand-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Auteur et métriques</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Informations affichées sous l&apos;image principale
                  </p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nom de l&apos;auteur</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rôle / sous-titre</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Temps de lecture</label>
                  <input
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="Ex: 4 min"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Vues initiales</label>
                  <input
                    type="number"
                    min="0"
                    value={viewsCount}
                    onChange={(e) => setViewsCount(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Avatar auteur</label>
                  <input
                    type="file"
                    className="text-sm"
                    accept="image/*"
                    onChange={(e) => setAuthorAvatarFile(e.target.files?.[0] ?? null)}
                  />
                  {authorAvatarFile && (
                    <p className="text-xs text-muted-foreground mt-2">{authorAvatarFile.name}</p>
                  )}
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
              <AdminButton href="/admin/news" variant="outline">
                Annuler
              </AdminButton>
              <AdminButton href="/news/1" target="_blank" variant="ghost" icon={<Eye className="w-4 h-4" />}>
                Aperçu
              </AdminButton>
            </div>
          </div>

          <div className="space-y-6 min-w-0">
            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Média</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Image de couverture
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
                  <input
                    type="file"
                    className="mt-4 text-sm"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                  {imageFile && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {imageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </AdminCard>

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <ImagePlus className="w-4 h-4 text-brand-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Galerie photos</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Images supplémentaires associées à l&apos;actualité
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <input
                  type="file"
                  className="text-sm"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))}
                />
                {galleryFiles.length > 0 && (
                  <div className="rounded-lg border border-border bg-slate-50 p-3">
                    <p className="text-xs font-medium text-foreground mb-2">
                      {galleryFiles.length} image(s) sélectionnée(s)
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {galleryFiles.map((file, index) => (
                        <li
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryFile(index)}
                            className="text-[11px] px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                          >
                            Supprimer
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AdminCard>

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-brand-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Publication & interactions</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Statut, date de publication et interactions utilisateur
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Statut
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={status === "draft"}
                          onChange={() => setStatus("draft")}
                          className="text-brand-primary"
                        />
                        <span className="text-sm">Brouillon</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
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
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={commentsEnabled}
                          onChange={(e) => setCommentsEnabled(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
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
                        />
                        <span className="text-sm font-medium text-foreground">Autoriser les réactions</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <Link2 className="w-4 h-4 text-brand-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Événement lié et CTA</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Associez l&apos;actualité à un événement existant sans dupliquer ses données
                  </p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Événement lié</label>
                  <select
                    value={linkedEventId}
                    onChange={(e) => setLinkedEventId(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
                  >
                    <option value="">Aucun événement lié</option>
                    {eventOptions.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground rounded-lg border border-border bg-slate-50 px-3 py-2">
                    Si un événement est lié, la date, le lieu, le tarif et les détails du bloc de droite
                    doivent venir de la fiche événement.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Libellé CTA personnalisé</label>
                  <input
                    type="text"
                    value={customCtaLabel}
                    onChange={(e) => setCustomCtaLabel(e.target.value)}
                    placeholder="Ex: S'inscrire au camp"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Lien CTA personnalisé</label>
                  <input
                    type="text"
                    value={customCtaUrl}
                    onChange={(e) => setCustomCtaUrl(e.target.value)}
                    placeholder="/payments"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </form>
    </div>
  );
}
