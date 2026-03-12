"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { DatePicker } from "@/components/ui/date-picker";
import { eventsApi, publicOptionsApi } from "@/lib/api";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminEventsNewPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formFieldErrors, setFormFieldErrors] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const [form, setForm] = useState({
    name: "",
    title: "",
    slug: "",
    event_category_id: 0,
    start_date: "",
    end_date: "",
    expected_attendees: "",
    location: "",
    price: "",
    is_published: false,
    registration_open: false,
  });

  useEffect(() => {
    publicOptionsApi.eventCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const setFormField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      const strVal = typeof value === "string" ? value : "";
      if (field === "title" && !f.slug) next.slug = slugify(strVal);
      if (field === "name" && !f.title) {
        next.title = strVal;
        if (!f.slug) next.slug = slugify(strVal);
      }
      return next;
    });
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Le nom est requis.";
    if (!form.event_category_id) return "La catégorie est requise.";
    if (!form.start_date) return "La date de début est requise.";
    if (!form.end_date) return "La date de fin est requise.";
    if (form.start_date && form.end_date && form.start_date > form.end_date) {
      return "La date de fin doit être après la date de début.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    if (!token) return;
    setSaving(true);
    setFormError(null);
    setFormFieldErrors({});
    try {
      const res = await eventsApi.create(token, {
        ...form,
        event_category_id: form.event_category_id || undefined,
        slug: form.slug || undefined,
      });
      toast.success(res.message || "Événement créé.");
      router.push("/admin/events");
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      const msg = apiErr?.message || "Erreur lors de l'enregistrement.";
      const fieldErrs = apiErr?.errors || {};
      setFormFieldErrors(fieldErrs);
      const friendlyMsg = msg.includes("validation.max") || msg.includes("max.string")
        ? "Un ou plusieurs champs dépassent la longueur maximale autorisée. Vérifiez Lieu, Participants attendus et Prix."
        : msg;
      setFormError(friendlyMsg);
      toast.error(friendlyMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl w-full">
      <div className="mb-6">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux événements
        </Link>
      </div>

      <AdminPageHeader
        title="Nouvel événement"
        description="Créez un nouvel événement"
        action={
          <AdminButton href="/admin/events" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Annuler
          </AdminButton>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 space-y-1">
            <p>{formError}</p>
            {Object.keys(formFieldErrors).length > 0 && (
              <ul className="list-disc list-inside mt-2">
                {Object.entries(formFieldErrors).map(([field, msgs]) => {
                  const labels: Record<string, string> = {
                    location: "Lieu",
                    expected_attendees: "Participants attendus",
                    price: "Prix",
                    name: "Nom",
                    title: "Titre",
                    slug: "Slug",
                  };
                  return (
                    <li key={field}>
                      <strong>{labels[field] ?? field}</strong> : {msgs?.[0] ?? ""}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
          <div className="flex flex-col gap-6 min-h-0">
            <AdminCard padding="none" className="flex-1">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Informations générales</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Nom, titre et catégorie</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nom *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setFormField("name", e.target.value)}
                    placeholder="Ex: Camp Biblique National 2026"
                    maxLength={255}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Titre</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setFormField("title", e.target.value)}
                    placeholder="Ex: Camp Biblique National 2026"
                    maxLength={255}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Slug (optionnel)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setFormField("slug", e.target.value)}
                    placeholder="Généré automatiquement à partir du titre"
                    maxLength={255}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Catégorie *</label>
                  <select
                    value={form.event_category_id || ""}
                    onChange={(e) => setFormField("event_category_id", Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </AdminCard>
            <div className="flex gap-3">
              <AdminButton type="submit" icon={<Save className="w-4 h-4" />} disabled={saving}>
                {saving ? "Création..." : "Créer l'événement"}
              </AdminButton>
              <AdminButton type="button" variant="outline" href="/admin/events" disabled={saving}>
                Annuler
              </AdminButton>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:h-full">
            <AdminCard padding="none" className="flex-1">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Dates et lieu</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Dates de début et fin, lieu</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date de début *</label>
                  <DatePicker
                    value={form.start_date}
                    onChange={(v) => setFormField("start_date", v)}
                    placeholder="jj / mm / aaaa"
                    allowFuture
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date de fin *</label>
                  <DatePicker
                    value={form.end_date}
                    onChange={(v) => setFormField("end_date", v)}
                    placeholder="jj / mm / aaaa"
                    allowFuture
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Lieu</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setFormField("location", e.target.value)}
                  placeholder="Ex: Yamoussoukro"
                  maxLength={255}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Participants attendus</label>
                <input
                  type="text"
                  value={form.expected_attendees}
                  onChange={(e) => setFormField("expected_attendees", e.target.value)}
                  placeholder="Ex: 500+"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prix</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setFormField("price", e.target.value)}
                  placeholder="Ex: 25 000 FCFA"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
            </div>
            </AdminCard>

            <AdminCard padding="none">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Publication</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Visibilité et inscriptions</p>
                </div>
                <div className="p-6 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => setFormField("is_published", e.target.checked)}
                      className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Publier l&apos;événement (visible sur le site)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.registration_open}
                      onChange={(e) => setFormField("registration_open", e.target.checked)}
                      className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Ouvrir les inscriptions</span>
                  </label>
                </div>
              </AdminCard>
          </div>
        </div>
      </form>
    </div>
  );
}
