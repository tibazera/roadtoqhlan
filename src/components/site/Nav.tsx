import Link from "next/link";
import { NAV } from "@/content/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="display text-xl font-extrabold tracking-wide">
          ROAD TO <span className="text-ember">QHLAN</span> 2028
        </Link>
        <nav aria-label="Main" className="hidden gap-5 text-sm text-dim xl:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-fg">{n.label}</Link>
          ))}
        </nav>
        {/* no-JS mobile menu */}
        <details className="relative xl:hidden">
          <summary className="cursor-pointer list-none border border-line px-3 py-1.5 text-sm" aria-label="Menu">Menu</summary>
          <nav aria-label="Mobile" className="absolute right-0 mt-2 grid w-64 gap-1 border border-line bg-raised p-3 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="px-2 py-2 text-dim hover:text-fg">{n.label}</Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
