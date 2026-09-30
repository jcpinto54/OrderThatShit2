/**
 * Copy for the Order Authorization: the receipt the checkout prints.
 *
 * The joke is still that ordering that shit fixes nothing. The receipt adds the part that is
 * true: deciding to finally order the thing makes people feel better, and what most of them
 * want is permission. So it grants it, officially, with a reason. The reasoning is in
 * docs/research/03-retail-therapy-and-permission.md.
 */

export type Deliberation = {
  id: string;
  /** Chip label in the order form. */
  label: string;
  /** How long it has been in their head, as printed on the receipt. */
  said: string;
  /** Days of deliberation, for the overthinking maths. */
  days: number;
};

const SINCE_2019 = Date.UTC(2019, 5, 1);

export function deliberations(now = new Date()): Deliberation[] {
  const sinceDays = Math.round((now.getTime() - SINCE_2019) / 86_400_000);
  return [
    { id: "now", label: "Just now", said: "4 minutes", days: 4 / 1440 },
    { id: "days", label: "A few days", said: "4 days", days: 4 },
    { id: "weeks", label: "Weeks", said: "3 weeks", days: 23 },
    { id: "months", label: "Months", said: "4 months", days: 130 },
    { id: "forever", label: "Since 2019", said: "since 2019", days: sinceDays },
  ];
}

/**
 * Which of the cast you are, by how long it's been in your head. Identity is what people share,
 * and each one is a character with a clip on the site.
 */
export const archetypes: Record<string, string> = {
  now: "A Linda (2 a.m. energy)",
  days: "A Marcus (decisive under fire)",
  weeks: "A Priya (tracking-page devotee)",
  months: "A Gary (commits, eventually)",
  forever: "A Walter (done waiting for sales)",
};

/** Minutes a day spent thinking about it. Measured by us, on us. */
export const OVERTHINKING_MINUTES_PER_DAY = 11;

/**
 * The official reason. Keyed by how long it's been in their head, plus some for anyone.
 * Reasons are about effort, excellence, restraint or a practical alibi, never money: in the
 * research, a reason made indulging guilt-free, and mentioning the money undid it
 * (docs/research/03-retail-therapy-and-permission.md).
 */
export const justifications: Record<string, string[]> = {
  now: [
    "Impulse is just intuition in a hurry.",
    "Your gut said yes. Your gut is a professional.",
  ],
  days: [
    "You slept on it. Twice. That's due diligence.",
    "You did the research. All of it. Some of it twice.",
  ],
  weeks: [
    "You've already paid for it in overthinking.",
    "It's been in your cart so long it gets mail there.",
  ],
  months: [
    "Months of saying no to yourself. That's discipline, and discipline gets a reward.",
    "It has survived three sales and your better judgement.",
  ],
  forever: [
    "It's not a purchase anymore. It's a promise to 2019 you.",
    "2019 you is watching. Don't let them down.",
  ],
  any: [
    "You've earned it. We looked at your week.",
    "Future you already said yes. We asked.",
    "You survived a Monday. Several, actually.",
    "It's basically a tool. Tools are responsible.",
    "You were excellent at something today. We don't know what. It counts.",
    "You've said no to yourself 41 times this month. Number 42 gets the day off.",
    "Your inner child asked nicely.",
  ],
};

/** Things we won't approve. The site sells nothing, but it can still have a conscience. */
export const denials: { match: RegExp; reason: string }[] = [
  {
    match: /\b(rent|mortgage|debts?|loans?|overdraft|bills|can'?t afford|payday)\b/i,
    reason: "Rent first, shit second. We'll hold your spot.",
  },
  { match: /\b(crypto|nft|bitcoin|memecoin|shitcoin)\b/i, reason: "Even we have standards." },
];

/** Crisis wording is handled in src/data/care.ts, shared with the Shit Finder. */
export { crisis } from "./care";

export const approvals = [
  "Approved",
  "Approved",
  "Approved · expedited",
  "Pre-approved by future you",
  "Approved (obviously)",
];

/**
 * A closing line under the receipt. Deciding is the part that makes people feel better (the
 * real study on the page), so the site says so: buying the real thing is optional.
 * Impulses get told to sleep on it.
 */
export const nudges: Record<string, string> = {
  now: "Four minutes is an impulse, not a decision. Sleep on it. If you still want it tomorrow, it's approved.",
  days: "Decision made. That's the part that feels good. Buying it is optional; the relief isn't.",
  weeks: "Deciding was the hard part, and you just did it. Buying it is optional. Our blessing isn't.",
  months: "Months of deliberation, closed. Whether you actually buy it is up to you. You're allowed to want things.",
  forever: "Since 2019. It's decided. Whether you buy it is between you and 2019 you.",
};

export const authorizationSteps = [
  "Consulting your inner child… they said yes…",
  "Checking your bank balance… looking away…",
  "Calculating cost per use…",
  "Asking future you… they're thrilled…",
  "Notifying Ohio…",
  "Printing a receipt. Losing the receipt…",
  "Stamping it…",
  "Waking up the warehouse…",
];
