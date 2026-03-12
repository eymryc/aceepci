"use client";

import { knowledgeSourcesApi, type LabeledSettingItem } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

const FormFields = ({
  form,
  setForm,
}: {
  form: Record<string, string | number | null>;
  setForm: (f: string, v: string | number | null) => void;
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Valeur *</label>
        <input
          type="text"
          value={String(form.value ?? "")}
          onChange={(e) => setForm("value", e.target.value)}
          placeholder="Ex: social_media"
          maxLength={50}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Libellé *</label>
        <input
          type="text"
          value={String(form.label ?? "")}
          onChange={(e) => setForm("label", e.target.value)}
          placeholder="Ex: Réseaux sociaux"
          maxLength={255}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Ordre d'affichage</label>
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

export default function KnowledgeSourcesPage() {
  return (
    <SettingsCrudPage
      title="Sources de connaissance"
      description="Gestion des sources indiquant comment une personne a connu l'ACEEPCI."
      api={knowledgeSourcesApi}
      addLabel="Ajouter une source de connaissance"
      editLabel="Modifier la source de connaissance"
      deleteLabel="Supprimer la source de connaissance"
      deleteConfirmLabel="Supprimer cette source ?"
      formFields={FormFields}
      getItemData={(form, editing) => ({
        value: String(form.value ?? "").trim(),
        label: String(form.label ?? "").trim(),
        ...(editing && { code: String(form.code ?? "").trim() || null }),
        display_order: form.display_order != null && form.display_order !== "" ? Number(form.display_order) : null,
      })}
      validateForm={(form) => {
        if (!String(form.value ?? "").trim()) return "La valeur est requise.";
        if (!String(form.label ?? "").trim()) return "Le libellé est requis.";
        return null;
      }}
      extraColumns={[
        { header: "Valeur", render: (item: LabeledSettingItem) => item.value || "—" },
        { header: "Code", render: (item: LabeledSettingItem) => item.code || "—" },
        { header: "Ordre", render: (item: LabeledSettingItem) => item.display_order ?? "—" },
      ]}
    />
  );
}
