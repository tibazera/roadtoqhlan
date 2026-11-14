/** Single source of truth for campaign config. All values editable (later: DB-backed, admin-edited, audit-logged). */

export type CostStatus = "estimated" | "quoted" | "booked" | "paid" | "cancelled";

export type BudgetItem = {
  id: string;
  label: string;
  /** Amount in BRL (planning currency). */
  brl: number;
  status: CostStatus;
  note?: string;
};

export const EVENT = {
  name: "QHLAN 2028",
  location: "Stockholm, Sweden (venue to be confirmed)",
  /** Season confirmed by organizers of this campaign; exact dates are NOT announced. */
  season: "summer" as const,
  seasonSource: "Confirmed by the campaign organizers",
  exactDatesConfirmed: false,
};

/** Illustrative rate, not live. */
export const EUR_RATE = 6.25; // 1 EUR = R$ 6.25
export const PLAYERS = 4;
export const FUNDRAISING_GOAL_EUR = 4000;

export const BUDGET: BudgetItem[] = [
  { id: "flights", label: "Four round-trip flights (São Paulo ↔ Stockholm)", brl: 24000, status: "estimated" },
  { id: "lodging", label: "Shared accommodation", brl: 3500, status: "estimated" },
  { id: "equipment", label: "Equipment rental (only if it cannot be borrowed)", brl: 1200, status: "estimated" },
  {
    id: "tickets",
    label: "Event tickets (4 players)",
    brl: 4 * 150 * EUR_RATE,
    status: "estimated",
    note: "Based on QHLAN26 ticket tiers (€100 / €150 / €200). QHLAN 2028 prices not yet announced.",
  },
];

const round2 = (n: number) => Math.round(n * 100) / 100;
export const brlToEur = (brl: number, rate = EUR_RATE) => round2(brl / rate);

export function budgetTotals(items = BUDGET, goalEur = FUNDRAISING_GOAL_EUR, rate = EUR_RATE) {
  // cancelled lines are reversed, never counted
  const live = items.filter((i) => i.status !== "cancelled");
  const totalBrl = round2(live.reduce((s, i) => s + i.brl, 0));
  const totalEur = brlToEur(totalBrl, rate);
  return {
    totalBrl,
    totalEur,
    communityGoalEur: goalEur,
    /** Never negative: if the goal exceeds costs, players owe nothing. */
    playersShareEur: Math.max(0, round2(totalEur - goalEur)),
    communityPct: totalEur > 0 ? Math.min(100, round2((goalEur / totalEur) * 100)) : 0,
  };
}
