import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";
import { TeamGrid } from "@/components/sections/Community";

export const metadata: Metadata = { title: "The lineup" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Meet the team" title="The lineup" lead="GT, Tiba and Mur are planned participants. The fourth player is still to be announced." />
      <div className="mx-auto max-w-6xl px-4 pb-20"><TeamGrid /></div>
    </>
  );
}
