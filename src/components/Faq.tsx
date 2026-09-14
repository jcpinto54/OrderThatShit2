import { faqs } from "@/data/faqs";

export function Faq() {
  return (
    <section id="faq" className="border-b-[3px] border-ink bg-paper py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <span className="eyebrow">FAQ</span>
        <h2 className="h2 mt-4">
          Frequently asked
          <br />
          <span className="text-ink/35">(never answered)</span>
        </h2>
        <div className="mt-10 border-t-[3px] border-ink">
          {faqs.map((f) => (
            <details key={f.q} className="faq group border-b-[3px] border-ink">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-display text-base uppercase leading-tight sm:text-lg">
                {f.q}
                <span className="faq-icon grid h-8 w-8 shrink-0 place-items-center border-2 border-ink bg-tv text-xl leading-none transition-transform">
                  +
                </span>
              </summary>
              <p className="pb-6 pr-12 text-base text-ink/80 sm:text-lg">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
