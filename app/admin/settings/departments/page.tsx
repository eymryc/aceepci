"use client";

import { departmentsApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

const FormFields = ({ form, setForm }: { form: Record<string, string | number | null>; setForm: (f: string, v: string | number | null) => void; editing: { id: number; name: string } | null }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
    <input
      type="text"
      value={String(form.name ?? "")}
      onChange={(e) => setForm("name", e.target.value)}
      placeholder="Ex: Évangélisation, Formation..."
      maxLength={255}
      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
    />
  </div>
);

export default function DepartmentsPage() {
  return (
    <SettingsCrudPage
      title="Départements de service"
      description="Gestion des départements de service de l'ACEEPCI"
      api={departmentsApi}
      addLabel="Ajouter un département"
      editLabel="Modifier le département"
      deleteLabel="Supprimer le département"
      deleteConfirmLabel="Supprimer ce département ?"
      formFields={FormFields}
      getItemData={(form) => ({ name: String(form.name ?? "").trim() })}
      validateForm={(form) => (!String(form.name ?? "").trim() ? "Le nom est requis." : null)}
    />
  );
}
