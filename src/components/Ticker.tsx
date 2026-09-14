import { useEffect, useState } from "react";
import { pick, randInt } from "@/lib/random";
import { tickerItems, tickerNames, tickerPlaces } from "@/data/misc";

type Toast = { id: number; name: string; place: string; item: string; ago: string };

const agos = ["just now", "2 seconds ago", "just now", "1 second ago", "just now", "moments ago"];

export function Ticker() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    let hide: number | undefined;
    let next: number | undefined;
    const show = () => {
      setToast({
        id: Date.now(),
        name: pick(tickerNames),
        place: pick(tickerPlaces),
        item: pick(tickerItems),
        ago: pick(agos),
      });
      hide = window.setTimeout(() => setToast(null), 5200);
      next = window.setTimeout(show, randInt(8000, 15000));
    };
    next = window.setTimeout(show, 6000);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(next);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      aria-hidden="true"
      className="fixed bottom-4 left-4 z-40 hidden [[data-cookie]_&]:bottom-24 max-w-xs animate-slide-in-left items-start gap-3 border-[3px] border-ink bg-white p-3 shadow-hard sm:flex"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center border-2 border-ink bg-tv text-lg">📦</div>
      <div className="text-sm leading-snug">
        <div className="font-bold">
          {toast.name} from {toast.place}
        </div>
        <div className="text-ink/75">
          just ordered <span className="font-semibold text-ink">“{toast.item}”</span>
        </div>
        <div className="mt-1 text-[11px] uppercase tracking-wide text-cash">
          ● Verified · {toast.ago}
        </div>
      </div>
    </div>
  );
}
