"use client";

import { citiesApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

const FormFields = ({ form, setForm }: { form: Record<string, string | number | null>; setForm: (f: string, v: string | number | null) => void }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
      <input
        type="text"
        value={String(form.name ?? "")}
        onChange={(e) => setForm("name", e.target.value)}
        placeholder="Ex: Abidjan, Yamoussoukro..."
        maxLength={255}
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>
  </div>
);

export default function CitiesPage() {
  return (
    <SettingsCrudPage
      title="Villes"
      description="Gestion des villes et localités"
      api={citiesApi}
      addLabel="Ajouter une ville"
      editLabel="Modifier la ville"
      deleteLabel="Supprimer la ville"
      deleteConfirmLabel="Supprimer cette ville ?"
      formFields={FormFields}
      getItemData={(form, editing) => ({ name: String(form.name ?? "").trim(), ...(editing && { code: String(form.code ?? "").trim() || null }) })}
      validateForm={(form) => (!String(form.name ?? "").trim() ? "Le nom est requis." : null)}
    />
  );
}
