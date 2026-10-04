/**
 * Ad spots: parodies of real ad genres, built from several generated shots, a voiceover,
 * a music bed and branded supers. Rendered by scripts/make-ads.mjs.
 *
 * Why genre parodies: everyone already knows the grammar of a pharma ad, an infomercial, a
 * nature documentary and a perfume ad, so the audience does half the joke. The violation is
 * the ad grammar selling a box that fixes nothing; it stays benign because nobody is hurt
 * and the product admits it. See docs/research/02-humor-and-satire.md.
 *
 * Shot fields:
 *   prompt    Veo 3.1 Fast prompt (text-to-video, or image-to-video when `keyframe` is set)
 *   keyframe  optional FLUX 1.1 Ultra prompt for a first frame (use it when packaging text must be legible)
 *   duration  "4s" | "6s" | "8s" (billed per second; generate only what the cut uses)
 * Timeline fields (seconds on the finished spot):
 *   cut       [shotId, in, out, { gain?, duck? }] in order; the spot is these trims played back to back.
 *             gain sets that cut's own audio level; duck lowers the music under on-screen dialogue
 *   vo        voiceover lines: { at, text, voice, tempo? } (ElevenLabs v3; tempo speeds up legal reads)
 *   lines     on-screen speech that Veo generates inside a shot, captioned: { at, dur, text }
 *   supers    { from, to, kind, text } — kind: tag | lower | legal | title | burst | serif | whisper | endcard
 *   voCaptions  false to skip the automatic VO captions (for spots that caption in their own type)
 */

const NO_TEXT = "No text, no subtitles, no captions, no logos, no watermarks.";
const BOX = "a plain brown cardboard shipping box";

