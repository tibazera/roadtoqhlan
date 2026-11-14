import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";


export const metadata: Metadata = { title: "Why QHLAN matters" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Our story" title="Why QHLAN matters" lead="QuakeWorld has kept us connected for years. Meeting the people behind the nicknames would mean a great deal." />
      <div className="mx-auto max-w-6xl px-4 pb-20"><div className="grid max-w-3xl gap-4 text-lg text-dim"><p className="display text-4xl font-extrabold text-fg sm:text-5xl">Four players. One passion. One shared goal: QHLAN 2028.</p><p>QuakeWorld is a classic competitive FPS with a passionate international community. For years Brazilian players have taken part in online competitions, played European teams, made friends, and helped keep the game alive.</p><p>Traveling from Brazil to Europe is much harder for us: work, family, everyday expenses, exchange rates and international airfare all add up. We would love to finally meet the people we have been playing with online.</p><p>Two of us already know what a QHLAN feels like: GT and Mur both played QHLAN 2017 in Stockholm. For Tiba, who has spent years working to rebuild the Brazilian community, it would be the first time.</p><p>We are not asking anyone to pay for a vacation or the whole trip. We will contribute our own money and cover our personal expenses. Any help is voluntary, and we are thankful for it. We are doing our part to make this happen. If you would like to help us get there, we would be incredibly grateful.</p></div></div>
    </>
  );
}
