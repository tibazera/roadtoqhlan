import { BUDGET, EUR_RATE, FUNDRAISING_GOAL_EUR, brlToEur, budgetTotals, type CostStatus } from "@/lib/campaign";
import { BUDGET_HISTORY, FLIGHT_QUOTES, FUNDS, LEDGER, expensesPaidEur, netDonationsEur } from "@/content/ledger";
import { fundingProgress } from "@/lib/flight";
import { CountUp } from "@/components/site/Motion";

const brl = (n: number) => "R$ " + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const eur = (n: number) => "€ " + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

const STATUS: Record<CostStatus, { label: string; cls: string; hint: string }> = {
  estimated: { label: "Estimated", cls: "text-dim border-line", hint: "A projected expense" },
  quoted: { label: "Quoted", cls: "text-yellow border-yellow/50", hint: "Backed by a dated supplier quote" },
  booked: { label: "Booked", cls: "text-ember border-ember/60", hint: "A confirmed reservation" },
  paid: { label: "Paid", cls: "text-green border-green/60", hint: "Backed by a payment record" },
  cancelled: { label: "Cancelled/Refunded", cls: "text-blood border-blood/60", hint: "A reversed transaction" },
};

export function StatusBadge({ s }: { s: CostStatus }) {
  const x = STATUS[s];
  return <span title={x.hint} className={`inline-block border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${x.cls}`}>{x.label}</span>;
}

export function StatusLegend() {
  return (
    <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
      {(Object.keys(STATUS) as CostStatus[]).map((k) => (
        <div key={k} className="hud p-3"><dt><StatusBadge s={k} /></dt><dd className="mt-2 text-dim">{STATUS[k].hint}</dd></div>
      ))}
    </dl>
  );
}

export function BudgetTable() {
  const t = budgetTotals();
  return (
    <div className="hud overflow-x-auto p-1">
      <table className="w-full min-w-[560px] text-left text-sm">
        <caption className="sr-only">Preliminary budget. Estimates, not confirmed bookings.</caption>
        <thead className="font-mono text-[11px] uppercase tracking-wider text-dim">
          <tr><th className="p-3">Expense</th><th className="p-3 text-right">BRL</th><th className="p-3 text-right">EUR (illustrative)</th><th className="p-3">Status</th></tr>
        </thead>
        <tbody>
          {BUDGET.map((i) => (
            <tr key={i.id} className="border-t border-line align-top">
              <td className="p-3">{i.label}{i.note && <div className="mt-1 text-xs text-dim">{i.note}</div>}</td>
              <td className="p-3 text-right tabular-nums">{brl(i.brl)}</td>
              <td className="p-3 text-right tabular-nums">{eur(brlToEur(i.brl))}</td>
              <td className="p-3"><StatusBadge s={i.status} /></td>
            </tr>
          ))}
          <tr className="border-t-2 border-ember/60 font-semibold">
            <td className="p-3">Total estimated expenses</td>
            <td className="p-3 text-right tabular-nums">{brl(t.totalBrl)}</td>
            <td className="p-3 text-right tabular-nums">{eur(t.totalEur)}</td><td />
          </tr>
        </tbody>
      </table>
      <p className="p-3 text-xs text-dim">Illustrative rate: €1 = R$ {EUR_RATE.toFixed(2)}. Not a live exchange rate and not a guaranteed travel price.</p>
    </div>
  );
}

export function BudgetNotice() {
  return (
    <aside className="hud border-l-4 border-l-ember p-5" aria-labelledby="notice">
      <h3 id="notice" className="display text-2xl font-extrabold text-ember">Budget Estimates — Subject to QHLAN 2028 Date Confirmation</h3>
      <div className="mt-3 grid gap-3 text-dim">
        <p>All costs presented are preliminary estimates based on currently available travel information.</p>
        <p>As the official dates and location of QHLAN 2028 have not yet been confirmed, these figures are intended to provide the community with a transparent overview of our expected expenses.</p>
        <p>Once the official dates and location are announced, we will update the entire budget with more accurate flight prices, accommodation options, and equipment requirements.</p>
        <p>We are committed to keeping the community informed of every significant financial change throughout the campaign.</p>
      </div>
    </aside>
  );
}

export function SplitExplainer() {
  const t = budgetTotals();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="hud p-5">
        <p className="eyebrow">We ask the community for</p>
        <p className="display mt-2 text-5xl font-extrabold">{eur(FUNDRAISING_GOAL_EUR)}</p>
        <p className="mt-2 text-dim">Flights, shared accommodation and equipment rental only, toward an estimated {eur(t.totalEur)}. Voluntary, never expected.</p>
      </div>
      <div className="hud p-5">
        <p className="eyebrow">The players cover</p>
        <p className="display mt-2 text-5xl font-extrabold">{eur(t.playersShareEur)}+</p>
        <p className="mt-2 text-dim">The remainder of the estimated costs, plus food, drinks, sightseeing and all personal expenses. We are putting in our own money too.</p>
      </div>
    </div>
  );
}

