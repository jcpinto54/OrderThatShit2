import type { ReactNode } from "react";

type Props = {
  items: ReactNode[];
  className?: string;
  speed?: "normal" | "fast";
  gapClass?: string;
};

/** Duplicates the list so the CSS animation loops seamlessly. */
export function Marquee({ items, className = "", speed = "normal", gapClass = "gap-10" }: Props) {
  const anim = speed === "fast" ? "animate-marquee-fast" : "animate-marquee";
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className={`marquee-track ${gapClass} ${anim} hover:[animation-play-state:paused]`}>
        {[0, 1].map((dup) =>
          items.map((it, i) => (
            <span key={`${dup}-${i}`} className="shrink-0">
              {it}
            </span>
          )),
        )}
      </div>
    </div>
  );
}
