import { useEffect, useState } from "react";
import { useOrders } from "@/lib/orders";

export function StickyCTA() {
  const { open, isOpen } = useOrders();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show || isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t-[3px] border-ink bg-tv p-3 lg:hidden">
      <button type="button" onClick={() => open()} className="btn-primary w-full">
        Order That Shit →
      </button>
    </div>
  );
}
