# Research: what makes Order That Shit spread, and why it should make people feel better

Seven briefs, compiled on 29–30 Sept 2026 by research agents and checked against primary
sources (DOIs, publisher pages, regulators, platform documentation). Each one tags its claims
by strength and ends with a section on what it means for this site. This page is the synthesis:
the handful of findings that decide what we build, and where each one comes from.

| # | Brief | The question it answers |
| --- | --- | --- |
| 01 | [Virality science](01-virality-science.md) | Why do people share anything, and how predictable is it? |
| 02 | [Humor and satire](02-humor-and-satire.md) | What makes it funny, what makes satire land, what makes it hurt? |
| 03 | [Retail therapy and permission](03-retail-therapy-and-permission.md) | Why does finally ordering the thing feel good, and where does that turn harmful? |
| 04 | [Platforms, hooks and share design](04-platforms-hooks-and-share-design.md) | How do TikTok, Reels, Shorts, X and link previews decide what spreads in 2026? |
| 05 | [Case studies](05-case-studies.md) | Which joke products, Black Friday stunts and AI ads worked, and why? |
| 06 | [The €1 mystery order](06-mystery-order-business.md) | Is the dropshipped mystery order legal and viable? What to sell instead? |
| 07 | [AI video and user generation](07-ai-video-and-user-generation.md) | Which models, what they cost, and how to let visitors generate safely |

Evidence labels used below: **Robust** (replicated or meta-analytic), **Suggestive** (a few
studies, or one strong one), **Lore** (practitioner knowledge; treat as a bet).

---

## The one-paragraph version

People share things that give them a jolt of high-arousal feeling (amusement, surprise, awe)
and that say something good about them, mostly by sending them privately to one specific
person. Satire lands when it is wrong and safe at the same time, with the joke aimed at the
marketing machine rather than at the buyer. The site's quiet truth is real science: *deciding*
to buy something restores a sense of control and lifts sadness, even when the purchase is
hypothetical, so a fake checkout that grants permission actually delivers the good part. Nobody
can predict which piece will hit, so we make many cheap pieces, measure early speed, and feed the
winners. And the €1 mystery dropship would lose money on every order and is probably illegal as
framed, so the money, if any, comes from things where the product *is* the joke.

---

## Twelve findings that decide what we build

### 1. Arousal beats valence, and funny beats angry for a brand
In the New York Times study, content evoking high-arousal emotions (awe, anger, anxiety,
amusement) was more likely to be shared, and sadness less (Berger & Milkman 2012) **[Robust]**.
Outrage spreads news and politics, but for brands, positive high-arousal content (amusement,
surprise, excitement) drives sharing without the persuasion penalty that provocation carries
(Tellis et al. 2019; Tucker 2015) **[Robust / Suggestive]**. Caveat: the lab experiment that
arousal *causes* sharing failed two replications (brief 01), so treat arousal as the strongest
correlate, not a switch.
→ *"I ordered it and feel good" is a low-arousal feeling.* Deliver it inside a spike (the stamp,
the confetti, the absurdly official receipt) and put the sincere line last.

