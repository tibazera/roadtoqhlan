"use client";
import { useEffect, useState } from "react";

/** Client-side so the launch gate uses the visitor's current time, not build time. */
export function DonateAction({ url, launchDate }: { url: string | null; launchDate: string }) {
  const [launched, setLaunched] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setLaunched(Date.now() >= new Date(launchDate).getTime()));
    return () => cancelAnimationFrame(id);
  }, [launchDate]);
  if (launched && url) {
    return <a href={url} rel="noopener noreferrer" className="mt-5 inline-block bg-ember px-6 py-3 font-semibold text-black hover:bg-blood hover:text-white">Support Our Journey</a>;
  }
  return (
    <p className="mt-5 border border-dashed border-line p-3 text-sm text-dim">
      Donations open on December 25, 2026{url ? "" : " (secure hosted donation page being set up)"}. Thank you for your patience.
    </p>
  );
}
