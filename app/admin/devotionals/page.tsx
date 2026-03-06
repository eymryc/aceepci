"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Eye, BookOpen } from "lucide-react";

const mockDevotionals = [
  { id: 1, title: "La fidélité de Dieu", verse: "Lamentations 3:22-23", date: "2 Mars 2026", category: "Foi" },
  { id: 2, title: "Marcher dans l'obéissance", verse: "Jacques 1:22", date: "1er Mars 2026", category: "Obéissance" },
  { id: 3, title: "La puissance de la prière", verse: "Philippiens 4:6-7", date: "29 Fév 2026", category: "Prière" },
  { id: 4, title: "L'amour qui transforme", verse: "1 Jean 4:19", date: "28 Fév 2026", category: "Amour" },
];

export default function AdminDevotionalsPage() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground uppercase tracking-tight">
            Dévotions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les méditations quotidiennes
          </p>
        </div>
        <Link
          href="/admin/devotionals/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-lg hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nouvelle dévotion
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une dévotion..."
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Référence</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockDevotionals.map((item) => (
                <tr key={item.id} className="hover:bg-brand-subtle/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{item.title}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.verse}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.category}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/devotion/${item.id}`} target="_blank" className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-brand-subtle rounded-lg transition-colors">
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
      </div>
    </div>
  );
}
