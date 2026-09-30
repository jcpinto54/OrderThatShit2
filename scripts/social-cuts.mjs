/**
 * Vertical (9:16) social cuts of the video testimonials, for TikTok / Reels / Shorts.
 * Rendered by scripts/make-social-cuts.mjs into social/<id>.mp4.
 *
 * - src:      the published clip in public/videos/ (master: the full-res render in .cache, used if present)
 * - vertical: true for native 9:16 clips (full-bleed; the hook shows for the first 3 s only)
 * - cropX:    left edge of the 720px-wide square crop, in the 1280x720 source (keeps the face big)
 * - hook:     the text card on top. It is on screen from frame one, so it has to work before
 *             anyone hears a word (most feeds start muted). *stars* mark the highlighted part.
 * - label:    the name tag on the clip. Realistic AI people must be labelled (EU AI Act Art. 50,
 *             TikTok and Instagram rules), so every label says "AI actor".
 * - captionY: optional vertical centre for the captions, when the default would cover a face
 * - zoomTop:  optional top-anchored crop (0–1) to cut off anything burned into the bottom of the take
 * - captions: burned-in captions, [start, end, text] in seconds. Timings come from Whisper
 *             word timestamps of the published clip; *stars* mark words shown in yellow.
 *
 * Captions and hooks are free to rewrite: re-rendering costs nothing (no API calls).
 */
