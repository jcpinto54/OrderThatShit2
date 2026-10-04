# Going viral by Black Friday: the revised plan

*Revised 30 Sept 2026. Replaces the 20 Sept memo "Spread that shit". The evidence is in
[`docs/research/`](research/README.md); the posting copy is in
[`docs/launch/posting-kit.md`](launch/posting-kit.md).*

**Black Friday is Friday 27 November 2026** (Cyber Monday 30 Nov, Giving Tuesday 1 Dec). That is
eight weeks from today. Europe's Black Friday interest starts climbing about two weeks before the
US, so the formats that work need to be known by about 13 November.

## The bet, revised

The old bet was "make the joke portable". It still holds, and the share-link work that followed
from it is done. The new bet adds the part the site never said out loud:

> **Ordering that shit fixes nothing, and it makes you feel better anyway.**
> That is real: *deciding* to buy something lifts lingering sadness, even when the purchase is
> hypothetical (Rick, Pereira & Burson 2014). So a fake checkout that grants permission for the
> thing you keep thinking about is the working part of retail therapy, without the spending.

That gives the satire a warm centre and gives visitors something about *them* to share. The
share unit is the **Order Authorization**: a phone-sized receipt with their item, how long it's
been in their head, their mood before and after, and an official justification, stamped by them.

## Where things stand (done on branch `claude/go-viral`)

