"use client";

import { familiesApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

const FormFields = ({ form, setForm }: { form: Record<string, string | number | null>; setForm: (f: string, v: string | number | null) => void }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
      <input
        type="text"
        value={String(form.name ?? "")}
        onChange={(e) => setForm("name", e.target.value)}
        placeholder="Ex: Famille Alpha, Famille Beta..."
        maxLength={255}
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Description (optionnel)</label>
      <textarea
        value={String(form.description ?? "")}
        onChange={(e) => setForm("description", e.target.value)}
        placeholder="Description de la famille..."
        rows={3}
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>
  </div>
);

export default function FamiliesPage() {
  return (
    <SettingsCrudPage
      title="Familles"
      description="Gestion des familles ou regroupements"
      api={familiesApi}
      addLabel="Ajouter une famille"
      editLabel="Modifier la famille"
      deleteLabel="Supprimer la famille"
      deleteConfirmLabel="Supprimer cette famille ?"
      formFields={FormFields}
      getItemData={(form) => ({
        name: String(form.name ?? "").trim(),
        description: String(form.description ?? "").trim() || null,
      })}
      validateForm={(form) => (!String(form.name ?? "").trim() ? "Le nom est requis." : null)}
    />
  );
}