export const cuts = [
  {
    id: "gary",
    src: "public/videos/gary.mp4",
    cropX: 400,
    hook: "Gary, 61, made a choice. *He stands by it.*",
    label: "Gary, 61 · AI actor",
    captions: [
      [0.0, 1.45, "She said it's me *or the shit.*"],
      [1.55, 2.75, "The shit had tracking."],
      [2.8, 3.95, "*She did not.*"],
      [4.05, 5.7, "Three to five business days."],
      [6.0, 8.01, "Exactly as promised."],
    ],
  },
  {
    id: "linda",
    src: "public/videos/linda.mp4",
    cropX: 200,
    hook: "POV: it's 2am and you *finally ordered that shit*",
    label: "Linda, 47 · AI actor",
    captions: [
      [0.2, 1.21, "It was 2 a.m."],
      [1.21, 2.37, "couldn't sleep,"],
      [2.37, 3.45, "so I ordered"],
      [3.45, 4.7, "*that shit.*"],
      [4.8, 5.75, "Still can't sleep,"],
      [5.75, 6.89, "but now"],
      [6.89, 8.01, "it's *next to me.*"],
    ],
  },
  {
    id: "marcus",
    src: "public/videos/marcus.mp4",
    cropX: 290,
    hook: "Prod is down at 3am. *He did the only rational thing.*",
    label: "Marcus, DevOps · AI actor",
    captions: [
      [0.0, 1.45, "Pager went off at 3 a.m."],
      [1.45, 2.79, "Everything was *on fire.*"],
      [2.79, 3.87, "I ordered *that shit.*"],
      [3.87, 5.01, "The fire is still there."],
      [5.01, 6.3, "Morale?"],
      [6.3, 8.01, "*Through the roof.*"],
    ],
  },
  {
    id: "ceo",
    src: "public/videos/ceo.mp4",
    cropX: 460,
    hook: "Founder finally explains *what that shit actually is*",
    label: "Our CEO · AI actor",
    captions: [
      [0.3, 1.41, "When I founded this company,"],
      [1.41, 2.7, "I had one question."],
      [2.9, 4.25, "What is *that shit?*"],
      [4.4, 5.9, "I still don't know."],
      [6.0, 8.01, "But we've sold *millions.*"],
    ],
  },
  {
    id: "ad",
    src: "public/videos/ad.mp4",
    cropX: 280,
    hook: "We made a 2h 14m infomercial. *These are the only 8 seconds that matter.*",
    label: "The Ad · AI-generated",
    captions: [
      [1.25, 2.8, "*Order that shit.*"],
      [2.95, 5.0, "*Order it now.*"],
      [5.2, 8.01, "(2 hours, 13 minutes and 52 seconds remain)"],
    ],
  },

  // ---- Season 2: native vertical, full-bleed. -------------------------------------------------
  {
    id: "diane",
    vertical: true,
    master: ".cache/videos/diane/veo.mp4",
    src: "public/videos/diane.mp4",
    hook: "Part 2: *Gary's wife finally speaks*",
    label: "Diane, 58 · AI actor",
    captions: [
      [0.3, 1.6, "Gary chose *the shit.*"],
      [1.9, 3.5, "So I ordered some shit too."],
      [3.85, 5.4, "Now I *understand him.*"],
      [5.7, 8.0, "We're still not getting back together."],
    ],
  },
  {
    id: "priya",
    vertical: true,
    master: ".cache/videos/priya/veo.mp4",
    src: "public/videos/priya.mp4",
    zoomTop: 0.84,
    captionY: 620, // the crop puts her face low in the frame; captions go up by the fairy lights
    hook: "POV: your order is *out for delivery*",
    label: "Priya, 29 · AI actor",
    captions: [
      [0.0, 1.4, "Refreshed the tracking page"],
      [1.4, 2.65, "forty times today."],
      [2.65, 3.75, "*Out for delivery.*"],
      [3.75, 4.65, "Honestly?"],
      [4.65, 8.0, "Best three words *in English.*"],
    ],
  },
  {
    id: "therapist",
    vertical: true,
    master: ".cache/videos/therapist/veo.mp4",
    src: "public/videos/therapist.mp4",
    trimEnd: 7.2,
    muteAfter: 6.15,
    hook: "Therapist reacts to her best patient's *new coping mechanism*",
    label: "Dr. Helen, 55 · AI actor",
    captions: [
      [0.0, 1.4, "Twenty years as a therapist."],
      [1.4, 2.85, "My best patient just ordered"],
      [2.85, 3.8, "*that shit.*"],
      [3.8, 4.9, "*Cured.*"],
      [4.9, 7.2, "I'm out of a job."],
    ],
  },
  {
    id: "donna",
    vertical: true,
    master: ".cache/videos/donna/veo.mp4",
    src: "public/videos/donna.mp4",
    hook: "Black Friday veteran. *19 years in the field.*",
    label: "Donna, 64 · AI actor",
    captions: [
      [0.0, 1.67, "Nineteen Black Fridays."],
      [1.67, 3.3, "Two *broken wrists.*"],
      [3.5, 5.3, "This year I ordered that shit *from bed*"],
      [5.3, 6.1, "at 12:01,"],
      [6.1, 8.0, "like a *professional.*"],
    ],
  },
  {
    id: "walter",
    vertical: true,
    master: ".cache/videos/walter/veo.mp4",
    src: "public/videos/walter.mp4",
    hook: "83-year-old shares *the only financial advice you need*",
    label: "Walter, 83 · AI actor",
    captions: [
      [0.4, 1.6, "At my age,"],
      [1.6, 3.6, "you don't wait for a sale."],
      [4.2, 8.0, "You order *that shit.*"],
    ],
  },
  {
    id: "kevin",
    vertical: true,
    master: ".cache/videos/kevin/veo.mp4",
    src: "public/videos/kevin.mp4",
    hook: "Customer support has *one (1) solution*",
    label: "Kevin, support · AI actor",
    captions: [
      [0.6, 2.4, "Thank you for calling Order That Shit."],
      [2.5, 5.1, "Your problem is very important to us."],
      [5.25, 8.0, "Have you tried ordering *more shit?*"],
    ],
  },
  {
    id: "luis",
    vertical: true,
    master: ".cache/videos/luis/veo.mp4",
    src: "public/videos/luis.mp4",
    hook: "Delivery driver reveals *what people do when he arrives*",
    label: "Luis, driver · AI actor",
    captions: [
      [0.3, 1.25, "I deliver *that shit.*"],
      [1.3, 2.7, "People cry when they see me."],
      [2.85, 3.9, "Happy crying."],
      [4.45, 5.5, "*Mostly.*"],
      [5.75, 8.0, "I've never seen what's inside."],
    ],
  },
];
