"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ImagePlus, User, Link2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { eventsApi, formatApiErrorMessage, blogApi, blogCategoriesApi, type BlogArticle, publicOptionsApi, resolveMemberImageUrl } from "@/lib/api";
import { DatePicker } from "@/components/ui/date-picker";

export default function AdminBlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const id = Number(params.id);

  const [eventOptions, setEventOptions] = useState<{ id: number; label: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  /** ID de la catégorie (blog_category_id ou news_category_id) */
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryFromNews, setCategoryFromNews] = useState(false);
  /** Si l'article a une catégorie actualité, charger les catégories actualités pour préselectionner */
  const [preferNewsCategories, setPreferNewsCategories] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorAvatarFile, setAuthorAvatarFile] = useState<File | null>(null);
  const [readingTime, setReadingTime] = useState("");
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

  // En édition : si l'article a news_category_id, charger d'abord les catégories actualités pour préselectionner ; sinon catégories blog
  useEffect(() => {
    let cancelled = false;
    const setOptions = (items: { id: number; name: string }[], fromNews = false) => {
      if (cancelled) return;
      setCategoryOptions(items.map((c) => ({ id: c.id, name: c.name || String(c.id) })));
      setCategoryFromNews(fromNews);
    };
    const tryNewsFallback = () =>
      publicOptionsApi.newsCategories().then((newsItems) => {
        const newsList = (newsItems ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
        if (newsList.length > 0) setOptions(newsList, true);
      });
    const loadBlogThenNews = () => {
      if (!token) return tryNewsFallback();
      return blogCategoriesApi.list(token, { per_page: 100 }).then((res) => {
        if (cancelled) return;
        const data = (res.data ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
        if (data.length > 0) {
          setOptions(data, false);
          return;
        }
        return publicOptionsApi.blogCategories().then((items) => {
          const list = (items ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
          if (list.length > 0) setOptions(list, false);
          else return tryNewsFallback();
        });
      }).catch(() => {
        if (cancelled) return;
        return publicOptionsApi.blogCategories().then((items) => {
          const list = (items ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
          if (list.length > 0) setOptions(list, false);
          else return tryNewsFallback();
        }).catch(() => tryNewsFallback());
      });
    };

    if (preferNewsCategories) {
      publicOptionsApi.newsCategories().then((newsItems) => {
        if (cancelled) return;
        const newsList = (newsItems ?? []).map((c) => ({ id: c.id, name: c.name || String(c.id) }));
        if (newsList.length > 0) {
          setOptions(newsList, true);
          return;
        }
        loadBlogThenNews();
      }).catch(() => loadBlogThenNews());
    } else {
      loadBlogThenNews();
    }
    return () => {
      cancelled = true;
    };
  }, [token, preferNewsCategories]);

  // Préselectionner la catégorie : par ID si présent dans les options, sinon par nom (article.category ou blog_category)
  useEffect(() => {
    if (!article || !categoryOptions.length) return;
    const currentId = categoryId ? Number(categoryId) : null;
    const inOptions = currentId != null && categoryOptions.some((c) => c.id === currentId);
    if (inOptions) return;

    const name =
      (typeof article.blog_category === "object" && article.blog_category !== null && "name" in article.blog_category
        ? (article.blog_category as { name?: string }).name
        : null) ??
      (typeof article.news_category === "object" && article.news_category !== null && "name" in article.news_category
        ? (article.news_category as { name?: string }).name
        : null) ??
      (typeof article.category === "object" && article.category !== null && "name" in article.category
        ? (article.category as { name: string }).name
        : null) ??
      (typeof article.category === "string" ? article.category : null) ??
      "";
    if (name) {
      const found = categoryOptions.find((c) => c.name === name || c.name === String(name).trim());
      if (found) setCategoryId(String(found.id));
    }
  }, [article, categoryOptions, categoryId]);

  const handleRemoveGalleryFile = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!token || !id || Number.isNaN(id)) return;
    setLoading(true);
    blogApi
      .get(token, id)
      .then((data) => {
        setArticle(data);
        setTitle(data.title ?? "");
        setSlug(data.slug ?? "");
        const catId =
          data.blog_category_id ??
          data.news_category_id ??
          data.blog_category?.id ??
          data.news_category?.id ??
          (typeof data.category === "object" && data.category !== null && "id" in data.category
            ? (data.category as { id: number }).id
            : null);
        setCategoryId(catId != null ? String(catId) : "");
        setPreferNewsCategories(!!(data.news_category_id ?? data.news_category?.id));
        setExcerpt(data.excerpt ?? "");
        setContent(data.content ?? "");
        setAuthorName(data.author_name ?? "");
        setAuthorRole(data.author_role ?? "");
        const readingVal =
          data.reading_time ??
          (data.reading_time_minutes != null ? `${Number(data.reading_time_minutes)} min` : "");
        setReadingTime(String(readingVal ?? ""));
        setViewsCount(String(data.views_count ?? 0));
        setStatus(data.is_published ?? !!data.published_at ? "published" : "draft");
        const rawPublishedAt = data.published_at ?? "";
        const normalizedPublishedAt =
          rawPublishedAt && typeof rawPublishedAt === "string"
            ? rawPublishedAt.slice(0, 10)
            : "";
        setPublishedAt(normalizedPublishedAt);
        const eventId =
          data.linked_event_id ??
          data.event_id ??
          (data.linked_event?.id != null ? data.linked_event.id : null);
        setLinkedEventId(eventId != null ? String(eventId) : "");
        setCustomCtaLabel((data.cta_label ?? data.custom_cta_label ?? "") as string);
        setCustomCtaUrl((data.cta_link ?? data.custom_cta_url ?? "") as string);
        setCommentsEnabled(data.comments_enabled ?? true);
        setReactionsEnabled(data.reactions_enabled ?? true);
      })
      .catch(() => {
        toast.error("Article introuvable.");
        router.push("/admin/blog");
      })
      .finally(() => setLoading(false));
  }, [token, id, router]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !article) return;
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error("Titre, extrait et contenu sont requis.");
      return;
    }
    setSaving(true);
    try {
      const res = await blogApi.update(
        token,
        article.id,
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
      toast.success(res.message || "Article enregistré.");
      router.push("/admin/blog");
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="p-12 text-center text-muted-foreground">Chargement...</div>
      </div>
    );
  }

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
        title="Modifier l'article"
        description={article?.title ?? "Article"}
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
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-title">Titre *</label>
                  <input
                    id="blog-edit-title"
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-slug">Slug (URL)</label>
                  <input
                    id="blog-edit-slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-de-larticle"
                    title="Slug ou URL de l'article"
                    aria-label="Slug ou URL de l'article"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-category">Catégorie</label>
                  <select
                    id="blog-edit-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    title="Catégorie de l'article"
                    aria-label="Catégorie de l'article"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary bg-white"
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
                      Catégories actualités (la catégorie sera enregistrée).
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-excerpt">Extrait *</label>
                  <textarea
                    id="blog-edit-excerpt"
                    rows={3}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Résumé court de l'article"
                    title="Extrait ou résumé de l'article"
                    aria-label="Extrait ou résumé de l'article"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-content">Contenu *</label>
                  <textarea
                    id="blog-edit-content"
                    rows={14}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Contenu principal de l'article"
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-author">Nom de l&apos;auteur</label>
                  <input
                    id="blog-edit-author"
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-author-role">Rôle / sous-titre</label>
                  <input
                    id="blog-edit-author-role"
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-reading">Temps de lecture</label>
                  <input
                    id="blog-edit-reading"
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-views">Vues initiales</label>
                  <input
                    id="blog-edit-views"
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
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-foreground mb-1" htmlFor="blog-edit-avatar">Avatar auteur</label>
                  {(article?.author_avatar_url ?? article?.author_avatar_path) && (
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveMemberImageUrl(article.author_avatar_url ?? article.author_avatar_path ?? "")}
                        alt="Avatar auteur actuel"
                        className="w-16 h-16 rounded-full object-cover border border-border"
                      />
                      <p className="text-xs text-muted-foreground">Avatar actuel</p>
                    </div>
                  )}
                  <input
                    id="blog-edit-avatar"
                    type="file"
                    accept="image/*"
                    className="text-sm"
                    title="Fichier image pour l'avatar de l'auteur"
                    aria-label="Fichier image pour l'avatar de l'auteur"
                    onChange={(e) => setAuthorAvatarFile(e.target.files?.[0] ?? null)}
                  />
                  {authorAvatarFile && (
                    <p className="text-xs text-muted-foreground mt-1">{authorAvatarFile.name}</p>
                  )}
                </div>
              </div>
            </AdminCard>

            <div className="flex gap-4">
              <AdminButton type="submit" icon={<Save className="w-4 h-4" />} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </AdminButton>
              <AdminButton href="/admin/blog" variant="outline">
                Annuler
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
              <div className="p-6 space-y-3">
                {(article?.cover_image_url ?? article?.image_url ?? article?.cover_image_path) && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Image de couverture actuelle</p>
                    <img
                      src={resolveMemberImageUrl(
                        (article.cover_image_url ?? article.image_url ?? article.cover_image_path) ?? ""
                      )}
                      alt="Couverture actuelle"
                      className="max-h-48 w-auto rounded-lg border border-border object-contain bg-slate-50"
                    />
                  </div>
                )}
                <label className="block text-sm font-medium text-foreground mb-1 sr-only" htmlFor="blog-edit-cover">Image de couverture</label>
                <input
                  id="blog-edit-cover"
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  title="Fichier image de couverture"
                  aria-label="Fichier image de couverture"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
                {imageFile && (
                  <p className="text-xs text-muted-foreground">
                    {imageFile.name} (remplacera l&apos;image actuelle)
                  </p>
                )}
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
                {(() => {
                  const raw =
                    article?.gallery_urls ??
                    article?.gallery_images ??
                    article?.gallery ??
                    [];
                  const urls: string[] = (() => {
                    let list: unknown[] = [];
                    if (Array.isArray(raw)) {
                      list = raw;
                    } else if (typeof raw === "string") {
                      try {
                        const parsed = JSON.parse(raw) as unknown;
                        list = Array.isArray(parsed) ? parsed : raw.trim() ? [raw] : [];
                      } catch {
                        list = raw.trim() ? [raw] : [];
                      }
                    } else if (raw && typeof raw === "object" && !Array.isArray(raw)) {
                      list = Object.values(raw);
                    }
                    return list
                      .map((item) =>
                        typeof item === "string"
                          ? item
                          : item && typeof item === "object" && "url" in item
                            ? String((item as { url?: string }).url ?? "")
                            : item && typeof item === "object" && "path" in item
                              ? String((item as { path?: string }).path ?? "")
                              : ""
                      )
                      .filter(Boolean);
                  })();
                  if (urls.length === 0) {
                    return (
                      <p className="text-xs text-muted-foreground">
                        Aucune image en galerie. Sélectionnez des fichiers ci-dessous pour en ajouter.
                      </p>
                    );
                  }
                  return (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Galerie actuelle ({urls.length} image(s))
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {urls.map((url, index) => (
                          <img
                            key={`${url}-${index}`}
                            src={resolveMemberImageUrl(url)}
                            alt={`Galerie ${index + 1}`}
                            className="h-20 w-20 rounded-lg border border-border object-cover bg-slate-50"
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
                <label className="block text-sm font-medium text-foreground mb-1 sr-only" htmlFor="blog-edit-gallery">Galerie photos</label>
                <input
                  id="blog-edit-gallery"
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
                      {galleryFiles.length} nouvelle(s) image(s) sélectionnée(s)
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
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Publication</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Statut et date de publication
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Statut</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={status === "draft"}
                          onChange={() => setStatus("draft")}
                          className="text-brand-primary"
                          title="Statut brouillon"
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
                          title="Statut publié"
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-event">Événement lié</label>
                  <select
                    id="blog-edit-event"
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
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-cta-label">Libellé CTA personnalisé</label>
                  <input
                    id="blog-edit-cta-label"
                    type="text"
                    value={customCtaLabel}
                    onChange={(e) => setCustomCtaLabel(e.target.value)}
                    placeholder="Ex: S'inscrire"
                    title="Libellé du bouton d'appel à l'action"
                    aria-label="Libellé du bouton d'appel à l'action"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="blog-edit-cta-link">Lien CTA personnalisé</label>
                  <input
                    id="blog-edit-cta-link"
                    type="text"
                    value={customCtaUrl}
                    onChange={(e) => setCustomCtaUrl(e.target.value)}
                    placeholder="https://..."
                    title="URL du lien d'appel à l'action"
                    aria-label="URL du lien d'appel à l'action"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </AdminCard>

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-brand-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Interactions</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Activez ou désactivez les interactions utilisateur
                  </p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={commentsEnabled}
                      onChange={(e) => setCommentsEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                      title="Autoriser les commentaires"
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
                      title="Autoriser les réactions"
                      aria-label="Autoriser les réactions"
                    />
                    <span className="text-sm font-medium text-foreground">Autoriser les réactions</span>
                  </label>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </form>
    </div>
  );
}
