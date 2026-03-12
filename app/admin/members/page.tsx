"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  UserPlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronDown,
  Columns3,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ShieldCheck,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { adminMembersApi, fetchMemberStatusOptions, type AdminMemberListItem } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type MemberWithName = AdminMemberListItem & { name: string };

// Tous les champs du formulaire membre — certains visibles par défaut, d'autres cachés
const COLUMN_CONFIG: { key: string; label: string; defaultVisible: boolean }[] = [
  { key: "firstname", label: "PRÉNOM(S)", defaultVisible: true },
  { key: "name", label: "NOM", defaultVisible: true },
  { key: "email", label: "EMAIL", defaultVisible: false },
  { key: "phone", label: "TÉLÉPHONE", defaultVisible: true },
  { key: "birth_date", label: "DATE NAISSANCE", defaultVisible: false },
  { key: "birth_place", label: "LIEU NAISSANCE", defaultVisible: false },
  { key: "sex", label: "SEXE", defaultVisible: false },
  { key: "nationality", label: "NATIONALITÉ", defaultVisible: false },
  { key: "address", label: "ADRESSE", defaultVisible: false },
  { key: "city", label: "VILLE", defaultVisible: true },
  { key: "district", label: "QUARTIER", defaultVisible: false },
  { key: "desired_service_department", label: "DÉPARTEMENT", defaultVisible: true },
  { key: "emergency_contact_name", label: "CONTACT URGENCE (NOM)", defaultVisible: false },
  { key: "emergency_contact_phone", label: "CONTACT URGENCE (TÉL)", defaultVisible: false },
  { key: "type", label: "TYPE", defaultVisible: true },
  { key: "member_level", label: "NIVEAU MEMBRE", defaultVisible: false },
  { key: "institution", label: "ÉTABLISSEMENT", defaultVisible: false },
  { key: "level", label: "NIVEAU", defaultVisible: false },
  { key: "field", label: "DOMAINE", defaultVisible: false },
  { key: "profession", label: "PROFESSION", defaultVisible: false },
  { key: "company", label: "ENTREPRISE", defaultVisible: false },
  { key: "local_church", label: "ÉGLISE LOCALE", defaultVisible: false },
  { key: "pastor", label: "PASTEUR", defaultVisible: false },
  { key: "born_again", label: "RENAISSANCE", defaultVisible: false },
  { key: "baptized", label: "BAPTÊME", defaultVisible: false },
  { key: "church_service", label: "SERVICE ÉGLISE", defaultVisible: false },
  { key: "how_did_you_know", label: "COMMENT CONNU", defaultVisible: false },
  { key: "motivation", label: "MOTIVATION", defaultVisible: false },
  { key: "service_areas", label: "ZONES SERVICE", defaultVisible: false },
  { key: "accept_charter", label: "CHARTE ACCEPTÉE", defaultVisible: false },
  { key: "accept_payment", label: "PAIEMENT ACCEPTÉ", defaultVisible: false },
  { key: "status", label: "STATUT", defaultVisible: true },
  { key: "date", label: "DATE", defaultVisible: true },
  { key: "actions", label: "ACTIONS", defaultVisible: true },
];

const DEFAULT_VISIBLE = Object.fromEntries(COLUMN_CONFIG.map((c) => [c.key, c.defaultVisible]));

function formatDate(val: unknown): string {
  if (!val) return "—";
  const d = typeof val === "string" ? new Date(val) : val instanceof Date ? val : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : String(val ?? "—");
}

function getCellValue(item: MemberWithName, key: string): React.ReactNode {
  const raw = item[key as keyof MemberWithName];
  if (raw === undefined || raw === null || raw === "") return "—";
  if (key === "birth_date" || key === "date") return formatDate(raw);
  if (key === "city") {
    const c = raw as { name?: string } | undefined;
    return c && typeof c === "object" && "name" in c ? (c.name as string) : String(raw);
  }
  if (key === "district") {
    const d = raw as { name?: string } | undefined;
    return d && typeof d === "object" && "name" in d ? (d.name as string) : String(raw);
  }
  if (key === "nationality") {
    const n = raw as { name?: string } | undefined;
    return n && typeof n === "object" && "name" in n ? (n.name as string) : String(raw);
  }
  if (key === "desired_service_department") {
    const dep = raw as { name?: string; label?: string } | undefined;
    return dep && typeof dep === "object" ? (dep.name ?? dep.label ?? String(raw)) : String(raw);
  }
  if (key === "service_areas") {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.length ? arr.join(", ") : "—";
  }
  if (key === "accept_charter" || key === "accept_payment") {
    return raw === true || raw === "1" || raw === 1 ? "Oui" : "Non";
  }
  return String(raw);
}

