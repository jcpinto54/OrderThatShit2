const steps = [
  { n: "01", title: "You have a problem.", body: "Everyone does. Yours is probably fine. It isn't, but it's probably fine." },
  { n: "02", title: "You order that shit.", body: "The button is right there. It's always right there. It's following you." },
  { n: "03", title: "That shit arrives.", body: "3–5 business days. Or never. Both count as delivery under our terms." },
  { n: "04", title: "You still have the problem.", body: "But now you also have that shit. Experts call this “growth.” We call it Tuesday." },
];

export function HowItWorks() {
  return (
    <section className="border-b-[3px] border-ink bg-paper py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="eyebrow">How it works</span>
        <h2 className="h2 mt-4">
          Four simple steps.
          <br />
          <span className="text-ink/35">Zero simple outcomes.</span>
        </h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.n} className="card relative p-6 pt-10">
              <span className="absolute -top-4 left-4 border-[3px] border-ink bg-tv px-2 py-0.5 font-display text-sm">
                {s.n}
              </span>
              {i < steps.length - 1 && (
                <span className="absolute -right-5 top-1/2 hidden -translate-y-1/2 font-display text-2xl lg:block">
                  →
                </span>
              )}
              <h3 className="font-display text-xl uppercase leading-tight">{s.title}</h3>
              <p className="mt-3 text-ink/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
