import { PageHero } from "@/components/sections/PageHero";
import { heroImages } from "@/config/heroImages";
import { MemberFormWithStepsPublic } from "@/components/public/MemberFormWithStepsPublic";

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-subtle">
      <PageHero
        title="Formulaire d'adhésion"
        subtitle="Rejoignez la famille ACEEPCI"
        background={heroImages.membershipForm}
      />
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <MemberFormWithStepsPublic />
      </div>
    </div>
  );
}
