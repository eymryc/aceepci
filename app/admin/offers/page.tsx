"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Eye, Briefcase, GraduationCap, DollarSign, Heart } from "lucide-react";

const mockOffers = [
  { id: 1, title: "Chargé(e) de Communication Digitale", organization: "ONG Vision Mondiale", category: "emploi", deadline: "15 Avril 2026", location: "Abidjan" },
  { id: 2, title: "Stage en Comptabilité et Finance", organization: "Cabinet FIDEXCO", category: "stage", deadline: "30 Mars 2026", location: "Abidjan" },
  { id: 3, title: "Bourse d'Excellence Master - France", organization: "Campus France", category: "bourse", deadline: "10 Avril 2026", location: "France" },
  { id: 4, title: "Animateur(trice) Bénévole - Camp d'Été", organization: "ACEEPCI", category: "benevolat", deadline: "5 Avril 2026", location: "Grand-Bassam" },
];

const categoryMeta = {
  emploi: { label: "Emploi", icon: Briefcase, color: "bg-blue-500/10 text-blue-600" },
  stage: { label: "Stage", icon: GraduationCap, color: "bg-violet-500/10 text-violet-600" },
  bourse: { label: "Bourse", icon: DollarSign, color: "bg-brand-primary/10 text-brand-primary" },
  benevolat: { label: "Bénévolat", icon: Heart, color: "bg-emerald-500/10 text-emerald-600" },
};

export default function AdminOffersPage() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground uppercase tracking-tight">
            Offres & Opportunités
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les offres d&apos;emploi, stages, bourses et bénévolat
          </p>
        </div>
        <Link
          href="/admin/offers/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-lg hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nouvelle offre
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une offre..."
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organisation</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lieu</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Échéance</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockOffers.map((item) => {
                const meta = categoryMeta[item.category as keyof typeof categoryMeta];
                const Icon = meta?.icon || Briefcase;
                return (
                  <tr key={item.id} className="hover:bg-brand-subtle/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{item.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.organization}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${meta?.color || "bg-muted"}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {meta?.label || item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.location}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.deadline}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-brand-subtle rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
