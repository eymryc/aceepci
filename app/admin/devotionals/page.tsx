"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Eye, RefreshCw, ChevronLeft, ChevronRight, Send, Ban, Tag, Columns, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminBadge, AdminButton } from "@/components/admin";
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
import { devotionalsApi, type Devotional } from "@/lib/api";
import { formatApiErrorMessage } from "@/lib/api";

const STATUS_OPTIONS: { value: "all" | "published" | "draft"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "published", label: "Publié" },
  { value: "draft", label: "Brouillon" },
];

const DEVOTIONAL_TABLE_COLUMNS: { id: string; label: string; defaultVisible: boolean }[] = [
  { id: "title", label: "Titre", defaultVisible: true },
  { id: "slug", label: "Slug", defaultVisible: false },
  { id: "scripture_reference", label: "Référence", defaultVisible: true },
  { id: "category", label: "Catégorie", defaultVisible: true },
  { id: "excerpt", label: "Extrait", defaultVisible: false },
  { id: "published_at", label: "Publié le", defaultVisible: true },
  { id: "status", label: "Statut", defaultVisible: true },
  { id: "reading_time", label: "Temps de lecture", defaultVisible: false },
  { id: "created_at", label: "Créé le", defaultVisible: false },
  { id: "updated_at", label: "Modifié le", defaultVisible: false },
  { id: "actions", label: "Actions", defaultVisible: true },
];

const DEFAULT_VISIBLE_COLUMNS = DEVOTIONAL_TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id);

