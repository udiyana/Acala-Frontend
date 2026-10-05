export {
  bookingActionCards,
  bookingActions,
  branchBookingUrls,
  contactLinks,
} from "./booking-data";

export const blogHighlights = [
  {
    slug: "a-tale-of-two-acala-branches",
    title: "A Tale of Two Acala Branches",
    category: "Branches",
    date: "July 2026",
    readTime: "4 min read",
    excerpt:
      "How Nusa Lembongan and Nusa Dua share one hospitality spirit while serving two different Bali dining moods.",
    body:
      "Acala carries one hospitality spirit across two very different Bali settings. Nusa Lembongan feels relaxed and coastal, made for slower breakfasts, casual lunches, pizza, seafood, and drinks after island days.\n\nNusa Dua brings a more polished rhythm inside Bali Collection, with Indonesian favorites, seafood plates, Western dishes, and a dinner atmosphere that suits families, couples, and groups.\n\nThe difference is the mood, not the welcome. Both branches are built around warm service, generous food, and a place where guests can settle in without rushing.",
    image: "/Branch/Acala nusa dua/DSC00742-HDR.jpg",
    href: "/branches",
    cta: "Explore Locations",
  },
  {
    slug: "pizza-seafood-and-slow-island-afternoons",
    title: "Pizza, Seafood, and Slow Island Afternoons",
    category: "Lembongan",
    date: "July 2026",
    readTime: "3 min read",
    excerpt:
      "Inside the casual Lembongan rhythm: breakfast in the sun, pizza for lunch, seafood and cocktails as the evening settles in.",
    body:
      "Nusa Lembongan is made for an easy pace. Morning light, breakfast plates, coffee, and fresh island air set the tone before the day opens into swimming, exploring, and long lunches.\n\nAt Acala Lembongan, pizza, seafood, and familiar comfort dishes fit that rhythm naturally. It is a place for casual tables, spontaneous drinks, and meals that stretch a little longer than planned.\n\nBy evening, the branch shifts into a laid-back dinner mood with warm lighting, cocktails, and the kind of island energy that feels simple in the best way.",
    image: "/Branch/Acala lembongan/galery/Copy of ADS01942.jpg",
    href: "/branches/nusa-lembongan",
    cta: "Visit Lembongan",
  },
  {
    slug: "romantic-dining-at-bali-collection",
    title: "Romantic Dining at Bali Collection",
    category: "Nusa Dua",
    date: "July 2026",
    readTime: "3 min read",
    excerpt:
      "Nusa Dua brings Indonesian classics, seafood plates, garden seating, and a polished dinner atmosphere.",
    body:
      "Acala Nusa Dua sits inside Bali Collection with a dining mood that feels composed but still warm. It is easy for families at lunch, comfortable for group dinners, and polished enough for a romantic evening.\n\nThe menu brings Indonesian classics, seafood, grilled plates, and Western favorites together in one generous branch experience. Garden seating and evening lighting help the space move naturally from daytime meals into dinner.\n\nFor guests staying around Nusa Dua, it is a practical and welcoming place to pause, eat well, and enjoy Bali Collection without losing the Acala character.",
    image: "/Branch/Acala nusa dua/Copy of RSK-133.jpg",
    href: "/branches/nusa-dua",
    cta: "Visit Nusa Dua",
  },
];

export const heroCollageImages = [
  {
    src: "/Branch/Acala nusa dua/DSC00742-HDR.jpg",
    alt: "Acala Nusa Dua front dining area",
    label: "Nusa Dua",
  },
  {
    src: "/Branch/Acala lembongan/galery/Copy of DSC08301.jpg",
    alt: "Acala Nusa Lembongan tropical dining room",
    label: "Lembongan",
  },
  {
    src: "/About/staff nusa lembongan.jpg",
    alt: "Acala staff serving guests",
    label: "Hospitality",
  },
  {
    src: "/Branch/Acala nusa dua/Copy of DSC03456.jpg",
    alt: "Garden atmosphere at Acala Nusa Dua",
    label: "Island Nature",
  },
];

export const branchMoments = {
  "nusa-lembongan": [
    {
      label: "Breakfast",
      headline: "Start slow with bright island breakfasts",
      copy:
        "Smoothie bowls, full breakfasts, tropical light, and the easy pace Nusa Lembongan is loved for.",
      image: "/Branch/Acala lembongan/galery/Copy of DSC08311.jpg",
      alt: "Guest enjoying breakfast at Acala Nusa Lembongan",
    },
    {
      label: "Lunch",
      headline: "Pizza, seafood, and easy conversations",
      copy:
        "Wood-fired pizza and casual seafood plates make lunch feel relaxed, social, and very Lembongan.",
      image: "/Branch/Acala lembongan/galery/Copy of ADS01942.jpg",
      alt: "Guests eating pizza at Acala Nusa Lembongan",
    },
    {
      label: "Dinner",
      headline: "A chill dinner spot after island days",
      copy:
        "Settle into warm lighting, cocktails, and comfort dishes for a laid-back dinner with island character.",
      image: "/Branch/Acala lembongan/galery/Copy of DSC08301.jpg",
      alt: "Tropical dining room at Acala Nusa Lembongan",
    },
  ],
  "nusa-dua": [
    {
      label: "Lunch",
      headline: "Family-friendly lunch in Bali Collection",
      copy:
        "Generous seafood, grilled plates, and Indonesian favorites served in a garden setting made for groups.",
      image: "/Branch/Acala nusa dua/Copy of RSK-133.jpg",
      alt: "Family-style lunch dishes at Acala Nusa Dua",
    },
    {
      label: "Dinner",
      headline: "Romantic dinners with live music energy",
      copy:
        "As the lights come up, Nusa Dua shifts into a polished dinner mood with cocktails, music, and seafood.",
      image: "/Branch/Acala nusa dua/Copy of DSC03456.jpg",
      alt: "Live music setting at Acala Nusa Dua",
    },
  ],
};

export const galleryBranches = [
  {
    branch: "Nusa Lembongan",
    slug: "nusa-lembongan",
    categories: [
      {
        name: "Food",
        images: [
          "/Branch/Acala lembongan/galery/Copy of DSC08311.jpg",
          "/Branch/Acala lembongan/galery/Copy of ADS01862.jpg",
          "/Branch/Acala lembongan/galery/Copy of ADS01903.jpg",
          "/Branch/Acala lembongan/galery/Copy of ADS01942.jpg",
        ],
      },
      {
        name: "Ambience & Video",
        images: [
          "/Branch/Acala lembongan/galery/Copy of DSC08301.jpg",
          "/About/staff nusa lembongan.jpg",
        ],
        videoLabel: "Lembongan dining reel",
      },
    ],
  },
  {
    branch: "Nusa Dua",
    slug: "nusa-dua",
    categories: [
      {
        name: "Food",
        images: [
          "/Branch/Acala nusa dua/Copy of DSC03302.jpg",
          "/Branch/Acala nusa dua/Copy of DSC03358.jpg",
          "/Branch/Acala nusa dua/Copy of DSC03396.jpg",
          "/Branch/Acala nusa dua/Copy of RSK-133.jpg",
        ],
      },
      {
        name: "Ambience & Video",
        images: [
          "/Branch/Acala nusa dua/depan-restorant.jpg",
          "/Branch/Acala nusa dua/Copy of DSC03456.jpg",
        ],
        videoLabel: "Nusa Dua evening reel",
      },
    ],
  },
];
