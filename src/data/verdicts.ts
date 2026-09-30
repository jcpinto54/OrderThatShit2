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
    match: (p) => /\btoo much (shit|stuff)\b/.test(p),
  },
  {
    id: "said-shit",
    text: "You already have the energy. Now get the shit.",
    match: (p) => p.includes("shit"),
  },
  {
    id: "broke",
    // Real money trouble is close and severe, so the joke turns on us, not on them.
    text: "Good news: that shit is free, because it doesn't exist. Cheapest fix you'll find all Black Friday. Your accountant, Nadia, is thrilled.",
    match: (p) => /\b(broke|money|debts?|poor)\b/.test(p),
  },
  {
    id: "help",
    text: "Help is not available at this time. That shit is.",
    match: (p) => /\bhelp\b/.test(p),
  },
  {
    id: "code",
    text: "Have you tried turning it off and ordering that shit?",
    match: (p) => /\b(code|coding|bugs?|prod|production|deploy\w*|outage|pager)\b/.test(p),
  },
  {
    id: "monday",
    text: "Monday is a construct. So is that shit. Only one of them ships.",
    match: (p) => /\bmondays?\b/.test(p),
  },
  {
    id: "ex",
    text: "Do not text back. Order that shit instead. It arrives faster than closure.",
    // Whole words: "text" contains "ex", and a boss who texted is not an ex.
    match: (p) => /\b(my ex|ex|ex-\w+)\b/.test(p) && /\b(text\w*|call\w*|messag\w*|dm\w*)\b/.test(p),
  },
  {
    id: "pets",
    text: "Pets can sense when you haven't ordered that shit. It's in their eyes. Fix it.",
    // Whole words: "vacation" and "education" contain "cat".
    match: (p) => /\b(cats?|kitt(y|en|ens|ies)|dogs?|pupp(y|ies))\b/.test(p),
  },
  {
    id: "meetings",
    text: "This meeting could have been an order. Order that shit, then block out \"focus time\" to wait for it.",
    match: (p) => /\b(meetings?|stand-?ups?|calendar|zoom calls?)\b/.test(p),
  },
  {
    id: "inbox",
    text: "4,000 unread emails. One order. Guess which one gets a tracking number.",
    match: (p) => /\b(inbox|e-?mails?|unread)\b/.test(p),
  },
  {
    id: "group-chat",
    text: "Leave the group chat on read. Order that shit. Come back with news.",
    match: (p) => /\b(group ?chats?)\b/.test(p),
  },
  {
    id: "sunday",
    text: "The Sunday scaries are just anticipation with bad PR. Order that shit and give it somewhere to go.",
    match: (p) => /\b(sunday scaries|sundays?)\b/.test(p),
  },
  {
    id: "doomscrolling",
    text: "You've scrolled past 400 things you didn't order. Order the one you actually wanted.",
    match: (p) => /\b(doom ?scroll\w*|scrolling)\b/.test(p),
  },
  {
    id: "nothing-to-wear",
    text: "You have plenty to wear. What you don't have is that shit.",
    match: (p) => /\bnothing to wear\b/.test(p),
  },
  {
    id: "black-friday",
    text: "Black Friday is for things you don't want. We only authorize the one thing you do. Order that shit.",
    match: (p) => /\b(black friday|cyber monday)\b/.test(p),
  },
  {
    id: "tired",
    text: "Rest is temporary. That shit is forever. Also it comes in a box you can lean on.",
    match: (p) => /\b(tired|sleep\w*|exhausted|insomnia)\b/.test(p),
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
