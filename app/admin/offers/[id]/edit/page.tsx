"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { DatePicker } from "@/components/ui/date-picker";
import { offersApi, publicOptionsApi, type PublicOptionItem } from "@/lib/api";

export default function AdminOffersEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formFieldErrors, setFormFieldErrors] = useState<Record<string, string[]>>({});
  const [categoryOptions, setCategoryOptions] = useState<PublicOptionItem[]>([]);
  const [typeOptions, setTypeOptions] = useState<PublicOptionItem[]>([]);

  const [form, setForm] = useState({
    title: "",
    organization: "",
    offer_category_id: "" as string | number,
    location: "",
    offer_type_id: "" as string | number,
    deadline: "",
    description: "",
    requirements: [""] as string[],
    salary: "",
    duration: "",
    external_link: "",
  });

  useEffect(() => {
    if (!token || !id || Number.isNaN(id)) return;
    setLoading(true);
    Promise.all([
      publicOptionsApi.offerCategories().catch(() => []),
      publicOptionsApi.offerTypes().catch(() => []),
      offersApi.get(token, id),
    ])
      .then(([cats, types, offer]) => {
        setCategoryOptions(cats);
        setTypeOptions(types);
        const extLink = offer.external_link ?? (offer as { externalLink?: string }).externalLink ?? "";
        let catId = offer.offer_category_id ?? (offer.offer_category as { id?: number })?.id;
        let typeId = offer.offer_type_id ?? (offer.offer_type as { id?: number })?.id;
        if (catId == null && offer.category) {
          const match = cats.find(
            (c: PublicOptionItem) =>
              String(c.code ?? "").toLowerCase() === String(offer.category).toLowerCase() ||
              String(c.name ?? "").toLowerCase() === String(offer.category).toLowerCase()
          );
          if (match) catId = match.id;
        }
        if (typeId == null && offer.type) {
          const match = types.find(
            (t: PublicOptionItem) =>
              String(t.name ?? "").toLowerCase() === String(offer.type).toLowerCase() ||
              String(t.code ?? "").toLowerCase() === String(offer.type).toLowerCase()
          );
          if (match) typeId = match.id;
        }
        setForm({
          title: offer.title ?? "",
          organization: offer.organization ?? "",
          offer_category_id: catId ?? "",
          location: offer.location ?? "",
          offer_type_id: typeId ?? "",
          deadline: (offer.deadline ?? "").slice(0, 10) || "",
          description: offer.description ?? "",
          requirements: Array.isArray(offer.requirements) && offer.requirements.length > 0 ? offer.requirements : [""],
          salary: offer.salary ?? "",
          duration: offer.duration ?? "",
          external_link: extLink,
        });
      })
      .catch(() => {
        toast.error("Offre introuvable.");
        router.push("/admin/offers");
      })
      .finally(() => setLoading(false));
  }, [token, id, router]);

  const setFormField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const setRequirement = (index: number, value: string) => {
    setForm((f) => {
      const next = [...f.requirements];
      next[index] = value;
      return { ...f, requirements: next };
    });
  };

  const addRequirement = () => {
    setForm((f) => ({ ...f, requirements: [...f.requirements, ""] }));
  };

  const removeRequirement = (index: number) => {
    setForm((f) => ({
      ...f,
      requirements: f.requirements.filter((_, i) => i !== index),
    }));
  };

  const selectedCategory = categoryOptions.find((o) => String(o.id) === String(form.offer_category_id));
  const categoryCode = selectedCategory?.code ?? selectedCategory?.name?.toLowerCase() ?? "";

  const validate = (): string | null => {
    if (!form.title.trim()) return "Le titre est requis.";
    if (!form.organization.trim()) return "L'organisation est requise.";
    if (!form.offer_category_id) return "La catégorie est requise.";
    if (!form.deadline) return "La date d'échéance est requise.";
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
      const res = await offersApi.update(token, id, {
        ...form,
        offer_category_id: form.offer_category_id ? Number(form.offer_category_id) : null,
        offer_type_id: form.offer_type_id ? Number(form.offer_type_id) : null,
        requirements: form.requirements.map((s) => s.trim()).filter(Boolean),
      });
      toast.success(res.message || "Offre modifiée.");
      router.push("/admin/offers");
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      const msg = apiErr?.message || "Erreur lors de l'enregistrement.";
      const fieldErrs = apiErr?.errors || {};
      setFormFieldErrors(fieldErrs);
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl w-full">
        <div className="p-12 text-center text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full">
      <div className="mb-6">
        <Link
          href="/admin/offers"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux offres
        </Link>
      </div>

      <AdminPageHeader
        title="Modifier l'offre"
        description={form.title || "Modification"}
        action={
          <AdminButton href="/admin/offers" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Annuler
          </AdminButton>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            <p>{formError}</p>
            {Object.keys(formFieldErrors).length > 0 && (
              <ul className="list-disc list-inside mt-2">
                {Object.entries(formFieldErrors).map(([field, msgs]) => (
                  <li key={field}>
                    <strong>{field}</strong> : {msgs?.[0] ?? ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
          <div className="flex flex-col gap-6 min-h-0">
            <AdminCard padding="none" className="flex-1">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Informations générales</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Titre, organisation et catégorie</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Titre *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setFormField("title", e.target.value)}
                    placeholder="Ex: Chargé(e) de Communication Digitale"
                    maxLength={255}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Organisation *</label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setFormField("organization", e.target.value)}
                    placeholder="Ex: ONG Vision Mondiale Côte d'Ivoire"
                    maxLength={255}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label htmlFor="offer_category_id" className="block text-sm font-medium text-foreground mb-2">Catégorie *</label>
                  <select
                    id="offer_category_id"
                    value={String(form.offer_category_id ?? "")}
                    onChange={(e) => setFormField("offer_category_id", e.target.value || "")}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
                    aria-label="Catégorie"
                    required
                  >
                    <option value="">— Choisir une catégorie —</option>
                    {categoryOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Lieu</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setFormField("location", e.target.value)}
                    placeholder="Ex: Abidjan, Cocody"
                    maxLength={255}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label htmlFor="offer_type_id" className="block text-sm font-medium text-foreground mb-2">Type / Contrat</label>
                  <select
                    id="offer_type_id"
                    value={String(form.offer_type_id ?? "")}
                    onChange={(e) => setFormField("offer_type_id", e.target.value || "")}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
                    aria-label="Type / Contrat"
                  >
                    <option value="">— Choisir un type —</option>
                    {typeOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date d&apos;échéance *</label>
                  <DatePicker
                    value={form.deadline}
                    onChange={(v) => setFormField("deadline", v)}
                    placeholder="jj / mm / aaaa"
                    allowFuture
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Salaire / Montant (optionnel)
                  </label>
                  <input
                    type="text"
                    value={form.salary}
                    onChange={(e) => setFormField("salary", e.target.value)}
                    placeholder={
                      categoryCode.includes("emploi")
                        ? "Ex: 450 000 - 600 000 FCFA"
                        : categoryCode.includes("bourse")
                        ? "Ex: Bourse d'études"
                        : "Ex: Indemnité, prime, etc."
                    }
                    maxLength={100}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                {(categoryCode.includes("stage") || categoryCode.includes("benevolat")) && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Durée</label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setFormField("duration", e.target.value)}
                      placeholder="Ex: 6 mois, 2 semaines (Juillet-Août)"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Lien de candidature</label>
                  <input
                    type="url"
                    value={form.external_link}
                    onChange={(e) => setFormField("external_link", e.target.value)}
                    placeholder="https://... ou mailto:..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </AdminCard>
            <div className="flex gap-3">
              <AdminButton type="submit" icon={<Save className="w-4 h-4" />} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </AdminButton>
              <AdminButton type="button" variant="outline" href="/admin/offers" disabled={saving}>
                Annuler
              </AdminButton>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:h-full">
            <AdminCard padding="none" className="flex-1">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Description</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Description et exigences</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setFormField("description", e.target.value)}
                    placeholder="Décrivez l'offre et les missions principales..."
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-y"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">Exigences</label>
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary-dark font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une exigence
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Chaque exigence peut contenir plusieurs lignes.</p>
                  <div className="space-y-3">
                    {form.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2">
                        <textarea
                          value={req}
                          onChange={(e) => setRequirement(index, e.target.value)}
                          placeholder={`Exigence ${index + 1} (ex: Licence en Communication ou Marketing)`}
                          rows={2}
                          className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-y text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          disabled={form.requirements.length <= 1}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                          title="Supprimer cette exigence"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </form>
    </div>
  );
}
