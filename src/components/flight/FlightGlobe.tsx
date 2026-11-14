"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "motion/react";
import { fundingProgress } from "@/lib/flight";
import type { SceneApi } from "./FlightScene";

const FlightScene = dynamic(() => import("./FlightScene"), { ssr: false });

type Props = {
  /** VERIFIED net donations only. Never pass simulated values here for public pages. */
  verifiedNet: number;
  goal: number;
  currency?: string;
  /** Admin-only: slider overrides progress locally. Never writes to campaign data. */
  adminPreview?: boolean;
};

const ARMOR = [
  { at: 0.25, name: "GREEN ARMOR", color: "#35e07a" },
  { at: 0.5, name: "YELLOW ARMOR", color: "#ffd400" },
  { at: 0.75, name: "RED ARMOR", color: "#ff3b30" },
];

function detect() {
  const mq = typeof matchMedia === "function";
  let webgl = false;
  try { webgl = !!document.createElement("canvas").getContext("webgl2") || !!document.createElement("canvas").getContext("webgl"); } catch {}
  return {
    webgl,
    reduced: mq && matchMedia("(prefers-reduced-motion: reduce)").matches,
    coarse: mq && matchMedia("(pointer: coarse)").matches,
    lowPower: mq && (matchMedia("(max-width: 768px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4),
  };
}

function Fallback2D({ p }: { p: number }) {
  // lightweight SVG: straight stylised arc, plane marker at p
  const x = 40 + p * 320, y = 150 - Math.sin(Math.PI * p) * 90;
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" role="img" aria-label={`Flight progress ${Math.round(p * 100)} percent`}>
      <path d="M40 150 Q200 -30 360 150" fill="none" stroke="#ffffff22" strokeWidth="3" />
      <path d="M40 150 Q200 -30 360 150" fill="none" stroke="#ff6a1f" strokeWidth="3" pathLength={1} strokeDasharray={`${p} 1`} />
      <circle cx="40" cy="150" r="6" fill="#35e07a" /><circle cx="360" cy="150" r="6" fill={p >= 1 ? "#ffd400" : "#4aa8ff"} />
      <text x="40" y="175" fill="#aaa" fontSize="11" textAnchor="middle">SÃO PAULO</text>
      <text x="360" y="175" fill="#aaa" fontSize="11" textAnchor="middle">STOCKHOLM</text>
      <g transform={`translate(${x} ${y})`}><circle r="7" fill="#fff" /></g>
    </svg>
  );
}

const BTN = "h-8 w-8 border border-white/25 bg-black/60 hover:border-orange-500";

export default function FlightGlobe({ verifiedNet, goal, currency = "€", adminPreview = false }: Props) {
  const [env, setEnv] = useState<ReturnType<typeof detect> | null>(null);
  const [sim, setSim] = useState<number | null>(null);
  const [arrived, setArrived] = useState(false);
  const tween = useRef<{ stop: () => void } | null>(null);
  const api = useRef<SceneApi | null>(null);
  const [moved, setMoved] = useState(false); // visitor rotated/zoomed: show recenter
  const [exploring, setExploring] = useState(false); // touch devices: opt in so the page still scrolls
  const [wheelOn, setWheelOn] = useState(false); // wheel zoom only after clicking the globe
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnv(detect()));
    return () => cancelAnimationFrame(id);
  }, []);

  const real = fundingProgress(verifiedNet, goal);
  const simulating = sim !== null; // admin slider OR public "simulate the goal" demo
  const p = simulating ? sim : real;
  const raised = simulating ? goal * p : verifiedNet;
  const realPct = Math.floor(real * 100);

  // Public demo: fly the plane to Stockholm as a picture of the goal. Never touches real data.
  const startSim = () => {
    tween.current?.stop();
    if (env?.reduced) { setSim(1); return; }
    tween.current = animate(real, 1, { duration: 9, ease: "easeInOut", onUpdate: setSim });
  };
  const zoomIn = () => api.current?.zoom(0.8);
  const zoomOut = () => api.current?.zoom(1.25);
  const recenter = () => api.current?.recenter();
  const stopSim = () => { tween.current?.stop(); setSim(null); };
  const pct = p >= 1 ? 100 : Math.floor(p * 100); // 99.9% shows 99, never rounds up to 100
  const use3D = !!env?.webgl; // 3D only; SVG shows solely when WebGL is unavailable
  const next = ARMOR.find((a) => p < a.at);

  return (
    <section onPointerDown={() => setWheelOn(true)} onPointerLeave={() => setWheelOn(false)}
      className="relative isolate h-[min(92vh,880px)] min-h-[560px] w-full overflow-hidden bg-[#05060a] text-white" aria-label="Fundraising flight from São Paulo to Stockholm">
      <div className="absolute inset-0">
        {env && use3D && <FlightScene progress={p} reduced={env.reduced} lowPower={env.lowPower} onArrive={setArrived} api={api} onUser={setMoved} interactive={!env.coarse || exploring} wheelZoom={wheelOn} />}
        {env && !use3D && <div className="grid h-full place-items-center p-6"><div className="w-full max-w-xl"><Fallback2D p={p} /></div></div>}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#05060acc_100%)]" />

      {/* HUD */}
      <div className="absolute left-4 right-4 top-4 flex items-start justify-between font-mono text-[11px] tracking-widest sm:left-8 sm:right-8 sm:top-8">
        <div className="border-l-2 border-orange-500 pl-3">
          <div className="text-orange-400">ROAD TO QHLAN 2028</div>
          <div className="text-white/60">SÃO PAULO → STOCKHOLM</div>
          <div className="mt-1 text-[10px] text-white/40">LONDRINA · FORTALEZA · RIO GRANDE → SÃO PAULO · 4TH PLAYER TBA</div>
        </div>
        {simulating && <div className="border border-yellow-400 px-2 py-1 text-yellow-300">{adminPreview ? "ADMIN PREVIEW · NOT PUBLIC DATA" : "SIMULATION · NOT REAL PROGRESS"}</div>}
      </div>

      <div className="absolute inset-x-4 bottom-4 sm:inset-x-8 sm:bottom-8">
        <div className="mx-auto max-w-3xl border border-white/15 bg-black/60 p-4 font-mono backdrop-blur">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] tracking-widest text-white/50">{simulating ? "SIMULATED — THE GOAL" : "VERIFIED NET RAISED"}</div>
              <div className="text-2xl font-bold text-orange-400 sm:text-3xl" aria-live="polite">
                {currency}{raised.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                <span className="text-base text-white/50"> / {currency}{goal.toLocaleString("en-US")}</span>
              </div>
            </div>
            <div className="text-right text-4xl font-black tabular-nums sm:text-5xl">{pct}<span className="text-xl text-white/50">%</span></div>
          </div>
          <div className="relative mt-3 h-2 bg-white/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-gradient-to-r from-orange-600 to-red-500 transition-[clip-path] duration-700" style={{ clipPath: `inset(0 ${100 - p * 100}% 0 0)` }} />
            {ARMOR.map((a) => (
              <span key={a.name} className="absolute top-[-3px] h-3.5 w-0.5" style={{ left: `${a.at * 100}%`, background: p >= a.at ? a.color : "#ffffff55" }} title={a.name} />
            ))}
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-white/50">
            {simulating && !adminPreview
              ? `A simulation of our final goal, not real progress. Real progress today: ${realPct}%.`
              : <>{next ? `Next marker: ${next.name} at ${next.at * 100}%. ` : ""}Progress reflects verified funds only. Reaching the goal does not mean flights are booked — see Travel Status.</>}
          </p>
        </div>
      </div>

      {adminPreview && (
        <div className="absolute right-4 top-20 w-44 border border-yellow-400/60 bg-black/70 p-3 font-mono text-[10px] text-yellow-200 sm:right-8">
          <label htmlFor="sim">PREVIEW {sim === null ? "OFF" : `${Math.round((sim) * 100)}%`}</label>
          <input id="sim" type="range" min={0} max={100} value={Math.round((sim ?? real) * 100)} onChange={(e) => setSim(+e.target.value / 100)} className="mt-1 w-full" />
          <button className="mt-1 underline" onClick={stopSim}>reset to real data</button>
        </div>
      )}

      {!adminPreview && env && use3D && (
        <button onClick={simulating ? stopSim : startSim} className="absolute right-4 top-20 border border-white/25 bg-black/60 px-3 py-2 font-mono text-[11px] tracking-widest text-white hover:border-orange-500 sm:right-8">
          {simulating ? "↺ BACK TO REAL PROGRESS" : "▶ SIMULATE THE GOAL"}
        </button>
      )}


      {env && use3D && (
        <div className="absolute right-4 top-[10.5rem] grid gap-1 font-mono text-sm text-white sm:right-8">
          <button onClick={zoomIn} aria-label="Zoom in" className={BTN}>+</button>
          <button onClick={zoomOut} aria-label="Zoom out" className={BTN}>−</button>
          {moved && <button onClick={recenter} aria-label="Recenter globe" title="Recenter" className={BTN}>⟲</button>}
          {env.coarse && (
            <button onClick={() => setExploring((v) => !v)} className="mt-1 border border-white/25 bg-black/60 px-2 py-1 text-[10px] tracking-widest hover:border-orange-500">
              {exploring ? "DONE" : "EXPLORE"}
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {(arrived || (!use3D && p >= 1)) && (
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-x-0 top-1/4 text-center" role="status">
            <div className="mx-auto inline-block bg-black/55 px-6 py-4 backdrop-blur">
              <div className="text-3xl font-black tracking-tight sm:text-5xl"
                style={{ background: "linear-gradient(90deg,#009c3b,#ffdf00,#006aa7,#fecc00)", WebkitBackgroundClip: "text", color: "transparent" }}>
                {simulating && !adminPreview ? "STOCKHOLM!" : "WE MADE IT!"}
              </div>
              <div className="mt-1 text-sm tracking-widest sm:text-base">{simulating && !adminPreview ? "THIS IS WHERE WE WANT TO GET." : "THANK YOU, QUAKEWORLD COMMUNITY!"}</div>
              <div className="mt-2 font-mono text-[10px] text-yellow-300">{simulating && !adminPreview ? "SIMULATION · NOT REAL PROGRESS" : "MILESTONE UNLOCKED · DESTINATION REACHED"}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
