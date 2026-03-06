"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { AdminPageHeader, AdminCard, AdminBadge, AdminButton } from "@/components/admin";

const mockNews = [
  { id: 1, title: "Lancement du Camp Biblique National 2026", category: "Événements", date: "2 Mars 2026", views: "1.2k", status: "Publié" },
  { id: 2, title: "Nouveau centre d'accueil à Yamoussoukro", category: "Projets", date: "28 Fév 2026", views: "856", status: "Publié" },
  { id: 3, title: "Témoignages : Comment l'ACEEPCI a changé nos vies", category: "Témoignages", date: "25 Fév 2026", views: "2.1k", status: "Publié" },
  { id: 4, title: "Brouillon - Séminaire leadership", category: "Formations", date: "-", views: "-", status: "Brouillon" },
];

export default function AdminNewsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <div>
      <AdminPageHeader
        title="Actualités"
        description="Gérez les actualités et annonces du site"
        action={
          <AdminButton href="/admin/news/new" icon={<Plus className="w-4 h-4" />}>
            Nouvelle actualité
          </AdminButton>
        }
      />

      <AdminCard padding="none">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une actualité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Publié", "Brouillon"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === f
                    ? "bg-brand-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f === "all" ? "Tous" : f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockNews.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground max-w-xs truncate">
                      {item.title}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {item.views}
                  </td>
                  <td className="px-6 py-4">
                    <AdminBadge
                      variant={item.status === "Publié" ? "success" : "warning"}
                    >
                      {item.status}
                    </AdminBadge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/news/${item.id}`}
                        target="_blank"
                        className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/news/${item.id}/edit`}
                        className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
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
