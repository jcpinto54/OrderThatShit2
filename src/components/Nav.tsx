import { useEffect, useRef, useState } from "react";
import { useOrders } from "@/lib/orders";

const links = [
  { href: "#stories", label: "Stories" },
  { href: "#finder", label: "Shit Finder™" },
  { href: "#science", label: "Science" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const { open, count } = useOrders();
  const [scrolled, setScrolled] = useState(false);
  const [egg, setEgg] = useState<string | null>(null);
  const clicks = useRef(0);
  const eggTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLogo = () => {
    clicks.current += 1;
    window.clearTimeout(eggTimer.current);
    eggTimer.current = window.setTimeout(() => (clicks.current = 0), 1500);
    if (clicks.current === 5) {
      clicks.current = 0;
      setEgg("You found the secret. The secret is: order that shit.");
      window.setTimeout(() => setEgg(null), 4000);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b-[3px] border-ink bg-paper/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_6px_0_0_var(--color-ink)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#top"
          onClick={onLogo}
          className="group flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-base uppercase leading-none tracking-tight sm:text-xl"
        >
          <span className="grid h-8 w-8 place-items-center border-2 border-ink bg-tv text-sm transition group-hover:rotate-6 group-hover:bg-urgent group-hover:text-white">
            !
          </span>
          <span>
            Order That Shit<sup className="text-[9px]">™</sup>
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-ink/70 underline-offset-4 transition hover:text-ink hover:underline"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {count > 0 && (
            <span
              className="hidden border-2 border-ink bg-cash px-2 py-1 font-display text-[11px] uppercase tracking-wide text-ink sm:inline-block"
              title="Times you have ordered that shit. Still not fixed? Order again."
            >
              Ordered ×{count}
            </span>
          )}
          <button type="button" onClick={() => open()} className="btn-primary whitespace-nowrap !px-4 !py-2 !text-sm">
            <span className="sm:hidden">Order →</span>
            <span className="hidden sm:inline">Order That Shit</span>
          </button>
        </div>
      </div>

      {egg && (
        <div
          role="status"
          className="absolute left-1/2 top-full mt-3 -translate-x-1/2 animate-pop border-[3px] border-ink bg-tv px-4 py-2 font-display text-xs uppercase shadow-hard"
        >
          {egg}
        </div>
      )}
    </header>
  );
}
