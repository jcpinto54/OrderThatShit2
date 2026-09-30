# 07 — AI video for comedic talking heads, and a safe "Generate some shit"

**Compiled 2026-09-29 by a research agent; prices/features change monthly — re-verify before spending.**
All prices are USD and were read from the linked provider pages on 2026-09-29 unless another date is given. "8-s clip" means 8 seconds of output with audio.

## TL;DR

1. **Keep Veo 3.1 Fast as the workhorse.** Your shipped clips use it, and it says "shit" on fal at `safety_tolerance: "6"`. On fal it costs $0.15/s with audio, so **$1.20 per 8-s clip**. The same model direct from the Gemini API is $0.10/s at 720p (**$0.80**) or $0.12/s at 1080p ($0.96).
2. **Sora is gone.** OpenAI removed Sora 2, Sora 2 Pro and the Videos API on **24 Sep 2026** and named no replacement.
3. **Two new cheap models are worth a $1 probe each.**
   - **Veo 3.1 Lite:** $0.05/s with audio at 720p, so **$0.40 per clip**.
   - **Gemini Omni 1.1 Flash:** released 27 Aug 2026. $0.10/s at 720p, or $0.03/s for 360p drafts.

   How well either one handles comedic timing is untested.
4. **For visitors, don't generate new video per request. Re-voice pre-rendered hero clips instead.** Fill a templated line, voice it with ElevenLabs in the character's voice, then lip-sync it onto the clip.
   - Lip-sync costs about $0.14 per 8-s clip with Kling LipSync, or $0.40 with sync lipsync-2.
   - In total that's **≈ $0.18–0.48 per delivered clip**, with a 1–3 minute wait.
5. **Build the zero-generation version first.** Pre-rendered clips, client-side overlays and pre-rendered name/item audio from a whitelist cost **~$0 per use**. They play instantly and leave almost no room for abuse.
6. **No free-text prompts and no face uploads before Black Friday.** The safe setup has two parts:
   - **Inputs:** slots only (name, item, problem). Whitelists first, then moderation. OpenAI omni-moderation is still free.
   - **Limits:** Turnstile, per-IP/device caps, a global daily $ cap in a Durable Object, and a prepaid fal balance with auto top-up off as the hard stop.
7. **EU AI Act Art. 50 has applied since 2 Aug 2026.**
   - Your realistic AI "customers" should be treated as deepfakes. The satire carve-out only lowers the bar to an unobtrusive label.
   - A generator makes you a **provider**, so its outputs need machine-readable marks. Keep the SynthID/fal marks and add your own C2PA signature after the final encode.
   - A feature launched in November gets **no grace period**.
8. **$100 buys ≈ 20 new 8-s characters on fal** at ~3 takes each (≈ 30 via the Gemini API directly). Season 2 (7 vertical characters, already in `video-characters.mjs`) costs ≈ $27 at 3 takes each.
9. **If you charge, charge €2.99.** That leaves ≈ €1.70–1.95 after 23% VAT, Stripe fees and generation cost. Below €1.99, the €0.25 card fee plus VAT eat the margin. For virality, "free, but it sells out every day" is better and on-brand.

---

## 0. Baseline: what the repo does today

**Pipeline (`scripts/generate-videos.mjs`):**
- FLUX 1.1 Ultra portrait → ElevenLabs v3 TTS → `fal-ai/veo3.1/fast/image-to-video`.
  - Settings: 8 s, 1080p, `generate_audio: true`, `safety_tolerance: "6"`, `auto_fix: false`, and a negative prompt against subtitles.
- Then an ffmpeg publish at 720p.
- Fallbacks: OmniHuman 1.5 (portrait + TTS), a `sync-lipsync/v2` re-dub with `lipsync-2-pro`, and an ffmpeg `mix` for voice-overs.
- New since the first batch: a per-character `aspect` field. Season 2 adds seven native 9:16 characters, published at 720×1280.

**Published season-1 files:** all five are 8.0 s, 1280×720, 24 fps and 1.0–3.0 MB.

**A failure mode you've already hit:** Veo rendered the ad's music but skipped the announcer, which you fixed with TTS + `mix`. Budget for re-rolls.

**Local tooling:** `node_modules/ffmpeg-static/ffmpeg` (v6.0) includes libass and drawtext, for any text you draw in ffmpeg itself. The Homebrew ffmpeg 9.0.1 on this Mac does not, so keep preferring ffmpeg-static, as the scripts already do.

## 1. Model landscape (as of Sept 2026)

**Recent churn:** Veo 3.1 Lite (31 Mar), Veo 2/3.0 shut down (30 Jun), MiniMax H3 (31 Jul, per press), Wan 3.0 / LTX-2.5 / Seedance 2.5 on fal (Aug), Gemini Omni 1.1 Flash (27 Aug), Sora API removed (24 Sep), ElevenLabs v4 as the new flagship (Sep). Lesson: **keep model IDs in config, not in code.**

### 1a. Video models with native dialogue (acting and voice in one pass)