export const spots = [
  {
    id: "pharma",
    title: "Ask your doctor",
    music: {
      prompt:
        "Gentle, uplifting acoustic guitar and soft piano, warm hopeful pharmaceutical television commercial background music, slow tempo, major key, no vocals, no drums",
      gain: 0.32,
    },
    shotGain: 0.35,
    shots: [
      {
        id: "beach",
        duration: "6s",
        // The first wording ("barefoot", "pharmaceutical") tripped Veo's prompt checker.
        prompt: `Cinematic slow-motion golden-hour shot on a beach, vertical framing. A happy middle-aged couple in white linen clothes strolls along the waterline, laughing, and the man carries ${BOX} under his arm like a treasured surfboard. Warm backlight, lens flare, shallow depth of field, glossy television commercial look. Sound of gentle waves and wind. ${NO_TEXT}`,
      },
      {
        id: "kayak",
        duration: "6s",
        prompt: `Cinematic sunrise shot on a misty mountain lake, vertical framing. A serene woman in her forties paddles a red kayak; ${BOX} sits in the front seat of the kayak wearing a tiny orange life jacket. Soft light, calm water, glossy pharmaceutical commercial look. Sound of paddles and birds. ${NO_TEXT}`,
      },
      {
        id: "dance",
        duration: "6s",
        prompt: `Cinematic slow-motion shot in a sunlit park, vertical framing. A joyful man in his seventies in a cardigan slow-dances with ${BOX}, twirling it like a dance partner, while friends on a picnic blanket behind him applaud. Golden light, glossy pharmaceutical commercial look. Sound of light applause and birdsong. ${NO_TEXT}`,
      },
      {
        id: "doctor",
        duration: "6s",
        prompt: `Warm, softly lit doctor's office, vertical framing. A kind female doctor in her fifties in a white coat hands ${BOX} to a relieved patient, then turns to the camera, leans in and says warmly and sincerely: "Honestly? Order that shit." Soft commercial lighting, shallow depth of field. ${NO_TEXT}`,
      },
      {
        id: "product",
        duration: "6s",
        keyframe:
          "Glossy pharmaceutical advertisement product shot, vertical. A plain brown cardboard shipping box stamped THAT SHIT in bold black block letters sits on a clean white pedestal against a soft blue and white gradient background, gentle glow and soft reflections, calm, premium, clinical, photorealistic.",
        prompt: `Slow, gentle push-in on the cardboard box on its white pedestal as soft light sweeps across it and a few particles of light drift upward. Calm ambient pad. ${NO_TEXT}`,
      },
    ],
    // Timings follow the takes: the doctor says "Honestly… order that shit" across ~5 s with a
    // pause in the middle, so she plays alone, loud, with the music ducked.
    cut: [
      ["beach", 0.2, 5.9],
      ["kayak", 0.3, 5.95],
      ["doctor", 0.5, 5.4, { gain: 1.4, duck: true }],
      ["dance", 0.3, 5.6],
      ["product", 0.2, 5.9],
    ],
    vo: [
      { at: 0.3, voice: "Sarah", text: "Do you suffer from problems?" },
      { at: 2.2, voice: "Sarah", text: "Moderate to severe problems? Problems that are, honestly, your own fault?" },
      { at: 7.3, voice: "Sarah", text: "Ask your doctor about That Shit." },
      {
        at: 16.4,
        voice: "Sarah",
        tempo: 1.35,
        text: "Side effects may include: still having the problem, owning a box, telling everyone about the box, refreshing the tracking page, three to five business days of hope, and in rare cases, closure. Do not take That Shit if you are allergic to that shit.",
      },
      { at: 28.5, voice: "Sarah", text: "Ask your doctor if That Shit is right for you." },
    ],
    lines: [
      { at: 11.4, dur: 1.2, text: "Honestly?" },
      { at: 14.1, dur: 2.1, text: "Order *that shit.*" },
    ],
    supers: [
      { from: 0.2, to: 5.6, kind: "lower", text: "Actual couple. Actual box. Not actual." },
      { from: 7.3, to: 11.3, kind: "lower", text: "That Shit™ · the once-a-cart treatment for whatever it is" },
      { from: 0, to: 16.3, kind: "tag", text: "Dramatization" },
      {
        from: 16.4,
        to: 28.2,
        kind: "legal",
        text: "That Shit™ is not a medicine, a treatment, a cure, a product or a thing. Do not operate heavy machinery while waiting for that shit. Tell your doctor about all the shit you have ordered, including shit you forgot about. That Shit™ has not been evaluated by anyone. Results not typical. Results not anything. Individual problems may vary. Ask your doctor if that shit is right for you. It is.",
      },
      { from: 28.3, to: 31.8, kind: "endcard", text: "Ask your doctor if That Shit™ is right for you.|(It is.)" },
    ],
  },

  {
    id: "better-way",
    title: "There's got to be a better way",
    music: {
      prompt:
        "Cheesy upbeat 1990s television infomercial music, bright synth brass stabs, funky slap bass, energetic, cheerful, no vocals",
      gain: 0.3,
    },
    shotGain: 0.55,
    shots: [
      {
        id: "ketchup",
        duration: "4s",
        prompt: `Black-and-white grainy 1990s infomercial "problem" footage, vertical framing, exaggerated and theatrical. A man in a kitchen squeezes a ketchup bottle and it explodes all over his face and shirt; he throws his hands up in despair. Comedic splat sound and a frustrated groan. ${NO_TEXT}`,
      },
      {
        id: "closet",
        duration: "4s",
        prompt: `Black-and-white grainy 1990s infomercial "problem" footage, vertical framing, exaggerated and theatrical. A woman opens a closet and an avalanche of clothes, shoes and a vacuum cleaner falls on top of her; she sighs dramatically from under the pile. Crash sound. ${NO_TEXT}`,
      },
      {
        id: "rain",
        duration: "4s",
        prompt: `Black-and-white grainy 1990s infomercial "problem" footage, vertical framing, exaggerated and theatrical. A man in a bathrobe is locked out of his house in pouring rain, holding a soggy newspaper over his head and shaking his fist at the sky. Rain and thunder. ${NO_TEXT}`,
      },
      {
        id: "host",
        duration: "6s",
        keyframe:
          "Bright, saturated 1990s television infomercial studio in full color, vertical. An over-enthusiastic male host in his forties with big hair and a loud purple suit and a headset microphone stands next to a spinning pedestal holding a plain brown cardboard box stamped THAT SHIT in bold black block letters, sparkles and stage lights, a cheering studio audience in the background. Photorealistic, slightly overexposed VHS broadcast look.",
        prompt: `The host throws his arms wide toward the box on the spinning pedestal and shouts with huge enthusiasm: "Introducing: that shit!" The studio audience cheers and applauds wildly. Bright 1990s infomercial energy. ${NO_TEXT}`,
      },
      {
        id: "more",
        duration: "6s",
        // Same host as the previous shot: start from its keyframe.
        keyframeFrom: "host",
        prompt: `The host turns to the camera and shouts "But wait, there's more!" as dozens of plain brown cardboard shipping boxes rain down from the ceiling and bury him, while the studio audience cheers. Comedic, chaotic, bright 1990s infomercial. ${NO_TEXT}`,
      },
      {
        id: "operators",
        duration: "4s",
        prompt: `A bright 1990s call center, vertical framing. Rows of telephone operators wearing headsets are all fast asleep on their desks; one is snoring with his mouth open; every phone is ringing and nobody answers. Comedic, bright colors. Sound of many phones ringing and loud snoring. ${NO_TEXT}`,
      },
    ],
    cut: [
      ["ketchup", 0.0, 3.2],
      ["closet", 0.2, 3.4],
      ["rain", 0.2, 3.3],
      ["host", 0.0, 5.8, { gain: 1.3, duck: true }],
      ["more", 0.0, 5.8, { gain: 1.3, duck: true }],
      ["operators", 0.0, 3.9],
    ],
    vo: [
      { at: 0.2, voice: "Roger", text: "Does this happen to you?" },
      { at: 3.6, voice: "Roger", text: "Are you sick and tired of... everything?" },
      { at: 7.0, voice: "Roger", text: "There's got to be a better way!" },
      { at: 12.2, voice: "Roger", text: "It won't fix a thing. But you'll feel incredible about it!" },
      { at: 18.4, voice: "Roger", text: "Order now and we'll double it! It's still nothing!" },
      { at: 21.6, voice: "Roger", text: "Operators are standing by! Order that shit dot com!" },
    ],
    lines: [
      { at: 9.5, dur: 2.2, text: "Introducing: *that shit!*" },
      { at: 15.7, dur: 2.0, text: "But wait, *there's more!*" },
    ],
    supers: [
      { from: 0, to: 9.7, kind: "tag", text: "Actual footage of you" },
      { from: 9.7, to: 21.3, kind: "burst", text: "$19.99|$0.00" },
      { from: 12.2, to: 15.4, kind: "lower", text: "Results not typical. Results not anything." },
      { from: 21.5, to: 25.4, kind: "title", text: "Operators are *standing by*" },
      { from: 25.4, to: 29.0, kind: "endcard", text: "Order That Shit™|It won't fix a thing. You'll feel incredible." },
    ],
  },

  {
    id: "migration",
    title: "The Great Migration",
    music: {
      prompt:
        "Epic orchestral nature documentary score, sweeping strings, soft french horns, sense of awe and wonder, slow build, no vocals, no drums at first",
      gain: 0.34,
    },
    shotGain: 0.4,
    shots: [
      {
        id: "lot",
        duration: "6s",
        prompt: `Epic aerial drone shot at dawn in winter over a huge shopping-center parking lot, vertical framing. Thousands of shoppers in winter coats wait in a long snaking line, breath fogging in the cold blue light. Majestic nature-documentary cinematography. Wind and a distant murmuring crowd. ${NO_TEXT} No store signs.`,
      },
      {
        id: "stampede",
        duration: "6s",
        prompt: `Slow-motion telephoto shot, vertical framing: a crowd of shoppers sprints through opening glass doors like a wildebeest migration, coats flapping, shopping bags flying, dust in the air, dramatic backlight, nature-documentary style. Thundering footsteps. ${NO_TEXT} No store signs.`,
      },
      {
        id: "bed",
        duration: "6s",
        prompt: `Soft dawn light in a cozy bedroom, vertical framing. A man in his thirties lies in bed under a thick white duvet, lazily taps his phone once, smiles contentedly and pulls the duvet over his head. Intimate nature-documentary framing, as if observing a rare animal. Quiet morning birdsong. ${NO_TEXT}`,
      },
      {
        id: "doorstep",
        duration: "6s",
        prompt: `Macro slow-motion golden-hour shot, vertical framing: a delivery driver's gloved hands gently place ${BOX} on a doormat, filmed with the reverence of a nature documentary. Warm backlight, shallow depth of field, a few leaves drifting. ${NO_TEXT}`,
      },
      {
        id: "door",
        duration: "6s",
        prompt: `A man in a fluffy bathrobe opens his front door, sees ${BOX} on the doormat, and slowly lifts it high above his head toward the sky in triumphant slow motion, golden backlight, birds flying past, epic and majestic. ${NO_TEXT}`,
      },
    ],
    cut: [
      ["lot", 0.2, 5.8],
      ["stampede", 0.4, 5.8],
      ["bed", 0.1, 5.95],
      ["doorstep", 0.3, 4.6],
      ["door", 0.2, 5.9],
    ],
    vo: [
      { at: 0.4, voice: "George", text: "Every November, the great migration begins." },
      { at: 3.6, voice: "George", text: "Driven by an ancient instinct... fifty percent off... they gather in their thousands." },
      { at: 11.2, voice: "George", text: "But one of them... has evolved." },
      { at: 13.5, voice: "George", text: "He ordered that shit. From bed. At twelve oh one." },
      { at: 21.4, voice: "George", text: "Three to five business days later... nature is healed." },
    ],
    lines: [],
    supers: [
      { from: 0.2, to: 3.4, kind: "title", text: "Black Friday|*a nature documentary*" },
      { from: 11.1, to: 16.8, kind: "lower", text: "Homo orderans. Rarely leaves bed." },
      { from: 26.3, to: 30.0, kind: "endcard", text: "This Black Friday,|order that shit from bed." },
    ],
  },

  {
    id: "fragrance",
    title: "SHIT. The fragrance.",
    music: {
      prompt:
        "Sultry minimal French electronic perfume commercial music, slow deep bass pulse, breathy pads, elegant and mysterious, no vocals",
      gain: 0.38,
    },
    shotGain: 0.3,
    shots: [
      {
        id: "balcony",
        duration: "6s",
        prompt: `Black-and-white high-fashion perfume commercial in slow motion, vertical framing. A striking woman in a black silk dress stands on a Paris balcony at night, the wind blowing her hair and the sheer curtains; she slowly turns to the camera with an intense, smouldering gaze. Grainy 35mm film look, dramatic. Wind. ${NO_TEXT}`,
      },
      {
        id: "splash",
        duration: "4s",
        keyframe:
          "Black-and-white luxury perfume advertisement product shot, vertical. A tiny plain brown cardboard shipping box with an elegant glass perfume atomizer bulb attached to its top, falling into dark water, dramatic rim light, frozen water droplets, glossy, high fashion, photorealistic. The box is completely blank: no label, no text, no writing anywhere.",
        seed: 91,
        prompt: `Ultra slow-motion: the tiny cardboard perfume box plunges into dark water, a crown of droplets glitters in the rim light. Deep whoosh and splash. ${NO_TEXT}`,
      },
      {
        id: "whisper",
        duration: "4s",
        prompt: `Black-and-white extreme close-up of a woman's lips and chin in soft light, vertical framing. She leans toward the camera and whispers slowly in a breathy French accent: "Shit." Grainy 35mm, sensual, intimate. ${NO_TEXT}`,
      },
    ],
    // The classic order: the model, the whispered name, then the bottle with the name on it.
    cut: [
      ["balcony", 0.2, 5.8],
      ["whisper", 0.0, 2.2, { gain: 1.6, duck: true }],
      ["splash", 0.0, 3.8],
    ],
    vo: [{ at: 9.0, voice: "Charlotte", text: "Par Order That Shit." }],
    voCaptions: false,
    lines: [],
    supers: [
      { from: 5.7, to: 7.8, kind: "whisper", text: "« Shit. »" },
      { from: 8.0, to: 13.8, kind: "serif", text: "SHIT|Eau de Having Ordered It" },
      { from: 9.0, to: 13.8, kind: "whisper", text: "par Order That Shit" },
      { from: 8.0, to: 13.8, kind: "tag", text: "AI-generated · orderthatshit.com" },
    ],
  },
];
