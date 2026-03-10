"use client";

import { academicYearsApi } from "@/lib/api";
import { SettingsCrudPage } from "@/components/admin";

const FormFields = ({
  form,
  setForm,
}: {
  form: Record<string, string | number | null>;
  setForm: (f: string, v: string | number | null) => void;
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
      <input
        type="text"
        value={String(form.name ?? "")}
        onChange={(e) => setForm("name", e.target.value)}
        placeholder="Ex: 2024-2025, 2025-2026"
        maxLength={255}
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Année de début</label>
        <input
          type="number"
          min={1900}
          max={2100}
          value={form.year_start ?? ""}
          onChange={(e) => setForm("year_start", e.target.value ? parseInt(e.target.value, 10) : null)}
          placeholder="Ex: 2024"
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Année de fin</label>
        <input
          type="number"
          min={1900}
          max={2100}
          value={form.year_end ?? ""}
          onChange={(e) => setForm("year_end", e.target.value ? parseInt(e.target.value, 10) : null)}
          placeholder="Ex: 2025"
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="is_current"
        checked={Boolean(form.is_current)}
        onChange={(e) => setForm("is_current", e.target.checked ? 1 : 0)}
        className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
      />
      <label htmlFor="is_current" className="text-sm font-medium text-foreground">
        Année académique en cours
      </label>
    </div>
  </div>
);

export default function AcademicYearsPage() {
  return (
    <SettingsCrudPage
      title="Années académiques"
      description="Gestion des années scolaires et universitaires"
      api={academicYearsApi}
      addLabel="Ajouter une année académique"
      editLabel="Modifier l'année académique"
      deleteLabel="Supprimer l'année académique"
      deleteConfirmLabel="Supprimer cette année académique ?"
      formFields={FormFields}
      getItemData={(form) => ({
        name: String(form.name ?? "").trim(),
        year_start: Number(form.year_start) || 0,
        year_end: form.year_end != null && form.year_end !== "" ? Number(form.year_end) : null,
        is_current: Boolean(form.is_current),
      })}
      validateForm={(form) => {
        if (!String(form.name ?? "").trim()) return "Le nom est requis.";
        const start = Number(form.year_start);
        if (!start || start < 1900 || start > 2100) return "L'année de début doit être entre 1900 et 2100.";
        const end = form.year_end != null && form.year_end !== "" ? Number(form.year_end) : null;
        if (end != null && (end < 1900 || end > 2100)) return "L'année de fin doit être entre 1900 et 2100.";
        return null;
      }}
      extraColumns={[
        { header: "Début", render: (item) => item.year_start ?? "—" },
        { header: "Fin", render: (item) => item.year_end ?? "—" },
        { header: "En cours", render: (item) => (item.is_current ? "Oui" : "Non") },
      ]}
    />
  );
}
