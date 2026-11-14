import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";
import { ShareButtons, SupporterWall } from "@/components/sections/SupporterWall";
import { SUPPORTERS } from "@/content/supporters";
import { TEST_SUPPORTERS } from "@/content/supporters.test-data";
import { publicSupporters } from "@/lib/supporters";

export const metadata: Metadata = { title: "Supporters" };

export default function Page() {
  // Demo donors only outside production; never counted in any total.
  const list = publicSupporters(process.env.NODE_ENV !== "production" ? [...SUPPORTERS, ...TEST_SUPPORTERS] : SUPPORTERS);
  return (
    <>
      <PageHead eyebrow="Supporters" title="Thank you" lead="Everyone who helps brings us a little closer. Listing here is optional, and nothing appears without the supporter's consent." />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20">
        <SupporterWall supporters={list} />
        <section className="grid gap-4 md:grid-cols-2">
          <div className="hud p-5">
            <h2 className="display text-3xl font-extrabold">How the wall works</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-dim">
              <li>Add a name or nickname and, if you like, a short message (up to 280 characters) when you donate.</li>
              <li>Name, message and amount each need your own consent. Amounts stay hidden unless you agree.</li>
              <li>We list only payments we have verified, and review every message before it goes live.</li>
              <li>Want to be removed? Contact us and we will take you off.</li>
            </ul>
          </div>
          <div className="hud p-5">
            <h2 className="display text-3xl font-extrabold">Can&apos;t donate? You still help.</h2>
            <p className="mt-3 text-dim">Sharing our journey helps too. There is never any pressure to give.</p>
            <div className="mt-4"><ShareButtons /></div>
          </div>
        </section>
      </div>
    </>
  );
}
