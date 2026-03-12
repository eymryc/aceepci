"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { getRegistrationsByEvent, type EventRegistration } from "@/lib/eventRegistrations";
import { eventsApi, type Event } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LEGACY_EVENTS: Record<string, { name: string; date: string; location: string; category: string }> = {
  "camp-2026": { name: "Camp Biblique National 2026", date: "15-22 Juillet 2026", location: "Grand-Bassam", category: "Camp" },
  "conference-jeunes": { name: "Conférence Jeunesse - Vision 2030", date: "5-7 Avril 2026", location: "Yamoussoukro", category: "Conférence" },
  "retraite-leaders": { name: "Retraite des Leaders", date: "20-22 Mars 2026", location: "Abidjan - Bingerville", category: "Retraite" },
  "journee-evangelisation": { name: "Journée d'Évangélisation Massive", date: "28 Mars 2026", location: "Bouaké", category: "Évangélisation" },
};

function formatDate(val: string | undefined): string {
  if (!val) return "—";
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? val : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateRange(start: string | undefined, end: string | undefined): string {
  if (!start && !end) return "—";
  const fmt = (s: string) => formatDate(s.includes("T") ? s : s + "T12:00:00");
  if (start && end && start === end) return fmt(start);
  return `${start ? fmt(start) : "—"} – ${end ? fmt(end) : "—"}`;
}

export default function Page() {
  const params = useParams();
  const { token } = useAuth();
  const eventId = (params.id as string) ?? "";
  const numericId = /^\d+$/.test(eventId) ? Number(eventId) : null;

  const [apiEvent, setApiEvent] = useState<Event | null>(null);
  const [eventLoading, setEventLoading] = useState(!!numericId);

  const event = numericId
    ? apiEvent
      ? {
          name: apiEvent.name,
          date: formatDateRange(apiEvent.start_date, apiEvent.end_date),
          location: apiEvent.location ?? "—",
          category: apiEvent.event_category?.name ?? "—",
        }
      : null
    : LEGACY_EVENTS[eventId];

  useEffect(() => {
    if (!numericId || !token) return;
    setEventLoading(true);
    eventsApi
      .get(token, numericId)
      .then(setApiEvent)
      .catch(() => setApiEvent(null))
      .finally(() => setEventLoading(false));
  }, [numericId, token]);

  const [items, setItems] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<EventRegistration | null>(null);

  const fetchData = () => {
    setLoading(true);
    const list = getRegistrationsByEvent(eventId);
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const filtered = items.filter((r) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const full = `${r.firstName} ${r.lastName} ${r.email} ${r.phone}`.toLowerCase();
    return full.includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    const cmp = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const total = sorted.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const startItem = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  if (eventLoading) {
    return (
      <div>
        <AdminPageHeader title="Chargement..." description="Récupération des données de l'événement." />
        <div className="p-12 text-center text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <AdminPageHeader title="Événement introuvable" description="Cet événement n'existe pas." />
        <AdminButton href="/admin/events" variant="outline" icon={<ChevronLeft className="w-4 h-4" />}>
          Retour aux événements
        </AdminButton>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={`Inscriptions — ${event.name}`}
        description={`${event.date} • ${event.location}`}
        action={
          <AdminButton href="/admin/events" variant="outline" icon={<ChevronLeft className="w-4 h-4" />}>
            Retour aux événements
          </AdminButton>
        }
      />

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
          <AdminButton
            variant="outline"
            icon={<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />}
            onClick={fetchData}
            disabled={loading}
          >
            Rafraîchir
          </AdminButton>
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
                    PARTICIPANT <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">EMAIL</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">TÉLÉPHONE</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">STATUT</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">DATE</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Chargement...
                  </td>
                </tr>
              )}
              {!loading && paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Aucune inscription pour cet événement
                  </td>
                </tr>
              )}
              {!loading &&
                paginated.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {item.firstName} {item.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.email || "—"}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-brand-primary/10 text-brand-primary">
                        {item.memberStatus || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(item.createdAt)}</td>
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReg(item);
                              setDetailOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            Voir détails
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
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
            <div className="flex gap-2 text-sm text-muted-foreground">
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

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l&apos;inscription</DialogTitle>
          </DialogHeader>
          {selectedReg && (
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Identité</h3>
                <div className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                  <p><span className="text-foreground">Nom :</span> {selectedReg.lastName} {selectedReg.firstName}</p>
                  <p><span className="text-foreground">Email :</span> {selectedReg.email || "—"}</p>
                  <p><span className="text-foreground">Téléphone :</span> {selectedReg.phone || "—"}</p>
                  <p><span className="text-foreground">Date de naissance :</span> {selectedReg.birthDate || "—"}</p>
                  <p><span className="text-foreground">Sexe :</span> {selectedReg.gender || "—"}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Statut membre</h3>
                <div className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                  <p><span className="text-foreground">Statut :</span> {selectedReg.memberStatus || "—"}</p>
                  <p><span className="text-foreground">N° membre :</span> {selectedReg.membershipNumber || "—"}</p>
                  <p><span className="text-foreground">Département :</span> {selectedReg.department || "—"}</p>
                  <p><span className="text-foreground">Église locale :</span> {selectedReg.localChurch || "—"}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Logistique</h3>
                <div className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                  <p><span className="text-foreground">Hébergement :</span> {selectedReg.needsAccommodation || "—"}
                    {selectedReg.accommodationType && ` (${selectedReg.accommodationType})`}
                  </p>
                  <p><span className="text-foreground">Transport :</span> {selectedReg.needsTransport || "—"}</p>
                  <p><span className="text-foreground">Préférence repas :</span> {selectedReg.mealPreference || "—"}</p>
                  {selectedReg.dietaryRestrictions && (
                    <p className="md:col-span-2"><span className="text-foreground">Restrictions :</span> {selectedReg.dietaryRestrictions}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Contact d&apos;urgence</h3>
                <div className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                  <p><span className="text-foreground">Nom :</span> {selectedReg.emergencyContact || "—"}</p>
                  <p><span className="text-foreground">Téléphone :</span> {selectedReg.emergencyPhone || "—"}</p>
                  <p><span className="text-foreground">Lien :</span> {selectedReg.emergencyRelation || "—"}</p>
                </div>
              </div>
              {(selectedReg.medicalConditions || selectedReg.allergies || selectedReg.medication || selectedReg.specialNeeds) && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Santé & besoins</h3>
                  <div className="space-y-2 text-muted-foreground">
                    {selectedReg.medicalConditions && <p><span className="text-foreground">Conditions :</span> {selectedReg.medicalConditions}</p>}
                    {selectedReg.allergies && <p><span className="text-foreground">Allergies :</span> {selectedReg.allergies}</p>}
                    {selectedReg.medication && <p><span className="text-foreground">Médicaments :</span> {selectedReg.medication}</p>}
                    {selectedReg.specialNeeds && <p><span className="text-foreground">Besoins spécifiques :</span> {selectedReg.specialNeeds}</p>}
                  </div>
                </div>
              )}
              {selectedReg.motivation && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Motivation</h3>
                  <p className="text-muted-foreground">{selectedReg.motivation}</p>
                </div>
              )}
              {selectedReg.workshopChoice?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Ateliers</h3>
                  <p className="text-muted-foreground">{selectedReg.workshopChoice.join(", ")}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                Inscription le {formatDate(selectedReg.createdAt)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
