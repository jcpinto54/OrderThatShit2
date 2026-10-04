/**
 * Cast list for the video testimonials. Each entry drives scripts/generate-videos.mjs.
 *
 * - aspect:         "16:9" (default, the original four) or "9:16" (vertical, native for TikTok/Reels/Shorts).
 * - portraitPrompt: FLUX 1.1 Ultra still in that aspect, used as the face for both routes.
 * - script:         the full spoken line for the talking-head route (TTS + OmniHuman). ~12–15s.
 * - veoLine:        a shorter line that fits Veo's 8-second clip.
 * - voice:          ElevenLabs premade voice name. v3 supports delivery tags like [sighs].
 */
export const characters = [
  {
    id: "linda",
    portraitPrompt:
      "Candid still frame from a laptop webcam video call, 16:9. A tired 47-year-old American woman with shoulder-length dyed-auburn hair, no makeup, faint dark circles, wearing an oversized grey sweatshirt, sitting on a beige couch in a dim living room at 2am. Only light is the blue glow of a television off-frame and a small lamp. She looks straight into the camera with a flat, deadpan, slightly defeated expression, mouth closed. A plain brown cardboard shipping box sits next to her on the couch. Slightly awkward framing, a little too close, natural skin texture, mild webcam noise and compression, realistic, unglamorous, documentary.",
    voice: "Matilda",
    stability: 0.45,
    script:
      "[tired] It was 2am. I couldn't sleep. [sighs] So I ordered that shit. ... I still can't sleep. But now it's next to me. On the nightstand. ... Watching. [flat] Five stars.",
    veoLine: "It was 2am. Couldn't sleep. So I ordered that shit. Still can't sleep. But now it's next to me.",
    veoDirection:
      "Static webcam shot, she barely moves, exhausted deadpan delivery, slight pause before the last sentence, quiet room tone with a TV murmuring off-screen.",
    omniPrompt: "Tired, deadpan woman speaking flatly into a webcam at night, minimal head movement, occasional slow blink, glances at the box once.",
  },
  {
    id: "marcus",
    portraitPrompt:
      "Candid still frame from a video call, 16:9. A 34-year-old Black man, short beard, wearing a black hoodie and a gaming headset around his neck, sitting at a cluttered home-office desk lit by two monitors with terminal windows and a red dashboard glowing. Energy-drink cans, a mechanical keyboard, a cardboard shipping box on the desk. He looks into the camera, wired and sleep-deprived but weirdly upbeat, mouth closed. 3am, monitor glow on his face, natural skin texture, webcam quality, realistic, documentary, unglamorous.",
    voice: "Eric",
    stability: 0.4,
    script:
      "[energetic] The pager went off at 3am. Everything was on fire. So I opened orderthatshit dot com. [pause] Four minutes later, I felt better. ... The fire is still there. But honestly? Morale is through the roof.",
    veoLine: "Pager went off at 3am. Everything was on fire. I ordered that shit. The fire's still there. Morale? Through the roof.",
    veoDirection:
      "Static webcam shot at a desk, monitors glowing, he talks fast with nervous energy and a grin, gestures once at the screens, keyboard clatter and a faint alert beep in the background.",
    omniPrompt: "Wired, sleep-deprived engineer talking fast and grinning into a webcam, animated hand gestures, glances at his monitors.",
  },
  {
    id: "gary",
    portraitPrompt:
      "Candid still frame from a phone video propped on a kitchen table, 16:9. A 61-year-old white American man, grey moustache, reading glasses, plaid flannel shirt, sitting very still at a wooden kitchen table in a tidy suburban kitchen in the afternoon. A plain brown cardboard shipping box sits on the table in front of him with a shipping label. Behind him, a window with net curtains and a driveway. He looks at the camera calmly, mouth closed, the face of a man at peace with a decision. Natural window light, natural skin texture, phone camera quality, realistic, documentary.",
    voice: "Bill",
    stability: 0.6,
    script:
      "[calm] She said, it's me or the shit. ... The shit had tracking. She did not. [pause] Three to five business days. Exactly as promised. ... Reliability matters.",
    veoLine: "She said it's me or the shit. The shit had tracking. She did not. Three to five business days. Exactly as promised.",
    veoDirection:
      "Locked-off phone camera, he speaks slowly and calmly with a flat Midwestern accent, one small nod at the end, kitchen clock ticking, a car pulling out of the driveway faintly outside.",
    omniPrompt: "Calm older man speaking slowly and deliberately at a kitchen table, very little movement, one small nod, hands folded near the box.",
  },
  {
    id: "ceo",
    portraitPrompt:
      "Still frame from a corporate interview video, 16:9. A confident 52-year-old man with silver hair, a navy blazer over an open-collar white shirt, very white teeth, sitting slightly off-center in a glass-walled office with a blurred potted plant and a framed abstract print behind him. Softbox key light, subtle rim light, shallow depth of field. On the desk in front of him, a plain brown cardboard shipping box. He looks at the camera with a warm, practiced founder smile, mouth closed. Polished, slightly too glossy, realistic, high-end camera, corporate video aesthetic.",
    voice: "Brian",
    stability: 0.55,
    script:
      "[warm] When I founded this company, I had one question. ... What is that shit? [pause] I still don't know. [chuckles] But we've sold millions of it. ... And that's the beauty of the business.",
    veoLine: "When I founded this company, I had one question: what is that shit? I still don't know. But we've sold millions.",
    veoDirection:
      "Slow, subtle push-in on a corporate interview setup, he speaks with polished founder confidence, a small self-satisfied chuckle after 'I still don't know', soft office ambience.",
    omniPrompt: "Polished corporate founder giving an interview, warm confident delivery, open-hand gestures, a small chuckle, keeps eye contact.",
  },
  {
    // The "2h 14m ad". No character: a FLUX still of the box, then Veo animates it with a voiceover.
    id: "ad",
    portraitPrompt:
      "Frame from a cheesy 1990s American television infomercial, 16:9. A plain brown cardboard shipping box sits on a mirrored pedestal against a deep blue studio backdrop with a slow lens flare and tiny sparkles. The box is stamped in bold black block letters: THAT SHIT. Dramatic spotlight, slightly overexposed, soft video glow, VHS-era broadcast look, a gold starburst in the corner reading NEW. Realistic photograph of a real box, kitsch product shot.",
    veoPrompt:
      "1990s television infomercial product shot. The camera slowly pushes in on the cardboard box on its mirrored pedestal while it rotates slightly, sparkles glinting, dramatic spotlight sweeping across it. Cheesy triumphant synth music swells. An enthusiastic male announcer voice says: \"Order that shit. Order it now.\" No subtitles, no captions, no on-screen text.",
    // Veo rendered the music but skipped the announcer, so the voiceover is TTS mixed over the clip (the `mix` step).
    voice: "Roger",
    stability: 0.35,
    script: "[excited] Order that shit! [pause] Order it now.",
    mix: { delayMs: 1200, voiceGain: 1.6, musicGain: 0.45 },
  },

  // ---- Season 2: vertical (9:16), native for TikTok / Reels / Shorts. -------------------------
  // Same game as season 1 (a real problem, that shit, the problem stays, the person is weirdly
  // fine), heightened, plus the part the site now says out loud: ordering the thing feels good.
  // Writing rules are in docs/research/02-humor-and-satire.md.
  {
    id: "diane",
    aspect: "9:16",
    portraitPrompt:
      "Candid vertical still from a front-facing phone video. A 58-year-old white American woman with a sharp silver bob and reading glasses pushed up on her head, cream cardigan, sitting on a sofa in a bright, freshly redecorated apartment in the afternoon, a glass of white wine on the side table. A plain brown cardboard shipping box sits on her lap. She looks into the camera with a composed, dry, faintly amused expression, mouth closed. Natural window light, natural skin texture, phone camera quality, realistic, documentary, unglamorous.",
    veoLine: "Gary chose the shit. So I ordered some shit too. Now I understand him. We're still not getting back together.",
    veoDirection:
      "Handheld selfie video, she speaks with dry, measured composure, a small pause before the last sentence, a tiny raise of the eyebrows at the end, quiet apartment ambience.",
  },
  {
    id: "priya",
    aspect: "9:16",
    portraitPrompt:
      "Candid vertical still from a front-facing phone video, late evening. A 29-year-old South Asian woman with long dark hair in a messy bun and an oversized hoodie, lying on her bed, filming herself with the front camera held at arm's length (the phone is the camera and is not in the shot), her whole face clearly visible, soft glow on her face, warm fairy lights on the wall of a small apartment behind her. She looks into the camera wide-eyed and giddy, mouth closed. Natural skin texture, slight phone noise, realistic, documentary, unglamorous.",
    seed: 7,
    veoLine: "I've refreshed the tracking page forty times today. Out for delivery. Honestly? Best three words in English.",
    // This take burned fake subtitles into the bottom of the frame from ~5 s; crop them off.
    zoomTop: 0.84,
    veoDirection:
      "Selfie video lying on a bed, she speaks clearly at normal volume in an excited, giddy voice, as if sharing big news with a friend, a little wiggle of joy on 'out for delivery', faint city noise outside the window.",
  },
  {
    id: "therapist",
    aspect: "9:16",
    portraitPrompt:
      "Candid vertical still from a phone video propped on a bookshelf. A 55-year-old woman therapist with short curly grey hair, round tortoiseshell glasses and a mustard cardigan, sitting in an armchair in a cozy therapy office with a box of tissues, a potted fern and framed diplomas behind her. A plain unmarked brown cardboard shipping box sits on the empty patient couch next to her. She looks into the camera, calm and professional with a hint of resignation, mouth closed. Warm lamp light, natural skin texture, realistic, documentary. No text or writing anywhere in the image.",
    seed: 7,
    veoLine: "Twenty years as a therapist. My best patient just ordered that shit. Cured. I'm out of a job.",
    // The take starts another sentence ("I…") at 6.15 s; keep her smile, lose the word.
    trimEnd: 7.2,
    muteAfter: 6.15,
    veoDirection:
      "Locked-off camera, she speaks gently in a soothing therapist voice, pauses before 'Cured.', a small defeated smile at the end, a clock ticking softly.",
  },
  {
    id: "donna",
    aspect: "9:16",
    portraitPrompt:
      "Candid vertical still from a front-facing phone video at night. A 64-year-old white American woman with a short blonde perm, reading glasses and a cardigan over pajamas, sitting up in bed under a floral duvet with an old black plastic laptop open on her knees, bedside lamp on, one wrist in an old sports brace. A plain brown cardboard shipping box on the nightstand. She looks into the camera with steely, proud confidence, mouth closed. Natural skin texture, phone camera quality, realistic, documentary, unglamorous. No logos, no text.",
    seed: 11,
    veoLine: "Nineteen Black Fridays. Two broken wrists. This year I ordered that shit from bed at 12:01. Like a professional.",
    veoDirection:
      "Selfie video in bed at night, she speaks with the calm pride of a war veteran, taps the laptop once, warm bedside lamp glow, quiet room.",
  },
  {
    id: "walter",
    aspect: "9:16",
    portraitPrompt:
      "Candid vertical still from a phone video. An 83-year-old Black American man with a neat white beard, a flat cap and a knitted sweater vest, sitting in a rocking chair on a wooden porch in golden late-afternoon sun, a plain brown cardboard shipping box on his lap. He looks into the camera with a twinkle-eyed, no-nonsense expression, mouth closed. Natural skin texture, phone camera quality, realistic, documentary.",
    veoLine: "At my age, you don't wait for a sale. You order that shit.",
    veoDirection:
      "Handheld phone video on a porch, he speaks slowly with warm, gravelly authority, a small knowing nod and a low chuckle at the end, birdsong and a distant lawnmower.",
  },
  {
    id: "kevin",
    aspect: "9:16",
    portraitPrompt:
      "Candid vertical still from a phone video. A 26-year-old white man with a patchy beard, a plain green lanyard with a blank white badge, wearing a call-center headset with a boom mic, sitting in a grey cubicle under fluorescent lights, a plain grey cubicle wall behind him with nothing on it. A plain brown cardboard shipping box on the desk. He looks into the camera with a forced customer-service smile, mouth closed. Natural skin texture, realistic, documentary, unglamorous. No posters, no logos, no text anywhere in the image.",
    seed: 11,
    veoLine: "Thank you for calling Order That Shit. Your problem is very important to us. Have you tried ordering more shit?",
    veoDirection:
      "Static shot, he speaks in a bright, scripted customer-service voice, the smile never reaching his eyes, office phones ringing faintly in the background.",
  },
  {
    id: "luis",
    aspect: "9:16",
    portraitPrompt:
      "Candid vertical still from a front-facing phone video. A 40-year-old Latino delivery driver with a short beard, plain brown uniform polo and cap, sitting in the driver's seat of a delivery van, stacks of plain brown cardboard boxes in the back. Daylight through the windshield. He looks into the camera, earnest and a little emotional, mouth closed. Natural skin texture, phone camera quality, realistic, documentary.",
    veoLine: "I deliver that shit. People cry when they see me. Happy crying. Mostly. I've never seen what's inside.",
    veoDirection:
      "Selfie video in the driver's seat, he speaks sincerely with a small proud smile, a slight pause before 'Mostly.', van engine idling, a dog barking far away.",
  },
];
