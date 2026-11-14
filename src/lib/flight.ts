import { Vector3 } from "three";

export const SAO_PAULO = { lat: -23.5505, lon: -46.6333 };
export const STOCKHOLM = { lat: 59.3293, lon: 18.0686 };

/**
 * progress = min(1, verified_net / goal). Returns exactly 1 only when the goal is met.
 * Invalid input (NaN, negative, goal <= 0) yields 0: never invent progress.
 */
export function fundingProgress(verifiedNet: number, goal: number): number {
  if (!Number.isFinite(verifiedNet) || !Number.isFinite(goal) || goal <= 0 || verifiedNet <= 0) return 0;
  if (verifiedNet >= goal) return 1;
  // float rounding guard: below goal must stay strictly below 1
  return Math.min(verifiedNet / goal, 1 - 1e-6);
}

export function latLonToVec3(lat: number, lon: number, r = 1): Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Point on great-circle (slerp) between unit vectors a,b at t in [0,1], lifted into an arc. */
export function greatCirclePoint(a: Vector3, b: Vector3, t: number, radius = 1, arcHeight = 0.12): Vector3 {
  const A = a.clone().normalize();
  const B = b.clone().normalize();
  const omega = Math.acos(Math.min(1, Math.max(-1, A.dot(B))));
  const so = Math.sin(omega);
  const p =
    so < 1e-6
      ? A.clone()
      : A.multiplyScalar(Math.sin((1 - t) * omega) / so).add(B.multiplyScalar(Math.sin(t * omega) / so));
  return p.normalize().multiplyScalar(radius * (1 + arcHeight * Math.sin(Math.PI * t)));
}

export function greatCircleDistanceKm(a = SAO_PAULO, b = STOCKHOLM): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
