import { Suspense } from "react";
import FlightGlobe from "@/components/flight/FlightGlobe";
import { FUNDRAISING_GOAL_EUR } from "@/lib/campaign";

// PROTOTYPE. Real data source will be the verified ledger (Supabase). Until then: zero, never simulated.
const VERIFIED_NET_EUR = 0;
const GOAL_EUR = FUNDRAISING_GOAL_EUR;

async function Globe({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const { preview } = await searchParams;
  // TODO(auth): adminPreview must come from a server-side admin session check, not a query string.
  // Query flag is prototype-only (disabled in production) so the slider can be tried locally.
  const adminPreview = process.env.NODE_ENV !== "production" && preview === "1";
  return <FlightGlobe verifiedNet={VERIFIED_NET_EUR} goal={GOAL_EUR} adminPreview={adminPreview} />;
}

export default function Page(props: { searchParams: Promise<{ preview?: string }> }) {
  if (process.env.GITHUB_PAGES === "true") {
    return <FlightGlobe verifiedNet={VERIFIED_NET_EUR} goal={GOAL_EUR} />;
  }
  return (
    <Suspense fallback={<div className="h-[520px] bg-[#05060a]" />}>
      <Globe searchParams={props.searchParams} />
    </Suspense>
  );
}
