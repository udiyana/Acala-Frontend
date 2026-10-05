import { nusaLembonganMenu, nusaDuaMenu } from "./branch-menus";
import { branchBookingUrls } from "./booking-data";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isSignature?: boolean;
}

export interface BranchSeo {
  title: string;
  description: string;
  keywords: string[];
  servesCuisine: string[];
  openingHours: string;
  content: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    highlights: string[];
  };
}

export interface Branch {
  slug: string;
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    weekends: string;
  };
  mapUrl: string;
  mapEmbedUrl: string;
  frontImage?: string;
  heroImage: string;
  galleryImages: string[];
  highlightMenu: MenuItem[];
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
  reservationUrl: string;
  fullMenu: {
    id: string;
    name: string;
    items: {
      name: string;
      description: string;
      price: string;
      isMarketPrice?: boolean;
    }[];
  }[];
  seo: BranchSeo;
}

export const branches: Branch[] = [
  {
    slug: "nusa-lembongan",
    name: "Acala Nusa Lembongan",
    tagline: "Pizza, seafood, and chill island hangouts in Jungutbatu",
    address: "Jl. Jungutbatu, Jungutbatu, Nusa Penida",
    phone: "+62 823-3975-7775",
    email: "lembongan@acalabar.com",
    hours: {
      weekdays: "7:00 AM - 10:00 PM",
      weekends: "7:00 AM - 10:00 PM",
    },
    mapUrl: "https://maps.app.goo.gl/Tfrd6WZjztDprfsJ7",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7902.1!2d115.45!3d-8.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd220000000001%3A0x0!2sNusa+Lembongan!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid",
    frontImage:
      "/Branch/Acala lembongan/depan-restorant.jpeg",
    heroImage:
      "/Branch/Acala lembongan/galery/Copy of DSC08301.jpg",
    galleryImages: [
      "/Branch/Acala lembongan/galery/Copy of ADS01862.jpg",
      "/Branch/Acala lembongan/galery/Copy of ADS01903.jpg",
      "/Branch/Acala lembongan/galery/Copy of ADS01942.jpg",
      "/Branch/Acala lembongan/galery/Copy of DSC08301.jpg",
      "/Branch/Acala lembongan/galery/Copy of DSC08311.jpg",
    ],
    highlightMenu: [
      {
        id: "lb-1",
        name: "Lembongan Sunrise Pizza",
        description:
          "Wood-fired pizza with fresh local seafood, chilli, and tropical herbs",
        price: 115000,
        category: "Pizza",
        image:
          "/Branch/Acala lembongan/galery/Copy of ADS01942.jpg",
        isSignature: true,
      },
      {
        id: "lb-2",
        name: "Nasi Goreng Acala",
        description:
          "Our signature fried rice with local spices, egg, prawn, and acar",
        price: 75000,
        category: "Indonesian",
        image:
          "/Branch/Acala nusa dua/Copy of DSC03302.jpg",
        isSignature: true,
      },
      {
        id: "lb-3",
        name: "Tropical Brekkie Board",
        description:
          "Avocado toast, poached eggs, local fruits, granola, and coconut yogurt",
        price: 95000,
        category: "Breakfast",
        image:
          "/Branch/Acala lembongan/galery/Copy of DSC08311.jpg",
        isSignature: true,
      },
    ],
    coordinates: { lat: -8.684, lng: 115.452 },
    features: [
      "Pizza & Seafood",
      "Chill Hangout Spot",
      "All-Day Dining",
      "Signature Cocktails",
      "Kids Menu",
      "Vegetarian Options",
    ],
    reservationUrl: branchBookingUrls["nusa-lembongan"],
    fullMenu: nusaLembonganMenu.categories,
    seo: {
      title: "Best Restaurant Nusa Lembongan for Brunch, Pizza & Coffee",
      description:
        "Acala Nusa Lembongan is a restaurant in Nusa Lembongan for brunch, breakfast, coffee, pizza, lunch, drinks, and a relaxed bar in Jungutbatu.",
      keywords: [
        "brunch lembongan",
        "restaurant nusa lembongan",
        "brunch near me",
        "best restaurant nusa lembongan",
        "restoran near me",
        "places to eat in nusa lembongan",
        "restro near me",
        "restaurants to eat near me",
        "restaurant near me",
        "drinks near me",
        "coffee near me",
        "best restaurant lembongan",
        "breakfast near me",
        "pizza nusa lembongan",
        "place to eat near me",
        "bar lembongan",
        "near by me restaurant",
        "best place to eat lembongan",
        "lunch lembongan",
        "best pizza nusa lembongan",
      ],
      servesCuisine: ["Brunch", "Breakfast", "Coffee", "Pizza", "Seafood", "Bar", "Indonesian"],
      openingHours: "Mo-Su 07:00-22:00",
      content: {
        eyebrow: "Restaurant Nusa Lembongan",
        title: "Brunch, Coffee, Pizza, Lunch, and Drinks in Nusa Lembongan",
        paragraphs: [
          "Acala Nusa Lembongan is built for guests looking for brunch Lembongan, breakfast near me, coffee near me, and an easy place to eat near Jungutbatu. The branch starts early, stays relaxed through lunch, and shifts naturally into drinks and dinner.",
          "For travelers comparing places to eat in Nusa Lembongan, Acala focuses on wood-fired pizza, seafood, tropical drinks, and a casual bar Lembongan mood. It is a practical pick for pizza Nusa Lembongan searches, best pizza Nusa Lembongan intent, and visitors who want one restaurant that works from morning coffee to evening cocktails.",
        ],
        highlights: [
          "Brunch and breakfast from 7:00 AM in Jungutbatu",
          "Pizza, seafood, lunch, coffee, drinks, and bar seating",
          "A relaxed option for restaurant near me and places to eat in Nusa Lembongan searches",
        ],
      },
    },
  },
  {
    slug: "nusa-dua",
    name: "Acala Nusa Dua",
    tagline: "Authentic Indonesian food, seafood, and romantic dining at Bali Collection",
    address: "Bali Collection Blok B1 No.2, Benoa,Kuta Selatan",
    phone: "+62 813-3704-3131",
    email: "nusadua@acalabar.com",
    hours: {
      weekdays: "10:00 AM - 10:00 PM",
      weekends: "10:00 AM - 10:00 PM",
    },
    mapUrl: "https://maps.app.goo.gl/Tfrd6WZjztDprfsJ7",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.6661413812836!2d115.2281223147844!3d-8.802187793677464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2433068e1694f%3A0xc48c187bc9e00000!2sBali%20Collection!5e0!3m2!1sen!2sid!4v1700000000001!5m2!1sen!2sid",
    frontImage:
      "/Branch/Acala nusa dua/depan-restorant.jpg",
    heroImage:
      "/Branch/Acala nusa dua/depan-restorant.jpg",
    galleryImages: [
      "/Branch/Acala nusa dua/Copy of DSC03302.jpg",
      "/Branch/Acala nusa dua/Copy of DSC03358.jpg",
      "/Branch/Acala nusa dua/Copy of DSC03396.jpg",
      "/Branch/Acala nusa dua/Copy of DSC03456.jpg",
      "/Branch/Acala nusa dua/Copy of DSC03521.jpg",
      "/Branch/Acala nusa dua/Copy of RSK-133.jpg",
    ],
    highlightMenu: [
      {
        id: "nd-1",
        name: "Nusa Dua Sunset Platter",
        description:
          "Mixed grilled seafood, satay, steamed rice, and sambal selection",
        price: 185000,
        category: "Grills",
        image:
          "/Branch/Acala nusa dua/Copy of RSK-133.jpg",
        isSignature: true,
      },
      {
        id: "nd-2",
        name: "Margherita Royale",
        description:
          "San Marzano tomatoes, buffalo mozzarella, fresh basil, EVOO",
        price: 105000,
        category: "Pizza",
        image:
          "/Branch/Acala lembongan/galery/Copy of ADS01903.jpg",
        isSignature: true,
      },
      {
        id: "nd-3",
        name: "Acala Full Breakfast",
        description:
          "Two eggs your way, bacon, sausage, toast, tomatoes, mushrooms, beans",
        price: 110000,
        category: "Breakfast",
        image:
          "/Branch/Acala nusa dua/Copy of DSC03302.jpg",
        isSignature: true,
      },
    ],
    coordinates: { lat: -8.802, lng: 115.228 },
    features: [
      "Authentic Indonesian Food",
      "Garden Terrace",
      "Seafood Specials",
      "Wine & Cocktails",
      "Romantic Dining",
      "Takeaway Available",
    ],
    reservationUrl: branchBookingUrls["nusa-dua"],
    fullMenu: nusaDuaMenu.categories,
    seo: {
      title: "Best Restaurant in Nusa Dua Bali Collection | Acala Nusa Dua",
      description:
        "Acala Nusa Dua is a tropical restaurant in Nusa Dua at Bali Collection for Indonesian cuisine, seafood, Western favorites, and dinner in Bali.",
      keywords: [
        "acala nusa dua",
        "best restaurants near me",
        "place to eat near me",
        "best place to eat bali",
        "restoran near me",
        "best restaurant in nusa dua",
        "restaurant bali",
        "best restaurant bali",
        "restaurant near me",
        "indonesian cuisine bali",
        "restaurant in nusa dua",
        "tropical restaurant nusa dua",
        "near by me restaurant",
        "best western restaurant",
        "best dinner nusa dua",
        "restaurants to eat near me",
        "bali collection restaurants",
        "seafood food near me",
        "order food near me",
        "dinner nusa dua",
      ],
      servesCuisine: ["Indonesian", "Seafood", "Western", "Tropical", "Dinner", "Bar"],
      openingHours: "Mo-Su 10:00-22:00",
      content: {
        eyebrow: "Restaurant in Nusa Dua",
        title: "Indonesian Cuisine, Seafood, and Tropical Dinner at Bali Collection",
        paragraphs: [
          "Acala Nusa Dua is the branch for guests searching for a restaurant in Nusa Dua, Bali Collection restaurants, Indonesian cuisine Bali, and a tropical restaurant Nusa Dua setting. The menu leans into Indonesian favorites, seafood, Western comfort dishes, cocktails, and dinner-friendly plates.",
          "For visitors already in Nusa Dua looking for restaurant near me, best restaurants near me, place to eat near me, best dinner Nusa Dua, or seafood food near me, Acala offers a clear Bali Collection location with a relaxed garden atmosphere and easy booking options.",
        ],
        highlights: [
          "Located at Bali Collection for Nusa Dua lunch and dinner plans",
          "Indonesian cuisine, seafood, Western dishes, cocktails, and romantic dining",
          "A practical match for best restaurant in Nusa Dua, restaurant Bali, and dinner Nusa Dua searches",
        ],
      },
    },
  },
];

export function getBranchBySlug(slug: string): Branch | undefined {
  return branches.find((b) => b.slug === slug);
}

export function getAllBranchSlugs(): string[] {
  return branches.map((b) => b.slug);
}
