import { useEffect, useState } from "react";
import { useCountUp } from "@/lib/useCountUp";
import { formatNumber, randInt } from "@/lib/random";

function Stat({
  value,
  label,
  note,
  live,
  raw,
}: {
  value: number;
  label: string;
  note?: string;
  live?: boolean;
  raw?: string;
}) {
  const { ref, value: v } = useCountUp(value);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setExtra((e) => e + randInt(1, 4)), 1800);
    return () => clearInterval(id);
  }, [live]);

  return (
    <div ref={ref} className="border-ink px-4 py-8 text-center sm:border-l-[3px] first:sm:border-l-0">
      <div className="font-display text-4xl tabular-nums leading-none sm:text-5xl">
        {raw ?? formatNumber(v + (v === value ? extra : 0))}
      </div>
      <div className="mt-3 font-display text-xs uppercase tracking-[0.2em] text-ink/70">{label}</div>
      {note && <div className="fine mt-1">{note}</div>}
    </div>
  );
}

export function Stats() {
  return (
    <section className="border-b-[3px] border-ink bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y-[3px] divide-ink sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
        <Stat value={2847391} label="Shits ordered" note="and counting (literally, look)" live />
        <Stat value={0} label="Problems solved" note="that we can prove†" />
        <Stat value={100} raw="100%" label="Satisfaction" note="we asked ourselves" />
        <Stat value={0} raw="3–5" label="Business days" note="or never. Both count." />
      </div>
    </section>
  );
}
