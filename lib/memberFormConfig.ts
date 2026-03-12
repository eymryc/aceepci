export const memberFormSteps = [
  { id: 1, key: "personal", label: "Personnel" },
  { id: 2, key: "contact", label: "Contact" },
  { id: 3, key: "academic", label: "Académique" },
  { id: 4, key: "spiritual", label: "Spirituel" },
  { id: 5, key: "documents", label: "Documents" },
  { id: 6, key: "validation", label: "Validation" },
];

/**
 * Calcule la cotisation à partir du nom du type de membre.
 * Utilise une correspondance souple (accents / minuscules).
 */
export function getMembershipFeeFromName(memberTypeName: string | undefined | null): string {
  if (!memberTypeName) return "À définir";
  const name = memberTypeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (name.includes("eleve")) return "5 000 FCFA";
  if (name.includes("etudiant")) return "10 000 FCFA";
  if (name.includes("travailleur") || name.includes("alumni") || name.includes("worker")) {
    return "20 000 FCFA";
  }

  return "À définir";
}

/** Points de la charte des membres utilisés dans les formulaires admin & public */
export const memberCharterItems: string[] = [
  "Vivre selon les principes bibliques et être un témoin de Christ",
  "Participer activement aux activités du département local",
  "Respecter les statuts et règlements intérieurs de l'association",
  "Contribuer à l'édification spirituelle des autres membres",
  "Être soumis(e) aux autorités spirituelles de l'association",
];

