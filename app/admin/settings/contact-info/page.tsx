"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Phone, Mail, MapPin, Clock, Globe, Plus, Trash2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { contactInfoApi, formatApiErrorMessage, type ContactInfo, type ContactInfoRegional } from "@/lib/api";

const defaultRegional: ContactInfoRegional = { region: "", contact: "", email: "" };

function toForm(info: ContactInfo | null) {
  if (!info) {
    return {
      phone: "",
      email: "",
      address: "",
      map_embed_url: "",
      hours_mon_fri: "8h00 - 17h00",
      hours_saturday: "9h00 - 13h00",
      hours_sunday: "Fermé",
      regional_contacts: [{ ...defaultRegional }] as ContactInfoRegional[],
      facebook_url: "",
      instagram_url: "",
      youtube_url: "",
    };
  }
  const regional = (info.regional_contacts && info.regional_contacts.length > 0)
    ? info.regional_contacts.map((r) => ({ region: r.region ?? "", contact: r.contact ?? "", email: r.email ?? "" }))
    : [{ ...defaultRegional }];
  return {
    phone: info.phone ?? "",
    email: info.email ?? "",
    address: info.address ?? "",
    map_embed_url: info.map_embed_url ?? "",
    hours_mon_fri: info.hours_mon_fri ?? "8h00 - 17h00",
    hours_saturday: info.hours_saturday ?? "9h00 - 13h00",
    hours_sunday: info.hours_sunday ?? "Fermé",
    regional_contacts: regional,
    facebook_url: info.facebook_url ?? "",
    instagram_url: info.instagram_url ?? "",
    youtube_url: info.youtube_url ?? "",
  };
}

export default function ContactInfoSettingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ReturnType<typeof toForm>>(toForm(null));

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await contactInfoApi.get(token);
      setForm(toForm(data));
    } catch (err) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const regional = form.regional_contacts
        .filter((r) => (r.region ?? "").trim() !== "")
        .map((r) => ({
          region: (r.region ?? "").trim(),
          contact: (r.contact ?? "").trim() || undefined,
          email: (r.email ?? "").trim() || undefined,
        }));
      await contactInfoApi.save(token, {
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        address: form.address.trim() || null,
        map_embed_url: form.map_embed_url.trim() || null,
        hours_mon_fri: form.hours_mon_fri.trim() || null,
        hours_saturday: form.hours_saturday.trim() || null,
        hours_sunday: form.hours_sunday.trim() || null,
        regional_contacts: regional,
        facebook_url: form.facebook_url.trim() || null,
        instagram_url: form.instagram_url.trim() || null,
        youtube_url: form.youtube_url.trim() || null,
      });
      toast.success("Informations de contact enregistrées.");
    } catch (err) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const setRegional = (index: number, field: keyof ContactInfoRegional, value: string) => {
    setForm((prev) => {
      const next = [...prev.regional_contacts];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, regional_contacts: next };
    });
  };

  const addRegional = () => {
    setForm((prev) => ({ ...prev, regional_contacts: [...prev.regional_contacts, { ...defaultRegional }] }));
  };

  const removeRegional = (index: number) => {
    setForm((prev) => ({
      ...prev,
      regional_contacts: prev.regional_contacts.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Informations de contact" description="Téléphone, email, adresse, horaires et contacts régionaux affichés sur la page contact." />
        <AdminCard><p className="text-muted-foreground text-sm p-6">Chargement…</p></AdminCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminPageHeader
        title="Informations de contact"
        description="Ces informations sont affichées sur la page contact du site (coordonnées, horaires, contacts régionaux, réseaux sociaux). Ce formulaire ne sert pas à recevoir les messages des visiteurs."
      />

      <form onSubmit={handleSave} className="space-y-6 lg:space-y-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 min-w-0 space-y-6">
        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border bg-slate-50/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Phone className="w-5 h-5 text-brand-primary" />
              Coordonnées principales
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Téléphone, email et adresse affichés en haut de la page contact
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+225 27 22 44 43 78"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="contact@aceepci.org"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="MAPE, Boulevard de l'Université, Abidjan-Cocody"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border bg-slate-50/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-primary" />
              Horaires d’accueil
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Affichés sur la page contact
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Lundi - Vendredi</label>
              <input
                type="text"
                value={form.hours_mon_fri}
                onChange={(e) => setForm((f) => ({ ...f, hours_mon_fri: e.target.value }))}
                placeholder="8h00 - 17h00"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Samedi</label>
              <input
                type="text"
                value={form.hours_saturday}
                onChange={(e) => setForm((f) => ({ ...f, hours_saturday: e.target.value }))}
                placeholder="9h00 - 13h00"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Dimanche</label>
              <input
                type="text"
                value={form.hours_sunday}
                onChange={(e) => setForm((f) => ({ ...f, hours_sunday: e.target.value }))}
                placeholder="Fermé"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border bg-slate-50/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-primary" />
              Contacts régionaux
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Liste des départements / villes avec téléphone et email
            </p>
          </div>
          <div className="p-6 space-y-4">
            {form.regional_contacts.map((r, index) => (
              <div key={index} className="flex flex-wrap gap-3 items-end p-4 rounded-lg border border-border bg-muted/20">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Ville / Département</label>
                  <input
                    type="text"
                    value={r.region}
                    onChange={(e) => setRegional(index, "region", e.target.value)}
                    placeholder="Ex: Abidjan - Cocody"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={r.contact}
                    onChange={(e) => setRegional(index, "contact", e.target.value)}
                    placeholder="+225 07 XX XX XX XX"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={r.email}
                    onChange={(e) => setRegional(index, "email", e.target.value)}
                    placeholder="cocody@aceepci.org"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                </div>
                <AdminButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRegional(index)}
                  disabled={form.regional_contacts.length <= 1}
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </AdminButton>
              </div>
            ))}
            <AdminButton type="button" variant="outline" size="sm" onClick={addRegional}>
              <Plus className="w-4 h-4" />
              Ajouter un contact régional
            </AdminButton>
          </div>
        </AdminCard>
          </div>

          <aside className="lg:w-80 flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border bg-slate-50/50">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-primary" />
                  Carte
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  URL d’intégration Google Maps (iframe src). Laissez vide pour masquer la carte.
                </p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-foreground mb-2">URL d’intégration de la carte</label>
                <input
                  type="url"
                  value={form.map_embed_url}
                  onChange={(e) => setForm((f) => ({ ...f, map_embed_url: e.target.value }))}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
            </AdminCard>
            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border bg-slate-50/50">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-brand-primary" />
                  Réseaux sociaux
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Liens affichés sur la page contact (Suivez-nous)
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Facebook</label>
                  <input
                    type="url"
                    value={form.facebook_url}
                    onChange={(e) => setForm((f) => ({ ...f, facebook_url: e.target.value }))}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Instagram</label>
                  <input
                    type="url"
                    value={form.instagram_url}
                    onChange={(e) => setForm((f) => ({ ...f, instagram_url: e.target.value }))}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">YouTube</label>
                  <input
                    type="url"
                    value={form.youtube_url}
                    onChange={(e) => setForm((f) => ({ ...f, youtube_url: e.target.value }))}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </AdminCard>
          </aside>
        </div>

        <div className="flex justify-end">
          <AdminButton type="submit" disabled={saving} icon={<Save className="w-4 h-4" />}>
            {saving ? "Enregistrement…" : "Enregistrer les informations"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
