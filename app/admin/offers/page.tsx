"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Briefcase, GraduationCap, DollarSign, Heart, RefreshCw, ChevronLeft, ChevronRight, Columns3, ChevronDown, CheckCircle2, CircleOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { offersApi, type Offer } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Tous les champs Offer — visibilité configurable (inspiré des événements)
const COLUMN_CONFIG: { key: string; label: string; defaultVisible: boolean }[] = [
  { key: "id", label: "ID", defaultVisible: false },
  { key: "title", label: "TITRE", defaultVisible: true },
  { key: "organization", label: "ORGANISATION", defaultVisible: true },
  { key: "category", label: "CATÉGORIE", defaultVisible: true },
  { key: "location", label: "LIEU", defaultVisible: true },
  { key: "type", label: "TYPE", defaultVisible: true },
  { key: "deadline", label: "ÉCHÉANCE", defaultVisible: true },
  { key: "status", label: "STATUT", defaultVisible: true },
  { key: "salary", label: "SALAIRE", defaultVisible: false },
  { key: "duration", label: "DURÉE", defaultVisible: false },
  { key: "description", label: "DESCRIPTION", defaultVisible: false },
  { key: "requirements", label: "EXIGENCES", defaultVisible: false },
  { key: "external_link", label: "LIEN", defaultVisible: false },
  { key: "created_at", label: "CRÉÉ LE", defaultVisible: false },
  { key: "updated_at", label: "MODIFIÉ LE", defaultVisible: false },
  { key: "actions", label: "ACTIONS", defaultVisible: true },
];

const DEFAULT_VISIBLE = Object.fromEntries(COLUMN_CONFIG.map((c) => [c.key, c.defaultVisible]));

const categoryMeta = {
  emploi: { label: "Emploi", icon: Briefcase, color: "bg-blue-500/10 text-blue-600" },
  stage: { label: "Stage", icon: GraduationCap, color: "bg-violet-500/10 text-violet-600" },
  bourse: { label: "Bourse", icon: DollarSign, color: "bg-brand-primary/10 text-brand-primary" },
  benevolat: { label: "Bénévolat", icon: Heart, color: "bg-emerald-500/10 text-emerald-600" },
};

