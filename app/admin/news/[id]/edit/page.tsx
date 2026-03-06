"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";

const categories = ["Événements", "Projets", "Formations", "Témoignages", "Galerie"];

export default function AdminNewsEditPage() {
  const params = useParams();
  const id = params.id as string;

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
        title={`Modifier l'actualité #${id}`}
        description="Modifiez le contenu de l'actualité"
        action={
          <AdminButton href="/admin/news" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
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
                defaultValue="Lancement du Camp Biblique National 2026"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary bg-white">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Extrait *</label>
              <textarea
                rows={2}
                required
                defaultValue="Le Camp Biblique National 2026 se tiendra à Grand-Bassam..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contenu *</label>
              <textarea
                rows={10}
                required
                defaultValue="Contenu de l'article..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </AdminCard>

        <div className="flex gap-4">
          <AdminButton type="submit">Enregistrer</AdminButton>
          <AdminButton href="/admin/news" variant="outline">Annuler</AdminButton>
        </div>
      </form>
    </div>
  );
}
