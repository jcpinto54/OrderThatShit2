import { seenOn } from "@/data/misc";
import { Marquee } from "./Marquee";

export function SeenOn() {
  return (
    <section className="border-b-[3px] border-ink bg-ink py-4 text-paper">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-6">
        <span className="shrink-0 border-2 border-paper px-2 py-1 font-display text-[10px] uppercase tracking-[0.25em]">
          As seen on
        </span>
        <Marquee
          className="flex-1"
          gapClass="gap-12"
          items={seenOn.map((s) => (
            <span className="font-display text-lg uppercase tracking-wide text-paper/80">{s}</span>
          ))}
        />
      </div>
    </section>
  );
}
