/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { feature, mesh } from "topojson-client";
import land from "world-atlas/land-110m.json";
import countries from "world-atlas/countries-110m.json";
import states from "@/data/brazil-states.json";
import { COUNTRY_LABELS, HOMES, UF_BY_CODE } from "@/lib/geo";
import { STOCKHOLM } from "@/lib/flight";

/**
 * Procedural Earth: every pixel comes from public-domain Natural Earth (world-atlas) and IBGE
 * (Brazilian state borders). No third-party image assets, so no licensing risk.
 */

type Ctx = CanvasRenderingContext2D;
type Ring = number[][];

const mk = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };

// seeded PRNG: stable look across reloads, pure for React
function rng(seed: number) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

/** Make a ring longitude-continuous across the antimeridian. */
function unwrap(ring: Ring): Ring {
  let prev = ring[0][0];
  return ring.map(([lon0, lat]) => {
    let lon = lon0;
    while (lon - prev > 180) lon -= 360;
    while (lon - prev < -180) lon += 360;
    prev = lon;
    return [lon, lat];
  });
}

const polysOf = (fc: any): Ring[][] => {
  const geoms = fc.features ? fc.features.map((f: any) => f.geometry) : [fc.geometry ?? fc];
  return geoms.flatMap((g: any) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates));
};

