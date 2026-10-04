# 04 — Platforms, hooks & share design (applied brief for Order That Shit)

**Compiled 2026-09-29 by a research agent; platform rules change — re-verify before launch.**
Sources were accessed 2026-09-29/30. Every platform claim carries a date; anything older than about 12 months is flagged as possibly stale.

**Tags.** **[Official]** = platform docs, statements by platform leaders, published ranking code, legal text. **[Research]** = peer-reviewed or platform-commissioned studies. **[Reporting]** = reputable press, or Wikipedia summarising press. **[Lore]** = practitioner claims. **[Data]** = numbers I pulled myself. **[Analysis]** = my inference.

---

## TL;DR

- **Private sharing is now the main currency.** On 2025-01-22 Mosseri said sends per reach matter most for reaching non-followers on Instagram. X's open-sourced ranker (2026) gives *share via copy link* a default weight of **20** and *share via DM* **5**, against **0.5** for a like. Build every clip and every on-site result to be sent to one specific person.
- **Watch-through is the other currency.** TikTok treats finishing a video as a strong signal. Instagram tries to predict whether you'll watch a Reel to the end. YouTube tracks "viewed vs. swiped away" and "engaged views". The site's 8-second clips are an advantage: they're short and loopable, and replays count as views.
- **Originality and AI labelling now decide distribution.** TikTok makes watermarked or reused clips ineligible for the For You feed and requires labels on realistic AI people (2025-09-13). Instagram stops recommending accounts that mostly repost (2026-04-30), buries bordered or mostly-text Reels (2023), and cuts reach for *unlabelled* AI-person profiles (2026-08-31). **EU AI Act Art. 50** deepfake disclosure applies from **2026-08-02**, with a lighter duty for satire. Label everything; YouTube and Instagram both say labelled content isn't penalised.
- **The share unit is a result card plus its own link.** Link-preview crawlers don't run JavaScript. The merged `/v/<id>/` design (pre-built page and preview image per verdict) gets that right. Add a phone-sized card people share as a file, with the URL printed on it.
- **Viral generators share one pattern.** Examples: Elf Yourself, Spotify Wrapped, Wordle, Receiptify, the ChatGPT Ghibli wave. The pattern: low-effort personal input → an output that says something about the user and invites comparison → a share format native to where it's posted, with the brand inside it. Adding friction hurts: Elf Yourself's traffic dropped to 56M after it added registration in 2008.
- **The viral loop alone won't carry you (K < 1).** It multiplies whatever broadcast reach you get. Online popularity is mostly the size of the biggest single broadcast (Goel et al. 2016). Seed broadly (big accounts/pages plus many small creators) and keep the loop's cycle time short. Cycle time matters more than K.
- **Timing, from Google Trends (2025).** Worldwide interest in "black friday" passed 25% of its peak on Nov 20, peaked on BF itself (Nov 28) and fell below 10% by Dec 2. **Europe ramps about 2 weeks earlier** (Germany ≥25% by Nov 11). For **BF 2026 (Nov 27)**, have proven formats by about Nov 13 and post daily Nov 16–30.
- **Measurement.** Cloudflare Web Analytics can't see crawler unfurls, query strings (so no UTMs) or custom events. Log share events and preview-image fetches at the edge with Workers Analytics Engine.

---

## 1. Ranking signals by platform (2025–2026)

### TikTok
- **Core signals.** [Official, 2020-06-18] Recommendations use your interactions (likes, shares, comments, follows, watching), information about the video (captions, sounds, hashtags) and device/account settings (weak signals). Finishing a longer video counts for more than weak signals. **Follower count and past hits are not direct factors.** This is old but still TikTok's canonical explanation.
- **2025 guidelines** [Official, effective 2025-09-13]. The system looks at what people like, share, comment on and **search for**, plus what's trending. The following are **not eligible for the For You feed (FYF)**:
  - reused or unoriginal content without creative edits, *"such as clips that show someone else's watermark or logo"*;
  - low-quality, minimally edited clips;
  - tricks to boost engagement ("like-for-like" promises, false incentives, misleading claims);
  - **commercial content not disclosed with the content-disclosure toggle**. Promoting your own business, product or service counts.
- **AI content** [Official, same guidelines]. You must label realistic-looking AI people or scenes, with the AIGC label or a clear caption, sticker or watermark. Unlabelled content may be removed, restricted or labelled by TikTok.
- **Users can now turn AI down** [Official, 2025-11-19]. TikTok is testing an AI-content slider in Manage Topics. It is also adding invisible watermarking and C2PA credentials, and says it has labelled 1.3B+ videos. [Analysis] Some viewers will actively suppress AI clips, so yours have to be funny enough to win anyway.
- **US ownership** [Reporting, 2026-01-22]. The TikTok USDS Joint Venture (Oracle, Silver Lake, MGX et al.) took over US operations; the algorithm will be adjusted over time for US users. What this means for EU posters reaching US viewers is unknown.
- **Ad-creative guidance** [Official, updated 2025-06]: 9:16, at least 720p, sound on, hook within the first 6 s, key idea within the first 3 s.
- **Links** [Lore]. Captions don't produce clickable links; the website link lives in the bio. The spoken and on-screen domain is the call to action.

