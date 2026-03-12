"use client";

import { useEffect, useState } from "react";
import { academicLevelsApi, memberTypesApi, type LabeledSettingItem } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { SettingsCrudPage } from "@/components/admin";

interface OptionItem {
  id: number;
  name: string;
}

function AcademicLevelsFormFields({
  form,
  setForm,
}: {
  form: Record<string, string | number | null>;
  setForm: (f: string, v: string | number | null) => void;
  editing: { id: number; name: string } | null;
}) {
  const { token } = useAuth();
  const [memberTypes, setMemberTypes] = useState<OptionItem[]>([]);

  useEffect(() => {
    if (!token) return;
    memberTypesApi
      .list(token, { per_page: 500 })
      .then((res) => setMemberTypes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMemberTypes([]));
  }, [token]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Valeur *</label>
          <input
            type="text"
            value={String(form.value ?? "")}
            onChange={(e) => setForm("value", e.target.value)}
            placeholder="Ex: licence_1"
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
            placeholder="Ex: Licence 1"
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

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Type de membre *</label>
        <select
          value={form.member_type_id ?? ""}
          onChange={(e) => setForm("member_type_id", e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
          aria-label="Type de membre"
        >
          <option value="">Sélectionner un type</option>
          {memberTypes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function AcademicLevelsPage() {
  const { token } = useAuth();
  const [memberTypesMap, setMemberTypesMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (!token) return;
    memberTypesApi
      .list(token, { per_page: 500 })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setMemberTypesMap(new Map(data.map((item) => [item.id, item.name])));
      })
      .catch(() => setMemberTypesMap(new Map()));
  }, [token]);

  return (
    <SettingsCrudPage
      title="Niveaux académiques"
      description="Gestion des niveaux académiques pilotés par type de membre."
      api={academicLevelsApi}
      addLabel="Ajouter un niveau académique"
      editLabel="Modifier le niveau académique"
      deleteLabel="Supprimer le niveau académique"
      deleteConfirmLabel="Supprimer ce niveau académique ?"
      formFields={AcademicLevelsFormFields}
      getItemData={(form, editing) => ({
        value: String(form.value ?? "").trim(),
        label: String(form.label ?? "").trim(),
        ...(editing && { code: String(form.code ?? "").trim() || null }),
        member_type_id: Number(form.member_type_id) || 0,
        display_order: form.display_order != null && form.display_order !== "" ? Number(form.display_order) : null,
      })}
      validateForm={(form) => {
        if (!String(form.value ?? "").trim()) return "La valeur est requise.";
        if (!String(form.label ?? "").trim()) return "Le libellé est requis.";
        if (!form.member_type_id || Number(form.member_type_id) <= 0) return "Le type de membre est requis.";
        return null;
      }}
      extraColumns={[
        { header: "Valeur", render: (item: LabeledSettingItem) => item.value || "—" },
        { header: "Code", render: (item: LabeledSettingItem) => item.code || "—" },
        {
          header: "Type de membre",
          render: (item: LabeledSettingItem) =>
            item.member_type?.name ?? memberTypesMap.get(item.member_type_id ?? 0) ?? "—",
        },
        { header: "Ordre", render: (item: LabeledSettingItem) => item.display_order ?? "—" },
      ]}
    />
  );
}
