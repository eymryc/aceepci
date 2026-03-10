"use client";

import { useState, useEffect } from "react";
import { districtsApi, citiesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { SettingsCrudPage } from "@/components/admin";

interface City {
  id: number;
  name: string;
}

interface DistrictItem {
  id: number;
  name: string;
  city_id?: number;
  city?: { id: number; name: string };
}

function DistrictsFormFields({
  form,
  setForm,
}: {
  form: Record<string, string | number | null>;
  setForm: (f: string, v: string | number | null) => void;
  editing: { id: number; name: string } | null;
}) {
  const { token } = useAuth();
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (!token) return;
    citiesApi
      .list(token, { per_page: 500 })
      .then((res) => setCities(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCities([]));
  }, [token]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
        <input
          type="text"
          value={String(form.name ?? "")}
          onChange={(e) => setForm("name", e.target.value)}
          placeholder="Ex: Cocody, Yopougon..."
          maxLength={255}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Ville *</label>
        <select
          value={form.city_id ?? ""}
          onChange={(e) => setForm("city_id", e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
          required
        >
          <option value="">Sélectionner une ville</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function DistrictsPage() {
  const { token } = useAuth();
  const [citiesMap, setCitiesMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (!token) return;
    citiesApi
      .list(token, { per_page: 500 })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCitiesMap(new Map(data.map((c) => [c.id, c.name])));
      })
      .catch(() => setCitiesMap(new Map()));
  }, [token]);

  return (
    <SettingsCrudPage
      title="Districts"
      description="Gestion des districts"
      api={districtsApi}
      addLabel="Ajouter un district"
      editLabel="Modifier le district"
      deleteLabel="Supprimer le district"
      deleteConfirmLabel="Supprimer ce district ?"
      formFields={DistrictsFormFields}
      getItemData={(form) => ({
        name: String(form.name ?? "").trim(),
        city_id: Number(form.city_id) || 0,
      })}
      validateForm={(form) => {
        if (!String(form.name ?? "").trim()) return "Le nom est requis.";
        if (!form.city_id || Number(form.city_id) <= 0) return "La ville est requise.";
        return null;
      }}
      extraColumns={[
        {
          header: "Ville",
          render: (item: DistrictItem) =>
            item.city?.name ?? citiesMap.get(item.city_id ?? 0) ?? "—",
        },
      ]}
    />
  );
}
