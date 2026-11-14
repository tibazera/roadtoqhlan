import Link from "next/link";
import FlightGlobe from "@/components/flight/FlightGlobe";
import { FUNDRAISING_GOAL_EUR } from "@/lib/campaign";
import { netDonationsEur } from "@/content/ledger";
import { Reveal } from "@/components/site/Reveal";
import { BudgetNotice, BudgetTable, SplitExplainer } from "@/components/sections/Finance";
import { DonateBox, FaqList, TeamGrid } from "@/components/sections/Community";

function Block({ eyebrow, title, href, cta, children }: { eyebrow: string; title: string; href?: string; cta?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-2 text-4xl font-extrabold sm:text-6xl">{title}</h2>
      </Reveal>
      <div className="mt-8">{children}</div>
      {href && <Link href={href} className="mt-6 inline-block text-ember underline">{cta} →</Link>}
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-8 pt-16 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,#ff6a1f33,transparent_70%)]" />
        <p className="eyebrow relative">Four Brazilian Players. One Dream. One Community.</p>
        <h1 className="display relative mx-auto mt-4 max-w-4xl text-6xl font-extrabold sm:text-8xl">
          From Brazil to <span className="text-ember">QHLAN 2028</span>
        </h1>
        <p className="relative mx-auto mt-5 max-w-2xl text-lg text-dim">
          After years of playing together across continents, we&apos;re hoping to finally meet our QuakeWorld friends in person. Help us make the journey from Brazil to Sweden possible.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <a href="#support" className="bg-ember px-6 py-3 font-semibold text-black hover:bg-blood hover:text-white">Support Our Journey</a>
          <Link href="/budget" className="border border-line px-6 py-3 font-semibold hover:border-ember">See Our Budget</Link>
        </div>
        <p className="relative mt-4 font-mono text-xs text-dim">Campaign launches December 25, 2026 · Help Us Cross the Ocean</p>
      </section>

      <FlightGlobe verifiedNet={netDonationsEur()} goal={FUNDRAISING_GOAL_EUR} />

      <Block eyebrow="Our story" title="Years online. Finally in person." href="/story" cta="Read our story">
        <p className="max-w-3xl text-lg text-dim"><strong className="text-fg">Four players, one passion, one shared goal: getting to QHLAN 2028.</strong> We are not asking the community to pay for a vacation. We are asking for voluntary help with a portion of essential travel costs, because flying from Brazil to Europe is far more expensive for us. We are putting in our own money too. Every contribution is optional, and we are grateful for all of it.</p>
      </Block>
      <Block eyebrow="Meet the team" title="The lineup" href="/team" cta="Meet the team"><TeamGrid /></Block>
      <Block eyebrow="Where your money goes" title="Every cost in the open" href="/transparency" cta="Full financial transparency">
        <div className="grid gap-5"><SplitExplainer /><BudgetTable /><BudgetNotice /></div>
      </Block>
      <section id="support" className="mx-auto max-w-3xl px-4 py-16"><DonateBox /></section>
      <Block eyebrow="FAQ" title="Questions, answered" href="/faq" cta="All questions"><FaqList /></Block>
    </>
  );
}