export default function AdminMembersPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<MemberWithName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(DEFAULT_VISIBLE);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<MemberWithName | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusMember, setStatusMember] = useState<MemberWithName | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [memberStatuses, setMemberStatuses] = useState<{ id: number; name: string }[]>([]);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminMembersApi.list(token, { page, per_page: perPage, search: search || undefined });
      setItems(res.data as MemberWithName[]);
      setLastPage(res.meta?.last_page ?? 1);
      setTotal(res.meta?.total ?? res.data.length);
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

  useEffect(() => {
    fetchMemberStatusOptions()
      .then(setMemberStatuses)
      .catch(() => setMemberStatuses([]));
  }, []);

  const handleDeleteClick = (item: MemberWithName) => {
    setDeleting(item);
    setDeleteDialogOpen(true);
  };

  const handleStatusClick = (item: MemberWithName) => {
    setStatusMember(item);
    const ms = (item.member_status ?? item.memberStatus) as { id?: number; name?: string } | undefined;
    const id = ms?.id ?? (item.member_status_id ?? item.memberStatusId) as number | undefined;
    setSelectedStatusId(id ?? null);
    setStatusDialogOpen(true);
  };

  const handleImportTemplate = async () => {
    if (!token) return;
    try {
      await adminMembersApi.downloadImportTemplate(token);
      toast.success("Modèle téléchargé.");
    } catch {
      toast.error("Erreur lors du téléchargement du modèle.");
    }
  };

  const handleImportSubmit = async () => {
    if (!importFile || !token) return;
    setImportLoading(true);
    try {
      const res = await adminMembersApi.importFromExcel(token, importFile);
      setImportDialogOpen(false);
      setImportFile(null);
      const count = (res as { imported?: number }).imported ?? 0;
      toast.success(res.message ?? `${count} membre(s) importé(s).`);
      fetchData();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors de l'import.";
      toast.error(msg);
    } finally {
      setImportLoading(false);
    }
  };

  const handleStatusConfirm = async () => {
    if (!statusMember || !token) return;
    setStatusLoading(true);
    try {
      const res = await adminMembersApi.updateStatus(token, statusMember.id, selectedStatusId);
      const newStatusName = selectedStatusId ? memberStatuses.find((s) => s.id === selectedStatusId)?.name ?? null : null;
      setItems((prev) =>
        prev.map((m) =>
          m.id === statusMember.id
            ? { ...m, status: newStatusName ?? "Aucun statut", member_status: newStatusName ? { id: selectedStatusId, name: newStatusName } : null }
            : m
        )
      );
      setStatusDialogOpen(false);
      setStatusMember(null);
      setSelectedStatusId(null);
      toast.success(res.message || "Statut mis à jour.");
      fetchData();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors de la mise à jour du statut.";
      toast.error(msg);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleting || !token) return;
    setDeleteLoading(true);
    try {
      const res = await adminMembersApi.delete(token, deleting.id);
      setDeleteDialogOpen(false);
      setDeleting(null);
      toast.success(res.message || "Supprimé.");
      fetchData();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors de la suppression.";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((v) => ({ ...v, [key]: !v[key] }));
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(sorted.map((m) => m.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const sorted = [...items].sort((a, b) => {
    const cmp = (a.name ?? "").localeCompare(b.name ?? "");
    return sortDir === "asc" ? cmp : -cmp;
  });

  const visibleCols = COLUMN_CONFIG.filter((c) => c.key !== "actions" && visibleColumns[c.key]);
  const colSpan = visibleCols.length + 1 + (visibleColumns.actions ? 1 : 0); // +checkbox, +actions
  const startItem = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  return (
    <div>
      <AdminPageHeader title="Adhésions" description="Gérez les membres et demandes d'adhésion" />
      <AdminCard padding="none">
        <div className="p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
            />
          </div>
          <div className="flex gap-2">
            <AdminButton href="/admin/members/new" variant="primary" icon={<UserPlus className="w-4 h-4" />} className="bg-emerald-600 hover:bg-emerald-700 border-0">
              Ajouter
            </AdminButton>
            <button
              type="button"
              onClick={() => setImportDialogOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-border bg-white hover:bg-slate-50 text-foreground"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Importer
            </button>
            <AdminButton
              variant="outline"
              icon={<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />}
              onClick={fetchData}
              disabled={loading}
              className="border-amber-500/50 text-amber-700 hover:bg-amber-50"
            >
              Rafraîchir
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
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-4 w-12">
                  <Checkbox
                    checked={sorted.length > 0 && selectedIds.size === sorted.length}
                    onCheckedChange={(c) => toggleSelectAll(!!c)}
                    aria-label="Tout sélectionner"
                  />
                </th>
                {visibleColumns.reference && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">RÉFÉRENCE</th>
                )}
                {visibleColumns.name && (
                  <th className="px-6 py-4 text-left">
                    <button
                      type="button"
                      onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                      className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
                    >
                      NOM <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                )}
                {visibleCols
                  .filter((c) => c.key !== "reference" && c.key !== "name")
                  .map((c) => (
                    <th key={c.key} className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {c.label}
                    </th>
                  ))}
                {visibleColumns.actions && (
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACTIONS</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {error && (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-12 text-center">
                    <p className="text-red-600 font-medium">Erreur: {error}</p>
                    <p className="text-sm text-muted-foreground mt-1">Vérifiez les credentials et que vous êtes bien connecté.</p>
                  </td>
                </tr>
              )}
              {!error && loading && (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-12 text-center text-muted-foreground">Chargement...</td>
                </tr>
              )}
              {!error && !loading && sorted.length === 0 && (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-12 text-center text-muted-foreground">Aucun membre</td>
                </tr>
              )}
              {!error &&
                !loading &&
                sorted.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={(c) => toggleSelectOne(item.id, !!c)}
                        aria-label={`Sélectionner ${item.name}`}
                      />
                    </td>
                    {visibleColumns.reference && (
                      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{item.id}</td>
                    )}
                    {visibleColumns.name && (
                      <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                    )}
                    {visibleCols
                      .filter((c) => c.key !== "reference" && c.key !== "name")
                      .map((c) => {
                        if (c.key === "type") {
                          return (
                            <td key={c.key} className="px-6 py-4 text-sm text-muted-foreground">
                              {item.member_type?.label ?? item.member_type?.name ?? "—"}
                            </td>
                          );
                        }
                        if (c.key === "status") {
                          const ms = item.member_status as { name?: string; label?: string } | undefined;
                          const st = (item.status as string) ?? ms?.name ?? ms?.label ?? "En attente";
                          return (
                            <td key={c.key} className="px-6 py-4">
                              <span
                                className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                  st === "Validé" || st === "validé"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : st === "Refusé" || st === "refusé"
                                      ? "bg-red-500/10 text-red-600"
                                      : "bg-amber-500/10 text-amber-600"
                                }`}
                              >
                                {st}
                              </span>
                            </td>
                          );
                        }
                        if (c.key === "date") {
                          return (
                            <td key={c.key} className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(item.created_at ?? item.createdAt ?? item.date)}
                            </td>
                          );
                        }
                        return (
                          <td key={c.key} className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate" title={String(getCellValue(item, c.key))}>
                            {getCellValue(item, c.key)}
                          </td>
                        );
                      })}
                    {visibleColumns.actions && (
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="p-2 text-slate-500 hover:text-foreground hover:bg-slate-100 rounded-lg transition-colors"
                              aria-label="Actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/members/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                                <Eye className="w-4 h-4" />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/members/${item.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                                <Pencil className="w-4 h-4" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusClick(item)} className="cursor-pointer">
                              <ShieldCheck className="w-4 h-4" />
                              Gérer le statut
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteClick(item)}
                              className="cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {total > 0 ? (
              <>
                {startItem} à {endItem} sur {total}
              </>
            ) : (
              "0 à 0 sur 0"
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Lignes par page{" "}
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="mx-1 px-2 py-1 border border-border rounded text-foreground"
                aria-label="Lignes par page"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Page {page} sur {lastPage || 1}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page >= lastPage}
                  className="p-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Page suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      <Dialog open={importDialogOpen} onOpenChange={(open) => { setImportDialogOpen(open); if (!open) setImportFile(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer des membres</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Téléchargez le modèle Excel, remplissez-le puis importez le fichier.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <button
                type="button"
                onClick={handleImportTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-white hover:bg-slate-50"
              >
                <Download className="w-4 h-4" />
                Télécharger le modèle Excel
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fichier Excel</label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-primary file:text-white file:cursor-pointer hover:file:opacity-90"
              />
              {importFile && (
                <p className="text-sm text-muted-foreground mt-1">{importFile.name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setImportDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleImportSubmit}
              disabled={!importFile || importLoading}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importLoading ? "Import en cours..." : "Importer"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={(open) => { setStatusDialogOpen(open); if (!open) setStatusMember(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gérer le statut</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {statusMember?.name ? `Statut de « ${statusMember.name} »` : "Sélectionnez le nouveau statut"}
            </p>
          </DialogHeader>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Statut</label>
            <select
              value={selectedStatusId ?? ""}
              onChange={(e) => setSelectedStatusId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              aria-label="Statut du membre"
            >
              <option value="">— Aucun statut —</option>
              {memberStatuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setStatusDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleStatusConfirm}
              disabled={statusLoading}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-primary text-white hover:opacity-90 disabled:opacity-50"
            >
              {statusLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce membre ?</AlertDialogTitle>
            <p className="text-sm text-muted-foreground">&quot;{deleting?.name}&quot; sera définitivement supprimé.</p>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center sm:justify-center">
            <AlertDialogCancel disabled={deleteLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteLoading} className="bg-red-600 hover:bg-red-700">
              {deleteLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
