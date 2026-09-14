import { useState, type FormEvent } from "react";
import { useOrders } from "@/lib/orders";

const columns = [
  { title: "Product", links: ["That Shit", "More Shit", "Other Shit (soon)", "The Sticker"] },
  { title: "Company", links: ["About (we're a website)", "Careers (order that shit)", "Press (please)", "Investors (please please)"] },
  { title: "Legal", links: ["Terms (no)", "Privacy (we know)", "Cookies (we ate them)", "Returns (lol)"] },
];

export function Footer() {
  const { open } = useOrders();
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubbed(true);
    setEmail("");
  };

  return (
    <footer className="bg-ink pb-28 pt-16 text-paper lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl uppercase">
              Order That Shit<sup className="text-xs">™</sup>
            </div>
            <p className="mt-3 max-w-sm text-sm text-paper/60">
              The #1 solution to whatever it is. Since whenever. Headquartered in a box.
            </p>
            <form onSubmit={onSubmit} className="mt-6">
              <label htmlFor="email" className="font-display text-xs uppercase tracking-[0.2em] text-tv">
                Get shit in your inbox
              </label>
              {subbed ? (
                <p className="mt-2 animate-pop border-2 border-cash px-3 py-2 text-sm text-cash">
                  Subscribed. Expect shit. (Nothing will be sent. That is the shit.)
                </p>
              ) : (
                <div className="mt-2 flex">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@somewhere-with-problems.com"
                    className="min-w-0 flex-1 border-[3px] border-r-0 border-paper bg-ink-2 px-3 py-2 text-sm text-paper placeholder:text-paper/30 focus:border-tv focus:outline-none"
                  />
                  <button type="submit" className="btn-tv !py-2 !text-xs">
                    Subscribe
                  </button>
                </div>
              )}
            </form>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <div className="font-display text-xs uppercase tracking-[0.2em] text-tv">{c.title}</div>
              <ul className="mt-4 space-y-2 text-sm text-paper/70">
                {c.links.map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => open()}
                      className="text-left underline-offset-4 transition hover:text-paper hover:underline"
                      title="Every link on this site goes to the same place."
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-paper/15 pt-8">
          <p className="text-[11px] leading-relaxed text-paper/40">
            <strong className="text-paper/60">Disclaimer:</strong> That Shit™ is not a product,
            service, medicine, cure, financial instrument, religion, or emotional support animal.
            Results not typical. Results not atypical. Results not. Ordering that shit does not
            constitute ordering that shit in jurisdictions where that shit is regulated, which is
            none, which is concerning. Testimonials are fictional; the feelings are real. Stock
            counts go up because we don't know how numbers work. The flash sale has been ending for
            four years. No money changes hands on this website. Nothing ships. Nothing has ever
            shipped. If something arrived, that wasn't us, and you should probably open it. Any
            resemblance to actual products, living or dead, is coincidental and, frankly, on them.
            orderthatshit.com is a parody website. The FDA has been notified.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-paper/50">
            <span>© {new Date().getFullYear()} Order That Shit LLC. Limited Liability. Unlimited Shit.</span>
            <button type="button" onClick={() => open()} className="font-display uppercase tracking-wider text-tv hover:underline">
              Order that shit ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
