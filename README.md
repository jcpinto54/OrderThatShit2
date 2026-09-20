# orderthatshit.com

> The #1 solution to whatever it is.

A parody marketing site. Every ad, testimonial, chart, and pricing tier on it argues that
the cure for your problem is to order that shit. Nothing is for sale. Nothing ships.
The FDA has been notified.

## What's on the page

- **Hero** with a stock counter that only goes up and a flash sale that never ends.
- **Testimonials** from real\* people whose problems were fixed\*\* by ordering that shit.
- **Shit Finder™**, an "AI" that analyzes any problem and recommends ordering that shit. Every
  verdict has its own link and its own preview card, so sharing one shows the verdict.
- **The Science™**: charts proving a perfect correlation between ordering that shit and having ordered that shit.
- **Video testimonials**, AI-generated on fal.ai (see below), and a 2h14m ad you can skip after eight seconds.
- **Pricing**, a comparison table, press quotes, FAQ, and a legally exhausting footer.
- A fake checkout that ends in confetti and a Certificate of Having Ordered That Shit.
- Live purchase toasts, an idle nag, an exit-intent modal, and a cookie banner, because the big sites have those.

\*Not real. \*\*Nothing.

## Stack

Vite + React + TypeScript + Tailwind CSS v4. Static output, no backend, no tracking.
Node 22.18 or newer: the build scripts import `src/data/verdicts.ts` directly, so they rely on
Node running TypeScript without a build step. The Playwright scripts take `CHROMIUM_PATH` if you
already have a Chromium lying around.

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ locally
npm run og         # regenerate public/og.png (needs Playwright's Chromium)
npm run cards      # regenerate the share cards in public/share/ (same)
npm run videos     # regenerate the video testimonials on fal.ai (needs FAL_KEY)
npm run deploy     # build + wrangler deploy to Cloudflare
```

## Deploying

The site is an assets-only Cloudflare Worker: no server code, just the Vite build in `dist/`
served as a single-page app.

**Deploys are handled by Cloudflare Workers Builds**, connected to this repository in the
Cloudflare dashboard. Every push to `main` is built and deployed by Cloudflare, with no
GitHub Actions involvement. The `CI` workflow still builds every push as a check.

The custom domains `orderthatshit.com` and `www.orderthatshit.com` are attached to the Worker
in the dashboard under **Settings → Domains & Routes**. That is deliberate, and it is why this
repository's Wrangler config has no `routes` key: Wrangler replaces a Worker's whole route
list with whatever the config declares on each deploy, so declaring the domains here would
fight the dashboard. The apex also carries hand-made DNS records, which makes a
Wrangler-managed Custom Domain on it fail outright.

To deploy by hand, for example to ship without pushing:

```bash
npx wrangler login     # once
npm run deploy         # build + wrangler deploy
```

The output is a plain static site in `dist/`, so Vercel, Netlify, or GitHub Pages would work
too if you ever move it.

## Share links

A shared joke only works if the preview carries it, so every Shit Finder verdict is its own
URL with its own card:

| URL | What it is |
| --- | --- |
| `/v/<id>/` | One Shit Finder verdict, with `public/share/<id>.png` as the preview |
| `/c/` | Somebody's certificate. Landing here opens the order form, pre-filled with what they ordered |

Link previews are built by crawlers that do not run JavaScript, so a single page app cannot
give a share its own title and image. `scripts/build-share-pages.mjs` runs after `vite build`
and writes a real `dist/v/<id>/index.html` per verdict: the same bundle and the same app, with
the meta tags rewritten and the sitemap regenerated. The app reads the URL on load and shows
the matching verdict without replaying the fake analysis. Nothing is added to the Worker, which
stays assets-only.

The cards themselves are pre-rendered by `npm run cards` and committed, the same way `og.png`
is. That is deliberate. The verdict list is finite, so there is no reason to generate anything
per visitor: no runtime cost, no per-share bill however far a link travels, and nothing to keep
warm. The one rule that makes it work is that **the visitor's own typed problem never goes into
the card**. It shows on the page and rides in `?p=`, capped and stripped in `src/lib/share.ts`,
but burning it into an image would mean rendering per request and would let anyone craft a link
that makes orderthatshit.com serve a preview card with their words on it.

Verdicts live in `src/data/verdicts.ts`. Rewording one is free; **renaming an `id` breaks every
link anyone has ever posted**, because the id is the URL and the card filename. Adding a verdict
means running `npm run cards` and committing the new PNG — the build fails if a card is missing.

To put art behind the cards, drop any number of images into `public/share/plates/` and run
`npm run cards` again. Each verdict picks one by hash, so a given verdict always looks the same.
They can come from anywhere, including a one-off fal.ai run like the videos below; generating a
few dozen once is plenty, since nobody ever sees two cards side by side.

## Generating the video testimonials

The clips in `public/videos/` are generated on [fal.ai](https://fal.ai) by
`scripts/generate-videos.mjs`, driven by the cast list in `scripts/video-characters.mjs`.
Per character it runs:

| Step | Model | What it does |
| --- | --- | --- |
| `portrait` | FLUX 1.1 Ultra | A photoreal 16:9 still of the character (with the box in shot) |
| `tts` | ElevenLabs v3 | The full spoken line, for the talking-head route |
| `veo` | Veo 3.1 Fast (image-to-video) | Animates the portrait and generates the dialogue and room tone, 8s |
| `omnihuman` | OmniHuman 1.5 | Alternative route: portrait + TTS audio → talking head, up to 60s |
| `lipsync` | sync lipsync-2 | Alternative route: re-dub a Veo clip with the TTS audio |
| `publish` | ffmpeg | Transcode the chosen route to 720p H.264 + poster frame into `public/videos/` |

The shipped clips use the `veo` route. Veo 3.1 on fal speaks the line as written, swearing
included, at `safety_tolerance: "6"`; the negative prompt stops it burning fake subtitles
into the frame.

```bash
export FAL_KEY=...                                  # from fal.ai, never commit it
npm run videos -- --only linda --steps portrait,tts,veo,publish --route veo
npm run videos -- --only gary --steps veo --force   # regenerate one step
npm run transcribe -- .cache/videos/gary/veo.mp4    # check what a clip actually says
```

Intermediate files are cached in `.cache/videos/<id>/` (gitignored). A full run for the
four testimonials plus the ad clip costs roughly $8 on fal at current prices.

`src/data/videos.ts` maps each card to its clip, poster and duration. A card without `src`
falls back to an animated placeholder, and the "Watch the ad" modal falls back to flashing
text when `adVideo` is undefined.

## Editing the copy

All words live in `src/data/`:

| File | What it holds |
| --- | --- |
| `testimonials.ts` | The testimonial cards |
| `faqs.ts` | FAQ questions and answers |
| `pricing.ts` | Pricing tiers |
| `videos.ts` | Video testimonial cards |
| `verdicts.ts` | Shit Finder verdicts, each with the stable id used by its share link and card |
| `misc.ts` | "As seen on" outlets, press quotes, ticker names/places/items, Shit Finder verdicts, processing steps, nags |
