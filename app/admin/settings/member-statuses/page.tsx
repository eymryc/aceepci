"use client";

import { memberStatusesApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

const FormFields = ({ form, setForm }: { form: Record<string, string | number | null>; setForm: (f: string, v: string | number | null) => void }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
    <input
      type="text"
      value={String(form.name ?? "")}
      onChange={(e) => setForm("name", e.target.value)}
      placeholder="Ex: Actif, Inactif, Suspendu..."
      maxLength={255}
      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
    />
  </div>
);

export default function MemberStatusesPage() {
  return (
    <SettingsCrudPage
      title="Statuts de membre"
      description="Gestion des statuts d'adhésion (actif, inactif, suspendu...)"
      api={memberStatusesApi}
      addLabel="Ajouter un statut"
      editLabel="Modifier le statut"
      deleteLabel="Supprimer le statut"
      deleteConfirmLabel="Supprimer ce statut ?"
      formFields={FormFields}
      getItemData={(form) => ({ name: String(form.name ?? "").trim() })}
      validateForm={(form) => (!String(form.name ?? "").trim() ? "Le nom est requis." : null)}
    />
  );
}
