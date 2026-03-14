"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight, Send, Ban, Tag, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminButton } from "@/components/admin";
import { galleryMediaApi, type GalleryMediaItem } from "@/lib/api";
import { formatApiErrorMessage } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const STATUS_OPTIONS: { value: "all" | "published" | "draft"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "published", label: "Publié" },
  { value: "draft", label: "Brouillon" },
];

export default function AdminGalleryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<GalleryMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<GalleryMediaItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishTarget, setPublishTarget] = useState<{ item: GalleryMediaItem; action: "publish" | "unpublish" } | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [statusSearch, setStatusSearch] = useState("");

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await galleryMediaApi.list(token, {
        page,
        per_page: perPage,
        search: search || undefined,
        status: statusFilter,
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const last = res.last_page ?? res.meta?.last_page ?? 1;
      setItems(data);
      setLastPage(last);
      setTotal(res.total ?? res.meta?.total ?? (page === last ? (page - 1) * perPage + data.length : last * perPage));
    } catch (err: unknown) {
      setError(formatApiErrorMessage(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, page, perPage, search, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleDeleteClick = (item: GalleryMediaItem) => {
    setDeleting(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deleting) return;
    setDeleteLoading(true);
    try {
      await galleryMediaApi.delete(token, deleting.id);
      toast.success("Photo supprimée");
      setDeleteDialogOpen(false);
      setDeleting(null);
      fetchData();
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePublishClick = (item: GalleryMediaItem) => {
    setPublishTarget({ item, action: "publish" });
    setPublishDialogOpen(true);
  };

  const handleUnpublishClick = (item: GalleryMediaItem) => {
    setPublishTarget({ item, action: "unpublish" });
    setPublishDialogOpen(true);
  };

  const filteredStatusOptions = useMemo(() => {
    const q = statusSearch.trim().toLowerCase();
    if (!q) return STATUS_OPTIONS;
    return STATUS_OPTIONS.filter((o) => o.label.toLowerCase().includes(q));
  }, [statusSearch]);

  const handlePublishConfirm = async () => {
    if (!token || !publishTarget) return;
    setPublishLoading(true);
    try {
      if (publishTarget.action === "publish") {
        await galleryMediaApi.publish(token, publishTarget.item.id);
        toast.success("Photo publiée");
      } else {
        await galleryMediaApi.unpublish(token, publishTarget.item.id);
        toast.success("Photo dépubliée");
      }
      setPublishDialogOpen(false);
      setPublishTarget(null);
      fetchData();
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setPublishLoading(false);
    }
  };

  function imageUrl(item: GalleryMediaItem): string {
    const url = item.image_url ?? item.image_path;
    if (typeof url === "string" && url.startsWith("http")) return url;
    if (typeof url === "string" && url) {
      const base = process.env.NEXT_PUBLIC_API_URL || "";
      return base ? `${base.replace(/\/$/, "")}/storage/${url.replace(/^storage\/?/, "")}` : url;
    }
    return "";
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground uppercase tracking-tight">
          Galerie média
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Galerie média pour les photos et vidéos de l&apos;ACEEPCI.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par titre ou catégorie..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
              aria-label="Rechercher"
            />
          </form>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/gallery/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-lg hover:opacity-95 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Ajouter une photo
            </Link>
            <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full border-2 border-dashed border-violet-200 bg-violet-50/80 text-violet-700 hover:bg-violet-100/80 transition-colors"
                  aria-label="Filtrer par statut"
                >
                  <Tag className="w-4 h-4 text-violet-600" />
                  Statut
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Statut"
                      value={statusSearch}
                      onChange={(e) => setStatusSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      aria-label="Rechercher un statut"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto py-1">
                  {filteredStatusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setPage(1);
                        setStatusSearch("");
                        setStatusPopoverOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-none transition-colors ${
                        statusFilter === opt.value
                          ? "bg-violet-100 text-violet-800 font-medium"
                          : "text-foreground hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-violet-300">
                        {statusFilter === opt.value ? (
                          <Check className="w-3 h-3 text-violet-600" />
                        ) : null}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <AdminButton
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={() => fetchData()}
              disabled={loading}
            >
              Actualiser
            </AdminButton>
          </div>
        </div>
        <div className="p-6">
          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Aucune photo. Ajoutez-en une pour commencer.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-xl overflow-hidden border border-border hover:border-brand-primary/30 transition-all bg-muted"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {imageUrl(item) ? (
                      <img
                        src={imageUrl(item)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Pas d&apos;image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <span className="text-[0.65rem] font-semibold tracking-wider uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mb-1">
                        {item.category ?? "—"}
                      </span>
                      <p className="text-sm font-bold text-white leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{item.title}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.is_published ? (
                      <button
                        type="button"
                        onClick={() => handleUnpublishClick(item)}
                        disabled={publishLoading}
                        className="p-2 bg-white/90 rounded-lg hover:bg-amber-50 text-amber-600"
                        title="Dépublier"
                        aria-label="Dépublier la photo"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePublishClick(item)}
                        disabled={publishLoading}
                        className="p-2 bg-white/90 rounded-lg hover:bg-green-50 text-green-600"
                        title="Publier"
                        aria-label="Publier la photo"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <Link
                      href={`/admin/gallery/${item.id}/edit`}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white text-foreground"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 bg-white/90 rounded-lg hover:bg-red-50 text-red-600"
                      title="Supprimer"
                      aria-label="Supprimer la photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  </div>
                  {/* Barre de statut toujours visible (comme colonne Statut dans sermons) */}
                  <div
                    className={`flex items-center justify-center px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white ${
                      item.is_published
                        ? "bg-emerald-600"
                        : "bg-amber-500"
                    }`}
                  >
                    {item.is_published ? "Publié" : "Brouillon"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && items.length > 0 && total > 0 && (
          <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {(page - 1) * perPage + 1} à {Math.min(page * perPage, total)} sur {total}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Par page</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1.5 border border-border rounded-lg text-foreground bg-white"
                  aria-label="Lignes par page"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Page {page} sur {lastPage}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                    disabled={page >= lastPage}
                    className="p-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Page suivante"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la photo ?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Vous êtes sur le point de supprimer &quot;{deleting?.title}&quot;. Cette action est irréversible.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {publishTarget?.action === "publish" ? "Publier la photo ?" : "Dépublier la photo ?"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            {publishTarget?.action === "publish"
              ? `La photo "${publishTarget?.item.title}" sera visible sur le site (page d'accueil, galerie).`
              : `La photo "${publishTarget?.item.title}" ne sera plus visible sur le site.`}
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={publishLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishConfirm}
              disabled={publishLoading}
              className={publishTarget?.action === "unpublish" ? "bg-amber-600 hover:bg-amber-700" : undefined}
            >
              {publishLoading ? "En cours..." : publishTarget?.action === "publish" ? "Publier" : "Dépublier"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