function formatDate(val: string | undefined | null): string {
  if (!val) return "—";
  const d = new Date(val);
  return Number.isNaN(d.getTime())
    ? val
    : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminDevotionalsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Devotional | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishTarget, setPublishTarget] = useState<{ item: Devotional; action: "publish" | "unpublish" } | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [statusSearch, setStatusSearch] = useState("");
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // TODO: remplacer par devotionalsApi.list(token, { page, per_page: perPage, search, status }) quand l’API sera prête
      const res = await devotionalsApi.list(token, {
        page,
        per_page: perPage,
        search: search || undefined,
        status: statusFilter,
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const last = res.meta?.last_page ?? res.last_page ?? 1;
      setItems(data);
      setLastPage(last);
      setTotal(res.meta?.total ?? res.total ?? (page === last ? (page - 1) * perPage + data.length : last * perPage));
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

  const handleDeleteClick = (item: Devotional) => {
    setDeleting(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleting || !token) return;
    setDeleteLoading(true);
    try {
      await devotionalsApi.delete(token, deleting.id);
      toast.success("Dévotion supprimée.");
      setDeleteDialogOpen(false);
      setDeleting(null);
      fetchData();
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePublishClick = (item: Devotional) => {
    setPublishTarget({ item, action: "publish" });
    setPublishDialogOpen(true);
  };

  const handleUnpublishClick = (item: Devotional) => {
    setPublishTarget({ item, action: "unpublish" });
    setPublishDialogOpen(true);
  };

  const filteredStatusOptions = useMemo(() => {
    const q = statusSearch.trim().toLowerCase();
    if (!q) return STATUS_OPTIONS;
    return STATUS_OPTIONS.filter((o) => o.label.toLowerCase().includes(q));
  }, [statusSearch]);

  const orderedColumnIds = useMemo(() => {
    const rest = visibleColumnIds.filter((id) => id !== "status" && id !== "actions");
    const end: string[] = [];
    if (visibleColumnIds.includes("status")) end.push("status");
    if (visibleColumnIds.includes("actions")) end.push("actions");
    return [...rest, ...end];
  }, [visibleColumnIds]);

  const toggleColumn = (id: string) => {
    setVisibleColumnIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handlePublishConfirm = async () => {
    if (!publishTarget || !token) return;
    setPublishLoading(true);
    try {
      if (publishTarget.action === "publish") {
        await devotionalsApi.publish(token, publishTarget.item.id);
        toast.success("Dévotion publiée.");
      } else {
        await devotionalsApi.unpublish(token, publishTarget.item.id);
        toast.success("Dévotion dépubliée.");
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

  return (
    <div>
      <AdminPageHeader
        title="Dévotions"
        description="Gérez les méditations quotidiennes"
      />

      <AdminCard padding="none">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une dévotion..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
              aria-label="Rechercher une dévotion"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton href="/admin/devotionals/new" icon={<Plus className="w-4 h-4" />}>
              Nouvelle dévotion
            </AdminButton>
            <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full border-2 border-dashed border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100/80 transition-colors"
                  aria-label="Filtrer par statut"
                >
                  <Tag className="w-4 h-4 text-amber-600" />
                  Statut
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
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
                          ? "bg-amber-100 text-amber-800 font-medium"
                          : "text-foreground hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-amber-300">
                        {statusFilter === opt.value ? (
                          <Check className="w-3 h-3 text-amber-600" />
                        ) : null}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-white text-foreground hover:bg-slate-50 transition-colors"
                  aria-label="Choisir les colonnes visibles"
                >
                  <Columns className="w-4 h-4 text-muted-foreground" />
                  Colonnes
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <div className="p-2 border-b border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Colonnes visibles
                  </p>
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {DEVOTIONAL_TABLE_COLUMNS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => toggleColumn(col.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border">
                        {visibleColumnIds.includes(col.id) ? (
                          <Check className="w-3 h-3 text-brand-primary" />
                        ) : null}
                      </span>
                      {col.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <AdminButton
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={fetchData}
              disabled={loading}
            >
              Actualiser
            </AdminButton>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-border">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Aucune dévotion trouvée.
            <Link
              href="/admin/devotionals/new"
              className="ml-2 text-brand-primary hover:underline font-medium"
            >
              Créer une dévotion
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-slate-50/50">
                  {orderedColumnIds.map((colId) => (
                    <th
                      key={colId}
                      className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${
                        colId === "actions" ? "text-right" : "text-left"
                      }`}
                    >
                      {DEVOTIONAL_TABLE_COLUMNS.find((c) => c.id === colId)?.label ?? colId}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => {
                  const isPublished = item.is_published ?? !!item.published_at;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      {orderedColumnIds.map((colId) => (
                        <td
                          key={colId}
                          className={`px-6 py-4 text-sm ${colId === "actions" ? "text-right" : ""}`}
                        >
                          {colId === "title" && (
                            <>
                              <p className="font-medium text-foreground max-w-xs truncate">
                                {item.title}
                              </p>
                              {item.slug && (
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                  {item.slug}
                                </p>
                              )}
                            </>
                          )}
                          {colId === "slug" && (item.slug ?? "—")}
                          {colId === "scripture_reference" && (item.scripture_reference ?? "—")}
                          {colId === "category" &&
                            (item.category && typeof item.category === "object" && "name" in item.category
                              ? item.category.name
                              : "—")}
                          {colId === "excerpt" && (
                            <span className="max-w-xs truncate block" title={item.excerpt ?? undefined}>
                              {item.excerpt ?? "—"}
                            </span>
                          )}
                          {colId === "published_at" &&
                            formatDate(item.published_at ?? item.created_at)}
                          {colId === "status" && (
                            <AdminBadge variant={isPublished ? "success" : "warning"}>
                              {isPublished ? "Publié" : "Brouillon"}
                            </AdminBadge>
                          )}
                          {colId === "reading_time" && (item.reading_time ?? "—")}
                          {colId === "created_at" && formatDate(item.created_at)}
                          {colId === "updated_at" && formatDate(item.updated_at)}
                          {colId === "actions" && (
                            <div className="flex items-center justify-end gap-1">
                              {isPublished ? (
                                <button
                                  type="button"
                                  onClick={() => handleUnpublishClick(item)}
                                  disabled={publishLoading}
                                  className="p-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Dépublier"
                                  aria-label="Dépublier la dévotion"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handlePublishClick(item)}
                                  disabled={publishLoading}
                                  className="p-2 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Publier"
                                  aria-label="Publier la dévotion"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              )}
                              <Link
                                href={`/devotion/${item.slug || item.id}`}
                                target="_blank"
                                className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors"
                                title="Voir"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/admin/devotionals/${item.id}/edit`}
                                className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(item)}
                                className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                                aria-label="Supprimer la dévotion"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {total > 0 ? (
                <>
                  {(page - 1) * perPage + 1} à {Math.min(page * perPage, total)} sur {total}
                </>
              ) : (
                `${items.length} dévotion(s)`
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Lignes par page</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1.5 border border-border rounded-lg text-foreground bg-white"
                  title="Lignes par page"
                  aria-label="Lignes par page"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Page {page} sur {lastPage}
                </span>
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
      </AdminCard>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la dévotion ?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Vous êtes sur le point de supprimer &quot;{deleting?.title}&quot;. Cette action est
            irréversible.
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
              {publishTarget?.action === "publish" ? "Publier la dévotion ?" : "Dépublier la dévotion ?"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            {publishTarget?.action === "publish"
              ? `La dévotion "${publishTarget?.item.title}" sera visible sur le site.`
              : `La dévotion "${publishTarget?.item.title}" ne sera plus visible sur le site.`}
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={publishLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishConfirm}
              disabled={publishLoading}
              className={publishTarget?.action === "unpublish" ? "bg-amber-600 hover:bg-amber-700" : undefined}
            >
              {publishLoading
                ? "En cours..."
                : publishTarget?.action === "publish"
                  ? "Publier"
                  : "Dépublier"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