| | |
| --- | --- |
| **Share links** (old phase 1) | The three open PRs (per-verdict links and cards, cookieless analytics, smoke tests) are merged into this branch. |
| **Order Authorization** | The checkout asks what you've been thinking about, how long, and how you feel. It prints a receipt with your mood before and after, an effort-based justification and your archetype ("A Gary: commits, eventually"). You stamp it yourself. Share it as a 1080×1920 image or a link. Rent/debt orders are denied; crisis wording gets a helpline. |
| **Hero** | A "thing you keep thinking about ordering" box above the fold, the feel-better line, and the real study, cited. The cookie banner waits until you scroll. |
| **The Science™** | "Plot twist: the only real study on this page." |
| **Shit Finder** | Whole-word matching (a vacation is no longer a cat), a tragedy/crisis guard, a kinder "broke" verdict, and 7 new verdicts with their own cards (meetings, inbox, group chat, Sunday scaries, doomscrolling, nothing to wear, Black Friday). |
| **Videos** | 7 new vertical testimonials: Diane (Gary's ex, "Part 2"), Priya, the therapist, Donna, Walter, Kevin, Luis. Plus **4 commercials**: a pharma ad ("side effects may include closure"), a 90s infomercial, a Black Friday nature documentary, and "SHIT. Eau de Having Ordered It". |
| **Social cuts** | 16 vertical, captioned, AI-labelled files in `social/` (11 testimonials + 4 ads + the old ad), ready to post. |
| **Black Friday mode** | Turns itself on 20 Nov and off after Cyber Monday: sale copy, badge, a Black Friday edition of the receipt, and the Black Friday ad leading. Preview with `?bf=1`. |
| **Hygiene** | Fictional press outlets instead of fake quotes from real ones, AI disclosure on all video, and 13 passing smoke tests. |
| **Spend** | About **$28** on fal: $10 on 7 testimonials, $18 on 4 commercials. |

## The plan, week by week

### Week 0 (30 Sep – 4 Oct): ship it
1. **Review and merge `claude/go-viral`** (it contains PRs #1–#3), then deploy. Set
   `CF_BEACON_TOKEN` in Workers Builds so analytics goes live (see README → Analytics).
2. **Accounts:** TikTok, Instagram, YouTube, X and Bluesky under one handle. Mark them as AI
   content where the platform offers it, and switch on each post's AI label.
3. **Back up `.cache/` and `social/`** from the worktree. They hold the paid 1080p masters.

### Weeks 1–2 (5 – 18 Oct): learn what's funny, cheaply
4. **Post 3–5 times a week**, one character or ad per post, rotating through all 15 cuts. On
   Instagram, run two or three hooks per clip as **Trial Reels** and keep the winner.
5. **Log shares at the edge.** Web Analytics can't see query strings or events, so add a tiny
   Worker route that logs share clicks and preview-card fetches (Workers Analytics Engine), plus
   channel links (`/tt`, `/ig`, `/yt`, `/x`, `/hn`, `/ph`) that log and redirect. This is also
   the first server code the site has, so it is a deploy decision (see Decisions).
6. **Check every preview** in Meta's Sharing Debugger, Slack, WhatsApp, iMessage and Discord.

### Weeks 3–4 (19 Oct – 1 Nov): double down on winners, build the stunt
7. **Season 3, made from the data.** Sequels for the top 2–3 characters, since series drive
   follows. Add 10–20 new clips at ~$1.20–4 each, written with the checklist in brief 02, and
   one or two new ad genres if the ads outperform the testimonials (candidates: an Apple-style
   product reveal, a car ad with the delivery van, a movie trailer).
8. **Build the flagship stunt: "Order ONE Thing Friday"** (below): a real counter in a Worker
   and a Durable Object. It counts buckets only, never typed text. 2–4 dev days.
9. **Pitch** humour newsletters, meme pages and the journalists who write "best Black Friday
   stunt" round-ups every year, with a 1 Nov embargo.
10. **If you want a physical product, lock the supplier by 20 Oct** (see Money).

### Weeks 5–6 (2 – 15 Nov): daily
11. **Post daily** on TikTok and Shorts and 4–7 times a week on Reels. Europe ramps first.
12. **Seed 20–40 micro-creators** in the niches each joke flatters: devs (Marcus), insomniacs
    and parents (Linda), deal-hunters (Donna), relationship humour (Gary and Diane), plus
    impulse-buy confessionals. Each gets a custom testimonial they agree to post natively. No
    engagement pods.
13. **Reaction assets:** turn the best beats into GIFs and stickers, including the "APPROVED"
    stamp, Walter's "You order that shit" and Gary's "She did not". Upload them to GIPHY so the
    brand becomes the reply whenever someone asks "should I buy it?" in a group chat.

### Week 7 (16 – 22 Nov): the big broadcast
14. **One room a day**, each framed its own way: r/InternetIsBeautiful (the toy, posted by you),
    Show HN (the build: per-verdict static previews, the ad pipeline), Product Hunt (a product
    that sells nothing; the weekend of 21–22 Nov), X and Bluesky (verdict cards).
15. Black Friday mode switches itself on (20 Nov).

### Week 8 (23 – 30 Nov): Black Friday
16. **"Order ONE Thing Friday"** goes live on 27 Nov, with a 15:00 CET drop (09:00 ET).
17. **Paid, only on proven winners:** once a post beats your median shares per view for 48 hours,
    boost it with TikTok Spark Ads and the Instagram equivalent. Budget about €250–500 across
    20–29 Nov. Google Ads is out: its policy bans profanity on landing pages.
18. **A new drop every day** through Cyber Monday: a verdict pack, a clip, a receipt variant.

### 1 December (Giving Tuesday): the second story
19. Publish **"The Overthinking Report 2026"** with the real numbers: authorizations issued,
    months of overthinking cured, most-ordered categories. Then switch the copy to gifts.

## The flagship stunt: "Order ONE Thing Friday"

Black Friday is for stuff you don't want. On 27 November the site authorizes **one** thing you
do. Every visitor gets a **numbered** Black Friday Authorization (#000001…). A **real** counter,
labelled "Real number. For once.", tracks authorizations issued and months of overthinking cured.
The fake prices *go up* every hour, since it's the only Black Friday deal that gets worse.

**Why it should work:**
- It is the one thing the site genuinely gives people: permission.
- It follows the Cards Against Humanity pattern: an annual absurd stunt, a real number the press
  can print, and a recap afterwards.
- It sits comfortably next to Buy Nothing Day: "Order that shit. Buy nothing."

**Cost:** 2–4 dev days plus ~€5–20/month. **Risk:** low, as long as the numbers are real (hide
the counter until it passes a threshold).

**Optional real-money kicker** (pick at most one; brief 05 has the others):
- **"Nothing. €1."** Pay €1 or more for literally nothing, with net proceeds to a named charity,
  a live euro counter and a numbered "Certificate of Having Ordered Nothing". It needs a charity
  agreement and fraud protection, and fees eat much of €1 (consider a €2 floor).
- **"The Physical Order Authorization"**, mailed from Portugal with one random sticker (all shown
  in advance, all the same value). About €2 margin at €5.99, launchable in ~3 weeks.

## Money: the €1 mystery dropship, and what to do instead

**Verdict: don't**, for Black Friday or later in that form (full reasoning in
[brief 06](research/06-mystery-order-business.md), not legal advice):
- **It loses money on every order.** Since 1 July 2026 every low-value parcel into the EU pays €3
  customs duty per item line. A €2 per-item handling fee was adopted on 21 Sept. A €1 order costs
  about €8.60 to fulfil and breaks even at about €11.
- **It's probably illegal as framed.** Sold as "a gambling thing", a paid draw is a *modalidade
  afim* under Portugal's DL 422/89, which for-profit companies may not run. Stripe also prohibits
  paid entry for a chance at a prize.
- **The supply is closed or unsafe.** Temu's terms forbid resale, and a dropshipper is likely the
  importer under EU product-safety law.
- **Full consumer law applies even at €1:** 14-day withdrawal, the new withdrawal button,
  Portugal's 3-year guarantee.

**What earns instead, ranked:**
1. **The Physical Order Authorization** (€5.99, ~€2 margin). The product is the joke.
2. **A free "Shit Roulette"** revealing real cheap products through disclosed affiliate links.
   There's no gambling risk because nothing is ever *won*. Tiny revenue, but good for spreading.
3. **Print-on-demand merch** ("I Ordered That Shit"), and/or a **€2.99 personalised testimonial**
   (see below).

**The wall rule:** the stock counter that only goes up, the endless sale and the fake purchase
toasts are fine as satire. On any page that takes real money, every claim must be literally true.

## "Generate some shit" (the visitor-made video)

- **v1, now: instant and free.** The receipt already gives each visitor a personal artifact in
  under two seconds. Next step: pre-rendered character clips with the visitor's item composited
  into the caption bar in the browser. That costs ~$0 per use and leaves nothing to moderate.
- **v2, only if v1 shows demand: re-voiced clips.** The visitor fills slots (name, item), never a
  free prompt. ElevenLabs voices the line in the character's voice and it is lip-synced onto a
  pre-rendered clip. Cost ≈ $0.18–0.48 per clip, with a 1–3 minute wait (turn the wait into a
  fake tracking page).
  - **Safety:** whitelists, then moderation, Turnstile, per-person and global daily caps, a
    prepaid fal balance as the hard stop, and C2PA marks (running a generator makes you a
    "provider" under the AI Act).
  - **Pricing:** free with a daily cap that "sells out" fits the joke best, or €2.99 per clip.
- **Never:** free-text prompts or face uploads before Black Friday.

## What to measure (daily, six numbers)

1. **Hook rate**: viewed vs. swiped, and 3-second hold.
2. **Completion**: average watch time ÷ length (above 100% means people loop it).
3. **Sends and shares per 1,000 views**, the ranking signal that matters now.
4. **On-site share rate**: shares ÷ receipts and verdicts shown.
5. **Arrivals per share**: visits from shared links, plus preview fetches, ÷ shares.
6. **Cycle time**: minutes from a verdict to the first visit from its link.

Make many cheap variants, watch the first hours, and put effort (and any money) behind the
top ~10%. Most posts will reach nobody, and that's normal.

## Budget

| Item | Spent | Proposed |
| --- | --- | --- |
| AI video: season 2 + four commercials | ~$28 | – |
| Season 3 content (sequels of winners, 10–20 clips, 1–2 ads) | – | $50–100 |
| Paid boosts on proven winners, 20–29 Nov | – | €250–500 |
| Counter Worker + Durable Object | – | ~€5–20/month |
| Optional: Physical Order Authorization run | – | cost-neutral at €5.99, set a hard loss cap |
| Optional: v2 re-voiced clips | – | $0.18–0.48 per clip, capped daily |

## Guardrails (non-negotiable)

- The joke is aimed at the marketing machine, never at the buyer.
- Crisis and grief get a straight answer; rent and debt get denied.
- At most one "shit" per beat, uncensored, no poop imagery.
- Every AI person is labelled, on the asset and on the platform.
- Nothing typed by a visitor is ever rendered into a preview card the site serves.
- No fake claims next to real money.
- No engagement pods, no upvote asks, no reposts carrying another platform's watermark.

## Decisions only you can make

1. **Merge and deploy `claude/go-viral`?** It includes PRs #1–#3. After merging, those PRs can
   be closed.
2. **Server code:** OK to add a small Worker route (share logging now, the stunt counter later)?
   The site is assets-only today.
3. **Stunt:** "Order ONE Thing Friday" (recommended). Add a real-money kicker ("Nothing. €1."
   for charity, or the €5.99 Physical Authorization) or not? If yes, a Portuguese lawyer and
   accountant should see brief 06's list of questions first.
4. **Content budget:** approve ~$50–100 for season 3, made from what the data says wins?
5. **Boost budget:** approve €250–500 for Black Friday week, winners only?
6. **Who posts?** Reddit, HN and Product Hunt go much better from a real person's account. Is
   that you?
