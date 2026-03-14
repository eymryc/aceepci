"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, ImagePlus, User, Link2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { eventsApi, formatApiErrorMessage, blogApi, blogCategoriesApi, publicOptionsApi } from "@/lib/api";
import { DatePicker } from "@/components/ui/date-picker";

export default function AdminBlogNewPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [eventOptions, setEventOptions] = useState<{ id: number; label: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  /** ID de la catégorie (blog_category_id ou news en secours), pas le nom */
  const [categoryId, setCategoryId] = useState<string>("");
  /** true si les options affichées viennent des catégories actualités (on n'envoie pas blog_category_id) */
  const [categoryFromNews, setCategoryFromNews] = useState(false);
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
    const setOptions = (items: { id: number; name: string }[], fromNews = false) => {
      if (cancelled) return;
      setCategoryOptions(items.map((c) => ({ id: c.id, name: c.name || String(c.id) })));
      setCategoryFromNews(fromNews);
    };
    publicOptionsApi
      .blogCategories()
      .then((items) => {
        const list = (items ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
        if (list.length > 0) {
          setOptions(list, false);
          return;
        }
        if (!token) return;
        return blogCategoriesApi.list(token, { per_page: 100 }).then((res) => {
          const data = (res.data ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
          if (data.length > 0) {
            setOptions(data, false);
            return;
          }
          return publicOptionsApi.newsCategories().then((newsItems) => {
            const newsList = (newsItems ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
            if (newsList.length > 0) setOptions(newsList, true);
          });
        });
      })
      .catch(() => {
        if (cancelled) return;
        if (token) {
          blogCategoriesApi
            .list(token, { per_page: 100 })
            .then((res) => {
              const data = (res.data ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
              if (data.length > 0) {
                setCategoryOptions(data);
                setCategoryFromNews(false);
              } else {
                return publicOptionsApi.newsCategories().then((newsItems) => {
                  const newsList = (newsItems ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
                  if (newsList.length > 0) {
                    setCategoryOptions(newsList);
                    setCategoryFromNews(true);
                  }
                });
              }
            })
            .catch(() => {
              publicOptionsApi.newsCategories().then((newsItems) => {
                const newsList = (newsItems ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
                if (newsList.length > 0) {
                  setCategoryOptions(newsList);
                  setCategoryFromNews(true);
                } else {
                  setCategoryOptions([]);
                  setCategoryFromNews(false);
                }
              }).catch(() => {
                setCategoryOptions([]);
                setCategoryFromNews(false);
              });
            });
        } else {
          publicOptionsApi.newsCategories().then((newsItems) => {
            const newsList = (newsItems ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
            setCategoryOptions(newsList.length > 0 ? newsList : []);
            setCategoryFromNews(newsList.length > 0);
          }).catch(() => {
            setCategoryOptions([]);
            setCategoryFromNews(false);
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

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
      const res = await blogApi.create(
        token,
        {
          title: title.trim(),
          slug: slug.trim() || undefined,
          blog_category_id: categoryFromNews ? "" : (categoryId && /^\d+$/.test(categoryId) ? categoryId : ""),
          news_category_id: categoryFromNews ? (categoryId && /^\d+$/.test(categoryId) ? categoryId : "") : "",
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
      toast.success(res.message || (status === "published" ? "Article publié." : "Brouillon enregistré."));
      router.push("/admin/blog");
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
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>
      </div>

      <AdminPageHeader
        title="Nouvel article"
        description="Rédigez et publiez un nouvel article"
        action={
          <AdminButton href="/admin/blog" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-title">Titre *</label>
                  <input
                    id="blog-new-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Lancement du Camp Biblique National 2026"
                    title="Titre de l'article"
                    aria-label="Titre de l'article"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-slug">Slug (URL)</label>
                  <input
                    id="blog-new-slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="lancement-du-camp-biblique-national-2026"
                    title="Slug ou URL de l'article"
                    aria-label="Slug ou URL de l'article"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-category">Catégorie</label>
                  <select
                    id="blog-new-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    title="Catégorie de l'article"
                    aria-label="Catégorie de l'article"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {categoryFromNews && categoryOptions.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Catégories actualités (la catégorie ne sera pas enregistrée ; créez des catégories blog dans Paramètres pour l’enregistrement).
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-excerpt">Extrait *</label>
                  <textarea
                    id="blog-new-excerpt"
                    rows={3}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Court résumé affiché dans la liste..."
                    aria-label="Extrait ou résumé de l'article"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-content">Contenu *</label>
                  <textarea
                    id="blog-new-content"
                    rows={10}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Contenu complet de l'article..."
                    title="Contenu de l'article"
                    aria-label="Contenu de l'article"
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-author">Nom de l&apos;auteur</label>
                  <input
                    id="blog-new-author"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Nom de l'auteur"
                    title="Nom de l'auteur"
                    aria-label="Nom de l'auteur"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-author-role">Rôle / sous-titre</label>
                  <input
                    id="blog-new-author-role"
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="Rôle ou sous-titre"
                    title="Rôle ou sous-titre de l'auteur"
                    aria-label="Rôle ou sous-titre de l'auteur"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-reading">Temps de lecture</label>
                  <input
                    id="blog-new-reading"
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="Ex: 4 min"
                    title="Temps de lecture"
                    aria-label="Temps de lecture"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-views">Vues initiales</label>
                  <input
                    id="blog-new-views"
                    type="number"
                    min="0"
                    value={viewsCount}
                    onChange={(e) => setViewsCount(e.target.value)}
                    placeholder="0"
                    title="Nombre de vues initiales"
                    aria-label="Nombre de vues initiales"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-avatar">Avatar auteur</label>
                  <input
                    id="blog-new-avatar"
                    type="file"
                    className="text-sm"
                    accept="image/*"
                    title="Fichier image pour l'avatar de l'auteur"
                    aria-label="Fichier image pour l'avatar de l'auteur"
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
              <AdminButton href="/admin/blog" variant="outline">
                Annuler
              </AdminButton>
              <AdminButton href="/blog/1" target="_blank" variant="ghost" icon={<Eye className="w-4 h-4" />}>
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
                  <label className="sr-only" htmlFor="blog-new-cover">Image de couverture</label>
                  <input
                    id="blog-new-cover"
                    type="file"
                    className="mt-4 text-sm"
                    accept="image/*"
                    title="Fichier image de couverture"
                    aria-label="Fichier image de couverture"
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
                    Images supplémentaires associées à l&apos;article
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <label className="block text-sm font-medium text-foreground mb-1 sr-only" htmlFor="blog-new-gallery">Galerie photos</label>
                <input
                  id="blog-new-gallery"
                  type="file"
                  className="text-sm"
                  accept="image/*"
                  multiple
                  title="Fichiers images pour la galerie"
                  aria-label="Fichiers images pour la galerie"
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
                          aria-label="Statut brouillon"
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

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <Link2 className="w-4 h-4 text-brand-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Événement lié et CTA</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Associez l&apos;article à un événement existant sans dupliquer ses données
                  </p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-event">Événement lié</label>
                  <select
                    id="blog-new-event"
                    value={linkedEventId}
                    onChange={(e) => setLinkedEventId(e.target.value)}
                    title="Événement lié à l'article"
                    aria-label="Événement lié à l'article"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
                  >
                    <option value="">Aucun événement lié</option>
                    {eventOptions.map((event) => (
                      <option key={event.id} value={String(event.id)}>
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-cta-label">Libellé CTA personnalisé</label>
                  <input
                    id="blog-new-cta-label"
                    type="text"
                    value={customCtaLabel}
                    onChange={(e) => setCustomCtaLabel(e.target.value)}
                    placeholder="Ex: S'inscrire au camp"
                    title="Libellé du bouton d'appel à l'action"
                    aria-label="Libellé du bouton d'appel à l'action"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-new-cta-link">Lien CTA personnalisé</label>
                  <input
                    id="blog-new-cta-link"
                    type="text"
                    value={customCtaUrl}
                    onChange={(e) => setCustomCtaUrl(e.target.value)}
                    placeholder="/payments"
                    title="URL du lien d'appel à l'action"
                    aria-label="URL du lien d'appel à l'action"
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
