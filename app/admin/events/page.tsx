"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Users, RefreshCw, ChevronLeft, ChevronRight, Columns3, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { eventsApi, type Event } from "@/lib/api";
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

// Tous les champs Event — visibilité configurable
const COLUMN_CONFIG: { key: string; label: string; defaultVisible: boolean }[] = [
  { key: "id", label: "ID", defaultVisible: false },
  { key: "name", label: "NOM", defaultVisible: true },
  { key: "title", label: "TITRE", defaultVisible: true },
  { key: "slug", label: "SLUG", defaultVisible: false },
  { key: "event_category", label: "CATÉGORIE", defaultVisible: true },
  { key: "start_date", label: "DATE DÉBUT", defaultVisible: true },
  { key: "end_date", label: "DATE FIN", defaultVisible: false },
  { key: "expected_attendees", label: "PARTICIPANTS ATTENDUS", defaultVisible: false },
  { key: "location", label: "LIEU", defaultVisible: true },
  { key: "price", label: "PRIX", defaultVisible: false },
  { key: "is_published", label: "PUBLIÉ", defaultVisible: true },
  { key: "registration_open", label: "INSCRIPTIONS OUVERTES", defaultVisible: true },
  { key: "created_at", label: "CRÉÉ LE", defaultVisible: false },
  { key: "updated_at", label: "MODIFIÉ LE", defaultVisible: false },
  { key: "inscriptions", label: "INSCRIPTIONS", defaultVisible: true },
  { key: "actions", label: "ACTIONS", defaultVisible: true },
];

const DEFAULT_VISIBLE = Object.fromEntries(COLUMN_CONFIG.map((c) => [c.key, c.defaultVisible]));

