import { tiers } from "@/data/pricing";
import { useOrders } from "@/lib/orders";

export function Pricing() {
  const { open } = useOrders();
  return (
    <section id="pricing" className="border-b-[3px] border-ink bg-paper py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="eyebrow">Pricing</span>
        <h2 className="h2 mt-4">
          There's no free tier.
          <br />
          <span className="text-ink/35">There's barely a paid one.</span>
        </h2>
        <p className="lede">
          All plans include that shit. No plan includes a solution. Prices shown are after our
          permanent 50% flash sale, which ends in about five minutes forever.
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`card relative flex flex-col p-7 ${
                t.featured ? "bg-tv lg:-translate-y-4 lg:scale-[1.03]" : "bg-white"
              }`}
            >
              {t.badge && (
                <span className="absolute -top-4 right-6 -rotate-3 border-[3px] border-ink bg-urgent px-3 py-1 font-display text-xs uppercase text-white shadow-hard-sm">
                  {t.badge}
                </span>
              )}
              <h3 className="font-display text-2xl uppercase">{t.name}</h3>
              <p className="mt-1 text-sm text-ink/70">{t.tagline}</p>
              <div className="mt-6 flex items-end gap-2">
                {t.wasPrice && <span className="strike mb-1 text-lg text-ink/50">{t.wasPrice}</span>}
                <span className="font-display text-5xl leading-none">{t.price}</span>
                {t.period && <span className="mb-1 font-bold text-ink/60">{t.period}</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="font-bold text-cash">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => open(t.name)}
                className={`mt-8 w-full ${t.featured ? "btn-primary" : "btn-ghost"}`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="card mt-8 flex flex-col items-start justify-between gap-4 bg-ink p-6 text-paper sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-xl uppercase">Enterprise Shit</div>
            <p className="mt-1 text-sm text-paper/70">
              We'll order that shit on behalf of your entire organization. Procurement loves us.
              SOC 2 pending (we sent them a box).
            </p>
          </div>
          <button type="button" onClick={() => open("Enterprise Shit for my whole company")} className="btn-tv shrink-0">
            Contact Sales
          </button>
        </div>
        <p className="fine mt-4">
          Prices in USD, or vibes. No refunds: we tried once and the shit came back. Cancellation of
          All The Shit requires a notarized letter, a duel, and the duel must be won by the shit.
        </p>
      </div>
    </section>
  );
}
