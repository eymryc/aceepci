"use client";

import { offerTypesApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

type OfferTypeItem = { id: number; name: string; code?: string | null; display_order?: number | null };

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
        placeholder="Ex: CDI, CDD, Stage, Bénévolat, Bourse"
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
        placeholder="Ex: cdi, cdd, stage, benevolat, bourse"
        maxLength={20}
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

export default function OfferTypesPage() {
  return (
    <SettingsCrudPage<OfferTypeItem>
      title="Types / Contrats d'offres"
      description="Types de contrat ou de poste (CDI, CDD, Stage, Bénévolat, Bourse...)."
      api={offerTypesApi}
      addLabel="Ajouter un type"
      editLabel="Modifier le type"
      deleteLabel="Supprimer le type"
      deleteConfirmLabel="Supprimer ce type d'offre ?"
      formFields={FormFields}
      getItemData={(form) => ({
        name: String(form.name ?? "").trim(),
        code: form.code == null || form.code === "" ? null : String(form.code).trim().slice(0, 20) || null,
        display_order: form.display_order != null && form.display_order !== "" ? Number(form.display_order) : 0,
      })}
      validateForm={(form) => {
        if (!String(form.name ?? "").trim()) return "Le nom est requis.";
        return null;
      }}
      extraColumns={[
        { header: "Code", render: (item: OfferTypeItem) => item.code || "—" },
        { header: "Ordre", render: (item: OfferTypeItem) => item.display_order ?? "—" },
      ]}
    />
  );
}