| Model (where) | Length/gen | 9:16 | Price per output second | ≈ 8-s clip | Says "shit"? | Notes |
|---|---|---|---|---|---|---|
| **Veo 3.1 Fast** (fal) | 4/6/8 s | ✓ | $0.10 silent / **$0.15 with audio** (720p and 1080p); $0.35 at 4K | **$1.20** | **Yes (your clips)** | fal-only `safety_tolerance` 1–6 (default 4). `auto_fix` silently rewrites prompts that fail policy, so keep it off. |
| Veo 3.1 Fast (Gemini API) | 4/6/8 s | ✓ | $0.10 (720p) / $0.12 (1080p), audio included | $0.80 / $0.96 | Likely; has no `safety_tolerance` knob, so test first | EEA-facing apps must use the paid tier. In the EU, image-to-video can only show adults. Latency 11 s–6 min. |
| Veo 3.1 Standard (fal or Gemini) | 4/6/8 s | ✓ | $0.40 with audio | $3.20 | Likely (untested) | For one or two hero ads. |
| **Veo 3.1 Lite** (fal or Gemini) | 4/6/8 s | ✓ | $0.05 (720p) / $0.08 (1080p) with audio | **$0.40** | Untested | Preview. The cheapest real Veo. |
| **Gemini Omni 1.1 Flash** (Gemini API, fal) | 3–10 s, extendable to 40 s | ✓ | $0.03 (360p) / $0.10 (720p) / $0.15 (1080p) / $0.30 (4K) | $0.80 at 720p | Untested | Editable through conversation. Refuses uploads of some recognizable people. In the EEA it can't edit or extend uploaded videos. |
| Kling 3.0 Pro (fal) | 3–15 s | not confirmed | $0.112 silent / $0.168 with audio / $0.196 with voice control | $1.34 | Untested | Native voices are English and Chinese only; other languages are translated to English. |
| Seedance 2.0 (fal) | ≤15 s | ✓ | ~$0.30 at 720p with audio (third-party figure; fal quotes US hosting on request) | ~$2.40 | Untested | Faces need separate approval on US hosting. |
| Seedance 2.5 (fal) | 4–30 s | ✓ | ~$0.47 (720p), ~$0.22 (480p), billed per token | ~$3.80 | Untested | Long multi-shot clips; expensive. |
| MiniMax H3 / H3 Max (fal) | 5–15 s | ✓ | $0.05 (480p) / $0.08 (768p) / $0.16 (1080p); H3 Max list price after the promo ends 30 Sep | $0.64 at 768p | Untested | fal lists native audio for H3, but there's no audio toggle. |
| Wan 3.0 (fal) | 2–30 s | ✓ | $0.05 (480p) / $0.10 (720p) / $0.20 (1080p) | $0.80 | Untested | Not open weights; Alibaba's open line stops at Wan 2.2. |
| LTX-2.5 Pro (fal) | ≤10 s | ✓ | $0.12 (720p) / $0.17 (1080p) | $0.96 | Yes, if you supply the audio | Has an audio-to-video endpoint that times the picture to your track. Open weights. |
| Runway Gen-4.5 (Runway API) | – | – | 12 credits/s = $0.12 | $0.96 (silent) | n/a | No native dialogue; audio models are separate. Runway also resells Veo 3.1 at $0.40/s and Veo 3.1 Fast at $0.15/s. |
| Sora 2 / Sora 2 Pro | – | – | – | – | – | **Removed 24 Sep 2026.** |
| Luma Ray3.x, Pika | – | – | – | – | – | Skip: no native-dialogue talking heads. Luma pairs with ElevenLabs; Pika has pivoted to a model aggregator plus audio models. |

### 1b. Bring your own voice (TTS → talking head or lip-sync)

Swearing is guaranteed with these routes, because you supply the audio.

| Model (fal unless noted) | Input | Price | ≈ 8 s | Best for |
|---|---|---|---|---|
| OmniHuman 1.5 | portrait + audio | $0.16/s | $1.28 | The best acting in this group. Up to 30 s at 1080p or 60 s at 720p, so good for infomercials. |
| Kling AI Avatar v2 Standard | portrait + audio | $0.0562/s | $0.45 | A cheap talking head from a still. |
| VEED Fabric 1.0 | portrait + audio | $0.08/s (480p), $0.15/s (720p) | $0.64 / $1.20 | Alternative avatar model. |
| sync lipsync-2 | video + audio | $3/min ($0.05/s) | $0.40 | Re-voicing an existing clip. |
| sync lipsync-2-pro | video + audio | ≈ $5/min ($0.083/s) | $0.67 | What your `lipsync` step uses; better teeth and beards. |
| sync-3 (sync.so direct) | video + audio | $0.107–0.133/s plus a plan ($5–249/mo) | ~$1 | Occluded faces, profiles, 4K. |
| **Kling LipSync** | video (2–10 s) + audio | $0.014 per input-video second, rounded up to 5 s | **$0.14** | The cheapest re-voice; test the quality. |
| Hedra, HeyGen, Synthesia | SaaS avatars | Subscriptions (Hedra $20–100/mo); per-second API prices not published | – | Poor fit: stock-avatar look and brand-safety filters. |

### 1c. TTS

An 8-s line is roughly 100–130 characters, so about one cent.

| Model | Price | Notes |
|---|---|---|
| ElevenLabs v3 | $0.10 per 1k chars on fal; $0.08 direct | Supports audio tags like `[sighs]`. On fal, `timestamps: true` returns word timings, which gives you caption timing for free. |
| ElevenLabs v4 | $0.08 per 1k list; $0.022 promo until 12 Oct 2026 | New flagship with 90+ languages. Tag support and fal availability not verified. |
| ElevenLabs Flash v2.5 | $0.04 per 1k | Fast and cheap, with less acting. |
| Gemini 3.8 Flash TTS | ≈ $0.00225 per 10 s of audio | Launched 22 Sep 2026. Comedic delivery untested. |

