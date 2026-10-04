import { useEffect, useRef, useState } from "react";
import { adVideo, commercials, videos, type VideoTestimonial } from "@/data/videos";
import { isBlackFridayWeek } from "@/lib/season";
import { Modal } from "./Modal";
import { useOrders } from "@/lib/orders";

function FakeVideo({ v }: { v: VideoTestimonial }) {
  const [playing, setPlaying] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setI((n) => (n + 1) % v.captions.length), 1500);
    return () => clearInterval(id);
  }, [playing, v.captions.length]);

  return (
    <button
      type="button"
      onClick={() => setPlaying((p) => !p)}
      aria-pressed={playing}
      aria-label={`${playing ? "Pause" : "Play"} testimonial from ${v.name}`}
      className="group relative block aspect-video w-full overflow-hidden border-b-[3px] border-ink bg-ink text-left"
    >
      <div
        className={`absolute inset-0 ${playing ? "animate-ken-burns" : ""}`}
        style={{
          background: `radial-gradient(120% 90% at 30% 20%, hsl(${v.hue} 70% 55%), hsl(${v.hue} 60% 22%) 60%, #0b0b0f)`,
        }}
      />
      <div className="grain absolute inset-0 opacity-60" />
      {/* a person-shaped blob, because we have no person */}
      <div className="absolute bottom-0 left-1/2 h-[70%] w-[38%] -translate-x-1/2 rounded-t-[45%] bg-ink/60" />
      <div className="absolute bottom-[52%] left-1/2 h-[30%] w-[20%] -translate-x-1/2 rounded-full bg-ink/60" />

      {playing ? (
        <div className="absolute inset-x-4 bottom-4 text-center">
          <span
            key={i}
            className="inline-block animate-pop bg-ink/85 px-3 py-1 font-display text-sm uppercase text-tv sm:text-base"
          >
            {v.captions[i]}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center border-[3px] border-paper bg-urgent pl-1 text-2xl text-white shadow-hard-sm transition group-hover:scale-110">
            ▶
          </span>
        </div>
      )}
      <span className="absolute right-3 top-3 bg-ink/80 px-2 py-0.5 font-mono text-xs text-paper">
        {playing ? "● LIVE-ISH" : v.duration}
      </span>
    </button>
  );
}

function RealVideo({ v }: { v: VideoTestimonial }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden border-b-[3px] border-ink bg-ink">
      <video
        ref={ref}
        src={v.src}
        poster={v.poster}
        controls={started}
        playsInline
        preload="none"
        onEnded={() => setStarted(false)}
        className="h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            // play() rejects if the browser can't decode the clip; fall back to the native controls.
            ref.current?.play().catch(() => undefined);
          }}
          aria-label={`Play testimonial from ${v.name}`}
          className="group absolute inset-0 grid place-items-center"
        >
          <span className="grid h-16 w-16 place-items-center border-[3px] border-paper bg-urgent pl-1 text-2xl text-white shadow-hard-sm transition group-hover:scale-110">
            ▶
          </span>
          <span className="absolute right-3 top-3 bg-ink/80 px-2 py-0.5 font-mono text-xs text-paper">
            {v.duration}
          </span>
        </button>
      )}
    </div>
  );
}

