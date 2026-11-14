import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";
import { FaqList } from "@/components/sections/Community";

export const metadata: Metadata = { title: "Questions, answered" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="FAQ" title="Questions, answered" lead="" />
      <div className="mx-auto max-w-6xl px-4 pb-20"><FaqList /></div>
    </>
  );
}
