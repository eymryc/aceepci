"use client";

import { useCallback, useEffect, useState } from "react";
import { Save, Target, BookOpen, Heart } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminCard, AdminPageHeader } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { visionMissionValuesApi } from "@/lib/api";

const inputClass = "w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export default function AdminMissionPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    sectionLabel: "ACEEPCI · Fondements",
    title: "Vision, mission & valeurs",
    subtitle: "Les piliers qui guident notre engagement",
    vision: "Gagner l'école ivoirienne à Christ et former les leaders intellectuels de demain, en établissant une génération de jeunes ancrés dans la foi et engagés pour la transformation de leur nation.",
    mission: "Évangéliser et former spirituellement les élèves et étudiants, développer leur leadership, et créer une communauté de foi vivante guidée par notre devise : Connaître, Aimer, Servir.",
    valeurs: "Connaître la Parole, aimer Dieu et son prochain, servir l'Église et la société : des valeurs vécues au quotidien dans nos départements et au cœur de chaque activité.",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await visionMissionValuesApi.get(token);
      if (res.data) {
        setForm({
          sectionLabel: res.data.section_label || "ACEEPCI · Fondements",
          title: res.data.title || "Vision, mission & valeurs",
          subtitle: res.data.subtitle || "Les piliers qui guident notre engagement",
          vision: res.data.vision || "Gagner l'école ivoirienne à Christ et former les leaders intellectuels de demain, en établissant une génération de jeunes ancrés dans la foi et engagés pour la transformation de leur nation.",
          mission: res.data.mission || "Évangéliser et former spirituellement les élèves et étudiants, développer leur leadership, et créer une communauté de foi vivante guidée par notre devise : Connaître, Aimer, Servir.",
          valeurs: res.data.valeurs || "Connaître la Parole, aimer Dieu et son prochain, servir l'Église et la société : des valeurs vécues au quotidien dans nos départements et au cœur de chaque activité.",
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
    if (!form.vision.trim() || !form.mission.trim() || !form.valeurs.trim()) {
      toast.error("Tous les champs sont requis.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await visionMissionValuesApi.save(token, {
        section_label: form.sectionLabel,
        title: form.title,
        subtitle: form.subtitle,
        vision: form.vision,
        mission: form.mission,
        valeurs: form.valeurs,
        publish,
      });
      toast.success(publish ? "Section publiée." : "Section enregistrée.");
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
      <AdminPageHeader title="Vision, Mission & Valeurs" description="Gérez les 3 piliers fondamentaux de l'ACEEPCI." />
      {loading && <div className="rounded-xl border bg-white px-4 py-3 text-sm">Chargement...</div>}
      
      <div className="grid max-w-6xl gap-6">
        <AdminCard>
          <div className="space-y-4">
            <h2 className="font-semibold">En-tête de section</h2>
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
          </div>
        </AdminCard>

        <div className="grid md:grid-cols-3 gap-4">
          <AdminCard>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">Notre Vision</h3>
              </div>
              <div>
                <label htmlFor="vision" className="block text-sm mb-1">Texte *</label>
                <textarea id="vision" value={form.vision} onChange={(e) => setForm({...form, vision: e.target.value})} className={`${inputClass} min-h-[150px]`} placeholder="Gagner l'école ivoirienne à Christ..." />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">Notre Mission</h3>
              </div>
              <div>
                <label htmlFor="mission" className="block text-sm mb-1">Texte *</label>
                <textarea id="mission" value={form.mission} onChange={(e) => setForm({...form, mission: e.target.value})} className={`${inputClass} min-h-[150px]`} placeholder="Évangéliser et former spirituellement..." />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">Nos Valeurs</h3>
              </div>
              <div>
                <label htmlFor="valeurs" className="block text-sm mb-1">Texte *</label>
                <textarea id="valeurs" value={form.valeurs} onChange={(e) => setForm({...form, valeurs: e.target.value})} className={`${inputClass} min-h-[150px]`} placeholder="Connaître la Parole, aimer Dieu..." />
              </div>
            </div>
          </AdminCard>
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
