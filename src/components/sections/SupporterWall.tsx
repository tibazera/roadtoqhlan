"use client";
import { motion, useReducedMotion } from "motion/react";
import "flag-icons/css/flag-icons.min.css";
import type { PublicSupporter } from "@/lib/supporters";

const countryName = (c: string) => new Intl.DisplayNames(["en"], { type: "region" }).of(c) ?? c;

export function SupporterWall({ supporters }: { supporters: PublicSupporter[] }) {
  const reduce = useReducedMotion();
  if (supporters.length === 0) {
    return <p className="hud p-6 text-dim">No supporters listed yet. When donors opt in, their names and messages appear here after review. Being listed is always optional.</p>;
  }
  return (
    <>
    {supporters.some((s) => s.isTest) && <p className="mb-4 border border-yellow/60 p-3 font-mono text-xs text-yellow">TEST DATA: fictional donors to preview the wall. Not real donations. Not shown on the published site.</p>}
    <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {supporters.map((s, i) => (
        <motion.li
          key={s.id}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: Math.min(i, 6) * 0.05, duration: 0.5 }}
          className="hud mb-4 break-inside-avoid p-5"
        >
          {s.message && <blockquote className="text-lg">“{s.message}”</blockquote>}
          <p className={`font-mono text-xs uppercase tracking-wider text-ember ${s.message ? "mt-3" : ""}`}>
            {s.country && <span className={`fi fi-${s.country.toLowerCase()} mr-2 align-[-1px]`} role="img" aria-label={countryName(s.country)} title={countryName(s.country)} />}{s.name}{s.amountEur !== undefined ? ` · €${s.amountEur}` : ""}{s.isTest ? " · TEST" : ""}
          </p>
        </motion.li>
      ))}
    </ul>
    </>
  );
}

export function ShareButtons() {
  const text = encodeURIComponent("Four Brazilian QuakeWorld players are hoping to reach QHLAN 2028 in Sweden. Follow the journey:");
  const url = encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL ?? "");
  const links = [
    ["Share on X", `https://twitter.com/intent/tweet?text=${text}&url=${url}`],
    ["Share on Reddit", `https://www.reddit.com/submit?url=${url}&title=${text}`],
    ["WhatsApp", `https://wa.me/?text=${text}%20${url}`],
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {links.map(([l, h]) => <a key={l} href={h} rel="noopener noreferrer" target="_blank" className="border border-line px-4 py-2 text-sm hover:border-ember">{l}</a>)}
    </div>
  );
}
