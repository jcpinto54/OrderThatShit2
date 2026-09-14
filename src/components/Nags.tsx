import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { useOrders } from "@/lib/orders";
import { idleNags } from "@/data/misc";

const EXIT_KEY = "ots.exitnag";

export function Nags() {
  const { open, count, isOpen } = useOrders();
  const [nag, setNag] = useState<number | null>(null);
  const [exit, setExit] = useState(false);

  // Idle nag: 45s, then 90s later a follow-up, then a final one. Stops once they order.
  useEffect(() => {
    if (count > 0) {
      setNag(null);
      return;
    }
    const timers = [45000, 135000, 240000].map((ms, i) =>
      window.setTimeout(() => setNag(i), ms),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [count]);

  // Exit intent: once per session, desktop only.
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    let shown = false;
    try {
      shown = sessionStorage.getItem(EXIT_KEY) === "1";
    } catch {
      /* ok */
    }
    if (shown) return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 8 || shown) return;
      shown = true;
      try {
        sessionStorage.setItem(EXIT_KEY, "1");
      } catch {
        /* ok */
      }
      setExit(true);
    };
    const t = window.setTimeout(() => document.addEventListener("mouseleave", onLeave), 8000);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      {nag !== null && !isOpen && (
        <div
          role="status"
          className="fixed bottom-24 right-4 z-40 max-w-sm sm:bottom-4 [[data-cookie]_&]:sm:bottom-24 animate-slide-up border-[3px] border-ink bg-tv p-4 shadow-hard"
        >
          <div className="font-display text-xs uppercase tracking-[0.2em] text-ink/60">
            A gentle reminder
          </div>
          <p className="mt-1 text-sm font-semibold">{idleNags[nag]}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setNag(null);
                open();
              }}
              className="btn-primary !px-3 !py-1.5 !text-xs"
            >
              Order that shit
            </button>
            <button
              type="button"
              onClick={() => setNag(null)}
              className="btn-ghost !px-3 !py-1.5 !text-xs"
            >
              I'm fine
            </button>
          </div>
        </div>
      )}

      <Modal open={exit && !isOpen} onClose={() => setExit(false)} label="Wait">
        <span className="eyebrow !bg-urgent !text-white">Wait!</span>
        <h2 className="mt-4 font-display text-3xl uppercase leading-none sm:text-4xl">
          Leaving without that shit?
        </h2>
        <p className="mt-3 text-ink/75">
          Statistically, this is the exact moment most people regret. Not now. Later. In the
          shower. Thinking about the box they didn't order.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setExit(false);
              open();
            }}
            className="btn-primary"
          >
            Fine, I'll order that shit
          </button>
          <button type="button" onClick={() => setExit(false)} className="btn-ghost">
            I'll regret it later
          </button>
        </div>
      </Modal>
    </>
  );
}
