import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-raised">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-dim md:grid-cols-3">
        <div>
          <p className="display text-lg text-fg">Four Brazilian Players. One Dream. One Community.</p>
          <p className="mt-2">A community-driven initiative, not a commercial project.</p>
        </div>
        <p>
          This is an independent fan initiative. It is not affiliated with or endorsed by QHLAN, id Software or Bethesda. Quake and QuakeWorld are trademarks of their respective owners.
        </p>
        <ul className="grid gap-1">
          <li><Link className="hover:text-fg" href="/transparency">Financial Transparency</Link></li>
          <li><Link className="hover:text-fg" href="/faq">FAQ</Link></li>
          <li><Link className="hover:text-fg" href="/contact">Contact</Link></li>
          <li><Link className="hover:text-fg" href="/admin">Organizer login</Link></li>
        </ul>
      </div>
    </footer>
  );
}
