import { describe, expect, it } from "vitest";
import { fundingProgress, greatCircleDistanceKm, greatCirclePoint, latLonToVec3, SAO_PAULO, STOCKHOLM } from "./flight";

describe("fundingProgress", () => {
  it("maps donations to progress", () => {
    expect(fundingProgress(0, 3200)).toBe(0);
    expect(fundingProgress(800, 3200)).toBeCloseTo(0.25);
    expect(fundingProgress(1600, 3200)).toBeCloseTo(0.5);
    expect(fundingProgress(3200, 3200)).toBe(1);
    expect(fundingProgress(9999, 3200)).toBe(1);
  });
  it("never reaches 1 below goal", () => {
    expect(fundingProgress(3199.9999999, 3200)).toBeLessThan(1);
    expect(fundingProgress(3199, 3200)).toBeLessThan(1);
  });
  it("rejects invalid input", () => {
    expect(fundingProgress(NaN, 3200)).toBe(0);
    expect(fundingProgress(100, 0)).toBe(0);
    expect(fundingProgress(-5, 3200)).toBe(0);
  });
});

describe("great circle", () => {
  const a = latLonToVec3(SAO_PAULO.lat, SAO_PAULO.lon);
  const b = latLonToVec3(STOCKHOLM.lat, STOCKHOLM.lon);
  it("endpoints match cities", () => {
    expect(greatCirclePoint(a, b, 0).distanceTo(a)).toBeLessThan(1e-6);
    expect(greatCirclePoint(a, b, 1).distanceTo(b)).toBeLessThan(1e-6);
  });
  it("distance ~10,900 km", () => {
    const d = greatCircleDistanceKm();
    expect(d).toBeGreaterThan(10800);
    expect(d).toBeLessThan(11050);
  });
});
