"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, RefreshCw, ChevronLeft, ChevronRight, Eye, Clock, Search, Columns, Check, Tag } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminBadge, AdminButton } from "@/components/admin";
import { contactMessagesApi, type ContactMessage } from "@/lib/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SUBJECT_LABELS: Record<string, string> = {
  adhesion: "Adhésion",
  activites: "Activités et événements",
  don: "Don et partenariat",
  info: "Demande d'information",
  autre: "Autre",
};

const FILTER_OPTIONS: { value: "all" | "unread"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "unread", label: "Non lus" },
];

const CONTACT_TABLE_COLUMNS: { id: string; label: string; defaultVisible: boolean }[] = [
  { id: "date", label: "Date", defaultVisible: true },
  { id: "nom", label: "Nom", defaultVisible: true },
  { id: "email", label: "Email", defaultVisible: true },
  { id: "telephone", label: "Téléphone", defaultVisible: false },
  { id: "sujet", label: "Sujet", defaultVisible: true },
  { id: "statut", label: "Statut", defaultVisible: true },
  { id: "actions", label: "Actions", defaultVisible: true },
];

const DEFAULT_VISIBLE_COLUMNS = CONTACT_TABLE_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id);

function formatDate(val: string | undefined | null): string {
  if (!val) return "—";
  const d = new Date(val);
  return Number.isNaN(d.getTime())
    ? String(val)
    : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function matchesSearch(msg: ContactMessage, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const name = `${msg.first_name} ${msg.last_name}`.toLowerCase();
  const subjectLabel = (SUBJECT_LABELS[msg.subject] ?? msg.subject).toLowerCase();
  return (
    name.includes(q) ||
    (msg.email ?? "").toLowerCase().includes(q) ||
    (msg.phone ?? "").toLowerCase().includes(q) ||
    subjectLabel.includes(q) ||
    (msg.message ?? "").toLowerCase().includes(q)
  );
}

export default function AdminContactPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMessage, setDetailMessage] = useState<ContactMessage | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await contactMessagesApi.list(token, {
        page,
        per_page: perPage,
        unread_only: filter === "unread",
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const last = res.meta?.last_page ?? 1;
      setItems(data);
      setLastPage(last);
      setTotal(res.meta?.total ?? (page === last ? (page - 1) * perPage + data.length : last * perPage));
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Erreur lors du chargement des messages.";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, page, perPage, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    return items.filter((msg) => matchesSearch(msg, search));
  }, [items, search]);

  const orderedColumnIds = useMemo(() => {
    const rest = visibleColumnIds.filter((id) => id !== "statut" && id !== "actions");
    const end: string[] = [];
    if (visibleColumnIds.includes("statut")) end.push("statut");
    if (visibleColumnIds.includes("actions")) end.push("actions");
    return [...rest, ...end];
  }, [visibleColumnIds]);

  const toggleColumn = (id: string) => {
    setVisibleColumnIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const openDetail = useCallback(
    async (msg: ContactMessage) => {
      setDetailMessage(msg);
      setDetailOpen(true);
      if (!token) return;
      setDetailLoading(true);
      try {
        const full = await contactMessagesApi.get(token, msg.id);
        setDetailMessage(full);
        if (!msg.read_at && full.read_at) {
          setItems((prev) => prev.map((m) => (m.id === full.id ? full : m)));
        }
      } catch {
        toast.error("Impossible de charger le détail du message.");
      } finally {
        setDetailLoading(false);
      }
    },
    [token]
  );

  return (
    <div>
      <AdminPageHeader
        title="Messages de contact"
        description="Messages reçus via le formulaire de contact du site."
      />

      <AdminCard padding="none">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher (nom, email, sujet)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
              aria-label="Rechercher un message"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full border-2 border-dashed border-violet-200 bg-violet-50/80 text-violet-700 hover:bg-violet-100/80 transition-colors"
                  aria-label="Filtrer par statut"
                >
                  <Tag className="w-4 h-4 text-violet-600" />
                  {filter === "unread" ? "Non lus" : "Tous"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="start">
                <div className="max-h-48 overflow-y-auto py-1">
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFilter(opt.value);
                        setPage(1);
                        setFilterPopoverOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-none transition-colors ${
                        filter === opt.value
                          ? "bg-violet-100 text-violet-800 font-medium"
                          : "text-foreground hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-violet-300">
                        {filter === opt.value ? (
                          <Check className="w-3 h-3 text-violet-600" />
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
                  {CONTACT_TABLE_COLUMNS.map((col) => (
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
            Aucun message pour le moment.
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
                      {CONTACT_TABLE_COLUMNS.find((c) => c.id === colId)?.label ?? colId}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                    {orderedColumnIds.map((colId) => (
                      <td
                        key={colId}
                        className={`px-6 py-4 text-sm ${colId === "actions" ? "text-right" : ""}`}
                      >
                        {colId === "date" && formatDate(msg.created_at)}
                        {colId === "nom" && (
                          <span className="font-medium text-foreground">
                            {msg.first_name} {msg.last_name}
                          </span>
                        )}
                        {colId === "email" && (
                          <a href={`mailto:${msg.email}`} className="text-brand-primary hover:underline">
                            {msg.email}
                          </a>
                        )}
                        {colId === "telephone" && (msg.phone ?? "—")}
                        {colId === "sujet" && (SUBJECT_LABELS[msg.subject] ?? msg.subject)}
                        {colId === "statut" && (
                          msg.read_at ? (
                            <AdminBadge variant="secondary">Lu</AdminBadge>
                          ) : (
                            <AdminBadge variant="default">Non lu</AdminBadge>
                          )
                        )}
                        {colId === "actions" && (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openDetail(msg)}
                              className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors"
                              title="Voir"
                              aria-label="Voir le message"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
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
                `${items.length} message(s)`
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

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Message de {detailMessage ? `${detailMessage.first_name} ${detailMessage.last_name}` : "…"}
            </DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <p className="text-muted-foreground text-sm">Chargement…</p>
          ) : detailMessage ? (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(detailMessage.created_at)}
                </span>
                {detailMessage.read_at && (
                  <AdminBadge variant="secondary">Lu</AdminBadge>
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Sujet</p>
                <p>{SUBJECT_LABELS[detailMessage.subject] ?? detailMessage.subject}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Email</p>
                <a href={`mailto:${detailMessage.email}`} className="text-brand-primary hover:underline">
                  {detailMessage.email}
                </a>
              </div>
              {detailMessage.phone && (
                <div>
                  <p className="font-semibold text-foreground mb-1">Téléphone</p>
                  <a href={`tel:${detailMessage.phone}`} className="text-brand-primary hover:underline">
                    {detailMessage.phone}
                  </a>
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground mb-1">Message</p>
                <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4">{detailMessage.message}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
