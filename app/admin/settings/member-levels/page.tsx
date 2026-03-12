"use client";

import { useEffect, useState } from "react";
import { familiesApi, memberLevelsApi, memberTypesApi, type LabeledSettingItem } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { SettingsCrudPage } from "@/components/admin";

interface OptionItem {
  id: number;
  name: string;
}

function MemberLevelsFormFields({
  form,
  setForm,
}: {
  form: Record<string, string | number | null>;
  setForm: (f: string, v: string | number | null) => void;
  editing: { id: number; name: string } | null;
}) {
  const { token } = useAuth();
  const [memberTypes, setMemberTypes] = useState<OptionItem[]>([]);
  const [families, setFamilies] = useState<OptionItem[]>([]);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      memberTypesApi.list(token, { per_page: 500 }),
      familiesApi.list(token, { per_page: 500 }),
    ])
      .then(([memberTypesRes, familiesRes]) => {
        setMemberTypes(Array.isArray(memberTypesRes.data) ? memberTypesRes.data : []);
        setFamilies(Array.isArray(familiesRes.data) ? familiesRes.data : []);
      })
      .catch(() => {
        setMemberTypes([]);
        setFamilies([]);
      });
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
            placeholder="Ex: university"
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
            placeholder="Ex: Étudiant / Université"
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

      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Famille</label>
          <select
            value={form.family_id ?? ""}
            onChange={(e) => setForm("family_id", e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            aria-label="Famille"
          >
            <option value="">Aucune</option>
            {families.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function MemberLevelsPage() {
  const { token } = useAuth();
  const [memberTypesMap, setMemberTypesMap] = useState<Map<number, string>>(new Map());
  const [familiesMap, setFamiliesMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (!token) return;

    Promise.all([
      memberTypesApi.list(token, { per_page: 500 }),
      familiesApi.list(token, { per_page: 500 }),
    ])
      .then(([memberTypesRes, familiesRes]) => {
        const memberTypes = Array.isArray(memberTypesRes.data) ? memberTypesRes.data : [];
        const families = Array.isArray(familiesRes.data) ? familiesRes.data : [];
        setMemberTypesMap(new Map(memberTypes.map((item) => [item.id, item.name])));
        setFamiliesMap(new Map(families.map((item) => [item.id, item.name])));
      })
      .catch(() => {
        setMemberTypesMap(new Map());
        setFamiliesMap(new Map());
      });
  }, [token]);

  return (
    <SettingsCrudPage
      title="Niveaux de membre"
      description="Gestion des niveaux de membre liés aux types d'adhésion."
      api={memberLevelsApi}
      addLabel="Ajouter un niveau de membre"
      editLabel="Modifier le niveau de membre"
      deleteLabel="Supprimer le niveau de membre"
      deleteConfirmLabel="Supprimer ce niveau de membre ?"
      formFields={MemberLevelsFormFields}
      getItemData={(form, editing) => ({
        value: String(form.value ?? "").trim(),
        label: String(form.label ?? "").trim(),
        ...(editing && { code: String(form.code ?? "").trim() || null }),
        member_type_id: Number(form.member_type_id) || 0,
        family_id: form.family_id != null && form.family_id !== "" ? Number(form.family_id) : null,
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
        {
          header: "Famille",
          render: (item: LabeledSettingItem) =>
            item.family?.name ?? familiesMap.get(item.family_id ?? 0) ?? "—",
        },
        { header: "Ordre", render: (item: LabeledSettingItem) => item.display_order ?? "—" },
      ]}
    />
  );
}
