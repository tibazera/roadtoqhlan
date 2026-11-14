import { describe, expect, it } from "vitest";
import { publicSupporters, type Supporter } from "./supporters";
import { SUPPORTERS } from "@/content/supporters";
import { TEST_SUPPORTERS } from "@/content/supporters.test-data";

const base: Supporter = {
  id: "1", displayName: "Fragger", message: "Good luck!", amountEur: 20, date: "2026-12-26",
  consent: { name: true, message: true, amount: false }, verifiedPayment: true, approved: true,
};

describe("publicSupporters", () => {
  it("lists a fully consented, verified, approved supporter", () => {
    expect(publicSupporters([base])).toHaveLength(1);
  });
  it("hides without name consent", () => {
    expect(publicSupporters([{ ...base, consent: { ...base.consent, name: false } }])).toHaveLength(0);
  });
  it("hides unverified or unapproved entries", () => {
    expect(publicSupporters([{ ...base, verifiedPayment: false }])).toHaveLength(0);
    expect(publicSupporters([{ ...base, approved: false }])).toHaveLength(0);
  });
  it("never leaks amount or message without their own consent", () => {
    const [s] = publicSupporters([{ ...base, consent: { name: true, message: false, amount: false } }]);
    expect(s.amountEur).toBeUndefined();
    expect(s.message).toBeUndefined();
  });
  it("shows amount only when consented", () => {
    const [s] = publicSupporters([{ ...base, consent: { ...base.consent, amount: true } }]);
    expect(s.amountEur).toBe(20);
  });
  it("sanitizes and truncates", () => {
    const [s] = publicSupporters([{ ...base, displayName: "A‮B\n" + "x".repeat(100), message: "m".repeat(500) }]);
    expect(s.name.length).toBeLessThanOrEqual(40);
    expect(s.name).not.toMatch(/[‮\n]/);
    expect(s.message!.length).toBe(280);
  });
  it("drops names that are empty after cleaning", () => {
    expect(publicSupporters([{ ...base, displayName: " ​ " }])).toHaveLength(0);
  });
});

describe("country flag", () => {
  it("accepts ISO codes, normalizes case, drops anything else", () => {
    const f = (country?: string) => publicSupporters([{ ...base, country }])[0].country;
    expect(f("se")).toBe("SE");
    expect(f("Sweden")).toBeUndefined();
    expect(f("<img>")).toBeUndefined();
    expect(f(undefined)).toBeUndefined();
  });
});

describe("test data safety", () => {
  it("real supporters list contains no test records", () => {
    expect(SUPPORTERS.some((s) => s.isTest)).toBe(false);
  });
  it("every demo record is flagged and protected records stay hidden", () => {
    expect(TEST_SUPPORTERS.every((s) => s.isTest)).toBe(true);
    const names = publicSupporters(TEST_SUPPORTERS).map((s) => s.name);
    expect(names).not.toContain("Hidden: no consent");
    expect(names).not.toContain("Hidden: unverified");
    expect(names).toHaveLength(6);
  });
});
