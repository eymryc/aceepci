"use client";

import { useParams } from "next/navigation";
import { MemberFormWithSteps } from "@/components/admin";

export default function AdminMemberEditPage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : undefined;

  if (!id || Number.isNaN(id)) {
    return null; // ou redirection vers la liste
  }

  return <MemberFormWithSteps memberId={id} />;
}
