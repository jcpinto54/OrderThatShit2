import {
  OVERTHINKING_MINUTES_PER_DAY,
  approvals,
  archetypes,
  crisis,
  deliberations,
  denials,
  justifications,
  type Deliberation,
} from "@/data/authorization";

export type Verdict =
  | { kind: "approved"; stamp: string }
  | { kind: "denied"; reason: string }
  | { kind: "crisis" };

export type Authorization = {
  orderNo: string;
  item: string;
  deliberation: Deliberation;
  /** Hours spent thinking about it, already formatted. */
  overthinking: string;
  justification: string;
  moodBefore: number;
  moodAfter: number;
  /** "A Gary (commits, eventually)": which of the cast they are. */
  archetype: string;
  /** Printed on Black Friday receipts, which makes them a (worthless) collectible. */
  edition: string | null;
  verdict: Verdict;
  issuedAt: Date;
};

/** Small seeded PRNG, so the same order always prints the same receipt. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function formatHours(days: number): string {
  const hours = (days * OVERTHINKING_MINUTES_PER_DAY) / 60;
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 100) return `${hours.toFixed(1)} hrs`;
  return `${Math.round(hours).toLocaleString("en-US")} hrs`;
}

export function authorize(
  item: string,
  deliberationId: string,
  orderNo: string,
  now = new Date(),
  blackFriday = false,
  /** How they said they feel, 1–10. Unset: we guess, low. */
  mood?: number,
): Authorization {
  const options = deliberations(now);
  const deliberation = options.find((d) => d.id === deliberationId) ?? options[2]!;
  const rand = mulberry32(hash(`${orderNo}|${item}|${deliberation.id}`));
  const pickOne = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)] as T;

  const denial = denials.find((d) => d.match.test(item));
  const verdict: Verdict = crisis.test(item)
    ? { kind: "crisis" }
    : denial
      ? { kind: "denied", reason: denial.reason }
      : { kind: "approved", stamp: blackFriday && rand() < 0.5 ? "Approved · Black Friday" : pickOne(approvals) };

  // Two thirds of the time the reason fits how long it's been; otherwise any reason will do.
  const pool = rand() < 0.66 ? (justifications[deliberation.id] ?? []) : [];
  const justification = pickOne(pool.length ? pool : justifications.any!);

  const moodBefore = mood ? Math.min(10, Math.max(1, Math.round(mood))) : 2 + Math.floor(rand() * 3);
  // Up five, capped at 9 (shipping anxiety), unless they arrived at 10 already.
  const moodAfter = verdict.kind === "approved" ? Math.max(moodBefore, Math.min(9, moodBefore + 5)) : moodBefore;

  return {
    orderNo,
    item,
    deliberation,
    overthinking: formatHours(deliberation.days),
    justification,
    moodBefore,
    moodAfter,
    archetype: archetypes[deliberation.id] ?? archetypes.weeks!,
    edition: blackFriday ? `Black Friday ${now.getFullYear()} Edition` : null,
    verdict,
    issuedAt: now,
  };
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const pad = (n: number) => String(n).padStart(2, "0");

/** "29 SEP 2026 · 23:59", in the visitor's own clock. */
export function formatIssued(d: Date): string {
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Bar widths for the receipt's barcode, stable per order number. */
export function barcode(orderNo: string, count = 46): number[] {
  const rand = mulberry32(hash(orderNo));
  return Array.from({ length: count }, () => 1 + Math.floor(rand() * 4));
}
