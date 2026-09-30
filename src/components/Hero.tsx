import { useEffect, useState, type FormEvent } from "react";
import { useOrders } from "@/lib/orders";
import { ProductBox } from "./ProductBox";
import { Starburst } from "./Starburst";
import { pick, randInt } from "@/lib/random";
import { orderPlaceholders } from "@/data/misc";
import { isBlackFridayWeek } from "@/lib/season";

export function Hero() {
  const { open } = useOrders();
  const [stock, setStock] = useState(3);
  const [bump, setBump] = useState(false);
  const [want, setWant] = useState("");
  const [placeholder, setPlaceholder] = useState("those shoes");
  const [bf] = useState(isBlackFridayWeek);

  useEffect(() => {
    const id = setInterval(() => setPlaceholder(pick(orderPlaceholders)), 2200);
    return () => clearInterval(id);
  }, []);

  const start = (e: FormEvent) => {
    e.preventDefault();
    open(want.trim());
  };

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
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 sm:pt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:pb-24 lg:pt-20">
        <div className="animate-slide-up">
          <div className="flex flex-wrap items-center gap-3">
            {bf ? (
              <span className="eyebrow !bg-ink !text-tv">★ Black Friday edition ★</span>
            ) : (
              <span className="eyebrow hidden sm:inline-block">★ As seen on a screen ★</span>
            )}
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

          <h1 className="mt-5 font-display text-[2.6rem] uppercase leading-[0.9] tracking-tight sm:mt-6 sm:text-7xl lg:text-[4.75rem]">
            Still haven't
            <br />
            ordered
            <br />
            <span className="relative inline-block bg-tv px-2 shadow-hard-sm">that shit?</span>
          </h1>

          <p className="lede">
            Every problem you've ever had has one thing in common: you hadn't ordered that shit yet.
            It won't fix the problem. It will fix how you feel about it, for 3–5 business days.
            <sup>*</sup>
          </p>

          <form onSubmit={start} className="mt-6 max-w-xl sm:mt-8">
            <label htmlFor="hero-item" className="text-sm font-bold">
              That thing you keep thinking about ordering:
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="hero-item"
                value={want}
                onChange={(e) => setWant(e.target.value)}
                placeholder={placeholder}
                maxLength={80}
                autoComplete="off"
                className="min-w-0 flex-1 border-[3px] border-ink bg-white px-4 py-3 text-lg shadow-hard-sm focus:border-urgent focus:outline-none"
              />
              <button type="submit" className="btn-primary animate-pulse-ring text-lg">
                Order That Shit →
              </button>
            </div>
          </form>
          <a href="#finder" className="mt-4 inline-block text-sm font-bold underline decoration-tv decoration-4 underline-offset-4">
            I don't know which shit ↓
          </a>

          <p className="fine mt-4 max-w-xl">
            <sup>*</sup>This part is real: making a purchase decision measurably reduces sadness, even
            when nothing gets bought (Rick, Pereira &amp; Burson, 2014). So this checkout charges
            nothing and still works. Everything else on this page is made up. Shipping to Ohio is
            free because of a thing that happened.
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
