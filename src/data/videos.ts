/**
 * Video testimonials.
 *
 * `src` is optional. When it's undefined the card renders an animated
 * "fake video" with captions. Drop a generated clip in `public/videos/`
 * and set `src: "/videos/linda.mp4"` (and optionally `poster`) to play the
 * real thing. Nothing else needs to change.
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

export const videos: VideoTestimonial[] = [
  {
    id: "linda",
    name: "Linda, 47",
    title: "“I ordered that shit at 2am”",
    duration: "0:14",
    hue: 12,
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
    duration: "0:22",
    hue: 210,
    captions: [
      "The pager went off.",
      "Everything was on fire.",
      "I opened orderthatshit.com.",
      "Four minutes later, I felt better.",
      "The fire is still there.",
    ],
  },
  {
    id: "gary",
    name: "Gary, 61",
    title: "“It arrived on time”",
    duration: "0:31",
    hue: 140,
    captions: [
      "She said it was me or the shit.",
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
    duration: "1:05",
    hue: 45,
    captions: [
      "When I founded this company,",
      "I had one question:",
      "what is that shit?",
      "I still don't know.",
      "But we've sold millions.",
    ],
  },
];
