"use client";

import { memberTypesApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

const FormFields = ({ form, setForm }: { form: Record<string, string | number | null>; setForm: (f: string, v: string | number | null) => void }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
    <input
      type="text"
      value={String(form.name ?? "")}
      onChange={(e) => setForm("name", e.target.value)}
      placeholder="Ex: Élève, Étudiant, Alumni"
      maxLength={255}
      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
    />
  </div>
);

export default function MemberTypesPage() {
  return (
    <SettingsCrudPage
      title="Types de membre"
      description="Gestion des types d'adhésion (élève, étudiant, alumni...)"
      api={memberTypesApi}
      addLabel="Ajouter un type de membre"
      editLabel="Modifier le type de membre"
      deleteLabel="Supprimer le type de membre"
      deleteConfirmLabel="Supprimer ce type de membre ?"
      formFields={FormFields}
      getItemData={(form) => ({ name: String(form.name ?? "").trim() })}
      validateForm={(form) => (!String(form.name ?? "").trim() ? "Le nom est requis." : null)}
    />
  );
}
