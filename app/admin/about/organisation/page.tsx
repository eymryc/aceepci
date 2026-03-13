"use client";

import { useCallback, useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminCard, AdminPageHeader } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { organisationSectionApi, type OrganisationCard } from "@/lib/api";

const inputClass = "w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const defaultCards: OrganisationCard[] = [
  { title: "BUREAU NATIONAL", description: "Direction stratégique et coordination des activités nationales" },
  { title: "BUREAUX RÉGIONAUX", description: "Coordination des départements par zone géographique" },
  { title: "88+ DÉPARTEMENTS", description: "Présents dans les établissements à travers le pays" },
  { title: "5 000+ MEMBRES ACTIFS", description: "Élèves, étudiants et alumni engagés dans la mission" },
];

export default function AdminOrganisationPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    sectionLabel: "ACEEPCI · Structure",
    title: "NOTRE ORGANISATION",
    subtitle: "Une structure efficace au service de notre mission",
    cards: defaultCards,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await organisationSectionApi.get(token);
      if (res.data) {
        setForm({
          sectionLabel: res.data.section_label || "ACEEPCI · Structure",
          title: res.data.title || "NOTRE ORGANISATION",
          subtitle: res.data.subtitle || "Une structure efficace au service de notre mission",
          cards: res.data.cards && res.data.cards.length > 0 ? res.data.cards : defaultCards,
        });
      }
    } catch {
      // Valeurs par défaut
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (publish = false) => {
    if (!token) {
      toast.error("Vous devez être connecté.");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Le titre est requis.");
      return;
    }
    if (form.cards.some((c) => !c.title.trim())) {
      toast.error("Chaque carte doit avoir un titre.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await organisationSectionApi.save(token, {
        section_label: form.sectionLabel,
        title: form.title,
        subtitle: form.subtitle,
        cards: form.cards,
        publish,
      });
      toast.success(publish ? "Organisation publiée." : "Organisation enregistrée.");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (index: number, field: keyof OrganisationCard, value: string) => {
    const next = [...form.cards];
    next[index] = { ...next[index], [field]: value };
    setForm({ ...form, cards: next });
  };

  const addCard = () => {
    setForm({ ...form, cards: [...form.cards, { title: "", description: "" }] });
  };

  const removeCard = (index: number) => {
    if (form.cards.length <= 1) {
      toast.error("Il faut au moins une carte.");
      return;
    }
    const next = form.cards.filter((_, i) => i !== index);
    setForm({ ...form, cards: next });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Notre organisation" description="Gérez la structure organisationnelle de l'ACEEPCI." />
      {loading && <div className="rounded-xl border bg-white px-4 py-3 text-sm">Chargement...</div>}

      <div className="grid max-w-6xl gap-6">
        <AdminCard>
          <div className="space-y-4">
            <h2 className="font-semibold">En-tête de section</h2>
            <div>
              <label htmlFor="sectionLabel" className="block text-sm font-medium mb-2">Libellé</label>
              <input id="sectionLabel" type="text" value={form.sectionLabel} onChange={(e) => setForm({ ...form, sectionLabel: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">Titre *</label>
              <input id="title" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium mb-2">Sous-titre</label>
              <input id="subtitle" type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputClass} />
            </div>
          </div>
        </AdminCard>

        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Cartes ({form.cards.length})</h2>
          <button
            type="button"
            onClick={addCard}
            className="flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-brand-primary/5 px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une carte
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {form.cards.map((card, i) => (
            <AdminCard key={i}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-brand-primary/20">{String(i + 1).padStart(2, "0")}</span>
                  <button
                    type="button"
                    onClick={() => removeCard(i)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title={`Supprimer la carte ${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label htmlFor={`card-title-${i}`} className="block text-sm mb-1">Titre *</label>
                  <input
                    id={`card-title-${i}`}
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCard(i, "title", e.target.value)}
                    className={inputClass}
                    placeholder="BUREAU NATIONAL"
                  />
                </div>
                <div>
                  <label htmlFor={`card-desc-${i}`} className="block text-sm mb-1">Description</label>
                  <textarea
                    id={`card-desc-${i}`}
                    value={card.description}
                    onChange={(e) => updateCard(i, "description", e.target.value)}
                    className={`${inputClass} min-h-[80px]`}
                    placeholder="Direction stratégique et coordination..."
                  />
                </div>
              </div>
            </AdminCard>
          ))}
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="flex gap-3 justify-center">
          <AdminButton onClick={() => handleSubmit(false)} icon={<Save className="w-4 h-4" />} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </AdminButton>
          <AdminButton onClick={() => handleSubmit(true)} icon={<Save className="w-4 h-4" />} disabled={saving}>
            {saving ? "Publication..." : "Publier"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