### Instagram Reels
- **Top signals** [Official statement, 2025-01-22, via Social Media Today]. Mosseri: *"The top three signals ... are watch time, likes and sends."* Likes weigh a bit more for **connected** reach (followers), sends a bit more for **unconnected** reach (new people).
- **What they predict and what they bury** [Official, 2023-05-31]. The key predictions are whether you'll **reshare**, **watch to the end**, like, or open the audio page. Reels that are low-resolution, **watermarked**, muted, **bordered**, **mostly text** or previously posted are shown less.
- **Trial Reels** [Official, 2024-12-10]. A Reel is shown to non-followers first, with metrics after about 24 h, and can be auto-shared to followers if it does well within **72 h**. This is a free A/B test for hooks.
- **Originality** [Official, 2026-04-30]. Accounts that mostly post non-original photos, carousels or Reels are no longer recommended to non-followers. A frame, watermark, subtitle or credit line doesn't make a repost original. Eligibility comes back over a rolling 30-day window.
- **AI-person profiles** [Official, 2026-08-31]. Profiles that depict AI-generated people should turn on the **"AI-generated profile"** label. Unlabelled ones lose reach; labelled ones don't.
- **Meta AI labels** [Official, 2024]. The "AI info" label (renamed from "Made with AI" in July 2024) is applied when Meta detects C2PA/IPTC-style metadata or when you self-disclose. A label alone doesn't demote content; content fact-checked as false is shown lower.
- **"Your Algorithm"** [Reporting, 2025-12]. Users can see and adjust the topics driving their Reels feed. The US got it first.
- **Engagement bait** [Official, 2017-12-18, Facebook]. Meta demotes posts that explicitly ask people to like, share, tag, comment or vote. I couldn't load Instagram's current guideline page, so assume a similar risk on IG.

### YouTube Shorts
- **Views** [Official, from 2025-03-31]. A view counts every time a Short **starts or replays**. The old metric survives as **"engaged views"**, which still decides YouTube Partner Program eligibility and revenue. Shorts can be up to **3 minutes**.
- **How distribution works** [Official statements, 2023-08-28, Todd Sherman, Shorts product lead]:
  - YouTube looks at whether people chose to watch or swiped away; there's a **"viewed vs. swiped away"** analytics metric.
  - New Shorts get exploratory views, and weak early numbers aren't final.
  - There's no magic posting frequency. Story matters more than length.
- **Links** [Official, from 2023-08-31]. Links in Shorts descriptions and comments aren't clickable. Use channel links and on-screen URLs.
- **Scale** [Reporting, 2025-06]. 200B daily Shorts views (70B reported in March 2024), partly inflated by the new view definition.
- **AI disclosure** [Official]. Realistic synthetic content must be disclosed at upload. YouTube says disclosure doesn't limit audience or revenue.

### X
- **2023 open-source weights** [Official code, 2023-04-05]. Replies (13.5), replies the author engaged with (75), good profile clicks (12) and good clicks (11) dominated. Likes were 0.5 and retweets 1. Reports were −369.
- **2026 Grok-based ranker** [Official code, open-sourced **2026-01-20**, updated 2026-05-15, weights clarified 2026-08-14].
  - A transformer model predicts the probability of about 20 actions; score = Σ weight × P(action).
  - Default weights: **copy-link share 20**, DM share 5, reply 5, quote 5, follow 4, share 2, repost 1, like 0.5, click 0.3, open link 0.2. Negatives: report −234, mute −58.8, not interested −47.5, block −31.2.
  - Replies between mutual follows get a +15 boost.
  - Posts from accounts you don't follow are discounted, and repeat authors decay.
- **Cold-start lift** [Official code; my reading]. Posts qualify if the author has **≤1,000 followers**, the post is **<48 h old** and has **<1,000 impressions**. Such a post can be moved up to about slot 15–16 of a feed.
- **Brigading doesn't work** [Official code comment]. Only engagement on posts **served in the Home timeline** counts. Pushing a post through a group chat "has no ranking impact".
- **What changed** [Analysis]. The weight moved from replies toward **sharing out of X**. The code has no explicit link penalty, but opening a link is worth only 0.2, so the joke has to work inside the post.

### Bluesky
- **Size and feeds** [Reporting, as of 2026-08]. 46M+ registered accounts, but activity fell after the January 2025 peak. Feeds are Following (chronological), Discover (algorithmic) and custom feeds; video up to 3 min since 2025-03. I found no published ranking weights.
- **Character** [Lore]. Link posts with preview cards feel native, and custom humour feeds exist. It's a decent secondary room.

### Reddit
- **Site rules** [Official, current Reddit Rules]. Rule 2: follow each community's rules, participate authentically where you have a personal interest, and no spam or content manipulation.
- **Self-promotion norms** [Lore]. The "9:1" self-promotion ratio and "be a Redditor with a website, not a website with a Reddit account" are widely cited. Always say you made it.
- **r/InternetIsBeautiful** [Reporting/observed, 2026]. About 16.6M members and heavily curated. "No AI-Based Content" is one of its most common removal flairs, and an April 2026 mod post targeted generic, repetitive sites. I couldn't fetch the exact rules, so read the sidebar. Lead with the Shit Finder toy, not the AI clips.

### Hacker News
- **Show HN rules** [Official, current]. It must be something people can **play with** and non-trivial:
  - no signups in the way;
  - no landing pages or blog posts;
  - *"Don't post quickly-generated one-offs; anybody can do that now."*
  - never ask friends to upvote.
