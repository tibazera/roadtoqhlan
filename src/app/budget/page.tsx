import type { Metadata } from "next";
import { PageHead } from "@/components/site/Reveal";
import { BudgetNotice, BudgetTable, FlightCosts, SplitExplainer, StatusLegend } from "@/components/sections/Finance";

export const metadata: Metadata = { title: "Every cost in the open" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Where your money goes" title="Every cost in the open" lead="Preliminary estimates, clearly labelled. We update them as soon as official QHLAN 2028 details are announced." />
      <div className="mx-auto max-w-6xl px-4 pb-20"><div className="grid gap-8"><SplitExplainer /><BudgetTable /><BudgetNotice /><h2 className="display text-4xl font-extrabold">Flights</h2><FlightCosts /><h2 className="display text-4xl font-extrabold">What the labels mean</h2><StatusLegend /></div></div>
    </>
  );
}