**Practical notes**
- **Profanity:** no provider documents it. Native-audio models pick the words and run their own filters, and the only evidence so far is yours. Before switching models, spend about $5 rendering the same Gary line on Lite, Omni, Kling 3, H3 and Wan 3.
- **Latency:** only Google publishes a range (11 s minimum, up to ~6 min at peak). Assume 1–3 minutes for everything else until you've measured it.
- **Portrait video:** Veo has supported 9:16 at every resolution since 13 Jan 2026. Generate vertical twins natively whenever the clip matters, which Season 2 already does.
- **Billing:** fal bills successful outputs only; server errors and queue time are free. Whether it bills content-policy rejections isn't documented.

## 2. Recommended production pipelines

### 2a. New hero clips (made by you, quality first)

1. **Write for 8 s.** One line of 20 words or fewer, with a written beat before the punchline. Put the joke in the last three words so the clip can loop.
2. **Generate the portrait at the target aspect.** FLUX 1.1 Ultra, about 4 tries, with the face in the upper third for 9:16.
3. **Run Veo 3.1 Fast image-to-video** at 1080p (the same price as 720p on fal) with your current settings.
   - Fire **3 seeds in parallel** and pick by ear.
   - Cheaper alternative: the Gemini API at 720p ($0.80 instead of $1.20), once you've checked it still swears.
   - For the one or two Black Friday hero spots, use one pass of **Veo 3.1 Standard** ($3.20 per take).
4. **If Veo fumbles the line** (skips the swear, garbles it, adds subtitles):
   - Generate the line with ElevenLabs in a fixed voice.
   - Re-voice it with `lipsync-2-pro` ($0.67) or Kling LipSync ($0.14).
   - Voice-over-only spots keep the `mix` step.
5. **Long form:** make a 20–30 s CEO "doorbuster" monologue on OmniHuman 1.5, driven by TTS. That's about $4.80 per take at 720p.
6. **Get caption timings.**
   - Veo clips: word timestamps from fal Whisper with `chunk_level: "word"` (your `transcribe.mjs` already calls it), or ElevenLabs Scribe v2 at $0.22 per audio-hour.
   - TTS-driven clips: use the TTS timestamps.
7. **Label and sign.** Add a small "AI actor · satire" tag to social cuts (see §6). Then C2PA-sign the final files *after* the last ffmpeg pass. A C2PA manifest is hash-bound to the exact bytes, so any re-encode breaks or drops it. c2patool supports MP4.
8. **Keep the 1080p masters.** The 720p site files are too soft to crop.

### 2b. Vertical 9:16 re-cuts of the season-1 (16:9) clips

The repo now has `scripts/make-social-cuts.mjs`, which already does the core job with no API calls:
- 1080×1920 output;
- a hook card from the first frame;
- a square face crop in the middle band;
- Whisper-timed captions, drawn by Playwright in the site's fonts.

Keep that approach. The upgrades worth making, best value first:

1. **Regenerate the best clips natively in 9:16** (≈ $2.40 for 2 takes). This gives the best framing, and it's now one `aspect` field away.
2. **Crop from the 1080p Veo masters** (the script caches them at `.cache/videos/<id>/veo.mp4`, if you still have them) instead of the 720p published files. The square crop then needs no upscale, instead of 1.5×.
3. **Make the first word land by ~0.2 s.** Cut both streams at the first word's timestamp.
4. **End on the punchline's last syllable** so the loop restarts cleanly.
5. **Put "AI actor" in the brand tag** (`label`), then C2PA-sign after the final encode (see §6).

If you want the whole frame instead of a crop, a blurred fill works: the full 16:9 clip centred over a blurred, zoomed copy of itself. It needs `ffmpeg-static`, which has libass and drawtext.

```sh
node_modules/ffmpeg-static/ffmpeg -i gary_1080.mp4 -filter_complex "\
[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=24:2,eq=brightness=-0.08[bg];\
[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2[v]" -map "[v]" -map 0:a \
-c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart gary_9x16.mp4
```

For animated word-pop captions and batch variants, **Remotion** is an option. It's free for individuals and companies of up to 3 people; above that it's $25 per seat per month, or $0.01 per render with a $100/month minimum.

## 3. Budget scenarios

