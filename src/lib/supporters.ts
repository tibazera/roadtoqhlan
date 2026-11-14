/**
 * Supporter wall rules. Privacy by default: nothing is public unless the donor opted in
 * AND the payment is verified AND an organizer approved it.
 */
export type Supporter = {
  id: string;
  /** Name/nickname the donor chose to show. Never a legal name unless they chose it. */
  displayName: string;
  /** ISO 3166-1 alpha-2 code, e.g. "SE". */
  country?: string;
  message?: string;
  amountEur?: number;
  date: string;
  consent: { name: boolean; message: boolean; amount: boolean };
  verifiedPayment: boolean;
  approved: boolean;
  /** Demo-only record. Must never be shown in production. */
  isTest?: boolean;
};

export type PublicSupporter = { id: string; name: string; country?: string; message?: string; amountEur?: number; date: string; isTest?: boolean };

export const MAX_NAME = 40;
export const MAX_MESSAGE = 280;

// eslint-disable-next-line no-control-regex
const clean = (s: string) => s.replace(/[\u0000-\u001f\u007f​-‏‪-‮]/g, " ").replace(/\s+/g, " ").trim();

export function publicSupporters(all: Supporter[]): PublicSupporter[] {
  return all
    .filter((s) => s.approved && s.verifiedPayment && s.consent.name)
    .map((s) => {
      const name = clean(s.displayName).slice(0, MAX_NAME);
      const msg = s.consent.message && s.message ? clean(s.message).slice(0, MAX_MESSAGE) : "";
      return {
        id: s.id,
        name,
        country: /^[A-Za-z]{2}$/.test(s.country ?? "") ? s.country!.toUpperCase() : undefined,
        message: msg || undefined,
        amountEur: s.consent.amount ? s.amountEur : undefined,
        date: s.date,
        isTest: s.isTest,
      };
    })
    .filter((s) => s.name.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
}
