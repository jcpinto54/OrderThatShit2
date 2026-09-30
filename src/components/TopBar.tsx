import { useEffect, useState } from "react";
import { isBlackFridayWeek } from "@/lib/season";

const START = 4 * 60 + 59;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function TopBar() {
  const [left, setLeft] = useState(START);
  const [extended, setExtended] = useState(false);
  const [extensions, setExtensions] = useState(0);
  const [bf] = useState(isBlackFridayWeek);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setExtended(true);
          setExtensions((n) => n + 1);
          setTimeout(() => setExtended(false), 2600);
          return START;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="stripes text-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-1.5 text-center font-display text-[11px] uppercase tracking-wider sm:text-xs">
        <span className="bg-ink px-3 py-1 text-paper">
          {extended ? (
            <span className="animate-shake inline-block">
              {bf ? "⚡ Black Friday extended! (It's a lifestyle now)" : "⚡ Sale extended! (It was never going to end)"}
              {extensions > 1 ? ` ×${extensions}` : ""}
            </span>
          ) : (
            <>
              {bf ? "⚡ Black Friday: 100% off that shit (it was always free) — ends in" : "⚡ Flash sale: 50% off that shit — ends in"}{" "}
              <span className="tabular-nums text-tv">{fmt(left)}</span> ⚡
            </>
          )}
        </span>
      </div>
    </div>
  );
}
