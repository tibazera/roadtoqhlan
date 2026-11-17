import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { CLUB, FAQ, LAUNCH_DATE, MILESTONES, SPONSOR_TYPES, TEAM, type Player } from "@/content/site";
import { Reveal } from "@/components/site/Reveal";
import { TimelineRail } from "@/components/site/Motion";
import { DonateAction } from "@/components/sections/DonateAction";

const DONATION_URL = process.env.NEXT_PUBLIC_DONATION_URL || null; // hosted provider page; chosen after eligibility check
const AMOUNTS = [5, 10, 20, 50, 100];

function Placeholder({ what }: { what: string }) {
  return <span className="border border-dashed border-line px-2 py-0.5 text-xs text-dim">{what} — placeholder, awaiting the player</span>;
}

/** Drop a file named <nick>.jpg (lowercase) into public/team/ and it appears automatically. */
function photoFor(p: Player): string | null {
  const f = `${p.nick.toLowerCase()}.jpg`;
  return fs.existsSync(path.join(process.cwd(), "public", "team", f)) ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/team/${f}` : p.photo;
}

/** Photos from QHLAN 2017 via the QuakeWorld Wiki, credited as listed there. Crop per player. */
const PHOTO_POS: Record<string, string> = { gt: "50% 8%", tiba: "50% 0%" };
const QHLAN17_CREDIT = "Photo: QHLAN 2017, credit Devogen & DSHARP3 (via QuakeWorld Wiki)";
/** Photos supplied by the players themselves need no credit line. */
const PHOTO_CREDIT: Record<string, string> = { gt: QHLAN17_CREDIT };

function PlayerCard({ p, i }: { p: Player; i: number }) {
  const photo = photoFor(p);
  return (
    <Reveal delay={i * 80}>
      <article className="hud h-full p-5">
        <div className="relative grid aspect-[3/4] place-items-center overflow-hidden border border-dashed border-line bg-bg text-dim">
          {photo ? <Image src={photo} alt={p.nick} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" style={{ objectPosition: PHOTO_POS[p.nick.toLowerCase()] ?? "50% 50%" }} /> : <span className="font-mono text-xs">PHOTO PLACEHOLDER</span>}
        </div>
        <h3 className="display mt-4 text-4xl font-extrabold">{p.nick}</h3>
        <p className={`font-mono text-[11px] uppercase tracking-wider ${p.status === "confirmed" ? "text-green" : "text-yellow"}`}>
          {p.status === "confirmed" ? "Planned participant" : "To be announced"}
        </p>
        {p.from && <p className="mt-2 text-sm text-dim">From {p.from}</p>}
        {p.qhlan && <p className="mt-2 inline-block border border-ember/60 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-ember">{p.qhlan}</p>}
        <dl className="mt-4 grid gap-3 text-sm">
          <div><dt className="text-dim">Bio</dt><dd>{p.bio ?? <Placeholder what="Bio" />}</dd></div>
          <div><dt className="text-dim">Favorite maps</dt><dd>{p.maps?.join(", ") ?? <Placeholder what="Maps" />}</dd></div>
          <div><dt className="text-dim">Message to the community</dt><dd>{p.message ? <q className="italic">{p.message}</q> : <Placeholder what="Message" />}</dd></div>
        </dl>
        {photo && PHOTO_CREDIT[p.nick.toLowerCase()] && <p className="mt-4 text-[11px] text-dim">{PHOTO_CREDIT[p.nick.toLowerCase()]}</p>}
        {p.source && <p className="mt-2 text-xs text-dim">Source: <a className="underline hover:text-fg" href={p.source.href} rel="noopener noreferrer" target="_blank">{p.source.label}</a></p>}
      </article>
    </Reveal>
  );
}

export function TeamGrid() {
  return (
    <div>
      <p className="hud mb-4 p-4 text-lg">All four represent <strong className="text-ember">{CLUB.name}</strong>, the team currently competing in the {CLUB.competition}.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{TEAM.map((p, i) => <PlayerCard key={p.nick} p={p} i={i} />)}</div>
      <p className="mt-4 text-sm text-dim">The final lineup depends on passports, documentation and travel arrangements, and is subject to confirmation.</p>
    </div>
  );
}

export function Timeline() {
  return (
    <div className="relative mx-auto max-w-3xl">
    <TimelineRail />
    <ol className="border-l border-line pl-8">
      {MILESTONES.map((m, i) => (
        <li key={m.id} className="relative pb-8">
          <Reveal delay={Math.min(i, 4) * 60}>
            <span aria-hidden className={`absolute -left-[41px] top-1 h-4 w-4 border ${m.verified ? "border-green bg-green" : "border-line bg-bg"}`} style={{ clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }} />
            <p className="font-mono text-[11px] uppercase tracking-wider text-ember">{m.when}</p>
            <h3 className="display text-2xl font-extrabold">{m.title} {m.verified && <span className="font-mono text-xs text-green">✓ VERIFIED</span>}</h3>
            {m.detail && <p className="mt-1 text-dim">{m.detail}</p>}
          </Reveal>
        </li>
      ))}
      <li className="text-sm text-dim">Dates are editable and may change. A milestone shows as complete only once verified.</li>
    </ol>
    </div>
  );
}

export function FaqList() {
  return (
    <div className="mx-auto grid max-w-3xl gap-2">
      {FAQ.map((f) => (
        <details key={f.q} className="hud group p-4">
          <summary className="cursor-pointer list-none font-semibold marker:hidden">{f.q}</summary>
          <p className="mt-3 text-dim">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function DonateBox() {
  return (
    <div className="hud p-6">
      <p className="eyebrow">Support our journey</p>
      <p className="display mt-2 text-4xl font-extrabold">Every contribution brings us a little closer.</p>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Suggested amounts">
        {AMOUNTS.map((a) => <span key={a} className="border border-line px-4 py-2 font-mono">€{a}</span>)}
        <span className="border border-line px-4 py-2 font-mono text-dim">Custom</span>
      </div>
      <DonateAction url={DONATION_URL} launchDate={LAUNCH_DATE} />
      <p className="mt-4 text-sm text-dim">Giving is always optional. Can&apos;t donate? Sharing our journey helps too. No amount guarantees the trip. <Link href="/transparency#policy" className="text-ember underline">How funds are held and released</Link>.</p>
    </div>
  );
}

export function SponsorGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SPONSOR_TYPES.map((s) => (
        <div key={s.title} className="hud p-5">
          <p className={`font-mono text-[11px] uppercase tracking-wider ${s.kind === "cash" ? "text-ember" : "text-yellow"}`}>{s.kind === "cash" ? "Monetary" : "In-kind"}</p>
          <h3 className="display mt-1 text-2xl font-extrabold">{s.title}</h3>
          <p className="mt-1 text-dim">{s.detail}</p>
        </div>
      ))}
      <p className="text-sm text-dim sm:col-span-2">In-kind support (equipment, discounts) is never counted as cash raised. All arrangements are public and subject to organizer approval. <Link href="/contact" className="text-ember underline">Get in touch</Link>.</p>
    </div>
  );
}
