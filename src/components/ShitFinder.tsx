import { useEffect, useRef, useState, type FormEvent } from "react";
import { finderSteps } from "@/data/misc";
import { genericVerdicts, matchVerdict, verdictById, type Verdict } from "@/data/verdicts";
import { pick, shuffle } from "@/lib/random";
import { useOrders } from "@/lib/orders";
import { readSharedLanding, shareLink, verdictShareUrl } from "@/lib/share";

const chips = [
  "I'm tired",
  "My code doesn't work",
  "I'm broke",
  "My ex texted me",
  "Existential dread",
  "My cat hates me",
  "It's Monday",
  "I have too much shit",
];

type Phase = "idle" | "thinking" | "done";

export function ShitFinder() {
  const { open } = useOrders();
  const [problem, setProblem] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [steps, setSteps] = useState<string[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [analysed, setAnalysed] = useState("");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const run = (text: string) => {
    const chosen = shuffle(finderSteps).slice(0, 4);
    setAnalysed(text);
    setSteps(chosen);
    setStepIdx(0);
    setVerdict(matchVerdict(text) ?? pick(genericVerdicts));
    setShared(false);
    setCopied(false);
    setPhase("thinking");
  };

  // Someone followed a /v/<id>/ link: show them that verdict straight away,
  // without making them sit through the analysis they already know is fake.
  useEffect(() => {
    const landing = readSharedLanding();
    if (landing?.kind !== "verdict") return;
    const v = verdictById(landing.id);
    if (!v) return;
    const chosen = shuffle(finderSteps).slice(0, 4);
    setAnalysed(landing.problem);
    setProblem(landing.problem);
    setSteps(chosen);
    setStepIdx(chosen.length);
    setVerdict(v);
    setShared(true);
    setPhase("done");
  }, []);

  useEffect(() => {
    if (phase !== "thinking") return;
    if (stepIdx >= steps.length) {
      const t = setTimeout(() => setPhase("done"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIdx((i) => i + 1), 650 + Math.random() * 350);
    return () => clearTimeout(t);
  }, [phase, stepIdx, steps.length]);

  // A visitor who typed a problem is already looking at the panel, so nudge it.
  // A visitor who arrived on a shared link is at the top of the page and has to
  // be taken to the verdict they were sent.
  useEffect(() => {
    if (phase !== "done") return;
    resultRef.current?.scrollIntoView({
      block: shared ? "center" : "nearest",
      behavior: shared ? "auto" : "smooth",
    });
  }, [phase, shared]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(problem);
  };

  const onShare = async () => {
    if (!verdict) return;
    const toClipboard = await shareLink(
      `The Shit Finder™ looked at my problem and said: “${verdict.text}”`,
      verdictShareUrl(verdict.id, analysed),
    );
    if (!toClipboard) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const label = analysed.trim() ? `“${analysed.trim()}”` : "(nothing)";

  return (
    <section id="finder" className="border-b-[3px] border-ink bg-ink py-20 text-paper">
      <div className="grain absolute inset-0 -z-10" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <span className="eyebrow">Powered by AI (a guy)</span>
        <h2 className="h2 mt-4">
          Not sure which shit
          <br />
          <span className="text-tv">to order?</span>
        </h2>
        <p className="lede text-paper/70">
          Describe your problem. Our proprietary Shit Finder™ will analyze it against billions of
          data points and recommend the appropriate shit. Results are final.
        </p>

        <form onSubmit={onSubmit} className="mt-10">
          <label htmlFor="problem" className="sr-only">
            Describe your problem
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. I'm tired and my cat has stopped respecting me"
              maxLength={140}
              className="min-w-0 flex-1 border-[3px] border-paper bg-ink-2 px-4 py-3 text-lg text-paper placeholder:text-paper/35 focus:border-tv focus:outline-none"
            />
            <button type="submit" className="btn-tv" disabled={phase === "thinking"}>
              {phase === "thinking" ? "Analyzing…" : "Analyze my problem"}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setProblem(c);
                  run(c);
                }}
                className="border-2 border-paper/30 px-3 py-1 text-sm text-paper/80 transition hover:border-tv hover:text-tv"
              >
                {c}
              </button>
            ))}
          </div>
        </form>

        {phase !== "idle" && (
          <div
            ref={resultRef}
            className="mt-10 border-[3px] border-paper bg-ink-2 p-6 font-mono text-sm shadow-hard-tv sm:p-8"
            aria-live="polite"
          >
            <div className="mb-4 flex items-center gap-2 text-paper/50">
              <span className="h-2.5 w-2.5 rounded-full bg-urgent" />
              <span className="h-2.5 w-2.5 rounded-full bg-tv" />
              <span className="h-2.5 w-2.5 rounded-full bg-cash" />
              <span className="ml-2">shitfinder v4.2.0 — problem: {label}</span>
            </div>
            <ul className="space-y-1.5">
              {steps.slice(0, Math.min(stepIdx + 1, steps.length)).map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className={i < stepIdx ? "text-cash" : "animate-blink text-tv"}>
                    {i < stepIdx ? "✔" : "▶"}
                  </span>
                  <span className={i < stepIdx ? "text-paper/60" : "text-paper"}>{s}</span>
                </li>
              ))}
            </ul>

            {phase === "done" && verdict && (
              <div className="mt-6 animate-pop border-t-2 border-dashed border-paper/30 pt-6 font-sans">
                <div className="text-xs uppercase tracking-[0.25em] text-paper/50">
                  {shared ? "Somebody sent you this verdict" : "Recommended solution"} · confidence
                  100%
                </div>
                <div className="mt-2 font-display text-3xl uppercase leading-none text-tv sm:text-4xl">
                  Order that shit.
                </div>
                <p className="mt-4 max-w-prose text-base text-paper/80">{verdict.text}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => open(analysed.trim())} className="btn-primary">
                    Order that shit for this →
                  </button>
                  <button type="button" onClick={onShare} className="btn-ghost-light">
                    {copied ? "Copied. Go ruin someone's day." : "Share this verdict"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhase("idle");
                      setProblem("");
                      setShared(false);
                    }}
                    className="btn-ghost-light"
                  >
                    I have another problem
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
