"use client";

import { serviceDomainsApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

const FormFields = ({ form, setForm }: { form: Record<string, string | number | null>; setForm: (f: string, v: string | number | null) => void }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
    <input
      type="text"
      value={String(form.name ?? "")}
      onChange={(e) => setForm("name", e.target.value)}
      placeholder="Ex: Évangélisation, Social..."
      maxLength={255}
      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
    />
  </div>
);

export default function ServiceDomainsPage() {
  return (
    <SettingsCrudPage
      title="Domaines de service"
      description="Gestion des domaines de service au sein de l'association"
      api={serviceDomainsApi}
      addLabel="Ajouter un domaine de service"
      editLabel="Modifier le domaine de service"
      deleteLabel="Supprimer le domaine de service"
      deleteConfirmLabel="Supprimer ce domaine de service ?"
      formFields={FormFields}
      getItemData={(form) => ({ name: String(form.name ?? "").trim() })}
      validateForm={(form) => (!String(form.name ?? "").trim() ? "Le nom est requis." : null)}
    />
  );
}