**Assumptions** (estimates, not measurements):
- About **3 Veo takes per keeper** to get the comedic timing right.
- 4 portrait tries at ~$0.06 each (the script's figure for FLUX 1.1 Ultra; not re-verified).
- About $0.05 for TTS and transcription.

**Per-character cost on fal:**
- **≈ $3.90** for a new character in one aspect.
- **≈ $6.40** for a character with both 16:9 and 9:16 (the second aspect needs 2 more takes).
- **≈ $9.85** for a Veo 3.1 Standard hero.

On the Gemini API at 720p, a character is ≈ $2.65 (≈ $4.30 with both aspects).

| Budget | What it buys (fal prices) |
|---|---|
| **$25** | **Season 2 as written:** 7 vertical characters × (3 × $1.20 + $0.24) ≈ $27. Or 6 new 16:9 characters with free blurred-fill vertical cuts. |
| **$100** | Season 2 (~$27), plus ~15 more characters (~$58), plus ~$10 of one-clip probes (Veo Lite, Omni, Kling 3, H3, Wan 3, LTX) and a small re-voice buffer. That's ≈ 30 characters if you go direct to the Gemini API. |
| **$300** | ~20 characters in both aspects ($128), 3 Veo Standard hero ads ($30) and a 30-s OmniHuman CEO infomercial (~$10, 2 takes). That leaves **~$130 as a launch buffer for the visitor feature**: about 300–600 lip-sync clips at $0.20–0.45 each. |

## 4. User-generated clips: options from cheapest to riskiest

| Option | What the visitor gets | Marginal cost | Wait | Risk | Effort |
|---|---|---|---|---|---|
| **A1 Overlay only** | A pre-rendered clip plus their first name and item as animated captions, a box label and an order-confirmation card | ≈ $0 (Workers/R2 free tiers) | Instant | Very low (typed text renders only on the visitor's page) | 3–5 days |
| **A2 Pre-rendered audio** | A1, plus an off-screen voice saying their name and item, stitched client-side from a whitelist. ~2,000 names in one voice ≈ $5 of TTS, paid once. | ≈ $0 | Instant | Very low (nothing the visitor types is ever spoken) | +2–3 days |
| **A3 Audio swap + lip-sync** (the recommended generated tier) | A cast member says a templated line with their name and item, lips synced | **$0.18–0.48**, including a 15% allowance for failures | 1–3 min (est.) | Low to medium | 1–2 weeks |
| **B Template-constrained fresh generation** | A new Veo performance from a fixed portrait and a templated line | $0.40 (Lite) to $1.20 (Fast), plus re-rolls | 1–6 min | Medium: the slot text goes into the video prompt, the voice isn't locked, and names get garbled | 1–2 weeks |
| **C Face upload ("cameo")** | Themselves in the ad | $1–3, plus an identity/liveness vendor | 2–10 min | **High** | Weeks, plus a lawyer |

### A1/A2: zero generation

This is pure front-end: a `<video>`, React overlays, and Web Audio scheduling the name and item snippets. The trick is to put the personalisation **where there are no lips**: the ad's announcer ("This Black Friday… {Name}… order that shit"), an off-screen voice behind Gary ("{Name}, it's me or the shit!"), or the box label.

For sharing, reuse the site's existing pattern (`src/lib/share.ts`). Pages are pre-built, each with a pre-rendered preview image, and the visitor's words ride in the URL and render **on the page only**, never in a preview card your domain serves. It's free at any scale, and there's nothing to store.

The in-progress Order Authorization receipt (`src/lib/receiptImage.ts`, a 1080×1920 image drawn on the visitor's device) is already A1 in still-image form. A1/A2 means adding the clip and the voice layer to it.

### A3: lip-sync re-voice (recommended)

**One-off setup, per cast member:**
- Pre-render one 8-s Veo "performance" clip, plus a speech-free ambience bed.
- Burn the "AI actor · satire" tag into the clip once.

**Per request:**
1. Fill the template.
2. Voice it with ElevenLabs v3 in the character's voice (~$0.012).
3. Mix it over the ambience bed.
4. Lip-sync it onto the base clip. Start with sync lipsync-2 ($0.40), a known quantity, and A/B test Kling LipSync ($0.14).
5. Sign the result and store it in R2.

**Why this design:**
- The voice and the acting stay on-brand.
- TTS pronounces the name, and the swear is guaranteed.
- **The visitor's text never reaches a generative-video prompt.**

**Templates should make people feel good about finally ordering.** For example:
- Gary: "{Name} said it's me or the {item}. The {item} had tracking. Three to five business days."
- Linda: "It's 2am, {Name}. That {item}'s been in your cart since March. Order that shit."

Keep every template within ~8 s at the slowest character's pace.

### B: fresh generation

Only do this with **whitelisted** slots, because the tokens go straight into the Veo prompt. Veo 3.1 Lite brings it down to $0.40 plus re-rolls, but the voice drifts between generations and names get mangled. It's a "deluxe" option for later.

### C: why face uploads are the riskiest option

**Who gets uploaded:** people will upload exes, bosses, celebrities and kids.

**What you'd need:**
- A liveness check plus proof that the uploader is the person pictured. That is biometric processing under GDPR (§6.3).
- Guaranteed deletion.

**What providers already do:**
- Gemini Omni refuses uploads of some recognizable people.
- Seedance on fal's US hosting puts faces behind an approval process.
- Sora's cameo feature died with Sora.

Not this year.

## 5. Safety and abuse controls (for A3 and B)

**Input design (the main control)**
- **Slots only:**
  - `firstName`: 20 characters or fewer, 2 words max. Letters, spaces, hyphens and apostrophes only; NFKC-normalised; zero-width and confusable characters stripped.
  - `item`: picked from about 40–60 generic items (custom text comes later).
  - `problem`: picked from a list.
- **No surname, no "who" field, no free prompt.**
- **Whitelist first:** a known-first-names list for EN/PT/ES, built from public baby-name statistics, passes instantly. Anything else goes to moderation.
- **Strip anything TTS could read as markup:** `[ ] { } < >`, so nobody can inject audio tags.
- **If an LLM ever writes jokes,** it should pick from pre-approved lines, not produce free text that ends up in a prompt.

**Moderation**
- **OpenAI `omni-moderation-latest`:** still free as of 2026-09-29. It covers 13 harm categories in text and images. fal runs the same model on its side, but that won't catch brand or defamation problems.
- **Your own blocklists:**
  - slurs in EN/PT/ES/FR/DE, with leetspeak normalised;
  - public-figure names, e.g. from a Wikidata dump of high-profile people;
  - brand names, mapped to generic nouns or rejected.
- **Optional second opinion:** Llama Guard 3 8B on Workers AI ($0.48 per million input tokens, ≈ $0.0002 per check).

**Rate and spend limits**
- **Turnstile** on every submit. It's free, with unlimited siteverify calls.
- **Exact counters in a Durable Object:**
  - per IP hash, salted and rotated daily (e.g. 3/day);
  - per device cookie (3/day);
  - per /24 (IPv4) or /64 (IPv6) block (20/day);
  - a global cap on clips per day and $ per day.
  - Reserve the estimated cost before calling fal, commit it on success, release it on failure.
- **Workers Rate Limiting binding as a burst guard only.** It uses 10 s or 60 s windows, counts per location, is eventually consistent, and Cloudflare advises against keying on IP alone.
- **fal is prepaid.** Keep auto top-up off and a modest balance through Black Friday; that's your circuit breaker. Add a kill-switch env var.

**Queue and webhooks**
- Use Workflows (durable steps, `waitForEvent` with a timeout), or Queues plus a Durable Object.
- Submit to fal's queue with `webhook_url` and verify each delivery:
  - check fal's ED25519 signature against its JWKS;
  - accept only timestamps within ±5 minutes;
  - be idempotent on `request_id`, because duplicate deliveries happen.
- **Return 2xx directly.** fal treats a 3xx as a permanent failure.

**Storage and retention**
- **Copy outputs to R2 immediately.** Gemini keeps Veo files for only 2 days, and fal URLs are public if leaked.
- **R2 has room:** 10 GB free, free egress, and your clips are 1–3 MB each, so ~3,000–10,000 clips fit.
- **Keep clips out of sight:** unguessable IDs, `noindex`, and a 30-day lifecycle delete unless the visitor chooses to keep the clip.
- **Keep an abuse trail:** log inputs, moderation verdicts and the IP hash for 30–90 days.

**Publishing:** nothing goes to a public gallery automatically. Use a manual hold queue, put a report button on every share page, and have a takedown path.

**Specific risks and mitigations**
- **Likeness and deepfakes:** a fixed fictional adult cast, no uploads, and no public-figure names in any slot.
- **Minors:** an 18+ confirmation, which the Gemini API terms require anyway if you call Google directly. No school- or child-coded items or templates.
- **Defamation:** first name only, and templates talk about "you" (the visitor), never a named third party.
- **Trademark and false endorsement:**
  - Keep items generic, and never let a cast member "recommend" a real brand.
  - Season 2's Luis (a brown-uniformed van driver) evokes a carrier's trade dress. Keep him logo-free (the prompt already says "plain") and never name carriers.
- **Template abuse:** write templates so no slot can complete an offensive sentence. Avoid frames like "{X} is a…".

## 6. Law and disclosure (EU-based owner)

### 6.1 EU AI Act, Article 50 (applies from 2 Aug 2026)

**What's in force:**
- **50(1):** chatbots must say they're AI.
- **50(2):** providers of generative systems must mark outputs machine-readably and detectably.
- **50(4):** deployers must disclose deepfakes.

A deepfake is AI image, audio or video that resembles existing persons, objects, places, entities or events and would falsely appear authentic (Art. 3(60)).

**Timing:**
- The **Digital Omnibus on AI** (in force late July 2026, per law-firm summaries) postponed the high-risk rules but **not** Art. 50.
- The only relief: systems already on the EU market before 2 Aug 2026 get until **2 Dec 2026** to meet 50(2) marking.
- Deployer duties got no deferral.

**The Commission guidelines** (final version 20 Jul 2026), as law firms read them:
- Simulated people who could plausibly exist can count as deepfakes. Photoreal "Linda" probably does.
- Only *evidently* satirical or artistic works get the lighter regime; any ambiguity removes it.
- Content that was already circulating before 2 Aug doesn't need retroactive labels.

**The satire carve-out:** for evidently satirical or fictional works, the duty shrinks to disclosure in a form that "does not hamper the display or enjoyment of the work" (Art. 50(4)).
- A small persistent "AI actor" chip on each player, plus one line in the testimonials section, is proportionate and visible at first exposure (Art. 50(5)).
- Commentary notes that most advertising examples still need disclosure, so label them.

**Your two roles:**
- **Deployer** (your testimonials, ads and social posts): label as above.
  - Visitors making clips for their own fun aren't deployers, because personal non-professional use is excluded (Art. 3(4)).
  - **You** become the deployer when you repost their clips.
- **Provider** (the generator): you put an AI system into service under your own name, so 50(2) marking is your job even though the model is Google's, reached through fal.
  - **You may lean on upstream marks, but responsibility stays with you.** The upstream marks are:
    - Veo's SynthID, which is designed to survive cropping, filters, frame-rate changes and lossy compression;
    - fal's own marks: it says media from its hosted apps is C2PA-signed and invisibly watermarked.
  - **Add your own layer.** Sign each final MP4 with your own C2PA manifest *after* the last ffmpeg step, and keep generation logs.

**Code of Practice on marking and labelling:**
- Final text published 10 Jun 2026; the Commission confirmed it as adequate on 20 Jul 2026. It's voluntary.
- It expects providers to use layered marking, e.g. signed metadata plus an imperceptible watermark.
- It expects deployers to label clearly at first exposure; an EU icon is provided. Artistic and satirical works get a lighter regime.

**Fines:** up to €15M or 3% of worldwide turnover, whichever is higher. For SMEs it's whichever is lower (Art. 99). Enforcement is by national authorities.

### 6.2 Consumer law (worth 30 minutes of a lawyer's time)

- **Fake testimonials:** the EU blacklist of unfair commercial practices (UCPD Annex I, points 23b–23c, added by Directive 2019/2161) bans false consumer reviews and endorsements used to promote products.
  - Obvious satire is defensible.
  - Once you sell real products (the mystery box), keep the AI "customers" visibly labelled, away from real listings and star ratings, and out of unlabelled paid ads.
- **Charging per clip:** a clip is digital content, so the 14-day withdrawal right applies unless the buyer does both of these:
  - expressly consents to immediate delivery;
  - acknowledges losing the right.

  You then confirm both on a durable medium (Consumer Rights Directive Art. 16(m)). Put a checkbox before payment.
- **VAT:** 23% on Portuguese B2C sales. Once cross-border EU sales of e-services pass €10k a year, VAT follows the customer's country via OSS. A merchant of record removes the chore.

### 6.3 GDPR

- **Text slots:** a first name is personal data, but low risk. Cover it in the privacy notice, including your processors (Cloudflare, fal, OpenAI moderation, ElevenLabs via fal) and the US data transfers, and keep retention short.
- **Face uploads:**
  - A photo becomes special-category biometric data once it's processed with technical means to identify someone uniquely (Art. 4(14), Art. 9, Recital 51). Any consent or liveness check does exactly that.
  - That means explicit consent, a DPIA and hard deletion.
  - Anyone else in the photo also has Portuguese image rights (Civil Code Art. 79).
  - Another reason to skip uploads.

### 6.4 Platform labelling

- **YouTube:** you must disclose realistic altered or synthetic content, such as AI people saying things; unrealistic and animated content is exempt. YouTube also labels content itself, using C2PA, its own tools and internal detection. Persistent non-disclosure risks forced labels, removal or YouTube Partner Program suspension.
- **TikTok:** creators must label realistic AI content, and TikTok has auto-labelled via C2PA since May 2024. Per secondary sources, its guidelines ban misleading realistic AI content and fake endorsements.
- **Meta (Instagram/Facebook):** you must label photorealistic video or realistic audio that AI made or altered. Meta also applies "AI info" labels itself from C2PA/IPTC signals, and ads (especially political or social ones) are stricter.
- **In practice:** tick the AI toggle on every upload. The burned-in "AI actor · satire" tag survives re-uploads that strip metadata, and it doubles as your Art. 50 disclosure.

### 6.5 Provider terms that bite

- **Gemini API terms** (effective 23 Mar 2026):
  - Users must be 18+.
  - Don't use it in services aimed at, or likely used by, under-18s.
  - Apps serving the EEA, UK or Switzerland must use the paid tier.
  - Google doesn't claim ownership of outputs.
- **Veo in the EU:** image-to-video can only show adults.
- **Google's Generative AI Prohibited Use Policy:** it bans deceptive impersonation of real people, misrepresenting where content came from, harassment and sexual content. It says nothing about profanity.
- **fal Trust & Safety:** fal runs OpenAI moderation plus CSAM/NCII detection, but moderating your end users is still your job.

## 7. Architecture sketch: "Generate some shit" on Cloudflare

```
Browser (React)                  Cloudflare                                        fal.ai
───────────────                  ──────────                                        ──────
form {firstName,itemId,problemId}
 + Turnstile token ──POST /api/orders──► Worker
                                          1 Turnstile siteverify
                                          2 validate + normalize slots → whitelist → moderation
                                          3 QuotaDO.reserve(ipHash, deviceId, estCost)   (global $/day)
                                          4 create Workflow(orderId) ──► 202 {orderId}
/o/{orderId} "order tracking" ◄── poll GET /api/orders/{id}  (status in OrderDO)
                                    Workflow "ship-the-shit"
                                          a TTS: fal ElevenLabs v3, fixed voice ─────────────► fal
                                          b mix TTS + ambience  (Container: ffmpeg)
                                          c lip-sync job, queue + webhook_url ───────────────► fal queue
                                          d waitForEvent("fal-done", 10 min) ◄── POST /api/fal-webhook
                                                (ED25519-verified, idempotent) ◄─────────────────┘
                                          e C2PA-sign (Container: c2patool) → R2 put .mp4
                                          f poster/teaser via Media Transformations
                                          g QuotaDO.commit|release; status = delivered
/o/{orderId} share page ◄── Worker HTML: <video> from R2 custom domain + OG/Twitter tags
```

**Pieces:**

| Piece | Cost / notes |
|---|---|
| Workers Paid | $5/mo; required for Containers. |
| Turnstile | Free. |
| Durable Objects | For quotas and order status. SQLite-backed, available on the free plan. |
| Workflows or Queues | Queues: 10k ops/day free, 1M/month included on paid. |
| R2 | 10 GB free, free egress. |
| Media Transformations | Poster frames and 3-s teasers (`mode=frame` / `mode=video`). 5,000 transformations/month free, then $0.50 per 1k. |
| Container (scale-to-zero) | ffmpeg + c2patool. Alternative: fal's ffmpeg endpoints (merge ≈ $0.0002 per processing-second) and sign elsewhere. |

**Share page (`/o/{id}`):**
- Keep the `share.ts` rule: the preview card stays generic, one pre-rendered image per cast member, with no typed text in `og:title` or `og:image`.
- The personal clip plays on the page only, alongside `noindex` and an "Order your own" call to action.
- The clip itself *does* carry the visitor's first name as speech. The whitelist and moderation are what make it acceptable for your domain to serve that.
- If you want a per-clip poster, a Media Transformations frame of the clip works, because the clip has no burned-in typed text.

**Realistic wait:** TTS takes seconds; lip-sync and Veo take anywhere from 30 s to a few minutes (Google's Veo range is 11 s–6 min). Design for **1–3 minutes, with 6+ as the worst case.**

**Make the wait the joke** with a fake order-tracking page whose stages map to real events:
1. "Order received"
2. "Checking your shit for dangerous goods" (moderation)
3. "Gary is packing it" (TTS)
4. "Loaded on the truck" (lip-sync; the progress bar stalls at 99%)
5. "Out for delivery" (signing and upload)
6. "Delivered, left in the rain"

Around it:
- "Estimated delivery: 3–5 business minutes".
- Pre-rendered clips to watch in the meantime.
- The tab title flips to "📦 Delivered!".
- `canvas-confetti` (already a dependency) fires on arrival.

**When the daily budget runs out,** show "SOLD OUT — restocking at midnight UTC" instead of an error.

## 8. Recommendation

**Before Black Friday (Fri 27 Nov 2026)**

1. **Now to mid-October: content.**
   - Render Season 2, plus 5–8 more Black Friday characters.
   - Make one Veo Standard hero ad and one 30-s OmniHuman "doorbuster" infomercial.
   - Captions, a hook and the "AI actor · satire" tag go on every social cut.
   - About $100.
2. **Mid-October to early November: ship A1 + A2** by extending the Order Authorization receipt into a short clip.
   - A pre-rendered cast reaction plus the announcer saying their whitelisted name and item.
   - Client-side, instant, $0 per use, using the existing share-page pattern.
   - It's the viral mechanic, and it can't bankrupt you.
   - Label the AI clips on the site (your Art. 50 deployer duty).
3. **Early November to 20 November: add A3 lip-sync testimonials,** but only if A1/A2 have shipped. Launch with all of these in place:
   - Turnstile, slot whitelists plus moderation, and Durable Object quotas;
   - a $30–50/day global cap and a prepaid fal balance;
   - C2PA signing plus the burned-in tag from day one (there's no grace period);
   - curated picks only, no public gallery.

   Soft-launch it to a slice of traffic, then open it for Black Friday through Cyber Monday (27–30 Nov).

**Later (2027):**
- A fresh-generation "deluxe" tier (option B, whitelisted slots, Veo Lite or Fast).
- Portuguese and Spanish versions. Use ElevenLabs multilingual voices; Kling's native voices are English/Chinese only.
- A curated public gallery.
- Face uploads: no.

**Per-clip cost of A3:**
- TTS ~$0.01, lip-sync $0.14 (Kling) or $0.40 (sync-2), infrastructure ~$0.005, plus 15% for failures and re-rolls.
- Total **≈ $0.18–0.48 per delivered clip**, so 1,000 clips over the Black Friday weekend ≈ $180–480.

**Price, if you charge:**
- **€2.99 for "Express Shipping":** skip the sold-out queue, get 3 re-rolls, and download both the 16:9 and 9:16 versions.
- The maths at €2.99:
  - ≈ €2.43 net of 23% VAT;
  - minus Stripe's 1.5% + €0.25 (≈ €0.30) leaves ≈ €2.14;
  - minus generation cost leaves ≈ €1.70–1.95.
- At €1.99 you keep ≈ €0.90–1.15; at €0.99 you barely break even.
- **Default: free with a daily cap, and Express Shipping as the overflow valve.**

## What I could not verify

- **Models:** profanity handling for everything except your Veo 3.1 Fast; real-world fal latency; the comedic quality of Veo Lite, Omni, H3 and Wan 3.
- **fal:** whether its C2PA signing covers raw API outputs, and whether it bills content-policy rejections.
- **Prices and specs:** Seedance 2.0 on fal (third-party figure), Kling 3.0 9:16 support, ElevenLabs v4 tags and fal availability, Hedra/HeyGen/Synthesia API prices, FLUX 1.1 Ultra (from the script comment).
- **Law and platforms:** the Digital Omnibus regulation number and date (law-firm summaries only). TikTok's and Instagram's policy pages didn't render, so secondary sources stand in for them.

My web-search quota ran out partway through, so the later checks were direct page fetches.

---

## Sources (accessed 2026-09-29 unless a date is shown)

**Video, lip-sync and TTS models**
- Google, Gemini API pricing (updated 2026-09-24): https://ai.google.dev/gemini-api/docs/pricing
- Google, Veo 3.1 docs (durations, 9:16, personGeneration, SynthID, latency, 2-day retention): https://ai.google.dev/gemini-api/docs/veo
- Google, Gemini API changelog: https://ai.google.dev/gemini-api/docs/changelog
- Google, Gemini Omni Flash docs: https://ai.google.dev/gemini-api/docs/omni
- The Decoder on Gemini Omni 1.1 Flash (Aug 2026): https://the-decoder.com/googles-gemini-omni-1-1-flash-makes-ai-video-generation-cheaper-and-more-flexible/
- fal, Veo 3.1 Fast I2V (+ `/api` schema): https://fal.ai/models/fal-ai/veo3.1/fast/image-to-video
- fal, Veo 3.1 I2V: https://fal.ai/models/fal-ai/veo3.1/image-to-video
- fal, Veo 3.1 Lite I2V (+ `/api`): https://fal.ai/models/fal-ai/veo3.1/lite/image-to-video
- fal, How to use Gemini Omni Flash 1.1 (2026-09-06): https://fal.ai/learn/tools/how-to-use-gemini-omni-flash-1-1
- OpenAI, API deprecations (Sora/Videos API removal 2026-09-24): https://developers.openai.com/api/docs/deprecations
- fal, Kling v3 Pro I2V: https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video, and overview: https://fal.ai/kling-3
- fal, Seedance 2.0: https://fal.ai/seedance-2.0; third-party price comparison: https://apiframe.ai/models/seedance-2.0/pricing
- fal, Seedance 2.5 I2V: https://fal.ai/models/bytedance/seedance-2.5/image-to-video
- fal, Seedance 2.5 vs MiniMax H3 (2026-08-19): https://fal.ai/learn/devs/seedance-2-5-vs-minimax-h3
- fal, MiniMax H3 Max I2V: https://fal.ai/models/minimax/h3-max/image-to-video
- fal, Wan 3: https://fal.ai/wan-3
- fal, Seedance 2.5 vs LTX-2.5 Pro (2026-08-17): https://fal.ai/learn/devs/seedance-2-5-vs-ltx-2-5-pro
- Runway, API pricing: https://docs.dev.runwayml.com/guides/pricing/
- fal, OmniHuman 1.5: https://fal.ai/models/fal-ai/bytedance/omnihuman/v1.5
- fal, Kling AI Avatar v2 Standard: https://fal.ai/models/fal-ai/kling-video/ai-avatar/v2/standard
- fal, VEED Fabric 1.0: https://fal.ai/models/veed/fabric-1.0
- fal, sync lipsync v2 and v2 pro: https://fal.ai/models/fal-ai/sync-lipsync/v2 · https://fal.ai/models/fal-ai/sync-lipsync/v2/pro
- sync.so, lipsync models: https://sync.so/docs/models/lipsync; pricing (2026-09-12): https://sync.so/pricing
- fal, Kling LipSync: https://fal.ai/models/fal-ai/kling-video/lipsync/audio-to-video
- Hedra, pricing: https://www.hedra.com/pricing
- fal, ElevenLabs v3: https://fal.ai/models/fal-ai/elevenlabs/tts/eleven-v3
- ElevenLabs, API pricing: https://elevenlabs.io/pricing/api; models: https://elevenlabs.io/docs/models
- fal, Whisper: https://fal.ai/models/fal-ai/whisper
- Remotion, license: https://www.remotion.pro/license

**Provenance, safety and infrastructure**
- C2PA supported formats: https://github.com/contentauth/c2pa-rs/blob/main/docs/supported-formats.md; c2patool: https://github.com/contentauth/c2patool
- Google DeepMind, SynthID: https://deepmind.google/models/synthid/
- fal, Verify: https://fal.ai/verify; Trust & Safety: https://fal.ai/legal/trust-and-safety
- fal, webhooks: https://fal.ai/docs/model-apis/model-endpoints/webhooks; billing: https://fal.ai/docs/documentation/model-apis/pricing; ffmpeg merge: https://fal.ai/models/fal-ai/ffmpeg-api/merge-audio-video
- OpenAI, moderation guide: https://developers.openai.com/api/docs/guides/moderation
- Cloudflare, Llama Guard 3 8B: https://developers.cloudflare.com/workers-ai/models/llama-guard-3-8b/
- Cloudflare, Turnstile plans (2026-08-14): https://developers.cloudflare.com/turnstile/plans/
- Cloudflare, Rate Limiting binding (2026-04-23): https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- Cloudflare, Durable Objects pricing (2026-08-25): https://developers.cloudflare.com/durable-objects/platform/pricing/
- Cloudflare, Queues pricing (2026-04-21): https://developers.cloudflare.com/queues/platform/pricing/
- Cloudflare, R2 pricing (2026-08-07): https://developers.cloudflare.com/r2/pricing/
- Cloudflare, Workflows events (2026-06-02): https://developers.cloudflare.com/workflows/build/events-and-parameters/
- Cloudflare, Media Transformations (2026-09-01): https://developers.cloudflare.com/stream/transform-videos/
- Cloudflare, Containers pricing (2026-08-28): https://developers.cloudflare.com/containers/pricing/
- Stripe Ireland pricing: https://stripe.com/ie/pricing

**Law and platform policy**
- AI Act, Art. 50 (text): https://artificialintelligenceact.eu/article/50/; official: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- European Commission, Code of Practice on marking and labelling (2026-06-10): https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content
- European Commission, transparency guidelines: https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations; FAQ: https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
- Morgan Lewis (2026-08): https://www.morganlewis.com/blogs/sourcingatmorganlewis/2026/08/eu-ai-acts-transparency-rules-what-went-into-effect-on-2-august
- Goodwin (2026-08): https://www.goodwinlaw.com/en/insights/publications/2026/08/alerts-technology-dpc-eu-ai-act-transparency-obligations-now-in-force
- Faegre Drinker (2026-07): https://www.faegredrinker.com/en/insights/publications/2026/7/eu-ai-act-commission-confirms-transparency-code-of-practice-as-adequate-and-publishes-final-version-of-its-guidelines-on-transparency-obligations
- William Fry, Art. 50(1)–(2): https://www.williamfry.com/knowledge/part-1-ai-act-articles-501-and-502-transparency-obligations/ and Art. 50(3)–(4): https://www.williamfry.com/knowledge/part-2-ai-act-articles-503-and-504-transparency-obligations/
- TechPolicy.Press on the Code: https://www.techpolicy.press/the-eus-ai-transparency-code-of-practice-explained/
- Gemini API Additional Terms (effective 2026-03-23): https://ai.google.dev/gemini-api/terms
- Google Generative AI Prohibited Use Policy (2024-12-17): https://policies.google.com/terms/generative-ai/use-policy
- YouTube, disclosing altered or synthetic content: https://support.google.com/youtube/answer/14328491
- TikTok newsroom, C2PA auto-labelling (2024-05-09): https://newsroom.tiktok.com/en-us/partnering-with-our-industry-to-advance-ai-transparency-and-literacy; Community Guidelines: https://www.tiktok.com/community-guidelines/en/integrity-authenticity
- Meta, approach to labelling AI content (2024, updated 2024-09): https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/; Instagram Help: https://help.instagram.com/761121959519495
- Consumer Rights Directive 2011/83/EU (Art. 16(m), as amended by 2019/2161): https://eur-lex.europa.eu/eli/dir/2011/83/oj
- Unfair Commercial Practices Directive 2005/29/EC (Annex I, as amended by 2019/2161): https://eur-lex.europa.eu/eli/dir/2005/29/oj
- GDPR: https://eur-lex.europa.eu/eli/reg/2016/679/oj
