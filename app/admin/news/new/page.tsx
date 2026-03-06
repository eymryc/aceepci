"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";

const categories = ["Événements", "Projets", "Formations", "Témoignages", "Galerie"];

export default function AdminNewsNewPage() {
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux actualités
        </Link>
      </div>

      <AdminPageHeader
        title="Nouvelle actualité"
        description="Rédigez et publiez une nouvelle actualité"
        action={
          <AdminButton href="/admin/news" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Annuler
          </AdminButton>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Contenu</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Titre, extrait et contenu de l&apos;article
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Titre *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Lancement du Camp Biblique National 2026"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Catégorie
              </label>
              <select
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Extrait *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Court résumé affiché dans la liste..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contenu *
              </label>
              <textarea
                rows={10}
                required
                placeholder="Contenu complet de l'article..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Média</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Image de couverture
            </p>
          </div>
          <div className="p-6">
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-brand-primary/30 transition-colors">
              <p className="text-sm text-muted-foreground mb-2">
                Glissez une image ici ou cliquez pour parcourir
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG ou WebP. Max 2 Mo.
              </p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>
        </AdminCard>

        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Publication</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Statut et date de publication
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Statut
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "draft"}
                    onChange={() => setStatus("draft")}
                    className="text-brand-primary"
                  />
                  <span className="text-sm">Brouillon</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "published"}
                    onChange={() => setStatus("published")}
                    className="text-brand-primary"
                  />
                  <span className="text-sm">Publier</span>
                </label>
              </div>
            </div>
          </div>
        </AdminCard>

        <div className="flex flex-wrap items-center gap-4">
          <AdminButton
            type="submit"
            icon={<Save className="w-4 h-4" />}
          >
            {saved ? "Enregistré !" : status === "published" ? "Publier" : "Enregistrer le brouillon"}
          </AdminButton>
          <AdminButton href="/admin/news" variant="outline">
            Annuler
          </AdminButton>
          <AdminButton
            href="/news/1"
            target="_blank"
            variant="ghost"
            icon={<Eye className="w-4 h-4" />}
          >
            Aperçu
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
