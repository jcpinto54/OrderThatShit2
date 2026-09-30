# Posting kit

Everything below is in `social/` (gitignored; re-render with `npm run social` and `npm run ads`).
All files are 1080×1920, H.264, captioned and labelled "AI actor" or "AI-generated". Reasoning in
[`docs/research/04-platforms-hooks-and-share-design.md`](../research/04-platforms-hooks-and-share-design.md).

## Rules for every post

- **Switch on the platform's AI label** (TikTok's AI-generated content toggle, YouTube's
  "altered or synthetic", Meta's AI info). The files are labelled too; the platforms want both.
- **Upload natively, per platform.** Never repost a file carrying another platform's watermark:
  TikTok keeps those out of For You, and Instagram stops recommending accounts that mostly repost.
- **No "tag a friend", "share this" or "like if…"** in captions: engagement-bait rules demote them.
  The send prompts live on the site, next to the share buttons, where they're allowed.
- **Captions short and deadpan.** The video carries the joke; the caption is the straight man.
- **The link:** in bio on TikTok and Instagram, in the post or first reply on X and Bluesky.
  The domain is printed on the receipts and end cards anyway.
- **16:9-sourced cuts** (Gary, Linda, Marcus, the CEO, the old ad) have a halftone frame, and
  Instagram shows bordered Reels less. Post those on TikTok and Shorts, and use the full-bleed
  vertical ones on Reels.

## The files

### Testimonials, season 1 (TikTok and Shorts)

| File | Hook on screen | Caption |
| --- | --- | --- |
| `gary.mp4` | Gary, 61, made a choice. He stands by it. | Customer testimonial #1: Gary. Reliability matters. |
| `linda.mp4` | POV: it's 2am and you finally ordered that shit | Customer testimonial #2: Linda, 2:04 a.m. |
| `marcus.mp4` | Prod is down at 3am. He did the only rational thing. | Customer testimonial #3: Marcus, DevOps. Prod is still down. |
| `ceo.mp4` | Founder finally explains what that shit actually is | A message from leadership. |
| `ad.mp4` | We made a 2h 14m infomercial. These are the only 8 seconds that matter. | Full version available on request. Please don't. |

### Testimonials, season 2 (every platform, including Reels)

| File | Hook on screen | Caption | Post |
| --- | --- | --- | --- |
| `diane.mp4` | Part 2: Gary's wife finally speaks | Customer testimonial #1, part 2. | Right after Gary: sequels are what earn follows |
| `priya.mp4` | POV: your order is out for delivery | Out for delivery. Best three words in English. | Any time |
| `therapist.mp4` | Therapist reacts to her best patient's new coping mechanism | Our most controversial testimonial. | Any time |
| `walter.mp4` | 83-year-old shares the only financial advice you need | Financial advice from Walter, 83. | Any time |
| `kevin.mp4` | Customer support has one (1) solution | Thank you for calling. | Any time |
| `luis.mp4` | Delivery driver reveals what people do when he arrives | Our delivery partner, Luis. Happy crying. Mostly. | Any time |
| `donna.mp4` | Black Friday veteran. 19 years in the field. | 19 Black Fridays. 2 broken wrists. 1 lesson. | From 16 Nov |

### Commercials (every platform)

| File | Length | Caption | Post |
| --- | --- | --- | --- |
| `ad-pharma.mp4` | 32 s | Ask your doctor. | Any time; the strongest general-audience spot |
| `ad-better-way.mp4` | 29 s | There's got to be a better way. | Any time |
| `ad-fragrance.mp4` | 14 s | SHIT. Eau de Having Ordered It. | Any time; built for Instagram |
| `ad-migration.mp4` | 30 s | Black Friday, narrated. | From 16 Nov, pinned on Black Friday |

### Receipts (Instagram carousel, X, Bluesky)

`receipts/receipt-1.png` … `receipt-6.png`: six sample Order Authorizations (a treadmill I'll
never use, the good coffee machine, closure since 2019, a second monitor, a flight home, and a
couch before rent, denied). Post them as one carousel: *"Recent authorizations."* The denied one
goes last.

## Suggested order for the first two weeks

| Week 1 | Week 2 |
| --- | --- |
| Gary → Diane (part 2), same day or the next | Linda → Priya |
| Ask your doctor | There's got to be a better way |
| Walter | Therapist |
| Marcus (dev audiences: also r/ProgrammerHumor) | Kevin |
| Receipt carousel | SHIT. The fragrance. |

Then follow the numbers: sequel whatever beats your median shares per 1,000 views, and retire
whatever doesn't. Black Friday content (Donna, the Great Migration, Black Friday receipts via
`?bf=1`) starts 16 November.

## The 2h 14m ad, for real (optional)

The site claims a 2 hour 14 minute infomercial. Uploading one to YouTube makes the claim
checkable, which is the joke:

```bash
node_modules/ffmpeg-static/ffmpeg -stream_loop 1004 -i public/videos/ad.mp4 -t 8040 \
  -c:v libx264 -preset veryfast -crf 32 -c:a aac -b:a 64k ad-2h14m.mp4
```

Title: "Order That Shit — Official Infomercial (Full Length)". Chapters optional; there is only
one chapter.