- **General guidelines** [Official, current]. Don't use HN mainly for promotion; no clickbait titles; **don't post generated or AI-edited text**.

### Product Hunt
- **Mechanics** [Official launch guide, current]:
  - The day resets at **12:01 am PT**.
  - Ranking depends on upvotes, comments, time since posting and undisclosed other factors. The homepage shows curated "featured" launches by default.
  - You may not ask for upvotes; ask for feedback. Paid votes get you banned. Only personal accounts can post. There's no advantage to a third-party hunter.
- **PH's own numbers** [Official, current]:
  - 70% of Product of the Day/Week/Month winners had a first comment from the maker.
  - About 53% of Product of the Day winners since 2021 had a video.
  - Weekend launches get 15% more "Visit" clicks.

---

## 2. Video hooks & retention — evidence vs. lore

| Claim | Evidence | Tag |
|---|---|---|
| People register feed content almost instantly | Facebook IQ (2016-04-20): recall after **0.25 s** of exposure; average time on a piece of mobile feed content 1.7 s (desktop 2.5 s). | [Research] (old) |
| Most of an ad's recall effect happens early | Nielsen for Facebook (2015, 173 studies): people who watched under 3 s produced **up to 47%** of a campaign's recall lift; up to 74% came within 10 s. Caveat: only campaigns that already showed positive lift, and Facebook commissioned it. | [Research] |
| Put the key message up front | TikTok (2020-10-21): 63%+ of the highest-CTR ads showed the key message in the first 3 s. About 40% of top ads used text overlays; about a third addressed the viewer directly. | [Official] |
| Vertical wins on TikTok | TikTok (2020): vertical video had about **25% higher 6-second view rates**. | [Official] |
| Sound | Facebook (2016): design feed video to work with sound off; captions raised view time 12%. TikTok/Kantar (2021): 88% of users call sound essential. So: **write for sound-on, caption for sound-off.** | [Official]/[Research] |
| Replays count | YouTube: every replay is a view (2025-03-31). TikTok and Reels also count replays (RouteNote, 2025-03). | [Official]/[Reporting] |
| Text-heavy or bordered Reels do worse | Instagram (2023-05-31). | [Official] |
| Pattern interrupt at 1–2 s; "Part 2" cliffhangers; seamless loops | Common advice; no platform data. | [Lore] |
| Recurring named characters build audience | Italian brainrot (2025): named, absurd, remixable characters plus fan lore, later trading cards, a Panini album, Roblox and Fortnite skins (2026-04). | [Reporting] |
| AI models repeat jokes | Veo 3 (2025) "tended to repeat the same joke" across prompts. Popular formats were fake street interviews, hauls and vlogs. | [Reporting] |
| Ideal length | No credible cross-platform number. YouTube says story beats length. 7–15 s loops are the default for a single gag. | [Official]/[Lore] |

