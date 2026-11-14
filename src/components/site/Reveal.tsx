"use client";
import { useEffect, useRef } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function PageHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-6 pt-16">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-3 text-5xl font-extrabold sm:text-7xl">{title}</h1>
      {lead && <p className="mt-5 max-w-2xl text-lg text-dim">{lead}</p>}
    </div>
  );
}
