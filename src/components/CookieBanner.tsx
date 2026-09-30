import { useEffect, useState } from "react";
import { useOrders } from "@/lib/orders";

const KEY = "ots.cookies";

export function CookieBanner() {
  const { open } = useOrders();
  const [show, setShow] = useState(false);

  // Barge in once they scroll (or after a while), not on arrival: the first screen, the one
  // people screenshot and screen-record, should be the joke and the order box, not a banner.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(KEY) === "1";
    } catch {
      /* show it */
    }
    if (dismissed) return;
    const appear = () => setShow(true);
    const onScroll = () => {
      if (window.scrollY > 400) appear();
    };
    const t = window.setTimeout(appear, 10_000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lets the purchase ticker and idle nag sit above the bar while it's visible.
  useEffect(() => {
    if (show) document.documentElement.dataset.cookie = "1";
    else delete document.documentElement.dataset.cookie;
    return () => {
      delete document.documentElement.dataset.cookie;
    };
  }, [show]);

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ok */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-4 bottom-20 z-[45] animate-slide-up border-[3px] border-ink bg-white p-4 shadow-hard sm:inset-x-0 sm:bottom-0 sm:flex sm:items-center sm:justify-center sm:gap-5 sm:border-x-0 sm:border-b-0 sm:px-6 sm:py-3 sm:shadow-none"
    >
      <p className="text-sm sm:max-w-2xl">
        🍪 <strong>We use cookies.</strong> We also use that shit. It's all connected. We don't
        actually track you, we just wanted a banner like the big sites have.
      </p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => {
            dismiss();
            open();
          }}
          className="btn-primary !px-3 !py-1.5 !text-xs"
        >
          Accept &amp; order that shit
        </button>
        <button type="button" onClick={dismiss} className="btn-ghost !px-3 !py-1.5 !text-xs">
          Decline (still order it)
        </button>
      </div>
    </div>
  );
}
