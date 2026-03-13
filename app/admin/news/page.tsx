"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Eye, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
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
import { newsApi, type NewsArticle } from "@/lib/api";

function formatDate(val: string | undefined | null): string {
  if (!val) return "—";
  const d = new Date(val);
  return Number.isNaN(d.getTime())
    ? val
    : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminNewsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<NewsArticle | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await newsApi.list(token, {
        page,
        per_page: perPage,
        search: search || undefined,
        status:
          statusFilter === "all"
            ? undefined
            : statusFilter === "published"
            ? "published"
            : "draft",
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const last = res.meta?.last_page ?? res.last_page ?? 1;
      setItems(data);
      setLastPage(last);
      setTotal(res.meta?.total ?? res.total ?? (page === last ? (page - 1) * perPage + data.length : last * perPage));
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Erreur lors du chargement des actualités.";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, page, perPage, search, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = (article: NewsArticle) => {
    setDeleting(article);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleting || !token) return;
    setDeleteLoading(true);
    try {
      await newsApi.delete(token, deleting.id);
      toast.success("Actualité supprimée.");
      setDeleteDialogOpen(false);
      setDeleting(null);
      fetchData();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Erreur lors de la suppression.";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Actualités"
        description="Gérez les actualités et annonces du site"
      />

      <AdminCard padding="none">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une actualité..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
            />
          </div>
          <div className="flex gap-2">
            <AdminButton href="/admin/news/new" icon={<Plus className="w-4 h-4" />}>
              Nouvelle actualité
            </AdminButton>
            {(["all", "published", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setStatusFilter(f);
                  setPage(1);
                }}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === f
                    ? "bg-brand-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f === "all" ? "Tous" : f === "published" ? "Publié" : "Brouillon"}
              </button>
            ))}
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
            Aucune actualité trouvée.
            <Link
              href="/admin/news/new"
              className="ml-2 text-brand-primary hover:underline font-medium"
            >
              Créer une actualité
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Publié le
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Vues
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => {
                  const isPublished = item.is_published ?? !!item.published_at;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground max-w-xs truncate">
                          {item.title}
                        </p>
                        {item.slug && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {item.slug}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {item.category || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(item.published_at ?? item.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {item.views_count ?? 0}
                      </td>
                      <td className="px-6 py-4">
                        <AdminBadge variant={isPublished ? "success" : "warning"}>
                          {isPublished ? "Publié" : "Brouillon"}
                        </AdminBadge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/news/${item.slug || item.id}`}
                            target="_blank"
                            className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/news/${item.id}/edit`}
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
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
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
                `${items.length} actualité(s)`
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
            <AlertDialogTitle>Supprimer l&apos;actualité ?</AlertDialogTitle>
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
    </div>
  );
}