export function makeEarth(lowPower: boolean) {
  const W = lowPower ? 2048 : 4096, H = W / 2;
  const S = W / 4096; // scale for line widths / fonts
  const X = (lon: number) => ((lon + 180) / 360) * W;
  const Y = (lat: number) => ((90 - lat) / 180) * H;

  const landPolys = polysOf(feature(land as any, (land as any).objects.land));
  const pathPolys = (g: Ctx, polys: Ring[][]) => {
    for (const off of [-360, 0, 360]) {
      for (const poly of polys) {
        for (const ring of poly) {
          unwrap(ring).forEach(([lon, lat], i) => (i ? g.lineTo(X(lon + off), Y(lat)) : g.moveTo(X(lon + off), Y(lat))));
          g.closePath();
        }
      }
    }
  };

  /* ---- land layer: climate-by-latitude gradient + speckle, masked by the coastline ---- */
  const landC = mk(W, H), lg = landC.getContext("2d")!;
  lg.beginPath(); pathPolys(lg, landPolys); lg.fillStyle = "#000"; lg.fill("evenodd");
  lg.globalCompositeOperation = "source-in";
  const grad = lg.createLinearGradient(0, 0, 0, H);
  const stops: [number, string][] = [[0, "#2c3752"], [0.5, "#1e2b40"], [1, "#2c3752"]];
  stops.forEach(([p, c]) => grad.addColorStop(p, c));
  lg.fillStyle = grad; lg.fillRect(0, 0, W, H);
  // relief-like speckle
  lg.globalCompositeOperation = "source-atop";
  const r = rng(11);
  for (let i = 0; i < (lowPower ? 26000 : 90000); i++) {
    const x = r() * W, y = r() * H, a = 0.02 + r() * 0.04;
    lg.fillStyle = r() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a * 1.2})`;
    lg.fillRect(x, y, (1 + r() * 5) * S * 2, (1 + r() * 3) * S * 2);
  }

  /* ---- main color map ---- */
  const c = mk(W, H), g = c.getContext("2d")!;
  const ocean = g.createLinearGradient(0, 0, 0, H);
  [[0, "#060d1a"], [0.3, "#09182c"], [0.5, "#0b1f36"], [0.7, "#09182c"], [1, "#060d1a"]].forEach(([p, col]) => ocean.addColorStop(p as number, col as string));
  g.fillStyle = ocean; g.fillRect(0, 0, W, H);
  // faint graticule
  g.strokeStyle = "rgba(160,200,255,0.05)"; g.lineWidth = S;
  for (let lon = -180; lon <= 180; lon += 15) { g.beginPath(); g.moveTo(X(lon), 0); g.lineTo(X(lon), H); g.stroke(); }
  for (let lat = -75; lat <= 75; lat += 15) { g.beginPath(); g.moveTo(0, Y(lat)); g.lineTo(W, Y(lat)); g.stroke(); }
  // shallow-water glow around coasts, then the land itself
  g.save(); g.shadowColor = "rgba(255,110,40,0.4)"; g.shadowBlur = 16 * S; g.drawImage(landC, 0, 0); g.restore();
  g.drawImage(landC, 0, 0);

  // coastline
  g.beginPath(); pathPolys(g, landPolys); g.strokeStyle = "rgba(255,140,60,0.9)"; g.lineWidth = 1.2 * S; g.stroke();

  // country borders (interior only)
  const borders: any = mesh(countries as any, (countries as any).objects.countries, (a: any, b: any) => a !== b);
  g.strokeStyle = "rgba(255,255,255,0.26)"; g.lineWidth = 1.1 * S;
  for (const line of borders.coordinates as Ring[]) {
    g.beginPath();
    line.forEach(([lon, lat], i) => {
      const jump = i > 0 && Math.abs(lon - line[i - 1][0]) > 180;
      return i === 0 || jump ? g.moveTo(X(lon), Y(lat)) : g.lineTo(X(lon), Y(lat));
    });
    g.stroke();
  }

  // Brazilian states: tint players' home states, SP (hub) in gold, then borders
  const home = new Set(HOMES.map((h) => h.uf));
  const centers: Record<string, [number, number]> = {};
  for (const f of (states as any).features) {
    const uf = UF_BY_CODE[f.properties.codarea];
    const polys: Ring[][] = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    const biggest = polys.map((p) => p[0]).sort((a, b) => b.length - a.length)[0];
    centers[uf] = [biggest.reduce((s, p) => s + p[0], 0) / biggest.length, biggest.reduce((s, p) => s + p[1], 0) / biggest.length];
    g.beginPath();
    for (const poly of polys) for (const ring of poly) ring.forEach(([lon, lat], i) => (i ? g.lineTo(X(lon), Y(lat)) : g.moveTo(X(lon), Y(lat))));
    if (uf === "SP") { g.fillStyle = "rgba(255,200,60,0.32)"; g.fill("evenodd"); }
    else if (home.has(uf)) { g.fillStyle = "rgba(255,106,31,0.34)"; g.fill("evenodd"); }
    g.strokeStyle = "rgba(255,185,130,0.65)"; g.lineWidth = 1.3 * S; g.stroke();
  }

  // names, painted with horizontal pre-stretch so they stay legible after sphere mapping
  const label = (text: string, lon: number, lat: number, size: number, color: string, weight = 600, align: CanvasTextAlign = "center") => {
    g.save();
    g.translate(X(lon), Y(lat));
    g.scale(1 / Math.max(0.3, Math.cos((lat * Math.PI) / 180)), 1);
    g.font = `${weight} ${size * S}px system-ui, "Segoe UI", sans-serif`;
    g.textAlign = align; g.textBaseline = "middle";
    g.lineJoin = "round"; g.lineWidth = size * S * 0.28; g.strokeStyle = "rgba(4,12,28,0.85)";
    g.strokeText(text, 0, 0); g.fillStyle = color; g.fillText(text, 0, 0);
    g.restore();
  };
  for (const [lon, lat, name, k] of COUNTRY_LABELS.filter((c) => c[2] === "BRAZIL" || (c[0] > -25 && c[0] < 45 && c[1] > 34 && c[1] < 72))) label(name, lon, lat, 40 * k * (name === "BRAZIL" ? 1 : 0.72), "rgba(255,255,255,0.78)", 700);
  label("STOCKHOLM", STOCKHOLM.lon + 0.9, STOCKHOLM.lat - 1.3, 27, "#9fd0ff", 800, "left");

  const color = new THREE.CanvasTexture(c);
  color.colorSpace = THREE.SRGBColorSpace;
  color.anisotropy = 8;

  return { color };
}
