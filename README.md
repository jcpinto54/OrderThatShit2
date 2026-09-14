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
- **Video testimonials** (animated stand-ins until real clips are dropped in, see below) and a 2h14m ad you can skip after five seconds.
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
```

## Deploying

The build is a plain static site in `dist/`. Any static host works:

- **Vercel / Netlify**: import the repo, framework "Vite", build `npm run build`, output `dist`.
- **Cloudflare Pages**: same settings, output directory `dist`.
- **GitHub Pages**: publish `dist/` from a workflow.

Point `orderthatshit.com` at whichever one you pick.

## Adding real video testimonials

`src/data/videos.ts` describes each card. Every entry currently renders an animated
placeholder with captions. To use a real clip, put the file in `public/videos/` and set
`src` (and optionally `poster`) on the entry:

```ts
{ id: "linda", name: "Linda, 47", src: "/videos/linda.mp4", poster: "/videos/linda.jpg", ... }
```

The card switches to a native `<video>` player automatically. The captions in each entry
double as a script if you're generating the clips.

## Editing the copy

All words live in `src/data/`:

| File | What it holds |
| --- | --- |
| `testimonials.ts` | The testimonial cards |
| `faqs.ts` | FAQ questions and answers |
| `pricing.ts` | Pricing tiers |
| `videos.ts` | Video testimonial cards |
| `misc.ts` | "As seen on" outlets, press quotes, ticker names/places/items, Shit Finder verdicts, processing steps, nags |
