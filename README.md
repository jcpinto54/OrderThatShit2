# orderthatshit.com

> The #1 solution to whatever it is.

A parody marketing site. Every ad, testimonial, chart, and pricing tier on it argues that
the cure for your problem is to order that shit. Nothing is for sale. Nothing ships.
The FDA has been notified.

## What's on the page

- **Hero** with a stock counter that only goes up and a flash sale that never ends.
- **Testimonials** from real\* people whose problems were fixed\*\* by ordering that shit.
- **Shit Finder™**, an "AI" that analyzes any problem and recommends ordering that shit.
- **The Science™**: charts proving a perfect correlation between ordering that shit and having ordered that shit.
- **Video testimonials**, AI-generated on fal.ai (see below), and a 2h14m ad you can skip after eight seconds.
- **Pricing**, a comparison table, press quotes, FAQ, and a legally exhausting footer.
- A fake checkout that ends in confetti and a Certificate of Having Ordered That Shit.
- Live purchase toasts, an idle nag, an exit-intent modal, and a cookie banner, because the big sites have those.

\*Not real. \*\*Nothing.

## Stack

Vite + React + TypeScript + Tailwind CSS v4. Static output, no backend, no tracking.

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ locally
npm run og         # regenerate public/og.png (needs Playwright's Chromium)
npm run videos     # regenerate the video testimonials on fal.ai (needs FAL_KEY)
npm run deploy     # build + wrangler deploy to Cloudflare
```

## Deploying

The site runs as an assets-only Cloudflare Worker. `wrangler.jsonc` points at `dist/`,
serves it as a single-page app, and attaches the custom domains `orderthatshit.com` and
`www.orderthatshit.com` (Cloudflare creates the DNS records and certificates on deploy,
as long as the zone is on the same account as the API token).

Two ways to ship it:

1. **GitHub Actions** (`.github/workflows/deploy.yml`): every push to `main` builds and runs
   `wrangler deploy`. Add two repository secrets: `CLOUDFLARE_API_TOKEN` (a token made from
   the "Edit Cloudflare Workers" template) and `CLOUDFLARE_ACCOUNT_ID`.
2. **Locally**: `CLOUDFLARE_API_TOKEN=... npm run deploy`, or `npx wrangler login` once and
   then `npm run deploy`.

The build is otherwise a plain static site in `dist/`, so Vercel, Netlify, or GitHub Pages
work too if you ever move it.

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
| `misc.ts` | "As seen on" outlets, press quotes, ticker names/places/items, Shit Finder verdicts, processing steps, nags |
