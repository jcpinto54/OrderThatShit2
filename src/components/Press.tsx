import { press, trustedBy } from "@/data/misc";
import { Marquee } from "./Marquee";

export function Press() {
  return (
    <section className="border-b-[3px] border-ink bg-paper py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="font-display text-center text-xs uppercase tracking-[0.3em] text-ink/50">
          What the press is saying
        </div>
      </div>
      <Marquee
        className="mt-6"
        gapClass="gap-8"
        items={press.map((p) => (
          <span className="inline-flex items-center gap-3 border-[3px] border-ink bg-white px-5 py-3 shadow-hard-sm">
            <span className="font-display text-lg">“{p.quote}”</span>
            <span className="text-xs font-bold uppercase tracking-wide text-ink/50">— {p.who}</span>
          </span>
        ))}
      />
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <div className="font-display text-center text-xs uppercase tracking-[0.3em] text-ink/50">
          Trusted by
        </div>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-display text-base uppercase text-ink/40 sm:text-lg">
          {trustedBy.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="fine mt-3 text-center">*Not Actually, Sorry, Apologies.</p>
      </div>
    </section>
  );
}