function formatDate(val: string | undefined): string {
  if (!val) return "—";
  const d = new Date(val + "T12:00:00");
  return Number.isNaN(d.getTime()) ? val : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function getCellValue(item: Offer, key: string): ReactNode {
  if (key === "id") return item.id;
  if (key === "title") return item.title || "—";
  if (key === "organization") return item.organization || "—";
  if (key === "category") return item.offer_category?.name ?? item.category ?? "—";
  if (key === "location") return item.location ?? "—";
  if (key === "type") return item.offer_type?.name ?? item.type ?? "—";
  if (key === "deadline") return formatDate(item.deadline);
   if (key === "status") return item.is_published ? "Publiée" : "Brouillon";
  if (key === "salary") return item.salary ?? "—";
  if (key === "duration") return item.duration ?? "—";
  if (key === "description") return item.description ? (item.description.length > 80 ? `${item.description.slice(0, 80)}…` : item.description) : "—";
  if (key === "requirements") {
    const arr = Array.isArray(item.requirements) ? item.requirements : [];
    return arr.length ? arr.slice(0, 2).join(" · ") + (arr.length > 2 ? " …" : "") : "—";
  }
  if (key === "external_link") return item.external_link ?? "—";
  if (key === "created_at") return formatDate(item.created_at);
  if (key === "updated_at") return formatDate(item.updated_at);
  return "—";
}

export default function AdminOffersPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Offer | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishing, setPublishing] = useState<Offer | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(DEFAULT_VISIBLE);

  const toggleColumn = (key: string) => {
    setVisibleColumns((v) => ({ ...v, [key]: !v[key] }));
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await offersApi.list(token, {
        page,
        per_page: perPage,
        search: search || undefined,
        include_expired: 1,
        include_unpublished: 1,
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const last = res.meta?.last_page ?? res.last_page ?? 1;
      setItems(data);
      setLastPage(last);
      setTotal(res.meta?.total ?? res.total ?? (page === last ? (page - 1) * perPage + data.length : last * perPage));
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors du chargement.";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, page, perPage, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = (offer: Offer) => {
    setDeleting(offer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleting || !token) return;
    setDeleteLoading(true);
    try {
      await offersApi.delete(token, deleting.id);
      setDeleteDialogOpen(false);
      setDeleting(null);
      toast.success("Offre supprimée.");
      fetchData();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors de la suppression.";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTogglePublishClick = (offer: Offer) => {
    setPublishing(offer);
    setPublishDialogOpen(true);
  };

  const handleTogglePublishConfirm = async () => {
    if (!publishing || !token) return;
    setPublishLoading(true);
    if (!token) return;
    try {
      if (publishing.is_published) {
        const res = await offersApi.unpublish(token, publishing.id);
        toast.success(res.message || "Offre dépubliée.");
      } else {
        const res = await offersApi.publish(token, publishing.id);
        toast.success(res.message || "Offre publiée.");
      }
      fetchData();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Erreur lors du changement de statut.";
      toast.error(msg);
    } finally {
      setPublishLoading(false);
      setPublishDialogOpen(false);
      setPublishing(null);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Offres & Opportunités" description="Gérez les offres d'emploi, stages, bourses et bénévolat" />

      <AdminCard padding="none">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une offre..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div className="flex gap-2">
            <AdminButton href="/admin/offers/new" icon={<Plus className="w-4 h-4" />}>
              Nouvelle offre
            </AdminButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-border bg-white hover:bg-slate-50 text-muted-foreground"
                >
                  <Columns3 className="w-4 h-4" />
                  Colonnes
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto w-56">
                {COLUMN_CONFIG.filter((c) => c.key !== "actions").map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.key}
                    checked={visibleColumns[c.key] ?? c.defaultVisible}
                    onCheckedChange={() => toggleColumn(c.key)}
                  >
                    {c.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <AdminButton variant="outline" icon={<RefreshCw className="w-4 h-4" />} onClick={fetchData} disabled={loading}>
              Actualiser
            </AdminButton>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-border">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Aucune offre trouvée.
            <Link href="/admin/offers/new" className="ml-2 text-brand-primary hover:underline font-medium">
              Créer une offre
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  {visibleColumns.id && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>}
                  {visibleColumns.title && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">TITRE</th>}
                  {visibleColumns.organization && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ORGANISATION</th>}
                  {visibleColumns.category && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">CATÉGORIE</th>}
                  {visibleColumns.location && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">LIEU</th>}
                  {visibleColumns.type && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">TYPE</th>}
                  {visibleColumns.deadline && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ÉCHÉANCE</th>}
                  {visibleColumns.status && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">STATUT</th>}
                  {visibleColumns.salary && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">SALAIRE</th>}
                  {visibleColumns.duration && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">DURÉE</th>}
                  {visibleColumns.description && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">DESCRIPTION</th>}
                  {visibleColumns.requirements && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">EXIGENCES</th>}
                  {visibleColumns.external_link && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">LIEN</th>}
                  {visibleColumns.created_at && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">CRÉÉ LE</th>}
                  {visibleColumns.updated_at && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">MODIFIÉ LE</th>}
                  {visibleColumns.actions && <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACTIONS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => {
                  const catCode = item.offer_category?.code ?? item.category ?? "";
                  const meta = categoryMeta[catCode as keyof typeof categoryMeta];
                  const Icon = meta?.icon || Briefcase;
                  return (
                    <tr key={item.id} className="hover:bg-brand-subtle/30 transition-colors">
                      {visibleColumns.id && <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{item.id}</td>}
                      {visibleColumns.title && <td className="px-6 py-4 font-medium text-foreground">{getCellValue(item, "title")}</td>}
                      {visibleColumns.organization && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "organization")}</td>}
                      {visibleColumns.category && (
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${meta?.color || "bg-muted"}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {meta?.label || item.offer_category?.name || item.category}
                          </span>
                        </td>
                      )}
                      {visibleColumns.location && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "location")}</td>}
                      {visibleColumns.type && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "type")}</td>}
                      {visibleColumns.deadline && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "deadline")}</td>}
                      {visibleColumns.status && (
                        <td className="px-6 py-4">
                          {item.is_published ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Publiée
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-700">
                              <CircleOff className="w-3.5 h-3.5" />
                              Brouillon
                            </span>
                          )}
                        </td>
                      )}
                      {visibleColumns.salary && <td className="px-6 py-4 text-sm text-muted-foreground max-w-[140px] truncate" title={item.salary ?? undefined}>{getCellValue(item, "salary")}</td>}
                      {visibleColumns.duration && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "duration")}</td>}
                      {visibleColumns.description && <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate" title={item.description ?? undefined}>{getCellValue(item, "description")}</td>}
                      {visibleColumns.requirements && <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate" title={Array.isArray(item.requirements) ? item.requirements.join("\n") : undefined}>{getCellValue(item, "requirements")}</td>}
                      {visibleColumns.external_link && <td className="px-6 py-4 text-sm text-muted-foreground max-w-[120px] truncate" title={item.external_link ?? undefined}>{getCellValue(item, "external_link")}</td>}
                      {visibleColumns.created_at && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "created_at")}</td>}
                      {visibleColumns.updated_at && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "updated_at")}</td>}
                      {visibleColumns.actions && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleTogglePublishClick(item)}
                              className="p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title={item.is_published ? "Dépublier" : "Publier"}
                            >
                              {item.is_published ? (
                                <CircleOff className="w-4 h-4" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </button>
                            <Link
                              href={`/admin/offers/${item.id}/edit`}
                              className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-brand-subtle rounded-lg transition-colors"
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
                      )}
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
                `${items.length} offre(s)`
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
      </AdminCard>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Supprimer l'offre ?"}</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            {`Vous êtes sur le point de supprimer "${deleting?.title ?? ""}". Cette action est irréversible.`}
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
              {publishing?.is_published ? "Dépublier l'offre ?" : "Publier l'offre ?"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            {publishing?.is_published
              ? `L'offre "${publishing?.title}" ne sera plus visible sur le site public, mais restera accessible dans l'administration.`
              : `L'offre "${publishing?.title}" sera visible sur le site public (si elle n'est pas expirée).`}
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={publishLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleTogglePublishConfirm} disabled={publishLoading}>
              {publishLoading
                ? publishing?.is_published
                  ? "Dépublication..."
                  : "Publication..."
                : publishing?.is_published
                ? "Dépublier"
                : "Publier"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
