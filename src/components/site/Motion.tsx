"use client";
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Number that counts up once when it scrolls into view. Static under reduced motion. */
export function CountUp({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (x) => setV(x) });
    return () => c.stop();
  }, [inView, to, reduce]);
  const shown = reduce ? to : v;
  return <span ref={ref}>{prefix}{Math.round(shown).toLocaleString("en-US")}{suffix}</span>;
}

/** Thin page-scroll progress bar. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div aria-hidden style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-ember" />;
}

/** Vertical rail that draws itself as the timeline scrolls past. */
export function TimelineRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 55%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={ref} aria-hidden className="absolute inset-y-0 -left-px w-0.5">
      <motion.div style={{ height: h }} className="w-full bg-gradient-to-b from-ember to-blood shadow-[0_0_12px_#ff6a1f]" />
    </div>
  );
}
