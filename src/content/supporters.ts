import type { Supporter } from "@/lib/supporters";

/**
 * Raw supporter records. Starts EMPTY: no fake donors, ever.
 * Add an entry only after (1) the payment is verified in the provider dashboard,
 * (2) the donor agreed to be listed, (3) you reviewed the message.
 * Set verifiedPayment/approved to true last. Only consented fields are ever shown (see lib/supporters.ts).
 */
export const SUPPORTERS: Supporter[] = [];
