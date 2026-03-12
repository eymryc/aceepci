"use client";

import { workshopOptionsApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

type WorkshopOptionItem = {
  id: number;
  name: string;
  event_id?: number | null;
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
        placeholder="Ex: Leadership spirituel, Évangélisation"
        maxLength={255}
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">ID événement (optionnel)</label>
      <input
        type="number"
        min={1}
        value={form.event_id ?? ""}
        onChange={(e) => setForm("event_id", e.target.value ? Number(e.target.value) : null)}
        placeholder="Vide = atelier global"
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Laissez vide pour un atelier disponible pour tous les événements.
      </p>
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

export default function WorkshopOptionsPage() {
  return (
    <SettingsCrudPage<WorkshopOptionItem>
      title="Options d'ateliers"
      description="Ateliers proposés lors des événements (liés à un événement ou globaux)."
      api={workshopOptionsApi}
      addLabel="Ajouter un atelier"
      editLabel="Modifier l'atelier"
      deleteLabel="Supprimer l'atelier"
      deleteConfirmLabel="Supprimer cette option d'atelier ?"
      formFields={FormFields}
      getItemData={(form) => ({
        name: String(form.name ?? "").trim(),
        event_id: form.event_id != null && form.event_id !== "" ? Number(form.event_id) : null,
        display_order: form.display_order != null && form.display_order !== "" ? Number(form.display_order) : 0,
      })}
      validateForm={(form) => {
        if (!String(form.name ?? "").trim()) return "Le nom est requis.";
        return null;
      }}
      extraColumns={[
        {
          header: "Événement",
          render: (item: WorkshopOptionItem) => (item.event_id ? `#${item.event_id}` : "Global"),
        },
        { header: "Ordre", render: (item: WorkshopOptionItem) => item.display_order ?? "—" },
      ]}
    />
  );
}
