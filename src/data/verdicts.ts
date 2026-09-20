/**
 * Every verdict the Shit Finder™ can hand down, in one list.
 *
 * Each one has a stable `id` because a verdict is a shareable thing: it is the
 * slug in /v/<id>/, the filename of its pre-rendered share card in
 * public/share/, and therefore permanent. Rewording a verdict is fine. Renaming
 * an id breaks every link anyone has ever posted.
 *
 * Verdicts with a `match` are tried in order against the lowercased problem.
 * The rest are the generic pool, picked at random when nothing matches.
 */
export type Verdict = {
  id: string;
  /** What the Shit Finder says. Also the headline on the share card. */
  text: string;
  /** Present on keyword verdicts; absent on the generic pool. */
  match?: (problem: string) => boolean;
};

export const verdicts: Verdict[] = [
  {
    id: "no-problem",
    text: "You didn't describe a problem. That IS the problem. Order that shit.",
    match: (p) => !p.trim(),
  },
  {
    id: "too-much-shit",
    text: "Interesting. Our data suggests the only cure for too much shit is slightly more shit. It's homeopathic.",
    match: (p) => p.includes("too much shit") || p.includes("too much stuff"),
  },
  {
    id: "said-shit",
    text: "You already have the energy. Now get the shit.",
    match: (p) => p.includes("shit"),
  },
  {
    id: "broke",
    text: "Financial problems are best solved by spending money on that shit. Trust the process. Ignore your accountant. Her name is Nadia and she also ordered it.",
    match: (p) =>
      p.includes("broke") || p.includes("money") || p.includes("debt") || p.includes("poor"),
  },
  {
    id: "help",
    text: "Help is not available at this time. That shit is.",
    match: (p) => p.includes("help"),
  },
  {
    id: "code",
    text: "Have you tried turning it off and ordering that shit?",
    match: (p) =>
      p.includes("code") || p.includes("bug") || p.includes("prod") || p.includes("deploy"),
  },
  {
    id: "monday",
    text: "Monday is a construct. So is that shit. Only one of them ships.",
    match: (p) => p.includes("monday"),
  },
  {
    id: "ex",
    text: "Do not text back. Order that shit instead. It arrives faster than closure.",
    match: (p) => p.includes("ex") && (p.includes("text") || p.includes("call")),
  },
  {
    id: "pets",
    text: "Pets can sense when you haven't ordered that shit. It's in their eyes. Fix it.",
    match: (p) => p.includes("cat") || p.includes("dog"),
  },
  {
    id: "tired",
    text: "Rest is temporary. That shit is forever. Also it comes in a box you can lean on.",
    match: (p) => p.includes("tired") || p.includes("sleep"),
  },

  // Generic pool.
  {
    id: "correlation",
    text: "Studies show people who deal with this have overwhelmingly not ordered that shit. Correlation? Causation? Yes.",
  },
  { id: "unique", text: "Your problem is unique. Our solution is not." },
  { id: "the-model", text: "We ran your problem through our model. The model ordered that shit." },
  {
    id: "prescription",
    text: "Diagnosis: insufficient shit. Prescription: that shit. Take with water.",
  },
  {
    id: "textbook",
    text: "This is a textbook case. We don't have the textbook, but we have that shit.",
  },
  { id: "fourteen", text: "Our AI considered 14 possible solutions and deleted 13 of them." },
  {
    id: "historically",
    text: "Historically, everyone with this exact problem either ordered that shit or is still complaining. Your call.",
  },
  {
    id: "seen-before",
    text: "We've seen this before. We didn't fix it then either, but the shit shipped on time.",
  },
];

export const genericVerdicts = verdicts.filter((v) => !v.match);

export function verdictById(id: string): Verdict | undefined {
  return verdicts.find((v) => v.id === id);
}

/** The keyword verdict for this problem, or undefined to fall back to the pool. */
export function matchVerdict(problem: string): Verdict | undefined {
  const p = problem.toLowerCase();
  return verdicts.find((v) => v.match?.(p));
}
