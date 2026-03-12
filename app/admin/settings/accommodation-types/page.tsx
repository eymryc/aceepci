"use client";

import { accommodationTypesApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

type AccommodationTypeItem = {
  id: number;
  name: string;
  code?: string | null;
  price_surcharge?: number | null;
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
        placeholder="Ex: Dortoir mixte, Chambre partagée"
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
        placeholder="Ex: DORT, CHAMBRE"
        maxLength={20}
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Supplément prix (FCFA)</label>
      <input
        type="number"
        min={0}
        step={100}
        value={form.price_surcharge ?? ""}
        onChange={(e) => setForm("price_surcharge", e.target.value ? Number(e.target.value) : null)}
        placeholder="0 si inclus"
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

export default function AccommodationTypesPage() {
  return (
    <SettingsCrudPage<AccommodationTypeItem>
      title="Types d'hébergement"
      description="Types d'hébergement proposés pour les événements."
      api={accommodationTypesApi}
      addLabel="Ajouter un type d'hébergement"
      editLabel="Modifier le type d'hébergement"
      deleteLabel="Supprimer le type d'hébergement"
      deleteConfirmLabel="Supprimer ce type d'hébergement ?"
      formFields={FormFields}
      getItemData={(form) => ({
        name: String(form.name ?? "").trim(),
        code: form.code == null || form.code === "" ? null : String(form.code).trim().slice(0, 20) || null,
        price_surcharge: form.price_surcharge != null && form.price_surcharge !== "" ? Number(form.price_surcharge) : null,
        display_order: form.display_order != null && form.display_order !== "" ? Number(form.display_order) : 0,
      })}
      validateForm={(form) => {
        if (!String(form.name ?? "").trim()) return "Le nom est requis.";
        return null;
      }}
      extraColumns={[
        { header: "Code", render: (item: AccommodationTypeItem) => item.code || "—" },
        {
          header: "Supplément",
          render: (item: AccommodationTypeItem) =>
            item.price_surcharge != null ? `${Number(item.price_surcharge).toLocaleString()} FCFA` : "—",
        },
        { header: "Ordre", render: (item: AccommodationTypeItem) => item.display_order ?? "—" },
      ]}
    />
  );
}
