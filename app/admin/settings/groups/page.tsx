"use client";

import { useState, useEffect } from "react";
import { groupsApi, familiesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { SettingsCrudPage } from "@/components/admin";

interface Family {
  id: number;
  name: string;
}

interface GroupItem {
  id: number;
  name: string;
  family_id?: number;
  family?: { id: number; name: string };
}

function GroupsFormFields({
  form,
  setForm,
}: {
  form: Record<string, string | number | null>;
  setForm: (f: string, v: string | number | null) => void;
  editing: { id: number; name: string } | null;
}) {
  const { token } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);

  useEffect(() => {
    if (!token) return;
    familiesApi
      .list(token, { per_page: 500 })
      .then((res) => setFamilies(Array.isArray(res.data) ? res.data : []))
      .catch(() => setFamilies([]));
  }, [token]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
        <input
          type="text"
          value={String(form.name ?? "")}
          onChange={(e) => setForm("name", e.target.value)}
          placeholder="Ex: Groupe Alpha, Cellule Beta..."
          maxLength={255}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Famille *</label>
        <select
          value={form.family_id ?? ""}
          onChange={(e) => setForm("family_id", e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
          required
        >
          <option value="">Sélectionner une famille</option>
          {families.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description (optionnel)</label>
        <textarea
          value={String(form.description ?? "")}
          onChange={(e) => setForm("description", e.target.value)}
          placeholder="Description du groupe..."
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const { token } = useAuth();
  const [familiesMap, setFamiliesMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (!token) return;
    familiesApi
      .list(token, { per_page: 500 })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setFamiliesMap(new Map(data.map((f) => [f.id, f.name])));
      })
      .catch(() => setFamiliesMap(new Map()));
  }, [token]);

  return (
    <SettingsCrudPage
      title="Groupes"
      description="Gestion des groupes et cellules"
      api={groupsApi}
      addLabel="Ajouter un groupe"
      editLabel="Modifier le groupe"
      deleteLabel="Supprimer le groupe"
      deleteConfirmLabel="Supprimer ce groupe ?"
      formFields={GroupsFormFields}
      getItemData={(form) => ({
        name: String(form.name ?? "").trim(),
        family_id: Number(form.family_id) || 0,
        description: String(form.description ?? "").trim() || null,
      })}
      validateForm={(form) => {
        if (!String(form.name ?? "").trim()) return "Le nom est requis.";
        if (!form.family_id || Number(form.family_id) <= 0) return "La famille est requise.";
        return null;
      }}
      extraColumns={[
        {
          header: "Famille",
          render: (item: GroupItem) =>
            item.family?.name ?? familiesMap.get(item.family_id ?? 0) ?? "—",
        },
      ]}
    />
  );
}
