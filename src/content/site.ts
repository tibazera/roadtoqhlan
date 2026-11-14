/** Editable campaign content. Nothing here is invented: unknown = null/TBA, rendered as a labelled placeholder. */

export const LAUNCH_DATE = "2026-12-25";

export const NAV = [
  { href: "/story", label: "Our Story" },
  { href: "/team", label: "Team" },
  { href: "/budget", label: "Where Your Money Goes" },
  { href: "/road", label: "Road to QHLAN" },
  { href: "/supporters", label: "Supporters" },
  { href: "/updates", label: "Updates" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export type Player = {
  nick: string;
  status: "confirmed" | "tba";
  photo: string | null;
  bio: string | null;
  history: string | null;
  maps: string[] | null;
  achievements: string[] | null;
  message: string | null;
  links: { label: string; href: string }[];
  video: string | null;
  /** QHLAN history. Facts only. */
  qhlan: string | null;
  /** Hometown, shared by the player. */
  from: string | null;
  /** Where the facts above come from. */
  source: { label: string; href: string } | null;
};

const empty = { photo: null, bio: null, history: null, maps: null, achievements: null, message: null, links: [], video: null, qhlan: null, from: null, source: null };

/** Team all four currently represent. Stated by the campaign organizers; update if it changes. */
export const CLUB = { name: "Falling in Reverse", competition: "QWLeague" };

const WIKI = "QuakeWorld Wiki (quakeworld.nu), checked 2026-11-14";

export const TEAM: Player[] = [
  {
    ...empty,
    nick: "GT",
    status: "confirmed",
    from: "Rio Grande, RS",
    bio: "Playing QuakeWorld since 2003, he came up through Brazil's TD2 and FFA scenes before moving into competitive duel and team play.",
    qhlan: "Attended QHLAN 2017",
    source: { label: WIKI, href: "https://www.quakeworld.nu/wiki/GT" },
  },
  {
    ...empty,
    nick: "Mur",
    status: "confirmed",
    from: "Fortaleza, CE",
    maps: ["Aerowalk", "ztnDM3", "dm3"],
    message: "Hey guys! Massive respect to everyone keeping QuakeWorld alive for 30 years. It's so cool to see a community that still loves and grinds this game after so long. Super happy to be here and share the servers with you all. GLHF!",
    bio: "A strong all-round player who performs well in every game mode. Back to playing, with the chance of one more QHLAN.",
    qhlan: "Attended QHLAN 2017",
    source: { label: WIKI, href: "https://www.quakeworld.nu/wiki/Mur" },
  },
  {
    ...empty,
    nick: "Tiba",
    status: "confirmed",
    from: "Londrina, PR",
    bio: "Started in NetQuake around 2000 and moved to QuakeWorld around 2007. He stepped away in 2011 and came back in 2019, and has worked to bring older players back, welcome newcomers and organize events for the Brazilian community.",
    maps: ["dm3"],
    qhlan: "Would be his first QHLAN",
    source: { label: WIKI, href: "https://www.quakeworld.nu/wiki/Tiba" },
  },
  { nick: "TBA", status: "tba", ...empty },
];

export type Milestone = {
  id: string;
  title: string;
  when: string;
  detail: string;
  /** true only after verification — never auto-completed */
  verified: boolean;
};

export const MILESTONES: Milestone[] = [
  { id: "launch", title: "Campaign launched", when: "Dec 25, 2026", detail: "The journey starts on Christmas Day.", verified: false },
  { id: "budget", title: "Initial budget published", when: "Dec 2026", detail: "Every estimate in the open, clearly labelled as an estimate.", verified: true },
  { id: "docs", title: "Player documentation verified", when: "2027", detail: "Passports and travel paperwork confirmed for each player.", verified: false },
  { id: "dates", title: "Official QHLAN 2028 dates announced", when: "TBA", detail: "Season is summer; exact dates and venue are not yet announced.", verified: false },
  { id: "quotes", title: "Flight quotes updated", when: "After dates", detail: "Dated, sourced quotes replace estimates.", verified: false },
  { id: "lodging", title: "Accommodation options researched", when: "2027–2028", detail: "Affordable shared lodging near the venue.", verified: false },
  { id: "funding", title: "Fundraising milestones reached", when: "Ongoing", detail: "Green, Yellow and Red Armor at 25%, 50% and 75%.", verified: false },
  { id: "evaluation", title: "Financial evaluation & travel planning", when: "~6 months before", detail: "Decide on bookings from what is actually raised.", verified: false },
  { id: "flights", title: "Flights booked", when: "TBA", detail: "Shown only with a booking record.", verified: false },
  { id: "stay", title: "Accommodation confirmed", when: "TBA", detail: "Shown only with a confirmation.", verified: false },
  { id: "ready", title: "Team ready to travel", when: "2028", detail: "Final preparations.", verified: false },
  { id: "arrive", title: "Arrival in Sweden", when: "2028", detail: "", verified: false },
  { id: "qhlan", title: "QHLAN participation", when: "2028", detail: "", verified: false },
  { id: "report", title: "Final financial report", when: "After event", detail: "Every euro accounted for.", verified: false },
];

export const FAQ = [
  { q: "Are you asking the community to pay for the whole trip?", a: "No. We ask for voluntary help with three things only: round-trip flights, affordable shared accommodation, and equipment rental if gear cannot be borrowed. The players pay for the rest themselves: tickets are partly covered by the goal, and food, sightseeing and personal expenses are entirely ours." },
  { q: "Why is travel so expensive for Brazilian players?", a: "Flights from São Paulo to Stockholm are costly, and the exchange rate multiplies every euro. Between work, family and everyday expenses, a trip like this is hard to fund alone." },
  { q: "Are the numbers final?", a: "No. Every figure is a preliminary estimate. Once official QHLAN 2028 dates and venue are announced, we update the full budget and keep a public history of each change." },
  { q: "How do I know my money is used properly?", a: "Our Financial Transparency page lists every expense with its status (estimated, quoted, booked, paid, cancelled), the receipt where available, and fees. Donations shown are only those verified through the payment provider." },
  { q: "What if the goal is not reached, the event is cancelled, or a player cannot travel?", a: "Our proposed policy: funds are released only as milestones are reached, and until then they stay with the payment platform or fiscal host, not with the players. If the goal is not reached by the decision checkpoint, we plan to return contributions through the platform where its rules allow (processing fees may not be recoverable). This is a draft pending organizer and host confirmation. See Financial Transparency." },
  { q: "Does reaching the goal mean the trip is guaranteed?", a: "No. Funding progress and travel booking are tracked separately. Flights count as booked only when a booking record is published." },
  { q: "Can I help without donating?", a: "Absolutely. Sharing our journey, joining the Discord and following the updates all help. There is never any pressure to give." },
];

export const SPONSOR_TYPES = [
  { title: "Partial airfare", detail: "Cash toward one or more flights.", kind: "cash" },
  { title: "Accommodation assistance", detail: "Lodging or a discount near the venue.", kind: "in-kind" },
  { title: "Equipment loans", detail: "Monitors, mice, keyboards or a PC for the event.", kind: "in-kind" },
  { title: "Travel partnerships", detail: "Travel services, baggage or transport support.", kind: "in-kind" },
];

export const CONTACT = {
  email: null as string | null, // TODO: set campaign contact e-mail
  discord: null as string | null, // TODO: set community invite
};
