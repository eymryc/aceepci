"use client";

import { useCallback, useEffect, useState } from "react";
import { Save, BookOpen, Heart, Target } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminCard, AdminPageHeader } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { deviseSectionApi, type DevisePillar } from "@/lib/api";

const ICONS = [
  { value: "BookOpen", label: "Livre", icon: BookOpen },
  { value: "Heart", label: "Cœur", icon: Heart },
  { value: "Target", label: "Cible", icon: Target },
];

const inputClass = "w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const defaultPillars: DevisePillar[] = [
  { icon: "BookOpen", title: "Connaître", description: "Approfondir notre connaissance de Dieu et de sa Parole" },
  { icon: "Heart", title: "Aimer", description: "Cultiver l'amour de Dieu et du prochain dans la communion" },
  { icon: "Target", title: "Servir", description: "Mettre nos talents au service du Royaume de Dieu" },
];

export default function AdminMissionPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    sectionLabel: "ACEEPCI · Devise",
    title: "NOTRE DEVISE",
    subtitle: "Les trois piliers de notre engagement",
    quote: "« Connaître, Aimer, Servir — telle est notre vocation »",
    pillars: defaultPillars,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDevise = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await deviseSectionApi.get(token);
      if (res.data) {
        setForm({
          sectionLabel: res.data.section_label || "ACEEPCI · Devise",
          title: res.data.title || "NOTRE DEVISE",
          subtitle: res.data.subtitle || "Les trois piliers de notre engagement",
          quote: res.data.quote || "« Connaître, Aimer, Servir — telle est notre vocation »",
          pillars: res.data.pillars || defaultPillars,
        });
      }
    } catch {
      // Valeurs par défaut
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchDevise(); }, [fetchDevise]);

  const handleSubmit = async (publish = false) => {
    if (!token) {
      toast.error("Vous devez être connecté.");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Le titre est requis.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await deviseSectionApi.save(token, {
        section_label: form.sectionLabel,
        title: form.title,
        subtitle: form.subtitle,
        quote: form.quote,
        pillars: form.pillars,
        publish,
      });
      toast.success(publish ? "Devise publiée." : "Devise enregistrée.");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as {message: string}).message) : "Erreur.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Notre devise" description="Gérez les 3 piliers de notre devise : Connaître, Aimer, Servir." />
      {loading && <div className="rounded-xl border bg-white px-4 py-3 text-sm">Chargement...</div>}
      
      <div className="grid max-w-6xl gap-6">
        <AdminCard>
          <div className="space-y-4">
            <h2 className="font-semibold">Textes généraux</h2>
            <div>
              <label htmlFor="sectionLabel" className="block text-sm font-medium mb-2">Libellé</label>
              <input id="sectionLabel" type="text" value={form.sectionLabel} onChange={(e) => setForm({...form, sectionLabel: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">Titre *</label>
              <input id="title" type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium mb-2">Sous-titre</label>
              <input id="subtitle" type="text" value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label htmlFor="quote" className="block text-sm font-medium mb-2">Citation</label>
              <input id="quote" type="text" value={form.quote} onChange={(e) => setForm({...form, quote: e.target.value})} className={inputClass} />
            </div>
          </div>
        </AdminCard>

        <div className="grid md:grid-cols-3 gap-4">
          {form.pillars.map((p, i) => (
            <AdminCard key={i}>
              <h3 className="font-semibold mb-3">Pilier {i + 1}</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor={`icon-${i}`} className="block text-sm mb-1">Icône</label>
                  <select id={`icon-${i}`} aria-label={`Icône pilier ${i + 1}`} value={p.icon} onChange={(e) => {
                    const next = [...form.pillars];
                    next[i] = {...next[i], icon: e.target.value};
                    setForm({...form, pillars: next});
                  }} className={inputClass}>
                    {ICONS.map(ic => <option key={ic.value} value={ic.value}>{ic.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor={`title-${i}`} className="block text-sm mb-1">Titre *</label>
                  <input id={`title-${i}`} type="text" value={p.title} onChange={(e) => {
                    const next = [...form.pillars];
                    next[i] = {...next[i], title: e.target.value};
                    setForm({...form, pillars: next});
                  }} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={`desc-${i}`} className="block text-sm mb-1">Description</label>
                  <textarea id={`desc-${i}`} value={p.description} onChange={(e) => {
                    const next = [...form.pillars];
                    next[i] = {...next[i], description: e.target.value};
                    setForm({...form, pillars: next});
                  }} className={`${inputClass} min-h-[100px]`} />
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
