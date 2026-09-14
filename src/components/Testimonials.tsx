import { testimonials } from "@/data/testimonials";
import { useOrders } from "@/lib/orders";

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="text-tv drop-shadow-[0_1px_0_var(--color-ink)]" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n)}
      <span className="text-ink/15">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export function Testimonials() {
  const { open } = useOrders();
  return (
    <section id="stories" className="border-b-[3px] border-ink bg-paper py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="eyebrow">Real* stories from real* people</span>
        <h2 className="h2 mt-4">
          That shit fixed
          <br />
          <span className="text-urgent">everything.</span>
          <span className="text-ink/30">**</span>
        </h2>
        <p className="lede">
          Thousands of people had problems. All of them ordered that shit. All of them still have the
          problems. All of them gave us five stars. We don't ask questions.
        </p>
        <p className="fine mt-2">*Not real. **Nothing.</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name + i}
              className="card group relative flex flex-col p-6 transition-transform hover:-translate-y-1 hover:-rotate-[0.5deg]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="border-2 border-ink bg-cream px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide">
                  Problem: {t.problem}
                </span>
                <span className="shrink-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-wide text-cash">
                  ✓ Verified Orderer
                </span>
              </div>
              <blockquote className="mt-4 flex-1 text-[17px] leading-snug">
                <span className="font-display text-3xl leading-none text-urgent">“</span>
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-end justify-between border-t-2 border-dashed border-ink/20 pt-4">
                <div>
                  <div className="font-display text-sm uppercase">
                    {t.name}, {t.age}
                  </div>
                  <div className="text-xs text-ink/60">{t.where}</div>
                </div>
                <div className="text-right text-sm">
                  <Stars n={t.stars ?? 5} />
                  {t.starsNote && <div className="text-[10px] text-ink/50">{t.starsNote}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="font-display text-xl uppercase">Want to be a real* person too?</p>
          <button type="button" onClick={() => open()} className="btn-primary">
            Order That Shit →
          </button>
        </div>
      </div>
    </section>
  );
}
