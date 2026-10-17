export const currency = "₦"; // change to your currency symbol

export type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number; // in minutes
  price: number;
  priceFrom?: boolean; // true = shows "From $40"
};

export const categories = [
  "Braids",
  "Locs",
  "Wigs & Installs",
  "Styling",
  "Treatments",
  "Lashes",
  "Nails",
];

export const services: Service[] = [
  {
    id: "knotless-braids",
    name: "Knotless Braids",
    category: "Braids",
    description: "Lightweight, natural-looking braids that are gentle on your scalp.",
    duration: 300,
    price: 120,
    priceFrom: true,
  },
  {
    id: "cornrows",
    name: "Cornrows",
    category: "Braids",
    description: "Neat straight-back or design cornrows, with or without extensions.",
    duration: 120,
    price: 50,
    priceFrom: true,
  },
  {
    id: "wig-install",
    name: "Wig Install",
    category: "Wigs & Installs",
    description: "Frontal or closure install with custom plucking and styling.",
    duration: 120,
    price: 80,
  },
  {
    id: "wig-revamp",
    name: "Wig Revamp",
    category: "Wigs & Installs",
    description: "Wash, condition and restyle your wig so it looks brand new.",
    duration: 90,
    price: 45,
  },
  {
    id: "silk-press",
    name: "Silk Press",
    category: "Styling",
    description: "Smooth, shiny, bouncy straight hair without chemicals.",
    duration: 90,
    price: 65,
  },
  {
    id: "wash-and-style",
    name: "Wash & Style",
    category: "Styling",
    description: "Shampoo, deep condition and a style of your choice.",
    duration: 60,
    price: 40,
  },
  {
    id: "deep-treatment",
    name: "Deep Conditioning Treatment",
    category: "Treatments",
    description: "Intense moisture treatment for dry or damaged hair.",
    duration: 45,
    price: 35,
  },
  {
    id: "scalp-treatment",
    name: "Scalp Treatment",
    category: "Treatments",
    description: "Soothing cleanse and massage to refresh and balance your scalp.",
    duration: 45,
    price: 30,
  },
    // LOCS
  {
    id: "starter-locs",
    name: "Starter Locs",
    category: "Locs",
    description: "Begin your loc journey with neat, even starter locs using comb coils or two-strand twists.",
    duration: 240,
    price: 25000,
    priceFrom: true,
  },
  {
    id: "loc-retwist",
    name: "Loc Retwist",
    category: "Locs",
    description: "Retwist your new growth to keep your locs neat, defined and healthy.",
    duration: 120,
    price: 15000,
    priceFrom: true,
  },
  {
    id: "loc-styling",
    name: "Loc Styling",
    category: "Locs",
    description: "Updos, barrel twists, petals and more, styled for everyday or special occasions.",
    duration: 90,
    price: 10000,
  },
  {
    id: "loc-repair",
    name: "Loc Repair",
    category: "Locs",
    description: "Fix thinning, weak or broken locs so they stay strong and full.",
    duration: 60,
    price: 8000,
    priceFrom: true,
  },

  // LASHES
  {
    id: "classic-lashes",
    name: "Classic Lash Extensions",
    category: "Lashes",
    description: "One extension per natural lash for a soft, natural, mascara-like look.",
    duration: 120,
    price: 15000,
  },
  {
    id: "hybrid-lashes",
    name: "Hybrid Lash Extensions",
    category: "Lashes",
    description: "A mix of classic and volume lashes for a fuller look with texture.",
    duration: 150,
    price: 20000,
  },
  {
    id: "volume-lashes",
    name: "Volume Lash Extensions",
    category: "Lashes",
    description: "Lightweight fans for a dramatic, fluffy, glamorous finish.",
    duration: 180,
    price: 25000,
  },
  {
    id: "lash-refill",
    name: "Lash Refill",
    category: "Lashes",
    description: "Top up your extensions every 2–3 weeks to keep them full.",
    duration: 60,
    price: 10000,
    priceFrom: true,
  },
  {
    id: "strip-lashes",
    name: "Strip Lash Application",
    category: "Lashes",
    description: "Quick strip lashes applied for an event, photoshoot or night out.",
    duration: 15,
    price: 5000,
  },

  // NAILS
  {
    id: "manicure",
    name: "Classic Manicure",
    category: "Nails",
    description: "Nail shaping, cuticle care, hand massage and regular polish.",
    duration: 45,
    price: 8000,
  },
  {
    id: "gel-manicure",
    name: "Gel Manicure",
    category: "Nails",
    description: "Long-lasting, chip-resistant gel polish with a glossy finish.",
    duration: 60,
    price: 12000,
  },
  {
    id: "pedicure",
    name: "Classic Pedicure",
    category: "Nails",
    description: "Foot soak, scrub, nail shaping, cuticle care and regular polish.",
    duration: 60,
    price: 10000,
  },
  {
    id: "gel-pedicure",
    name: "Gel Pedicure",
    category: "Nails",
    description: "Our full pedicure finished with long-lasting gel polish.",
    duration: 75,
    price: 14000,
  },
  {
    id: "mani-pedi",
    name: "Manicure & Pedicure Combo",
    category: "Nails",
    description: "Treat your hands and feet together and save.",
    duration: 105,
    price: 18000,
  },
];

// Turns 90 into "1 hr 30 min"
export function formatDuration(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs && mins) return `${hrs} hr ${mins} min`;
  if (hrs) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${mins} min`;
}

// Turns 40 into "$40" or "From $40"
export function formatPrice(service: Service) {
  const amount = `${currency}${service.price.toLocaleString()}`;
  return service.priceFrom ? `From ${amount}` : amount;
}