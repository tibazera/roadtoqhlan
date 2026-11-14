import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";


export const metadata: Metadata = { title: "Admin" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Organizers" title="Admin" lead="" />
      <div className="mx-auto max-w-6xl px-4 pb-20"><p className="hud max-w-xl p-6 text-dim">Admin dashboard is not configured yet. It requires Supabase authentication and authorization, which are not connected in this build.</p></div>
    </>
  );
}
