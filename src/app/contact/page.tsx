import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = { title: "Get in touch" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Contact" title="Get in touch" lead="For the community, press and sponsors." />
      <div className="mx-auto max-w-6xl px-4 pb-20"><div className="hud grid max-w-xl gap-2 p-6 text-dim">{CONTACT.email ? <p>E-mail: <a className="text-ember underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p> : <p>Contact e-mail: to be announced.</p>}{CONTACT.discord ? <p>Discord: <a className="text-ember underline" href={CONTACT.discord} rel="noopener noreferrer">join</a></p> : <p>Discord invite: to be announced.</p>}</div></div>
    </>
  );
}
