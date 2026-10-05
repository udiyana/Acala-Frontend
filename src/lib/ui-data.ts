export type BranchKey = "nusa-lembongan" | "nusa-dua";

export type IconName =
  | "cake-slice"
  | "cup-soda"
  | "fish"
  | "heart"
  | "pizza"
  | "soup"
  | "users"
  | "utensils-crossed";

export const branchOptions: { key: BranchKey; label: string; summary: string }[] = [
  {
    key: "nusa-lembongan",
    label: "Nusa Lembongan",
    summary: "Pizza, seafood, chill untuk nongkrong",
  },
  {
    key: "nusa-dua",
    label: "Nusa Dua",
    summary: "Indonesian authentic, seafood, romantic place",
  },
];

export const branchUsps: Record<
  BranchKey,
  {
    icon: IconName;
    title: string;
    copy: string;
    image: string;
    alt: string;
  }[]
> = {
  "nusa-lembongan": [
    {
      icon: "pizza",
      title: "Pizza",
      copy: "Wood-fired pizza, casual plates, and easy island lunches made for sharing.",
      image: "/Home/why-acala/nusa-lembongan/pizza.jpg",
      alt: "Pizza and seafood at Acala Nusa Lembongan",
    },
    {
      icon: "fish",
      title: "Seafood",
      copy: "Fresh seafood, tropical flavors, and relaxed dinner energy after a day on the island.",
      image: "/Home/why-acala/nusa-lembongan/seafood.jpg",
      alt: "Seafood dining at Acala Nusa Lembongan",
    },
    {
      icon: "users",
      title: "Chill untuk Nongkrong",
      copy: "A laid-back branch for slow afternoons, casual meetups, and easy conversations.",
      image: "/Branch/Acala lembongan/galery/Copy of DSC08301.jpg",
      alt: "Acala Nusa Lembongan tropical hangout space",
    },
  ],
  "nusa-dua": [
    {
      icon: "utensils-crossed",
      title: "Authentic Indonesian Food",
      copy: "Indonesian favorites served with Acala warmth in the heart of Bali Collection.",
      image: "/Home/why-acala/nusa-dua/indonesian-food.jpg",
      alt: "Authentic Indonesian food at Acala Nusa Dua",
    },
    {
      icon: "fish",
      title: "Seafood",
      copy: "Seafood plates, grilled dishes, and generous flavors for lunch or dinner.",
      image: "/Home/why-acala/nusa-dua/seafood.jpg",
      alt: "Seafood dishes at Acala Nusa Dua",
    },
    {
      icon: "heart",
      title: "Romantic Place",
      copy: "A polished garden mood for date nights, evening meals, and special moments.",
      image: "/Home/why-acala/nusa-dua/valentine.jpg",
      alt: "Romantic evening setting at Acala Nusa Dua",
    },
  ],
};

export const homeMenuGroups: {
  id: string;
  name: string;
  copy: string;
  image: string;
  icon: IconName;
  matchers: string[];
}[] = [
  {
    id: "appetizer",
    name: "Appetizer",
    copy: "Fresh starters, soups, salads, vegetables, and light opening plates.",
    image: "/Branch/Acala nusa dua/Copy of DSC03358.jpg",
    icon: "soup",
    matchers: ["appetizer", "starter", "soup", "salad", "vegetarian", "side"],
  },
  {
    id: "main-course",
    name: "Main Course",
    copy: "Branch favorites across seafood, Indonesian plates, pizza, pasta, and grills.",
    image: "/Branch/Acala nusa dua/Copy of RSK-133.jpg",
    icon: "utensils-crossed",
    matchers: [
      "breakfast",
      "light",
      "seafood",
      "pizza",
      "pasta",
      "grill",
      "main",
      "burger",
      "sandwich",
      "meal",
    ],
  },
  {
    id: "dessert",
    name: "Dessert",
    copy: "Sweet endings for a relaxed lunch, dinner, or late island treat.",
    image: "/Home/galery/gallery-5.webp",
    icon: "cake-slice",
    matchers: ["dessert", "gelato", "sweet"],
  },
  {
    id: "drink",
    name: "Drink",
    copy: "Cocktails, mocktails, juices, coffee, wine, beer, and brewed favorites.",
    image: "/Home/galery/gallery-3.webp",
    icon: "cup-soda",
    matchers: [
      "wine",
      "drink",
      "cocktail",
      "mocktail",
      "shake",
      "juice",
      "smoothie",
      "beverage",
      "brew",
      "coffee",
      "beer",
      "water",
      "soda",
    ],
  },
];
