import { useEffect, useState } from "react";
import { useOrders } from "@/lib/orders";
import { ProductBox } from "./ProductBox";
import { Starburst } from "./Starburst";
import { randInt } from "@/lib/random";

export function Hero() {
  const { open } = useOrders();
  const [stock, setStock] = useState(3);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setStock((s) => s + randInt(1, 3));
      setBump(true);
      setTimeout(() => setBump(false), 500);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden border-b-[3px] border-ink">
      <div className="halftone absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:pb-24 lg:pt-20">
        <div className="animate-slide-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">★ As seen on a screen ★</span>
            <span
              className={`inline-flex items-center gap-1 border-2 border-urgent bg-white px-2 py-1 text-xs font-bold uppercase tracking-wide text-urgent ${
                bump ? "animate-shake" : ""
              }`}
              title="The number goes up. We don't know why. Order before it changes again."
            >
              🔥 Only <span className="tabular-nums">{stock}</span> left in stock
              <span className="text-ink/40">(it keeps going up)</span>
            </span>
          </div>

          <h1 className="mt-6 font-display text-[2.9rem] uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-[4.75rem]">
            Still haven't
            <br />
            ordered
            <br />
            <span className="relative inline-block bg-tv px-2 shadow-hard-sm">that shit?</span>
          </h1>

          <p className="lede">
            Every problem you've ever had has one thing in common: you hadn't ordered that shit yet.
            Fix that in 3–5 business days.<sup>*</sup>
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => open()} className="btn-primary animate-pulse-ring text-lg">
              Order That Shit →
            </button>
            <a href="#finder" className="btn-ghost">
              I don't know which shit ↓
            </a>
          </div>

          <p className="fine mt-4">
            <sup>*</sup>Problems may persist. Shit will not. Shipping to Ohio is free because of a
            thing that happened.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink/70">
            <li>
              <span className="text-tv drop-shadow-[0_1px_0_var(--color-ink)]">★★★★★</span> 4.9/5 from
              3 reviews (2 were us)
            </li>
            <li>📦 2,847,391 shits ordered</li>
            <li>↩️ No refunds. We tried. It came back.</li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="animate-float">
            <ProductBox className="w-full drop-shadow-[0_18px_0_rgba(11,11,15,0.08)]" />
          </div>
          <Starburst size={128} rotate={-14} className="absolute -left-2 top-2 sm:left-2">
            New!
            <br />
            <span className="text-[0.6em]">(same as before)</span>
          </Starburst>
          <Starburst
            size={116}
            rotate={12}
            fill="fill-urgent"
            text="text-white"
            className="absolute -right-2 bottom-6 sm:right-4"
          >
            50% off
            <br />
            <span className="text-[0.6em]">(of what?)</span>
          </Starburst>
          <div className="absolute right-6 top-4 hidden -rotate-6 border-[3px] border-ink bg-white px-3 py-1 font-display text-xs uppercase shadow-hard-sm sm:block">
            Actual size may vary
          </div>
        </div>
      </div>
    </section>
  );
}
