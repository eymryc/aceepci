"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Calendar, Users } from "lucide-react";

const mockEvents = [
  { id: "camp-2026", name: "Camp Biblique National 2026", date: "15-22 Juillet 2026", location: "Grand-Bassam", category: "Camp", registrations: 127 },
  { id: "conference-jeunes", name: "Conférence Jeunesse - Vision 2030", date: "5-7 Avril 2026", location: "Yamoussoukro", category: "Conférence", registrations: 89 },
  { id: "retraite-leaders", name: "Retraite des Leaders", date: "20-22 Mars 2026", location: "Abidjan - Bingerville", category: "Retraite", registrations: 45 },
  { id: "journee-evangelisation", name: "Journée d'Évangélisation Massive", date: "28 Mars 2026", location: "Bouaké", category: "Évangélisation", registrations: 234 },
];

export default function AdminEventsPage() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground uppercase tracking-tight">
            Événements
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les événements et inscriptions
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-lg hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nouvel événement
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Événement</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lieu</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inscriptions</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockEvents.map((item) => (
                <tr key={item.id} className="hover:bg-brand-subtle/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{item.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.location}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-brand-primary/10 text-brand-primary">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                      <Users className="w-4 h-4 text-brand-primary" />
                      {item.registrations}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href="/event-registration" target="_blank" className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-brand-subtle rounded-lg transition-colors" title="Voir formulaire">
                        <Calendar className="w-4 h-4" />
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
