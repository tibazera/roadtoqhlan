/** Public ledger. Starts EMPTY on purpose: no simulated donations or transactions, ever. */
import type { CostStatus } from "@/lib/campaign";

export type LedgerEntry = {
  date: string;
  category: "flights" | "lodging" | "equipment" | "tickets" | "fees" | "other";
  description: string;
  currency: string;
  amount: number;
  rate: number | null;
  convertedEur: number;
  feeEur: number;
  status: CostStatus;
  receiptUrl: string | null; // redacted receipts only: no passport numbers, names, addresses or booking codes
  updatedAt: string;
};

export type FlightQuote = {
  airline: string;
  from: string;
  to: string;
  dates: string;
  roundTripPrice: number;
  currency: string;
  researchedOn: string;
  sourceUrl: string;
  evidenceUrl: string | null;
};

export type BudgetChange = { date: string; previousEur: number; newEur: number; reason: string };

export const LEDGER: LedgerEntry[] = [];
export const FLIGHT_QUOTES: FlightQuote[] = [];
export const BUDGET_HISTORY: BudgetChange[] = [];

/** Verified figures. Update only from the payment provider's records. */
export const FUNDS = {
  grossDonationsEur: 0,
  feesEur: 0,
  supporters: 0 as number | null,
  playersVerifiedContributionEur: 0,
  lastUpdate: null as string | null,
};

export const netDonationsEur = () => Math.round((FUNDS.grossDonationsEur - FUNDS.feesEur) * 100) / 100;

export function expensesPaidEur(entries: LedgerEntry[] = LEDGER) {
  return Math.round(entries.filter((e) => e.status === "paid").reduce((s, e) => s + e.convertedEur + e.feeEur, 0) * 100) / 100;
}