### 2. People share to look good, and mostly to one person at a time
Sharing is self-presentation, emotion regulation and bonding (Berger 2014 review); talking about
yourself is intrinsically rewarding (Tamir & Mitchell 2012) **[Robust]**. When people send to one
person rather than broadcast, they pick what is useful or fitting for *that* person (Barasch &
Berger 2014) **[Suggestive]**. Platforms now reward exactly that: Instagram ranks on sends per
reach, and X's open-sourced ranker weights "copy link" at 20 and a like at 0.5 (brief 04)
**[Official]**.
→ Every result must be *about the sharer* (their item, their mood, their archetype) and make them
look witty, never broke or sad. Every share surface gets a narrowcast prompt ("send it to the
friend who's been thinking about it since March").

### 3. The preview is the content
59% of news links shared on Twitter were never clicked (Gabielkov et al. 2016) **[Robust]**. Most
people will only ever see the card, the thumbnail or the first frame.
→ The per-verdict preview cards (`/v/<id>/`) and the phone-sized receipt image carry the whole
joke on their own, with the URL printed on them.

### 4. Virality is a lottery with loaded dice
Most shared items reach nobody (73–96% in large datasets), and big hits are usually one large
broadcast rather than a long chain (Goel et al. 2016) **[Robust]**. Social influence makes
success unpredictable (Salganik, Dodds & Watts 2006) **[Robust]**, but early speed predicts
whether something keeps growing, with ~80% accuracy (Cheng et al. 2014) **[Robust]**.
→ Ship many cheap variants, measure the first hours, and put effort and any ad money behind the
top ~10%. Seed broadly (many small creators) and chase one big broadcast (a newsletter, a meme
page, Hacker News, a journalist's round-up).

### 5. Benign violation: wrong and safe at the same time
Humor needs a violation that also feels benign: distant enough, low-stakes, or clearly not real
(McGraw & Warren 2010) **[Suggestive → Robust]**. Distance is the dial: mild mishaps are funniest
up close, tragedies only with distance (McGraw et al. 2012) **[Suggestive]**.
→ The game: *a company sells one undefined product and believes, with total corporate sincerity,
that it cures everything.* Heighten along three dials: a more specific (never tragic) problem, a
bigger corporate apparatus, an even less defined product. Never define the product.

### 6. Aim at the machine, never the customer, and add one warm beat
Mean humor hurts brands (Warren & McGraw 2016) and doesn't soothe anyone; affiliative,
self-enhancing humor does (Samson & Gross 2012; Martin et al. 2003) **[Robust direction]**.
→ The butt is ad-speak, fake urgency, the Black Friday machine and the company itself. Each flow
ends on one deadpan kindness ("You're allowed to want things"). Testimonials use a four-beat
shape: a specific small misery, "I ordered that shit", the problem is still there, an absurd
*silver lining* (Linda's "but now it's next to me").

### 7. Deciding is the part that feels good
Making shopping choices reduced lingering sadness compared with browsing, **even when the
choices were hypothetical** (Rick, Pereira & Burson 2014, *J. Consumer Psychology*); the
mechanism is restored personal control, and it does nothing for anger **[Suggestive: three small
studies, not replicated]**. Anticipation is more intense than retrospection (Van Boven & Ashworth
2007) **[Robust-ish]**.
→ The fake checkout isn't just a joke about retail therapy: it *is* the working part of retail
therapy, minus the spending. The site now says so, citing the study, and lets the visitor stamp
the decision themselves.

### 8. A reason removes the guilt, unless the reason is money
People indulge more when they have a justification based on effort or excellence (Kivetz & Zheng
2006; Okada 2005) **[Robust pattern]**, and a functional alibi helps. Mentioning the money erased
the effect in the experiments.
→ The receipt's "Official Justification" is about effort ("You've already paid for it in
overthinking"), excellence, restraint ("Number 42 gets the day off") or a practical alibi
("It's basically a tool"). No "it's basically free" jokes.

### 9. Where the joke must stop
About 5% of adults buy compulsively (Maraz et al. 2016 meta-analysis) and sadness raises
willingness to pay **[Robust]**. Satire about grief, self-harm or real debt is close *and* severe,
so it isn't benign, and it is the screenshot that turns a joke site into a pile-on (brief 02).
→ Crisis and grief wording gets a straight answer and a helpline link, with nothing to share.
Orders that mention rent or debt are denied ("Rent first, shit second"). The core stays free,
and fake urgency never appears next to a real price.

### 10. Say it's satire, in your own voice, and label the AI
An in-voice "this is a humor site" marker reduced belief in satire more than fact-checks did,
and was resented less (Garrett & Poulsen 2019) **[Suggestive]**. EU AI Act Article 50 has applied
since 2 Aug 2026: realistic AI people count as deepfakes, and the satire exception only lowers
the bar to an unobtrusive label. TikTok and Instagram cut reach for unlabeled AI people (briefs 04,
07) **[Official]**.
→ "AI actor" tags on every cut, "AI actors. Satire. Nothing here is for sale." on every end card,
and the platform's own AI label switched on at upload. Fake quotes credited to real outlets are
gone.

### 11. The winners' pattern: the purchase is the joke
Cards Against Humanity has run one absurd Black Friday stunt a year since 2013: $6 boxes of
actual bull feces (30,000 sold in ~30 minutes, 2014), paying $5 for nothing ($71,145 from 11,248
people, 2015), digging a hole ($100,573, 2016). Pet Rock, the Million Dollar Homepage and Dollar
Shave Club's $4,500 video share the traits: the product *is* the joke, the buyer is in on it, a
real number the press can print, a fixed time, and often a charity kicker (brief 05) **[Reported
figures]**. AI content is loved when openly absurd and hated when it fakes prestige or reality
(Kalshi's ~$2,000 Veo ad vs. Coca-Cola's AI Christmas ads).
→ On a site where everything is fake, the one real thing is the story: a real counter of
authorizations issued, published afterwards.

### 12. The €1 mystery dropship: don't
Since 1 July 2026 every low-value parcel into the EU pays a flat €3 duty per item line, and a €2
per-item handling fee was adopted on 21 Sept 2026. A €1 order costs about €8.60 to fulfil. Framed
as "a gambling thing", a paid draw is a *modalidade afim* under Portugal's DL 422/89, which
for-profit companies may not run. Temu's terms forbid resale, and a dropshipper is likely the
importer under the EU product-safety rules (brief 06) **[Regulation; not legal advice]**.
→ Surprise is fine when every variant has the same value and all are shown before purchase.
Better earners: a mailed physical Order Authorization from Portugal (~€2 margin at €5.99), print-
on-demand merch, or a paid personalised clip. Brief 06 has the full ranking.

---

## Things that sound true and aren't (or aren't proven)

- **"People share angry content more, so be edgy."** True mainly for news and politics; the
  "each moral-emotional word adds ~20%" result failed a re-analysis (brief 01).
- **"The 8-second goldfish attention span."** No source exists for it (brief 01).
- **"Headline wording decides virality."** Wording barely predicts winners: 54% versus 50%
  chance in a large test (brief 01).
- **"Swearing makes brands look honest."** The swearing-honesty link was rebutted; mild,
  uncensored, one-per-beat profanity helps a joke, and stacking it doesn't (brief 02).
- **"Choice overload" and "decision fatigue."** Choice overload averages about zero across
  studies, and decision fatigue failed large replications (brief 03).
- **"Launch everywhere with the same post."** Each platform rewards different framing; Instagram
  down-ranks bordered Reels and reposts with other platforms' watermarks (brief 04).

## How this shaped the current build

| Finding | What changed on the site or in the content |
| --- | --- |
| 1, 7, 8 | The checkout became an **Order Authorization**: mood before (you set it), effort-based justification, a stamp you apply yourself, confetti, then "buying it is optional; the relief isn't". |
| 2, 3 | The receipt is drawn as a **1080×1920 image** with your item, mood, archetype and the URL, shared as a file from your phone. Narrowcast prompts sit next to every share button. |
| 7 | The hero now says what the site actually does, and The Science™ gained **the only real study on the page**. |
| 5, 6 | New testimonials follow the four-beat shape; four **ad-genre parodies** aim at pharma ads, infomercials, Black Friday and perfume ads, never at buyers. |
| 9 | **Care rules** (`src/data/care.ts`): crisis and grief inputs get a straight answer and a helpline in both the checkout and the Shit Finder; rent/debt orders are denied. The "broke" verdict now jokes about us, not about money. |
| 10 | "AI actor" tags, satire end cards, fictional press outlets, AI disclosure on the videos. |
| 2, 4 (04) | Social cuts put no brand in the first frame, keep faces clear, use full-bleed 9:16 for Reels, and label the AI. |
| 12 | No mystery dropship. The plan proposes safer money (see `docs/go-viral-plan.md`). |
