// cspell:disable
import { notFound } from "next/navigation";
import { AdminCard, AdminPageHeader } from "@/components/admin";

type AboutSectionKey =
  | "histoire"
  | "mot-du-president"
  | "mission"
  | "vision"
  | "devise"
  | "documents"
  | "organisation";

type AboutSection = {
  title: string;
  description: string;
};

const ABOUT_SECTIONS: Record<AboutSectionKey, AboutSection> = {
  histoire: {
    title: "Histoire",
    description: "Présentez ici l'histoire de l'ACEEPCI, ses grandes étapes et les dates marquantes.",
  },
  "mot-du-president": {
    title: "Mot du président",
    description: "Ajoutez ici le mot du président qui sera affiché dans la section À propos.",
  },
  mission: {
    title: "Notre mission",
    description: "Décrivez ici la mission de l'association et son rôle auprès des membres.",
  },
  vision: {
    title: "Notre vision",
    description: "Renseignez ici la vision portée par l'ACEEPCI.",
  },
  devise: {
    title: "Notre devise",
    description: "Ajoutez ici la devise officielle de l'association.",
  },
  documents: {
    title: "Nos documents",
    description: "Listez ici les documents de référence qui seront publiés dans la section À propos.",
  },
  organisation: {
    title: "Notre organisation",
    description: "Présentez ici l'organisation, les organes et la structuration de l'ACEEPCI.",
  },
};

function isAboutSectionKey(section: string): section is AboutSectionKey {
  return section in ABOUT_SECTIONS;
}

export default async function AdminAboutSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!isAboutSectionKey(section)) {
    notFound();
  }

  const current = ABOUT_SECTIONS[section];

  return (
    <div>
      <AdminPageHeader title={current.title} description={current.description} />

      <AdminCard>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Cette rubrique est prête. Vous pouvez maintenant y brancher votre formulaire, votre éditeur
            de contenu ou votre gestion documentaire selon le besoin.
          </p>
          <div className="rounded-lg border border-dashed border-border bg-slate-50 px-4 py-6 text-sm text-slate-600">
            {"Contenu de base en attente d'implémentation pour "}
            <span className="font-medium">{current.title}</span>.
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
