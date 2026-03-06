"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, Check, X, GraduationCap, Briefcase } from "lucide-react";

const mockMemberships = [
  { id: 1, name: "Jean Kouassi", email: "jean.k@email.com", phone: "+225 07 XX XX XX XX", type: "Étudiant", department: "Abidjan - Cocody", status: "En attente", date: "5 Mars 2026" },
  { id: 2, name: "Marie Yao", email: "marie.y@email.com", phone: "+225 05 XX XX XX XX", type: "Élève", department: "Abidjan - Yopougon", status: "En attente", date: "4 Mars 2026" },
  { id: 3, name: "David Bamba", email: "david.b@email.com", phone: "+225 01 XX XX XX XX", type: "Alumni", department: "Bouaké", status: "Validé", date: "3 Mars 2026" },
  { id: 4, name: "Aïcha Koné", email: "aicha.k@email.com", phone: "+225 07 XX XX XX XX", type: "Étudiante", department: "Yamoussoukro", status: "En attente", date: "2 Mars 2026" },
];

export default function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved">("all");

  const filtered = mockMemberships.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.includes(search);
    const matchStatus = filterStatus === "all" || (filterStatus === "pending" && m.status === "En attente") || (filterStatus === "approved" && m.status === "Validé");
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground uppercase tracking-tight">
          Adhésions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez les demandes d&apos;adhésion et les membres
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                filterStatus === status
                  ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white"
                  : "bg-white border border-border text-foreground hover:bg-brand-subtle"
              }`}
            >
              {status === "all" ? "Tous" : status === "pending" ? "En attente" : "Validés"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Candidat</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Département</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-brand-subtle/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      {item.type === "Alumni" ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.department}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                      item.status === "Validé" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-brand-subtle rounded-lg transition-colors" title="Voir dossier">
                        <Eye className="w-4 h-4" />
                      </button>
                      {item.status === "En attente" && (
                        <>
                          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Valider">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Refuser">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
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
