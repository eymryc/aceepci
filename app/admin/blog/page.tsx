"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";

const mockPosts = [
  { id: 1, title: "Comment Dieu a transformé ma vie universitaire", author: "Sarah Kouadio", category: "Témoignages", date: "28 Fév 2026", views: 1245 },
  { id: 2, title: "L'importance de la communauté chrétienne à l'université", author: "Koffi Mensah", category: "Réflexions", date: "25 Fév 2026", views: 987 },
  { id: 3, title: "Retour sur le Camp d'Été 2025 à Grand-Bassam", author: "Équipe Communication", category: "Événements", date: "20 Fév 2026", views: 2134 },
  { id: 4, title: "5 clés pour une vie de prière efficace", author: "Pasteur Jean Koné", category: "Vie Spirituelle", date: "18 Fév 2026", views: 1567 },
];

export default function AdminBlogPage() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Gérez les articles et témoignages"
        action={
          <AdminButton href="/admin/blog/new" icon={<Plus className="w-4 h-4" />}>
            Nouvel article
          </AdminButton>
        }
      />

      <AdminCard padding="none">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Titre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Auteur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vues</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockPosts.map((item) => (
                <tr key={item.id} className="hover:bg-brand-subtle/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{item.title}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.author}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/blog/${item.id}`} target="_blank" className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-brand-subtle rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-brand-subtle rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
