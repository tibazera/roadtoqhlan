import { describe, expect, it } from "vitest";
import { BUDGET, budgetTotals } from "./campaign";

describe("budgetTotals", () => {
  it("includes tickets: R$ 32,450 / € 5,192", () => {
    const t = budgetTotals();
    expect(t.totalBrl).toBe(32450);
    expect(t.totalEur).toBe(5192);
  });
  it("players cover the remainder of the €4,000 goal", () => {
    expect(budgetTotals().playersShareEur).toBe(1192);
  });
  it("excludes cancelled lines", () => {
    const items = BUDGET.map((i) => (i.id === "tickets" ? { ...i, status: "cancelled" as const } : i));
    expect(budgetTotals(items).totalBrl).toBe(28700);
  });
  it("players share never negative", () => {
    expect(budgetTotals(BUDGET, 99999).playersShareEur).toBe(0);
  });
  it("everything starts as estimated, nothing falsely booked", () => {
    expect(BUDGET.every((i) => i.status === "estimated")).toBe(true);
  });
});
