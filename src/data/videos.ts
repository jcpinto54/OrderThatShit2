/**
 * Video testimonials.
 *
 * Clips are generated on fal.ai by scripts/generate-videos.mjs (see README) and live in
 * public/videos/. A card without `src` renders an animated placeholder with `captions`
 * instead, so the page still works if a clip is removed.
 */
export type VideoTestimonial = {
  id: string;
  name: string;
  title: string;
  duration: string;
  captions: string[];
  hue: number;
  src?: string;
  poster?: string;
};

/** The infomercial clip for the "Watch the ad" modal. Undefined = flashing text fallback. */
export const adVideo: { src: string; poster: string } | undefined = {
  src: "/videos/ad.mp4",
  poster: "/videos/ad.jpg",
};

export const videos: VideoTestimonial[] = [
  {
    id: "linda",
    name: "Linda, 47",
    title: "“I ordered that shit at 2am”",
    duration: "0:08",
    hue: 12,
    src: "/videos/linda.mp4",
    poster: "/videos/linda.jpg",
    captions: [
      "It was 2am.",
      "I couldn't sleep.",
      "So I ordered that shit.",
      "I still can't sleep.",
      "But now it's next to me.",
    ],
  },
  {
    id: "marcus",
    name: "Marcus, DevOps",
    title: "“Production was down”",
    duration: "0:08",
    hue: 210,
    src: "/videos/marcus.mp4",
    poster: "/videos/marcus.jpg",
    captions: [
      "The pager went off.",
      "Everything was on fire.",
      "I ordered that shit.",
      "The fire is still there.",
      "Morale? Through the roof.",
    ],
  },
  {
    id: "gary",
    name: "Gary, 61",
    title: "“It arrived on time”",
    duration: "0:08",
    hue: 140,
    src: "/videos/gary.mp4",
    poster: "/videos/gary.jpg",
    captions: [
      "She said it's me or the shit.",
      "The shit had tracking.",
      "She did not.",
      "Three to five business days.",
      "Exactly as promised.",
    ],
  },
  {
    id: "ceo",
    name: "Our CEO",
    title: "“A message from leadership”",
    duration: "0:08",
    hue: 45,
    src: "/videos/ceo.mp4",
    poster: "/videos/ceo.jpg",
    captions: [
      "When I founded this company,",
      "I had one question:",
      "what is that shit?",
      "I still don't know.",
      "But we've sold millions.",
    ],
  },
];
