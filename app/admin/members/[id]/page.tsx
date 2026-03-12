"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader, AdminButton } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { adminMembersApi, type AdminMemberListItem } from "@/lib/api";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";

type MemberWithName = AdminMemberListItem & { name: string };

function formatDate(val: unknown): string {
  if (!val) return "—";
  const d = typeof val === "string" ? new Date(val) : val instanceof Date ? val : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : String(val ?? "—");
}

export default function AdminMemberDetailsPage() {
  const params = useParams();
  const { token } = useAuth();
  const id = params?.id ? Number(params.id) : null;
  const [member, setMember] = useState<MemberWithName | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    adminMembersApi
      .get(token, id)
      .then((m) => setMember(m as MemberWithName))
      .catch((err) => setError(err?.message ?? "Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Détails du membre" description="Chargement..." />
        <div className="bg-white rounded-xl border border-border p-8 text-center text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div>
        <AdminPageHeader title="Détails du membre" description="Membre introuvable" />
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <p className="text-red-600 font-medium">{error ?? "Membre introuvable"}</p>
          <AdminButton href="/admin/members" variant="outline" icon={<ArrowLeft className="w-4 h-4" />} className="mt-4">
            Retour à la liste
          </AdminButton>
        </div>
      </div>
    );
  }

  const infoRows = [
    { label: "Prénom", value: member.firstname },
    { label: "Nom", value: member.lastname },
    { label: "Email", value: member.email },
    { label: "Téléphone", value: member.phone },
    { label: "Date de naissance", value: formatDate(member.birth_date) },
    { label: "Lieu de naissance", value: member.birth_place },
    { label: "Sexe", value: member.sex },
    { label: "Nationalité", value: (member.nationality as { name?: string })?.name ?? member.nationality },
    { label: "Adresse", value: member.address },
    { label: "Ville", value: (member.city as { name?: string })?.name ?? member.city },
    { label: "Type", value: member.member_type?.label ?? member.member_type?.name },
    { label: "Statut", value: (member.status as string) ?? "En attente" },
  ].filter((r) => r.value);

  return (
    <div>
      <AdminPageHeader
        title={`${member.name}`}
        description={`Détails du membre #${member.id}`}
        action={
          <AdminButton href={`/admin/members/${member.id}/edit`} variant="outline" icon={<Pencil className="w-4 h-4" />}>
            Modifier
          </AdminButton>
        }
      />
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <dl className="divide-y divide-border">
          {infoRows.map(({ label, value }) => (
            <div key={label} className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{String(value)}</dd>
            </div>
          ))}
        </dl>
        <div className="px-6 py-4 border-t border-border">
          <AdminButton href="/admin/members" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Retour à la liste
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
