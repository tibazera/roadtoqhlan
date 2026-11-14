import type { Supporter } from "@/lib/supporters";

/**
 * DEMO ONLY. Fictional donations using public nicks seen on the QuakeWorld Wiki, to preview the wall.
 * Not real donations, not real messages, not endorsements. The supporters page only loads this
 * outside production, and it never feeds the dashboard, the goal progress or the globe.
 */
const c = (name: boolean, message: boolean, amount: boolean) => ({ name, message, amount });
const t = { verifiedPayment: true, approved: true, isTest: true } as const;

export const TEST_SUPPORTERS: Supporter[] = [
  { id: "t1", displayName: "Andeh", country: "SE", message: "See you in Stockholm. Bring the rockets!", amountEur: 50, date: "2026-12-30", consent: c(true, true, true), ...t },
  { id: "t2", displayName: "Bulat", country: "FI", message: "Good luck on the trip, every frag counts.", amountEur: 20, date: "2026-12-29", consent: c(true, true, false), ...t },
  { id: "t3", displayName: "Lethalwiz", country: "BR", message: "Can't wait to play you in person!", amountEur: 10, date: "2026-12-28", consent: c(true, true, true), ...t },
  { id: "t4", displayName: "Rikoll", country: "NO", amountEur: 100, date: "2026-12-27", consent: c(true, false, true), ...t },
  { id: "t5", displayName: "Milton", country: "DK", message: "Proud of this community. Go get it!", amountEur: 5, date: "2026-12-26", consent: c(true, true, false), ...t },
  { id: "t6", displayName: "rio", country: "NO", amountEur: 20, date: "2026-12-26", consent: c(true, false, false), ...t },
  // The next two must stay hidden: they show how the rules protect people.
  { id: "t7", displayName: "Hidden: no consent", message: "Should never appear.", amountEur: 10, date: "2026-12-25", consent: c(false, true, true), ...t },
  { id: "t8", displayName: "Hidden: unverified", message: "Should never appear.", date: "2026-12-25", consent: c(true, true, true), verifiedPayment: false, approved: true, isTest: true },
];