export function FlightCosts() {
  return (
    <div className="grid gap-4">
      <p className="max-w-3xl text-dim">
        Flights are expected to be the biggest expense. Our planning estimate is about R$ 6,000 per player for round-trip economy São Paulo ↔ Stockholm. The real price depends on official event dates, airline availability, summer demand, departure and return dates, baggage, exchange rates and how early we book.
      </p>
      <div className="hud overflow-x-auto p-1">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="font-mono text-[11px] uppercase tracking-wider text-dim">
            <tr><th className="p-3">Airline</th><th className="p-3">Route</th><th className="p-3">Dates</th><th className="p-3 text-right">Round trip</th><th className="p-3">Researched</th><th className="p-3">Source</th></tr>
          </thead>
          <tbody>
            {FLIGHT_QUOTES.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-dim">No verified flight quotes yet. Prices stay “Estimated” until a dated, sourced quote is added here.</td></tr>
            )}
            {FLIGHT_QUOTES.map((q) => (
              <tr key={q.sourceUrl} className="border-t border-line">
                <td className="p-3">{q.airline}</td><td className="p-3">{q.from} → {q.to}</td><td className="p-3">{q.dates}</td>
                <td className="p-3 text-right tabular-nums">{q.currency} {q.roundTripPrice}</td><td className="p-3">{q.researchedOn}</td>
                <td className="p-3"><a className="text-ember underline" href={q.sourceUrl} rel="noopener noreferrer">link</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Dashboard() {
  const net = netDonationsEur();
  const pct = Math.floor(fundingProgress(net, FUNDRAISING_GOAL_EUR) * 100);
  const paid = expensesPaidEur();
  const t = budgetTotals();
  const cards: [string, number | null, string, string][] = [
    ["Gross donations", FUNDS.grossDonationsEur, "€ ", ""],
    ["Fees (platform + conversion)", FUNDS.feesEur, "€ ", ""],
    ["Net funds received", net, "€ ", ""],
    ["Community goal", FUNDRAISING_GOAL_EUR, "€ ", ""],
    ["Funded", pct, "", "%"],
    ["Supporters", FUNDS.supporters, "", ""],
    ["Expenses paid", paid, "€ ", ""],
    ["Campaign balance", Math.round((net - paid) * 100) / 100, "€ ", ""],
    ["Players' verified contribution", FUNDS.playersVerifiedContributionEur, "€ ", ""],
    ["Estimated remaining expenses", Math.max(0, t.totalEur - paid), "€ ", ""],
  ];
  return (
    <div>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map(([k, n, pre, suf]) => (
          <div key={k} className="hud p-4">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-dim">{k}</dt>
            <dd className="display mt-1 text-3xl font-extrabold tabular-nums">{n === null ? "—" : <CountUp to={n} prefix={pre} suffix={suf} />}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-dim">Last financial update: {FUNDS.lastUpdate ?? "no contributions recorded yet"}. Figures come only from verified payment-provider records.</p>
    </div>
  );
}

export function Ledger() {
  return (
    <div className="hud overflow-x-auto p-1">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="font-mono text-[11px] uppercase tracking-wider text-dim">
          <tr>{["Date", "Category", "Description", "Orig.", "Rate", "EUR", "Fees", "Status", "Receipt", "Updated"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr>
        </thead>
        <tbody>
          {LEDGER.length === 0 && <tr><td colSpan={10} className="p-6 text-center text-dim">No transactions yet. Every expense will appear here with its receipt (private details removed).</td></tr>}
          {LEDGER.map((e, i) => (
            <tr key={i} className="border-t border-line">
              <td className="p-3">{e.date}</td><td className="p-3">{e.category}</td><td className="p-3">{e.description}</td>
              <td className="p-3 tabular-nums">{e.currency} {e.amount}</td><td className="p-3">{e.rate ?? "—"}</td>
              <td className="p-3 tabular-nums">{e.convertedEur}</td><td className="p-3 tabular-nums">{e.feeEur}</td>
              <td className="p-3"><StatusBadge s={e.status} /></td>
              <td className="p-3">{e.receiptUrl ? <a className="text-ember underline" href={e.receiptUrl} rel="noopener noreferrer">view</a> : "—"}</td>
              <td className="p-3">{e.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BudgetHistory() {
  return (
    <div className="hud overflow-x-auto p-1">
      <table className="w-full text-left text-sm">
        <thead className="font-mono text-[11px] uppercase tracking-wider text-dim"><tr><th className="p-3">Date</th><th className="p-3">Previous</th><th className="p-3">New</th><th className="p-3">Why</th></tr></thead>
        <tbody>
          {BUDGET_HISTORY.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-dim">No changes yet. Initial estimate: {eur(budgetTotals().totalEur)}. Every revision will be logged here.</td></tr>}
          {BUDGET_HISTORY.map((c) => (
            <tr key={c.date} className="border-t border-line"><td className="p-3">{c.date}</td><td className="p-3">{eur(c.previousEur)}</td><td className="p-3">{eur(c.newEur)}</td><td className="p-3">{c.reason}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PolicyDraft() {
  const items: [string, string][] = [
    ["How funds are held", "Contributions are meant to stay with the payment platform or fiscal host, not in a player's personal account. This applies only once the host is confirmed and agrees to it."],
    ["Release by milestones", "No money is spent before the goal is reached. Once it is, funds are paid out only against real expenses with receipts, and every payment appears in the public ledger."],
    ["If the goal is not reached", "At the decision checkpoint (about six months before QHLAN) we plan to offer to return contributions through the same platform instead of spending them."],
    ["Limits on refunds", "Platforms may not return their processing fees, and card refunds usually have a time limit. Older contributions may need a manual return. This is still to be confirmed with the host."],
    ["If the event or trip is cancelled", "To be decided by the organizers. We intend to follow the same return approach."],
    ["If a player cannot travel", "To be decided. Funds would only cover the remaining players' approved costs."],
    ["Unused funds", "To be decided. Any surplus would be disclosed publicly."],
  ];
  return (
    <div id="policy" className="hud p-5">
      <p className="eyebrow">Draft — pending organizer approval and fiscal host confirmation, not final</p>
      <dl className="mt-3 grid gap-4">
        {items.map(([k, v]) => (<div key={k}><dt className="font-semibold">{k}</dt><dd className="text-dim">{v}</dd></div>))}
      </dl>
    </div>
  );
}
