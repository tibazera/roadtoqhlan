import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";
import { Timeline } from "@/components/sections/Community";

export const metadata: Metadata = { title: "The journey" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Road to QHLAN" title="The journey" lead="Our milestones. They only show as complete once verified, and dates may change." />
      <div className="mx-auto max-w-6xl px-4 pb-20"><Timeline /></div>
    </>
  );
}
