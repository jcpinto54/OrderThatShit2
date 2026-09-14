export type Testimonial = {
  name: string;
  age: number | string;
  where: string;
  problem: string;
  quote: string;
  stars?: number;
  starsNote?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Linda",
    age: 47,
    where: "Tulsa, OK",
    problem: "Chronic exhaustion",
    quote:
      "I was tired all the time. Then I ordered that shit. I'm still tired, but now I'm tired with that shit. Huge difference.",
  },
  {
    name: "Marcus",
    age: 34,
    where: "Senior DevOps Engineer",
    problem: "Production outage",
    quote:
      "Our database went down at 3am. I ordered that shit. The database is still down, but morale? Through the roof.",
  },
  {
    name: "Priya",
    age: 29,
    where: "Berlin, DE",
    problem: "Loneliness",
    quote: "I had no friends. I ordered that shit. Now I have that shit. Do the math.",
  },
  {
    name: "Gary",
    age: 61,
    where: "Retired",
    problem: "Marriage",
    quote:
      "My marriage was falling apart. I ordered that shit. My wife left, but the shit arrived in 3–5 business days, exactly as promised. Reliability matters.",
    starsNote: "(shipping)",
  },
  {
    name: "Jess",
    age: 25,
    where: "Content Creator",
    problem: "Insomnia",
    quote:
      "Couldn't sleep for months. Ordered that shit. Now I lie awake next to that shit. It's something.",
  },
  {
    name: "Tom",
    age: 38,
    where: "Cat Owner",
    problem: "Cat ignores me",
    quote:
      "My cat wouldn't look at me. Ordered that shit. Now she ignores the shit too. We finally have something in common.",
  },
  {
    name: "Dr. Anand",
    age: 52,
    where: "PhD (unrelated field)",
    problem: "Existential dread",
    quote:
      "I didn't know what I was doing with my life. I ordered that shit. Now I know I have that shit. That's a data point.",
  },
  {
    name: "Chloe",
    age: 31,
    where: "Startup Founder",
    problem: "Runway",
    quote:
      "We had 3 weeks of runway. I ordered that shit on the company card. We now have 2 weeks of runway and that shit. Investors love a story.",
  },
  {
    name: "Big Rick",
    age: 44,
    where: "Long-haul Trucker",
    problem: "Weight loss",
    quote:
      "Lost 30 pounds! Doctors said it was the diet and exercise, but I also ordered that shit around the same time, so, you know.",
  },
  {
    name: "Nadia",
    age: 36,
    where: "Accountant",
    problem: "Back taxes",
    quote:
      "Owed $14,000 in back taxes. Ordered that shit. Still owe $14,000. Plus $19.99. But I feel like I did something.",
  },
  {
    name: "Dylan",
    age: 19,
    where: "Student",
    problem: "Failing chemistry",
    quote:
      "Ordered that shit instead of studying. Failed. But the shit came with a sticker. Five stars.",
  },
  {
    name: "Anonymous",
    age: "??",
    where: "Ohio",
    problem: "Everything",
    quote:
      "Ordered that shit. Ordered that shit again. Ordered more of that shit. I'm writing this from inside the shit.",
  },
];
