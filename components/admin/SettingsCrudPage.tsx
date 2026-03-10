"use client";

import { useState, useEffect, useCallback } from "react";
import { UserPlus, Search, RefreshCw, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export interface CrudItem {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface CrudApi<T extends CrudItem> {
  list: (token: string, params?: { page?: number; per_page?: number; search?: string }) => Promise<{ data: T[]; meta?: { total?: number; last_page?: number }; total?: number; last_page?: number }>;
  create: (token: string, data: Record<string, unknown>) => Promise<{ status: string; message: string }>;
  update: (token: string, id: number, data: Record<string, unknown>) => Promise<{ status: string; message: string }>;
  delete: (token: string, id: number) => Promise<{ status: string; message: string }>;
}

interface ExtraColumn<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface SettingsCrudPageProps<T extends CrudItem> {
  title: string;
  description: string;
  api: CrudApi<T>;
  addLabel: string;
  editLabel: string;
  deleteLabel: string;
  deleteConfirmLabel: string;
  formFields: (props: {
    form: Record<string, string | number | null>;
    setForm: (field: string, value: string | number | null) => void;
    editing: T | null;
  }) => React.ReactNode;
  getItemData: (form: Record<string, string | number | null>) => Record<string, unknown>;
  validateForm: (form: Record<string, string | number | null>) => string | null;
  extraColumns?: ExtraColumn<T>[];
}

export function SettingsCrudPage<T extends CrudItem>({
  title,
  description,
  api,
  addLabel,
  editLabel,
  deleteLabel,
  deleteConfirmLabel,
  formFields,
  getItemData,
  validateForm,
  extraColumns = [],
}: SettingsCrudPageProps<T>) {
  const colSpan = 2 + extraColumns.length;
  const { token } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [lastPage, setLastPage] = useState(1);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, string | number | null>>({});
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formFieldErrors, setFormFieldErrors] = useState<Record<string, string[]>>({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const setFormField = (field: string, value: string | number | null) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.list(token, { page, per_page: perPage, search: search || undefined });
      let data: T[] = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && typeof res.data === "object" && "data" in res.data) {
        data = Array.isArray((res.data as { data: unknown }).data) ? (res.data as { data: T[] }).data : [];
      }
      setItems(data);
      setLastPage(res.meta?.last_page ?? res.last_page ?? 1);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors du chargement.";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, page, perPage, search, api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditing(null);
    setForm({});
    setFormError(null);
    setFormFieldErrors({});
    setDialogOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditing(item);
    setForm({ name: item.name, ...item });
    setFormError(null);
    setFormFieldErrors({});
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const err = validateForm(form);
    if (err) {
      setFormError(err);
      return;
    }
    if (!token) return;
    setFormSaving(true);
    setFormError(null);
    setFormFieldErrors({});
    try {
      const res = editing
        ? await api.update(token, editing.id, getItemData(form))
        : await api.create(token, getItemData(form));
      setDialogOpen(false);
      toast.success(res.message || (editing ? "Modifié." : "Créé."));
      fetchData();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors de l'enregistrement.";
      const fieldErrs = err && typeof err === "object" && "errors" in err && typeof (err as { errors?: unknown }).errors === "object"
        ? (err as { errors: Record<string, string[]> }).errors
        : {};
      setFormError(msg);
      setFormFieldErrors(fieldErrs);
      toast.error(msg);
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteClick = (item: T) => {
    setDeleting(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleting || !token) return;
    setDeleteLoading(true);
    try {
      const res = await api.delete(token, deleting.id);
      setDeleteDialogOpen(false);
      setDeleting(null);
      toast.success(res.message || "Supprimé.");
      fetchData();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur lors de la suppression.";
      setError(msg);
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const sorted = [...items].sort((a, b) => {
    const cmp = a.name.localeCompare(b.name);
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      <AdminPageHeader title={title} description={description} />
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
            <AdminButton variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 border-0">
              Ajouter
            </AdminButton>
            <AdminButton
              variant="outline"
              icon={<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />}
              onClick={fetchData}
              disabled={loading}
              className="border-amber-500/50 text-amber-700 hover:bg-amber-50"
            >
              Rafraîchir
            </AdminButton>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    type="button"
                    onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                    className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
                  >
                    NOM <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                {extraColumns.map((col) => (
                  <th key={col.header} className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {col.header}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACTIONS</th>
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
                  <td colSpan={colSpan} className="px-6 py-12 text-center text-muted-foreground">Aucune donnée</td>
                </tr>
              )}
              {!error && !loading && sorted.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                  {extraColumns.map((col) => (
                    <td key={col.header} className="px-6 py-4 text-sm text-muted-foreground">
                      {col.render(item)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => handleEdit(item)} className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-subtle rounded-lg transition-colors" title="Modifier">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleDeleteClick(item)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Lignes par page{" "}
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="mx-1 px-2 py-1 border border-border rounded text-foreground" aria-label="Lignes par page">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Page {page} sur {lastPage || 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Page précédente">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page >= lastPage} className="p-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Page suivante">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </AdminCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? editLabel : addLabel}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg space-y-1">
                <p>{formError}</p>
                {Object.keys(formFieldErrors).length > 0 && (
                  <ul className="list-disc list-inside mt-2 text-red-700">
                    {Object.entries(formFieldErrors).flatMap(([field, msgs]) =>
                      (Array.isArray(msgs) ? msgs : [msgs]).map((m) => (
                        <li key={`${field}-${m}`}>{m}</li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            )}
            {formFields({ form, setForm: setFormField, editing })}
          </div>
          <DialogFooter className="justify-center sm:justify-center">
            <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Annuler
            </button>
            <AdminButton onClick={handleSave} disabled={formSaving}>
              {formSaving ? "Enregistrement..." : "Enregistrer"}
            </AdminButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteConfirmLabel}</AlertDialogTitle>
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
