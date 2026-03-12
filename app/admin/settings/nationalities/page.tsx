"use client";

import { nationalitiesApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

type NationalityItem = { id: number; name: string; code?: string | null; display_order?: number | null };

const FormFields = ({
  form,
  setForm,
}: {
  form: Record<string, string | number | null>;
  setForm: (f: string, v: string | number | null) => void;
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Nom *</label>
      <input
        type="text"
        value={String(form.name ?? "")}
        onChange={(e) => setForm("name", e.target.value)}
        placeholder="Ex: Ivoirienne"
        maxLength={100}
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Ordre d&apos;affichage</label>
      <input
        type="number"
        min={0}
        value={form.display_order ?? ""}
        onChange={(e) => setForm("display_order", e.target.value ? Number(e.target.value) : null)}
        placeholder="Ex: 1"
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>
  </div>
);

export default function NationalitiesPage() {
  return (
    <SettingsCrudPage<NationalityItem>
      title="Nationalités"
      description="Gestion des nationalités pour les membres."
      api={nationalitiesApi}
      addLabel="Ajouter une nationalité"
      editLabel="Modifier la nationalité"
      deleteLabel="Supprimer la nationalité"
      deleteConfirmLabel="Supprimer cette nationalité ?"
      formFields={FormFields}
      getItemData={(form, editing) => ({
        name: String(form.name ?? "").trim(),
        ...(editing && { code: String(form.code ?? "").trim() || null }),
        display_order: form.display_order != null && form.display_order !== "" ? Number(form.display_order) : 0,
      })}
      validateForm={(form) => {
        if (!String(form.name ?? "").trim()) return "Le nom est requis.";
        return null;
      }}
      extraColumns={[
        { header: "Code", render: (item: NationalityItem) => item.code || "—" },
        { header: "Ordre", render: (item: NationalityItem) => item.display_order ?? "—" },
      ]}
    />
  );
}
