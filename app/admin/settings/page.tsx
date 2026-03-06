"use client";

import { useState } from "react";
import { Save, Mail, Phone, MapPin, Globe, Shield } from "lucide-react";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Paramètres"
        description="Configuration générale du site"
      />

      <div className="space-y-6">
        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border bg-slate-50/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-primary" />
              Coordonnées
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Informations de contact affichées sur le site
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email de contact
              </label>
              <input
                type="email"
                defaultValue="contact@aceepci.org"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                defaultValue="+225 27 22 44 43 78"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Adresse
              </label>
              <textarea
                rows={2}
                defaultValue="MAPE, Boulevard de l'Université, Abidjan-Cocody, face CHU de Cocody"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border bg-slate-50/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-primary" />
              Réseaux sociaux
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Liens vers les plateformes sociales
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Facebook
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Instagram
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                YouTube
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border bg-slate-50/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-primary" />
              Sécurité
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestion des accès administrateur
            </p>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              L&apos;authentification admin sera configurée lors de l&apos;intégration du backend.
            </p>
            <button
              disabled
              className="px-5 py-2.5 bg-slate-100 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              Modifier le mot de passe (à venir)
            </button>
          </div>
        </AdminCard>

        <div className="flex justify-end">
          <AdminButton onClick={handleSave} icon={<Save className="w-4 h-4" />}>
            {saved ? "Enregistré !" : "Enregistrer les modifications"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
