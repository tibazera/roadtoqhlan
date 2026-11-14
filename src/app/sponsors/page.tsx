import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";
import { SponsorGrid } from "@/components/sections/Community";

export const metadata: Metadata = { title: "Sponsor the journey" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Sponsorship" title="Sponsor the journey" lead="For individuals, businesses and gaming companies. Cash donations and in-kind support are tracked separately." />
      <div className="mx-auto max-w-6xl px-4 pb-20"><SponsorGrid /></div>
    </>
  );
}
