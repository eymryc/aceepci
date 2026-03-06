"use client";

import { useState } from "react";
import { Save, BookOpen, Info } from "lucide-react";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";

const mockVerse = {
  text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
  reference: "Jean 3:16",
  secondaryText: "Ne sois pas de ceux qui se détournent et qui sont perdus.",
  secondaryReference: "Luc 13:23",
};

export default function AdminVersePage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(mockVerse);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Verset du jour"
        description="Gérez le verset affiché sur la page d'accueil et la page Médias"
      />

      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Où apparaît le verset ?</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-700">
              <li>Page d&apos;accueil — section « Parole du jour »</li>
              <li>Page Médias / Ressources — section « Verset du jour »</li>
            </ul>
          </div>
        </div>

        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border bg-slate-50/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-primary" />
              Verset principal
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Texte et référence affichés en priorité
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Texte du verset</label>
              <textarea
                rows={3}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Car Dieu a tant aimé le monde..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Référence biblique</label>
              <input
                type="text"
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
                placeholder="Jean 3:16"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border bg-slate-50/50">
            <h2 className="font-semibold text-foreground">
              Verset secondaire (optionnel)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Affiché sur la page d&apos;accueil sous le verset principal
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Texte</label>
              <textarea
                rows={2}
                value={form.secondaryText}
                onChange={(e) => setForm({ ...form, secondaryText: e.target.value })}
                placeholder="Ne sois pas de ceux qui se détournent..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Référence</label>
              <input
                type="text"
                value={form.secondaryReference}
                onChange={(e) => setForm({ ...form, secondaryReference: e.target.value })}
                placeholder="Luc 13:23"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </AdminCard>

        <div className="flex justify-end">
          <AdminButton onClick={handleSave} icon={<Save className="w-4 h-4" />}>
            {saved ? "Enregistré !" : "Enregistrer le verset"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