function formatDate(val: string | undefined): string {
  if (!val) return "—";
  const d = new Date(val + "T12:00:00");
  return Number.isNaN(d.getTime()) ? val : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateRange(start: string | undefined, end: string | undefined): string {
  if (!start && !end) return "—";
  if (start && end && start === end) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function getCellValue(item: Event, key: string): ReactNode {
  if (key === "id") return item.id;
  if (key === "name") return item.name || "—";
  if (key === "title") return item.title || "—";
  if (key === "slug") return item.slug || "—";
  if (key === "event_category") return item.event_category?.name ?? "—";
  if (key === "start_date") return formatDate(item.start_date);
  if (key === "end_date") return formatDate(item.end_date);
  if (key === "expected_attendees") return item.expected_attendees ?? "—";
  if (key === "location") return item.location ?? "—";
  if (key === "price") return item.price ?? "—";
  if (key === "is_published") return item.is_published ? "Oui" : "Non";
  if (key === "registration_open") return item.registration_open ? "Oui" : "Non";
  if (key === "created_at") return formatDate(item.created_at);
  if (key === "updated_at") return formatDate(item.updated_at);
  return "—";
}

export default function AdminEventsPage() {
  const { token, logout, refreshAuth } = useAuth();
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Event | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(DEFAULT_VISIBLE);

  const toggleColumn = (key: string) => {
    setVisibleColumns((v) => ({ ...v, [key]: !v[key] }));
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await eventsApi.list(token, {
        published: 0,
        page,
        per_page: perPage,
        search: search || undefined,
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const last = res.meta?.last_page ?? res.last_page ?? 1;
      setItems(data);
      setLastPage(last);
      setTotal(res.meta?.total ?? res.total ?? (page === last ? (page - 1) * perPage + data.length : last * perPage));
    } catch (err: unknown) {
      let msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors du chargement.";
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("forbidden")) {
        msg = "Accès refusé. Vous n'avez pas la permission de gérer les événements. Voir docs/events-permission-setup.md pour configurer la permission events.manage sur le backend.";
      }
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, page, perPage, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = (event: Event) => {
    setDeleting(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleting || !token) return;
    setDeleteLoading(true);
    try {
      await eventsApi.delete(token, deleting.id);
      setDeleteDialogOpen(false);
      setDeleting(null);
      toast.success("Événement supprimé.");
      fetchData();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors de la suppression.";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <AdminPageHeader
          title="Événements"
          description="Gérez les événements et inscriptions"
          action={
            <Link href="/admin/events/new">
              <AdminButton icon={<Plus className="w-4 h-4" />}>Nouvel événement</AdminButton>
            </Link>
          }
        />
      </div>

      <AdminCard padding="none">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div className="flex gap-2">
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
          <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="flex-1">{error}</p>
            {(error.includes("Accès refusé") || error.includes("permission")) && (
              <div className="flex gap-2 shrink-0">
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await refreshAuth(true);
                    setError(null);
                    fetchData();
                  }}
                >
                  Rafraîchir la session
                </AdminButton>
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={() => logout("/login")}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Se reconnecter
                </AdminButton>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Aucun événement trouvé.
            <Link href="/admin/events/new" className="ml-2 text-brand-primary hover:underline font-medium">
              Créer un événement
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      {visibleColumns.id && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>}
                      {visibleColumns.name && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">NOM</th>}
                      {visibleColumns.title && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">TITRE</th>}
                      {visibleColumns.slug && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">SLUG</th>}
                      {visibleColumns.event_category && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">CATÉGORIE</th>}
                      {visibleColumns.start_date && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">DATE DÉBUT</th>}
                      {visibleColumns.end_date && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">DATE FIN</th>}
                      {visibleColumns.expected_attendees && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">PARTICIPANTS ATTENDUS</th>}
                      {visibleColumns.location && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">LIEU</th>}
                      {visibleColumns.price && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">PRIX</th>}
                      {visibleColumns.is_published && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">PUBLIÉ</th>}
                      {visibleColumns.registration_open && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">INSCRIPTIONS OUVERTES</th>}
                      {visibleColumns.created_at && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">CRÉÉ LE</th>}
                      {visibleColumns.updated_at && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">MODIFIÉ LE</th>}
                      {visibleColumns.inscriptions && <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">INSCRIPTIONS</th>}
                      {visibleColumns.actions && <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACTIONS</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-brand-subtle/30 transition-colors">
                        {visibleColumns.id && <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{item.id}</td>}
                        {visibleColumns.name && <td className="px-6 py-4 font-medium text-foreground">{getCellValue(item, "name")}</td>}
                        {visibleColumns.title && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "title")}</td>}
                        {visibleColumns.slug && <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{getCellValue(item, "slug")}</td>}
                        {visibleColumns.event_category && (
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-brand-primary/10 text-brand-primary">
                              {getCellValue(item, "event_category")}
                            </span>
                          </td>
                        )}
                        {visibleColumns.start_date && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "start_date")}</td>}
                        {visibleColumns.end_date && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "end_date")}</td>}
                        {visibleColumns.expected_attendees && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "expected_attendees")}</td>}
                        {visibleColumns.location && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "location")}</td>}
                        {visibleColumns.price && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "price")}</td>}
                        {visibleColumns.is_published && (
                          <td className="px-6 py-4">
                            {item.is_published ? (
                              <span className="text-green-600 font-medium text-sm">Oui</span>
                            ) : (
                              <span className="text-amber-600 font-medium text-sm">Non</span>
                            )}
                          </td>
                        )}
                        {visibleColumns.registration_open && (
                          <td className="px-6 py-4">
                            {item.registration_open ? (
                              <span className="text-green-600 font-medium text-sm">Oui</span>
                            ) : (
                              <span className="text-muted-foreground text-sm">Non</span>
                            )}
                          </td>
                        )}
                        {visibleColumns.created_at && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "created_at")}</td>}
                        {visibleColumns.updated_at && <td className="px-6 py-4 text-sm text-muted-foreground">{getCellValue(item, "updated_at")}</td>}
                        {visibleColumns.inscriptions && (
                          <td className="px-6 py-4">
                            <Link
                              href={`/admin/events/${item.id}/registrations`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-brand-primary hover:underline"
                            >
                              <Users className="w-4 h-4 text-brand-primary" />
                              Voir inscriptions
                            </Link>
                          </td>
                        )}
                        {visibleColumns.actions && (
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/events/${item.id}/edit`}
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
                    ))}
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
                `${items.length} événement(s)`
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
            <AlertDialogTitle>Supprimer l&apos;événement ?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Vous êtes sur le point de supprimer &quot;{deleting?.name}&quot;. Cette action est irréversible.
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
