"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";

const categories = ["Témoignages", "Réflexions", "Événements", "Vie Spirituelle", "Autres"];

export default function AdminBlogNewPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>
      </div>

      <AdminPageHeader
        title="Nouvel article"
        description="Rédigez un nouvel article ou témoignage"
        action={
          <AdminButton href="/admin/blog" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Annuler
          </AdminButton>
        }
      />

      <form className="space-y-6">
        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Contenu</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Titre *</label>
              <input
                type="text"
                required
                placeholder="Ex: Comment Dieu a transformé ma vie"
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
              <label className="block text-sm font-medium text-foreground mb-2">Auteur</label>
              <input
                type="text"
                placeholder="Nom de l'auteur"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Extrait *</label>
              <textarea
                rows={2}
                required
                placeholder="Résumé court..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contenu *</label>
              <textarea
                rows={12}
                required
                placeholder="Contenu de l'article..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </AdminCard>

        <div className="flex gap-4">
          <AdminButton type="submit">Publier</AdminButton>
          <AdminButton href="/admin/blog" variant="outline">Annuler</AdminButton>
        </div>
      </form>
    </div>
  );
}