**Bottom line** [Analysis]. The measurable part of a hook is whether people swipe away in the first second (YouTube's viewed-vs-swiped; 3-second hold elsewhere). Frame 1 has to work as a silent still (big text plus a striking image) *and* as audio (a spoken first line with no dead air).

---

## 3. The share unit

**What people share** [Analysis]: screenshots of result cards (Wordle grid, Wrapped card, receipts), links that unfurl into a card, and clips re-posted natively. Group chats are the main channel: Instagram's "sends" and X's DM and copy-link weights measure exactly that.

**Link previews**
- **Crawlers don't run JavaScript** [Lore, well documented]. Slack, WhatsApp, iMessage and others fetch OG/Twitter tags with no JS and no cookies, so analytics never see them.
- **iMessage** [Lore/doc]. Previews are fetched **from the user's device**, with a user agent containing `facebookexternalhit`/`Twitterbot`.
- **Meta specs** [Official]:
  - use at least 1200×630 (1.91:1), max 8 MB;
  - the crawler only accepts gzip/deflate;
  - set `og:image:width`/`height` so the first share renders instantly;
  - Meta caches images, so use a **new image URL** when you change one.
- **X specs** [Official docs, via secondary summary]. `summary_large_image`: about 2:1, 300×157 up to 4096×4096, under 5 MB; JPG/PNG/WEBP/GIF (first frame only); no SVG. X falls back to `og:` tags for title/description/image; set `twitter:card` explicitly.
- **WhatsApp** [Lore]. It sometimes drops heavy preview images, so keep them to a few hundred KB.

**Sharing from the web on mobile**
- **Web Share API** [Official, MDN/caniuse]. `navigator.share()` needs HTTPS and a tap. It can share `url`, `text`, `title` and **`files`** (check with `canShare`). Works on iOS Safari, Android Chromium and most desktop Chromium/Safari; Firefox doesn't support it. Cancelling throws `AbortError`, which isn't a real error.
- **No direct web → Instagram Stories** [Official]. Only native apps with a Meta app ID can share directly to IG Stories (since 2023). From the web, share a 9:16 image or video *file* through the share sheet.

**Narrowcasting.**
- [Research] Barasch & Berger (JMR 2014): when people share with one person they pick content that's *useful to that person*; broadcasting pushes them toward content that flatters themselves.
- [Analysis] "Send this to the friend who…" turns the joke into a gift for someone specific. Put it **on the site**. In post captions it can read as engagement bait (Meta demotes it; TikTok excludes engagement tricks from the FYF).

**Watermarks** [Official + Analysis]. TikTok (2025) and Instagram (2023/2026) penalise *other platforms'* watermarks and logos, so the old growth trick of an app's watermark travelling with the clip doesn't carry across platforms. Instead, make the brand **part of the content**: an infomercial caption bar, the receipt, a product shot. Don't use a floating corner logo.

**Make the output the ad.** Wordle's grid carried no URL, only the name and puzzle number, and the name was the search term. Spotify's cards carry its design and logo. Sora outputs had a visible moving watermark. Here, the domain *is* the punchline: print it on every artefact.

---

## 4. Generator-style viral loops — case evidence

| Case | Mechanic | Verified numbers | Lesson |
|---|---|---|---|
| **Elf Yourself** (OfficeMax, Dec 2006) | Your face → dancing elf video | About 200 hits/s at launch. After **registration** was added in 2008, traffic fell to **56M**. 2B+ elves over its lifetime. [Reporting] | Seasonal and personal, returns every year. Friction kills it. |
| **JibJab** | "This Land" (2004); face-insertion e-cards from 2007 | 1M+ hits in 24 h; 100M+ visitors a year after the e-cards. [Reporting] | Your face in a joke is the most shareable format there is. |
| **Spotify Wrapped** | Your year as 9:16 story cards | **227M monthly active users** engaged with Wrapped 2023. The 2025 edition included sharing through Messages, "Wrapped Party", **Clubs** and fan leaderboards. [Official] | Identity plus comparison, delivered in the native story format. |
| **Receiptify** (Michelle Liu) | Listening data → **receipt-style** top 10 | Usage figures **unverified**. | The receipt format fits an *order*. |
| **Wordle** (Oct 2021) | Spoiler-free emoji grid + puzzle number | Went viral after the share feature (late Dec 2021): 90 players (Nov 1) → 300k (Jan 2) → 2M+ weekly (mid-Jan); 1.2M results tweeted Jan 1–13. NYT bought it 2022-01-31. [Reporting] | A daily ritual, comparable results, and a share that makes people ask "what is this?" |
| **Barbie Selfie Generator** (2023) | Selfie → "This Barbie is a…" poster | Usage **unverified**; the film's marketing spend was about $150M. [Reporting] | A fill-in-the-blank identity line is endlessly remixable. |
| **ChatGPT Ghibli wave** (2025-03-25) | Your photo → famous style, inside an app people already use | OpenAI: **130M+ users made 700M+ images in week one**. GPUs "melting", then rate limits. [Reporting] | Zero new friction and a flattering output. |
| **Lensa / AI-yearbook apps** (2022–23) | Selfies → stylised portraits | Figures **unverified**. Lensa faced controversy over sexualised outputs. [Reporting] | The flattering self-portrait is the product, and quality control matters. |
| **Sora 2 "cameos"** (2025-09-30) | You and friends inside generated clips | Users reportedly **peaked around 1M, then fell below 500k**, at about $1M/day. The app closed 2026-04-26. [Reporting] | Cameos drive early sharing, but novelty fades and costs pile up. |
| **Veo 3 absurd clips** (2025-05) | 8-s clips with native audio | Fake interviews, vlogs, hauls; Veo 3.1 came 2025-10-15. [Reporting] | Cheap absurdity floods the feed. Writing is what stands out. |
| **Italian brainrot** (2025-01→) | AI creatures + Italian text-to-speech names + fan lore | One clip hit 7M views in mid-Jan 2025, followed by merch and games. [Reporting] | Recurring, named, remixable characters. |

**Shared design properties** [Analysis]
1. Low-effort personal input, with no signup.
2. An output that says something about the user ("so me", or so my friend).
3. Built-in comparison: a number, rank, club or serial.
4. A native share format with the brand inside the image.
5. Instant turnaround.
6. A reason to come back: daily, yearly or seasonal.

---

## 5. Growth-loop math & seeding

- **K and cycle time** [Lore, David Skok]. The viral coefficient K = invites per user × conversion. Cycle time dominates: over 20 days, a **2-day cycle gives about 20k users and a 1-day cycle about 20M**.
- **With K < 1** [Analysis]. Total reach ≈ seed traffic × 1/(1−K). If 20% of visitors share and each share brings 1.2 visits, K = 0.24 and the loop adds about 30% on top of the traffic the platforms send.
- **Broadcast beats chains** [Research, Goel et al., *Management Science* 2016, 1B Twitter diffusion events]. Popularity is **largely driven by the size of the largest broadcast**.
- **Who to seed** [Research]:
  - Hinz et al. (*J. Marketing* 2011): seeding well-connected people was **up to 8× more successful**. They participate more; they aren't more persuasive.
  - Bakshy et al. (WSDM 2011): big cascades are unpredictable, and **"ordinary influencers"** are usually the most cost-effective seeds.
- **What doesn't work** [Official]. Group-chat coordination has no effect on X's ranking. HN and PH ban vote solicitation. Meta demotes engagement bait.
- **Paid amplification** [Official, TikTok Ads help, updated 2026-07]:
  - Minimum daily budget is **$50 per campaign and $20 per ad group**.
  - **Spark Ads** boost an existing organic post (yours, or a creator's via an authorisation code), and all engagement **accrues to that organic post**.
  - The minimums for in-app TikTok Promote and Meta boosts are shown in-app; I couldn't verify them.
  - **I couldn't find credible 2025–26 CPM figures.** Run a €50 test and use your own numbers.

---

## 6. Seasonality & timing

**Google Trends, daily, share of each series' peak** [Data, pulled 2026-09-30]

| Series (2025) | ≥10% | ≥25% | ≥50% | Peak | Back <10% |
|---|---|---|---|---|---|
| "black friday", worldwide | Nov 6 | Nov 20 | Nov 27 | **Nov 28** (BF) | Dec 2 |
| "black friday", US | Nov 20 | Nov 26 | Nov 28 | Nov 28 | Dec 1 |
| "black friday", Germany | Oct 29 | **Nov 11** | Nov 20 | Nov 28 | Dec 2 |
| "black friday", UK | Oct 29 | **Nov 7** | Nov 20 | Nov 28 | Dec 3 |
| "black friday", Portugal | Oct 28 | Nov 15 | Nov 27 | Nov 28 | Dec 2 |
| "black week", Germany | Oct 29 | Nov 9 | Nov 16 | **Nov 24** | Dec 2 |
| "black friday memes", worldwide | Nov 20 | Nov 26 | Nov 27 | Nov 28 | Dec 2 |
| "cyber monday", worldwide | Nov 28 | Nov 30 | Dec 1 | Dec 1 | Dec 3 |

2024 had the same shape (worldwide ≥25% on Nov 21, peak on BF Nov 29). Germany, the UK and Portugal all show a bump on the **Thursday/Friday a week before BF**, when "Black Week" deals start.

**What follows for 2026** [Analysis]
- **Dates**: Thanksgiving Nov 26, **BF Nov 27**, Cyber Monday Nov 30.
- **Europe** starts caring around Nov 7–15 and gets serious from about Nov 19–20. **The US** barely moves until Thanksgiving week.
- **Memes** are a 3-day window (Nov 25–28).
- **Everything dies by Dec 2.**
- **Buy Nothing Day** [Reporting] falls on BF in North America and the UK (Nov 27, 2026) and on Saturday elsewhere. It's natural counter-programming.

**How long content needs to find its audience.** Nobody guarantees a window.
- [Official] Instagram decides on Trial Reels within 72 h.
- [Official] X's cold-start lift covers posts under 48 h old.
- [Official] YouTube keeps testing Shorts after a slow start.
- [Lore] TikTok videos sometimes resurface days later.
- [Analysis] Find your winning formats **by about Nov 13**, then post them daily. Anything made *for* BF day should go up between Nov 24 and 27.

---

## 7. Measurement without cookies

**Cloudflare Web Analytics** [Official FAQ/docs]
- **Tracks**: visits and page views by country, host, **path**, **referrer host**, device, browser and OS; plus Web Vitals.
- **Doesn't log query strings, so no UTMs**, and has no custom events.
- **History**: the last 7 days are unsampled; older data is aggregated to about 10%; about 6 months are kept.
- **Blind spots**: ad-blockers block the JS beacon, and it never sees link-preview crawlers.

**Fill the gap at the edge** [Official, pricing]. Workers Analytics Engine gives 100k data points/day free (Paid plan: 10M/month included) and isn't billed yet. Log:
- `verdict_shown`
- `share_click{channel}`
- `share_done` (`navigator.share` resolved)
- `copy_link`
- `card_download`
- `/v/` and `/c/` arrivals, with a `s=` channel value read server-side
- **preview-image fetches by crawler user agent** (facebookexternalhit, Twitterbot, Slackbot, WhatsApp, TelegramBot, Discordbot) — a lower-bound proxy for link pastes, since platforms cache previews.

**Per-platform metrics to read**
- **Instagram**: sends/shares per reach, watch time, non-follower share.
- **TikTok**: average watch time, % watched to the end, shares, traffic source (For You vs Search).
- **YouTube**: viewed vs. swiped away, engaged views.
- **X**: replies, shares, profile visits.

---

## What this means for Order That Shit

1. **Use full-bleed 9:16 for Reels and don't letterbox.**
   - The in-progress `scripts/make-social-cuts.mjs` puts 16:9 sources in a paper-banded frame. Instagram says bordered Reels are shown less (2023-05-31).
   - For IG, regenerate the characters in 9:16 (the script's `vertical: true` path is already full-bleed). Check that the fal Veo 3.1 route accepts a 9:16 aspect ratio.
   - The banded version is fine to A/B on TikTok and Shorts, where no border penalty is documented.
2. **Master spec for every clip.**
   - **Format**: 1080×1920, H.264, 8–12 s.
   - **Frame 1**: the spoken first line starts immediately, with the same line burned in as a caption of 7 words or fewer, placed centrally away from the UI bands (the script's hook card does this).
   - **Character tag**: e.g. "LINDA · 2:04 AM · VERIFIED CUSTOMER".
   - **Ending**: punchline in the last 1–1.5 s, and a last frame that cuts back into the first.
   - **Brand**: the domain as an infomercial caption bar.
   - **Clean exports**: one per platform, with no other platform's watermark.
   - **Disclosure**: a small "AI-generated satire" line in the end frame.
3. **Test hooks with Trial Reels before publishing.** Candidates: "Customer testimonial #14: Gary." / "It's 2am. Linda has a problem." / "Production is on fire. Marcus has a solution." / "Our CEO responds to Black Friday." Post 3 variants as Trial Reels and ship the winner by its 24–72 h numbers.
4. **Run the characters as a series.**
   - Number the episodes and keep a stable cold open. Use catchphrases ("The shit had tracking. She did not.").
   - Make a sequel only when comments ask for one, and reply to comments with video.
   - A human writes every joke and the model only renders it (Veo repeats jokes, TikTok users can turn AI down, HN bans AI-written text).
5. **Keep the merged share-link design.**
   - It gets the crawler side right: `/v/<id>/` and `/c/` are pre-built pages with one preview image per verdict, and the visitor's words appear on the page but never in the preview card.
   - Add `og:image:width`/`height`/`alt` and `twitter:card=summary_large_image`, and use versioned image URLs.
   - Check the previews in Meta's Sharing Debugger, Slack, WhatsApp, iMessage and Discord.
   - Put a "Diagnose your own shit" button above the fold on every shared page. That button closes the loop.
6. **Make the phone card the personal share unit.**
   - The in-progress `src/lib/receiptImage.ts` draws a 1080×1920 "Order Authorization" in the browser, which is exactly the Receiptify/Wrapped pattern.
   - **Print orderthatshit.com on it** and add a comparison hook: an order number/serial ("#48,213 today") or an archetype ("You're a Linda — 31% of today's customers").
   - Share it as a *file*: `navigator.share({files, url, text})` when `canShare` allows.
7. **Put narrowcast prompts on-site only.**
   - Main button: "Send it". Then **Copy link** (the action X weights highest), WhatsApp/Telegram/X/Bluesky links with pre-filled text, and "Save for Stories".
   - Copy like "Send to the friend who's been 'thinking about it' since March."
   - Keep "tag/share" asks out of post captions (engagement-bait rules).
8. **Privacy and abuse around `?p=`.**
   - The typed problem travels in the URL. Recipients and chat histories see it, and anyone can craft a link that shows arbitrary text on your page.
   - Keep the 80-character cap. Show a one-line note ("your words ride along in the link"). Frame the text as "a customer wrote:". Add a small blocklist.
   - Cloudflare Web Analytics won't log it, which is good.
9. **"Generate some shit" v1: instant and templated.**
   - One text line, no signup. Show verdict + archetype + card in under 2 s.
   - Optional video: a **pre-rendered** character clip with the visitor's line composited into the caption bar, done in the browser or at build time.
   - **Don't run live generation per visitor.** The pipeline notes cost Veo 3.1 Fast at about **$0.15/s (≈$1.20 per 8-s clip)** before the portrait and voice steps. This branch has no queue or moderation layer for live generation yet, and Sora shows what happens when generation costs meet novelty decay.
   - Save real generation for seeded creators and contests.
   - End every result with permission, not mockery: "You've researched this for 3 weeks. That's due diligence."
10. **Label AI everywhere, on purpose.**
    - **TikTok**: the AIGC label, and the "your brand" disclosure toggle (lower-risk reading of the commercial-content rule, even though nothing is for sale).
    - **YouTube**: "altered or synthetic" = yes.
    - **Meta**: AI info.
    - **Character accounts**: Instagram's "AI-generated profile" label.
    - **The site footer and end cards**: a satire disclosure (EU Art. 50(4), from 2026-08-02).
11. **Playbook by platform.**

| Platform | What to post | Framing | Link | Cadence |
|---|---|---|---|---|
| TikTok | Character episodes; replies to comments with video | Chaotic infomercial | Spoken + on-screen domain; bio | Daily Nov 2–30 |
| IG Reels | The same masters (full-bleed, clean) via Trial Reels; receipt carousels | "This is so [friend]" — easy to send | Bio + Story link sticker | 4–7/week |
| YT Shorts | Loop versions, evergreen titles | "Customer testimonial #N" | On screen | Daily in Nov |
| X | The joke as text plus native clip; quote-post BF discourse | Deadpan brand voice | In a reply or the video (test) | 1–3/day in BF week |
| Bluesky | Link posts that unfurl the verdict card | Web toy | Preview card | A few/week |
| Reddit | The toy, not the ads; say you made it | "I built a satirical store" | Direct | One sub at a time |
| HN | Show HN once playable with no signup | Builder story (static per-verdict previews on Workers) | Direct | Once, on a weekday |
| Product Hunt | A "product" that sells nothing, with video | Joke launch | Direct | Once; weekend of Nov 21–22 [Analysis] |

12. **Seeding plan.**
    - **Big broadcast**: 3–5 attempts via meme pages, humour newsletters, HN/PH/Reddit.
    - **Small seeds**: 20–40 micro-creators (deal-hunters, impulse-buy confessions, office/dev humour for Marcus), each given a custom testimonial, made with consent, to post natively.
    - **No pods**: no engagement pods, no upvote asks.
13. **Paid, only on proven winners.** Once a post beats your median shares-per-view for 48 h, run TikTok Spark Ads on it (minimums $50/day per campaign, $20/day per ad group). Budget about €250–500 across Nov 20–29 for EU and US English audiences, and boost the best Reel similarly. Judge by on-site share rate, not CPM.
14. **Timeline.**
    - **Oct**: build, and post 3–5 times a week to learn which hooks work.
    - **Nov 2–15**: daily posts as Europe ramps up.
    - **Nov 16–22**: creators and PH.
    - **Nov 23–27**: BF content, plus "Buy Nothing Day? Order That Shit Day."
    - **Nov 28–30**: Cyber Monday.
    - **Dec 1**: switch to gifts.
15. **Six metrics, checked daily.**
    - (1) Hook rate: viewed-vs-swiped %, 3-s hold.
    - (2) Completion: % watched to the end, and average watch time ÷ length (>100% means people loop).
    - (3) Sends/shares per reach, or shares per 1k views.
    - (4) On-site share rate: share actions ÷ verdicts shown.
    - (5) Loop coefficient: shared-page arrivals plus crawler unfurls ÷ verdicts shown.
    - (6) Cycle time: median minutes from verdict to the first arrival from its link.
    - Use path-based channel links (`/tt`, `/ig`, `/yt`, `/x`, `/ph`, `/hn`) that log at the edge and then redirect, because Web Analytics only shows paths and referrer hosts.

---

## Pre-launch checklist
- [ ] Full-bleed 9:16 masters for every character; banded variants only for TikTok/Shorts tests; AI labels set on each platform.
- [ ] `/v/` and `/c/` previews verified in the Meta Debugger, Slack, WhatsApp, iMessage and Discord; image dimensions, alt text and `twitter:card` set.
- [ ] Phone card carries the URL plus a comparison hook; Web Share with files, copy link and intent fallbacks tested on iOS Safari and Android Chrome.
- [ ] `?p=` notice, cap and blocklist in place.
- [ ] Satire/AI disclosure on the site and in end cards; TikTok commercial toggle decided.
- [ ] Workers Analytics Engine events and crawler-fetch logging live; path-based channel links.
- [ ] Trial Reels hook tests done; 3 proven formats by about Nov 13.
- [ ] Creator list and meme-page outreach ready, with custom clips made with consent.
- [ ] Show HN and PH copy written by a human; the toy playable with no signup.
- [ ] Paid test budget and kill/scale rules written down.
- [ ] Every platform rule here re-checked the week before posting.

---

## Sources (all accessed 2026-09-29/30)

**Platforms**
- TikTok, "How TikTok recommends videos #ForYou" (2020-06-18): https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you
- TikTok Community Guidelines, effective 2025-09-13 (Open Terms Archive copy): https://github.com/OpenTermsArchive/contrib-versions/blob/main/TikTok/Community%20Guidelines.md · live: https://www.tiktok.com/community-guidelines/en/
- Social Media Today, TikTok guidelines update (2025-08): https://www.socialmediatoday.com/news/tiktok-updates-community-guidelines-misinformation-bullying/757740/
- TikTok, "More ways to spot, shape, and understand AI content" (2025-11-19): https://newsroom.tiktok.com/more-ways-to-spot-shape-and-understand-ai-content?lang=en
- Tubefilter, TikTok AI toggle (2025-11-19): https://www.tubefilter.com/2025/11/19/tiktok-generative-ai-content-toggle-trust-safety/
- Wikipedia, TikTok (US joint venture 2026-01-22): https://en.wikipedia.org/wiki/TikTok
- TikTok for Business, "9 creative tips" (2020-10-21): https://ads.tiktok.com/business/en-US/blog/9-creative-tips-to-drive-auction-ad-performance
- TikTok Ads Help: Creative best practices (2025-06) https://ads.tiktok.com/help/article/creative-best-practices?lang=en · Budget (2026-07) https://ads.tiktok.com/help/article/budget?lang=en · Spark Ads https://ads.tiktok.com/help/article/spark-ads?lang=en
- Social Media Today, Mosseri on ranking signals (2025-01-22): https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/
- Instagram, "Instagram Ranking Explained" (2023-05-31): https://about.instagram.com/blog/announcements/instagram-ranking-explained
- Instagram Creators: Trial Reels (2024-12-10) https://creators.instagram.com/blog/instagram-trial-reels · Original creators (2026-04-30) https://creators.instagram.com/blog/rewarding-original-creators-on-instagram · AI-generated profile label (2026-08-31) https://creators.instagram.com/blog/ai-generated-profile-label
- Tubefilter, Instagram aggregator penalty (2026-04-30): https://www.tubefilter.com/2026/04/30/instagram-removes-algorithm-recommendations-repost-content-aggregator/
- TechCrunch, Instagram "Your Algorithm" (2025-12-10): https://techcrunch.com/2025/12/10/instagrams-new-your-algorithm-tool-gives-you-more-control-over-the-reels-you-see
- Meta, AI labelling approach (2024-04; updated 2024-07/09): https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/
- Facebook, Fighting engagement bait (2017-12-18): https://about.fb.com/news/2017/12/news-feed-fyi-fighting-engagement-bait-on-facebook/
- YouTube Help: Shorts basics (views change 2025-03-31) https://support.google.com/youtube/answer/10059070 · Altered or synthetic content disclosure https://support.google.com/youtube/answer/14328491
- Search Engine Journal, Todd Sherman on the Shorts algorithm (2023-08-28): https://www.searchenginejournal.com/youtube-explains-how-shorts-algorithm-works/494953/
- Malwarebytes, Shorts links made non-clickable (2023-08): https://www.malwarebytes.com/blog/news/2023/08/youtube-makes-sweeping-changes-to-tackle-spam-on-shorts-videos
- Tubefilter (2025-06-18) https://www.tubefilter.com/2025/06/18/youtube-shorts-200-billion-daily-views-google-veo-3-ai-neal-mohan/ · TheWrap https://www.thewrap.com/youtube-shorts-200-billion-daily-views
- RouteNote, How views are counted (2025-03-27): https://routenote.com/blog/how-are-views-counted-shorts-tiktok-reels/
- xai-org/x-algorithm (2026-01-20 → 2026-08-14): https://github.com/xai-org/x-algorithm · weights https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs · cold start https://github.com/xai-org/x-algorithm/blob/main/home-mixer/scorers/author_cold_start.rs
- twitter/the-algorithm-ml heavy ranker (2023-04-05): https://github.com/twitter/the-algorithm-ml/blob/main/projects/home/recap/README.md
- Wikipedia, Bluesky: https://en.wikipedia.org/wiki/Bluesky · Bluesky blog: https://bsky.social/about/blog
- Reddit Rules: https://redditinc.com/policies/reddit-rules · r/InternetIsBeautiful stats: https://gummysearch.com/r/InternetIsBeautiful
- Hacker News: https://news.ycombinator.com/showhn.html · https://news.ycombinator.com/newsguidelines.html
- Product Hunt: https://www.producthunt.com/launch · https://www.producthunt.com/launch/preparing-for-launch · https://www.producthunt.com/launch/how-product-hunt-works · https://www.producthunt.com/launch/sharing-your-launch

**Hooks and attention**
- Facebook IQ, "Capturing Attention in Feed" (2016-04-20): https://www.facebook.com/business/news/insights/capturing-attention-feed-video-creative
- MarTech, Facebook–Nielsen study (2015): https://martech.org/even-brief-video-views-drive-brand-lift-facebook-nielsen-study-finds/
- 3Play Media, Facebook's 12% captions finding (2016; post dated 2020-07-28): https://3playmedia.com/blog/captions-increase-viewership-for-facebook-video-ads
- Social Media Today, TikTok/Kantar sound study (2021-06-09): https://www.socialmediatoday.com/news/tiktok-shares-new-insights-into-the-importance-of-sound-for-marketing-promo/601569

**Share mechanics**
- Meta, Images in link shares: https://developers.facebook.com/docs/sharing/webmasters/images · Sharing to Stories: https://developers.facebook.com/docs/instagram-platform/sharing-to-stories/
- The SEO Framework KB, X card specs and OG fallback: https://kb.theseoframework.com/kb/twitter-cards-and-x-sharing/ (official page: https://developer.x.com/en/docs/x-for-websites/cards/overview/markup)
- Open Graph protocol: https://ogp.me/
- Simon Willison, "Microbrowsers are everywhere" (2019-12-18): https://simonwillison.net/2019/Dec/18/microbrowsers-are-everywhere/
- Centinel Analytica, Apple link-preview fetcher: https://docs.centinelanalytica.com/crawlers/apple-link-preview
- MDN, Navigator.share(): https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share · caniuse: https://caniuse.com/web-share
- Barasch & Berger, *JMR* (2014): https://doi.org/10.1509/jmr.13.0238

**Generators**
- Wikipedia: Elf Yourself https://en.wikipedia.org/wiki/Elf_Yourself · JibJab https://en.wikipedia.org/wiki/JibJab · Wordle https://en.wikipedia.org/wiki/Wordle · Barbie (film) https://en.wikipedia.org/wiki/Barbie_(film) · GPT Image https://en.wikipedia.org/wiki/GPT_Image · Lensa https://en.wikipedia.org/wiki/Lensa · Sora https://en.wikipedia.org/wiki/Sora_(text-to-video_model) · Veo https://en.wikipedia.org/wiki/Veo_(text-to-video_model) · Italian brainrot https://en.wikipedia.org/wiki/Italian_brainrot
- Spotify Newsroom (2024-12-04) https://newsroom.spotify.com/2024-12-04/10-years-spotify-wrapped/ · (2025-12-03) https://newsroom.spotify.com/2025-12-03/2025-wrapped-user-experience/
- Receiptify: https://receiptify.herokuapp.com/

**Growth and seeding**
- David Skok, "Lessons Learned – Viral Marketing": https://www.forentrepreneurs.com/lessons-learnt-viral-marketing/
- Goel et al., *Management Science* (2016): https://doi.org/10.1287/mnsc.2015.2158
- Hinz et al., *J. Marketing* (2011): https://doi.org/10.1509/jm.10.0088
- Bakshy et al., WSDM (2011): http://snap.stanford.edu/class/cs224w-readings/bakshy11influencers.pdf

**Timing, measurement, regulation**
- Google Trends (pulled 2026-09-30): https://trends.google.com/trends/explore?q=black%20friday
- Wikipedia: Black Friday https://en.wikipedia.org/wiki/Black_Friday_(shopping) · Buy Nothing Day https://en.wikipedia.org/wiki/Buy_Nothing_Day
- Cloudflare: Web Analytics FAQ https://developers.cloudflare.com/web-analytics/faq/ · Dimensions https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/ · Analytics Engine pricing https://developers.cloudflare.com/analytics/analytics-engine/pricing/
- EU AI Act, Art. 50 (applies 2026-08-02): https://artificialintelligenceact.eu/article/50/ — **unverified**: whether the EU's late-2025 "digital omnibus" proposals changed any Art. 50 timing.

**Couldn't verify:** usage numbers for Receiptify, the Barbie Selfie Generator and Lensa/AI-yearbook apps; exact r/InternetIsBeautiful rules; minimums for TikTok Promote and Meta boosts; current CPM benchmarks; WhatsApp's preview-image size limit; Instagram's current engagement-bait wording; whether the fal Veo 3.1 route supports 9:16.
