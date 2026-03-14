"use client";

import { devotionalCategoriesApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

type DevotionalCategoryItem = {
  id: number;
  name: string;
  code?: string | null;
  display_order?: number | null;
};

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
        placeholder="Ex: Dévotion quotidienne, Foi, Prière..."
        maxLength={255}
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Code</label>
      <input
        type="text"
        value={String(form.code ?? "")}
        onChange={(e) => setForm("code", e.target.value)}
        placeholder="Ex: devotion-quotidienne, foi, priere"
        maxLength={50}
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

export default function DevotionalCategoriesPage() {
  return (
    <SettingsCrudPage<DevotionalCategoryItem>
      title="Catégories de dévotionnels"
      description="Gérez les catégories utilisées pour classer les dévotionnels (ex. Dévotion quotidienne, Foi, Prière, Amour...)."
      api={devotionalCategoriesApi}
      addLabel="Ajouter une catégorie"
      editLabel="Modifier la catégorie"
      deleteLabel="Supprimer la catégorie"
      deleteConfirmLabel="Supprimer cette catégorie de dévotionnel ?"
      formFields={FormFields}
      getItemData={(form) => ({
        name: String(form.name ?? "").trim(),
        code: form.code == null || form.code === "" ? null : String(form.code).trim().slice(0, 50) || null,
        display_order: form.display_order != null && form.display_order !== "" ? Number(form.display_order) : 0,
      })}
      validateForm={(form) => {
        if (!String(form.name ?? "").trim()) return "Le nom est requis.";
        return null;
      }}
      extraColumns={[
        { header: "Code", render: (item: DevotionalCategoryItem) => item.code || "—" },
        { header: "Ordre", render: (item: DevotionalCategoryItem) => item.display_order ?? "—" },
      ]}
    />
  );
}
