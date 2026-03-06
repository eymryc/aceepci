"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";

const categories = ["Formation", "Réunion", "Culture", "Jeunesse", "Événement", "Solidarité", "Loisirs"];

export default function AdminGalleryNewPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la galerie
        </Link>
      </div>

      <AdminPageHeader
        title="Ajouter une photo"
        description="Nouvelle photo pour la galerie média"
        action={
          <AdminButton href="/admin/gallery" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Annuler
          </AdminButton>
        }
      />

      <form className="space-y-6">
        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Détails</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Titre *</label>
              <input
                type="text"
                required
                placeholder="Ex: Formation communautaire"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary bg-white">
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Image *</label>
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-brand-primary/30 transition-colors">
                <p className="text-sm text-muted-foreground mb-2">
                  Glissez une image ou cliquez pour parcourir
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG. Max 2 Mo.</p>
              </div>
            </div>
          </div>
        </AdminCard>

        <div className="flex gap-4">
          <AdminButton type="submit">Ajouter</AdminButton>
          <AdminButton href="/admin/gallery" variant="outline">Annuler</AdminButton>
        </div>
      </form>
    </div>
  );
}
