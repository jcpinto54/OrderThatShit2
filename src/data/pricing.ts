export type Tier = {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
  wasPrice?: string;
};

export const tiers: Tier[] = [
  {
    name: "Some Shit",
    price: "$19.99",
    wasPrice: "$39.98",
    tagline: "One (1) shit. For people with one problem.",
    features: ["1× that shit", "Free shipping (to Ohio)", "Emotional support (none)", "One sticker"],
    cta: "Order Some Shit",
  },
  {
    name: "A Lot of Shit",
    price: "$49.99",
    wasPrice: "$99.98",
    tagline: "For people whose problems have problems.",
    features: [
      "3× that shit",
      "Priority shit",
      "A second sticker",
      "We remember your name (we won't)",
      "Gift wrapping (it's the same box)",
    ],
    cta: "Order A Lot of Shit",
    featured: true,
    badge: "Most Ordered",
  },
  {
    name: "All The Shit",
    price: "$999",
    period: "/mo",
    tagline: "We send you shit until you ask us to stop. We will not stop.",
    features: [
      "Unlimited shit",
      "Shit arrives daily",
      "Dedicated Shit Success Manager",
      "Quarterly Shit Review",
      "Cancellation requires a notarized letter and a duel",
    ],
    cta: "Order All The Shit",
  },
];