function TheAd({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { open: order } = useOrders();
  const [phase, setPhase] = useState<"skip" | "over">("skip");
  const AD_SECONDS = adVideo ? 8 : 5;
  const [n, setN] = useState(AD_SECONDS);

  useEffect(() => {
    if (!open) {
      setPhase("skip");
      setN(AD_SECONDS);
      return;
    }
    const id = setInterval(() => {
      setN((x) => {
        if (x <= 1) {
          setPhase("over");
          return 0;
        }
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [open, AD_SECONDS]);

  return (
    <Modal open={open} onClose={onClose} label="The ad" size="lg" tone="ink">
      {phase === "skip" ? (
        <div className="grid min-h-[40vh] place-items-center text-center">
          {adVideo ? (
            <div className="w-full">
              <video
                src={adVideo.src}
                poster={adVideo.poster}
                autoPlay
                playsInline
                className="aspect-video w-full border-[3px] border-paper bg-ink object-cover"
              />
              <div className="mt-4 font-mono text-sm text-paper/60">Ad · 2:14:00 · Skip in {n}…</div>
            </div>
          ) : (
            <div>
              <div className="animate-flash font-display text-5xl uppercase leading-none sm:text-8xl">
                Order
                <br />
                that
                <br />
                shit
              </div>
              <div className="mt-6 font-mono text-sm text-paper/60">Ad · 2:14:00 · Skip in {n}…</div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid min-h-[40vh] place-items-center text-center">
          <div className="animate-pop">
            <div className="font-display text-3xl uppercase">That was the ad.</div>
            <p className="mt-3 text-paper/70">
              You watched the important part. The remaining 2 hours, 13 minutes and {60 - AD_SECONDS}{" "}
              seconds are just that, but slower.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  order();
                }}
                className="btn-primary"
              >
                It worked. Order that shit →
              </button>
              <button type="button" onClick={onClose} className="btn-ghost-light">
                I'm immune to advertising
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** A vertical clip: a poster in the row, full-height in a modal when tapped. */
function Reel({ v }: { v: VideoTestimonial }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play ${v.title} (${v.name})`}
        className="group relative block aspect-[9/16] w-full overflow-hidden border-b-[3px] border-ink bg-ink"
      >
        <img src={v.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
        {/* Low in the frame, so the button never sits on a face. */}
        <span className="absolute inset-x-0 bottom-5 flex justify-center">
          <span className="grid h-14 w-14 place-items-center border-[3px] border-paper bg-urgent pl-1 text-xl text-white shadow-hard-sm transition group-hover:scale-110">
            ▶
          </span>
        </span>
        <span className="absolute right-2 top-2 bg-ink/80 px-2 py-0.5 font-mono text-xs text-paper">
          {v.duration}
        </span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label={v.name} tone="ink">
        <video
          src={v.src}
          poster={v.poster}
          autoPlay
          controls
          playsInline
          className="mx-auto aspect-[9/16] max-h-[78vh] w-auto max-w-full border-[3px] border-paper bg-ink"
        />
        <div className="mt-3 text-center">
          <div className="font-display text-sm uppercase">{v.title}</div>
          <div className="text-xs text-paper/60">{v.name}</div>
        </div>
      </Modal>
    </>
  );
}

/** A swipeable row of vertical clips on phones, a grid on bigger screens. */
function ReelRow({ title, items, columns }: { title: React.ReactNode; items: VideoTestimonial[]; columns: string }) {
  return (
    <div>
      <h3 className="font-display text-2xl uppercase leading-none sm:text-3xl">{title}</h3>
      <ul className={`-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 ${columns}`}>
        {items.map((v) => (
          <li
            key={v.id}
            className="card w-[58vw] max-w-[240px] shrink-0 snap-start overflow-hidden bg-paper text-ink sm:w-auto sm:max-w-none"
          >
            <Reel v={v} />
            <div className="p-3">
              <div className="font-display text-xs uppercase leading-tight">{v.title}</div>
              <div className="mt-1 text-[11px] text-ink/60">{v.name}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Videos() {
  const [adOpen, setAdOpen] = useState(false);
  const wide = videos.filter((v) => v.aspect !== "9:16");
  const tall = videos.filter((v) => v.aspect === "9:16");
  // Black Friday week leads with the Black Friday spot.
  const [spots] = useState(() =>
    isBlackFridayWeek() ? [...commercials].sort((a) => (a.id === "ad-migration" ? -1 : 0)) : commercials,
  );
  return (
    <section id="videos" className="border-b-[3px] border-ink bg-ink-2 py-20 text-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Watch them say it</span>
            <h2 className="h2 mt-4">
              Real* people.
              <br />
              <span className="text-tv">Real* cameras.</span>
            </h2>
            <p className="lede text-paper/70">
              Unscripted. Unpaid. Unclear what any of them ordered. Press play if you dare.
            </p>
          </div>
          <button type="button" onClick={() => setAdOpen(true)} className="btn-tv">
            ▶ Watch the ad (2h 14m)
          </button>
        </div>

        {/* Commercials first everywhere. On phones the vertical testimonials come next, since
            vertical is what the phone was made for; on bigger screens the 16:9 grid does. */}
        <div className="mt-12 flex flex-col gap-12 sm:gap-14">
          <ReelRow
            title={
              <>
                Our commercials <span className="text-tv">(now airing nowhere)</span>
              </>
            }
            items={spots}
            columns="sm:grid-cols-4"
          />
          <ul className="order-2 grid gap-6 sm:order-1 sm:grid-cols-2 lg:grid-cols-4">
            {wide.map((v) => (
              <li key={v.id} className="card overflow-hidden bg-paper text-ink">
                {v.src ? <RealVideo v={v} /> : <FakeVideo v={v} />}
                <div className="p-4">
                  <div className="font-display text-sm uppercase leading-tight">{v.title}</div>
                  <div className="mt-1 text-xs text-ink/60">{v.name} · ✓ Verified Orderer</div>
                </div>
              </li>
            ))}
          </ul>
          {tall.length > 0 && (
            <div className="order-1 sm:order-2">
              <ReelRow
                title={
                  <>
                    More verified orderers <span className="text-tv">(now vertical)</span>
                  </>
                }
                items={tall}
                columns="sm:grid-cols-4 lg:grid-cols-7"
              />
            </div>
          )}
        </div>
        <p className="fine mt-4 text-paper/40">
          *Not real. Every face here was made by an AI video model. We did not film anyone.
        </p>
      </div>
      <TheAd open={adOpen} onClose={() => setAdOpen(false)} />
    </section>
  );
}
