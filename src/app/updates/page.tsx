import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";


export const metadata: Metadata = { title: "Campaign news" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Updates" title="Campaign news" lead="Campaign updates, financial reports, player preparation and travel news." />
      <div className="mx-auto max-w-6xl px-4 pb-20"><p className="hud p-6 text-dim">No updates yet. The first post will go live at launch on December 25, 2026.</p></div>
    </>
  );
}
