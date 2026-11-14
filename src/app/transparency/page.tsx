import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";
import { BudgetHistory, Dashboard, Ledger, PolicyDraft, StatusLegend } from "@/components/sections/Finance";

export const metadata: Metadata = { title: "Where every contribution goes" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Financial transparency" title="Where every contribution goes" lead="A public dashboard, expense ledger and budget history. Private details are removed from receipts." />
      <div className="mx-auto max-w-6xl px-4 pb-20"><div className="grid gap-8"><Dashboard /><StatusLegend /><h2 className="display text-4xl font-extrabold">Expense ledger</h2><Ledger /><h2 className="display text-4xl font-extrabold">Budget history</h2><BudgetHistory /><h2 className="display text-4xl font-extrabold">Campaign policy</h2><PolicyDraft /></div></div>
    </>
  );
}
