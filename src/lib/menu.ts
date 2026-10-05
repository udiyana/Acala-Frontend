export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  isSignature?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

export type MenuCategory =
  | "Breakfast"
  | "Starters"
  | "Pizza"
  | "Indonesian"
  | "Mains"
  | "Burgers & Sandwiches"
  | "Salads"
  | "Desserts"
  | "Drinks"
  | "Cocktails";

export const menuCategories: MenuCategory[] = [
  "Breakfast",
  "Starters",
  "Pizza",
  "Indonesian",
  "Mains",
  "Burgers & Sandwiches",
  "Salads",
  "Desserts",
  "Drinks",
  "Cocktails",
];

export const menuItems: MenuItem[] = [
  // Breakfast
  {
    id: "b1",
    name: "Tropical Brekkie Board",
    description:
      "Avocado toast, poached eggs, local fruits, granola, and coconut yogurt",
    price: 95000,
    category: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
    isSignature: true,
    isVegetarian: true,
  },
  {
    id: "b2",
    name: "Acala Full Breakfast",
    description:
      "Two eggs your way, crispy bacon, pork sausage, toast, grilled tomatoes, mushrooms, baked beans",
    price: 110000,
    category: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
  },
  {
    id: "b3",
    name: "Banana & Nutella Pancakes",
    description:
      "Stack of fluffy pancakes with caramelised banana, Nutella, and vanilla ice cream",
    price: 75000,
    category: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
    isVegetarian: true,
  },
  {
    id: "b4",
    name: "Green Smoothie Bowl",
    description:
      "Spirulina, banana, coconut milk base with kiwi, granola, seeds, and honey drizzle",
    price: 70000,
    category: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80",
    isVegetarian: true,
  },
  // Starters
  {
    id: "s1",
    name: "Crispy Calamari",
    description:
      "Lightly battered squid rings with chipotle aioli and lemon wedge",
    price: 75000,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1613728913341-8f6c4c4f3d7a?w=600&q=80",
  },
  {
    id: "s2",
    name: "Bruschetta Trio",
    description:
      "Three classic toppings: heirloom tomato, mushroom truffle, and ricotta",
    price: 65000,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80",
    isVegetarian: true,
  },
  {
    id: "s3",
    name: "Beef Nachos",
    description:
      "Corn tortilla chips with spiced beef, cheddar, guacamole, sour cream, and jalapeños",
    price: 85000,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&q=80",
    isSpicy: true,
  },
  {
    id: "s4",
    name: "Chicken Wings",
    description:
      "6 wings in your choice of BBQ, buffalo, or honey garlic sauce",
    price: 85000,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&q=80",
  },
  // Pizza
  {
    id: "p1",
    name: "Lembongan Sunrise Pizza",
    description:
      "Wood-fired base with local seafood, chilli, capers, and tropical herbs",
    price: 115000,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    isSignature: true,
    isSpicy: true,
  },
  {
    id: "p2",
    name: "Margherita Royale",
    description:
      "San Marzano tomatoes, buffalo mozzarella, fresh basil, extra virgin olive oil",
    price: 95000,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
    isVegetarian: true,
  },
  {
    id: "p3",
    name: "Smoky BBQ Chicken",
    description:
      "BBQ sauce, grilled chicken, red onion, smoked cheddar, fresh coriander",
    price: 110000,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80",
  },
  {
    id: "p4",
    name: "Veggie Garden",
    description:
      "Pesto base, grilled zucchini, capsicum, cherry tomatoes, feta, olives",
    price: 100000,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1548365328-8c6db3220e4d?w=600&q=80",
    isVegetarian: true,
  },
  // Indonesian
  {
    id: "i1",
    name: "Nasi Goreng Acala",
    description:
      "Our signature fried rice with local spices, egg, tiger prawn, and acar",
    price: 75000,
    category: "Indonesian",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    isSignature: true,
    isSpicy: true,
  },
  {
    id: "i2",
    name: "Mie Goreng Seafood",
    description: "Wok-fried noodles with mixed seafood, vegetables, and sambal",
    price: 80000,
    category: "Indonesian",
    image:
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
    isSpicy: true,
  },
  {
    id: "i3",
    name: "Chicken Satay",
    description:
      "5 skewers of marinated chicken with peanut sauce, lontong, and pickles",
    price: 70000,
    category: "Indonesian",
    image:
      "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600&q=80",
  },
  {
    id: "i4",
    name: "Gado-Gado",
    description:
      "Steamed mixed vegetables, boiled egg, tofu, tempeh with peanut sauce",
    price: 65000,
    category: "Indonesian",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    isVegetarian: true,
  },
  // Mains
  {
    id: "m1",
    name: "Grilled Barramundi",
    description:
      "Local barramundi with lemon butter, capers, seasonal vegetables, and mashed potato",
    price: 165000,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    isSignature: true,
  },
  {
    id: "m2",
    name: "Nusa Dua Sunset Platter",
    description:
      "Mixed grilled seafood, satay, steamed rice, and sambal selection for two",
    price: 185000,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    isSignature: true,
  },
  {
    id: "m3",
    name: "Pasta Arrabiata",
    description:
      "Penne with spicy tomato sauce, garlic, chilli, parmesan, and basil",
    price: 90000,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80",
    isVegetarian: true,
    isSpicy: true,
  },
  // Burgers
  {
    id: "bg1",
    name: "Acala Classic Burger",
    description:
      "180g beef patty, cheddar, lettuce, tomato, pickles, house sauce, brioche bun, fries",
    price: 95000,
    category: "Burgers & Sandwiches",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    isSignature: true,
  },
  {
    id: "bg2",
    name: "Crispy Chicken Sando",
    description: "Buttermilk fried chicken, coleslaw, pickles, sriracha mayo",
    price: 85000,
    category: "Burgers & Sandwiches",
    image:
      "https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&q=80",
    isSpicy: true,
  },
  // Salads
  {
    id: "sl1",
    name: "Tropical Quinoa Salad",
    description:
      "Quinoa, mango, avocado, cucumber, cherry tomatoes, lime-coriander dressing",
    price: 80000,
    category: "Salads",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    isVegetarian: true,
  },
  {
    id: "sl2",
    name: "Caesar with Grilled Chicken",
    description:
      "Cos lettuce, parmesan, croutons, bacon, classic caesar dressing, grilled chicken breast",
    price: 85000,
    category: "Salads",
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80",
  },
  // Desserts
  {
    id: "d1",
    name: "Coconut Panna Cotta",
    description:
      "Silky coconut cream panna cotta with mango coulis and toasted coconut",
    price: 60000,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
    isVegetarian: true,
  },
  {
    id: "d2",
    name: "Warm Chocolate Lava Cake",
    description:
      "Dark chocolate fondant with vanilla ice cream and berry compote",
    price: 70000,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    isVegetarian: true,
  },
  // Drinks
  {
    id: "dr1",
    name: "Fresh Coconut",
    description: "Young coconut served ice cold, direct from the shell",
    price: 30000,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80",
    isVegetarian: true,
  },
  {
    id: "dr2",
    name: "Tropical Fruit Juice",
    description: "Your choice of mango, watermelon, pineapple, or passion fruit",
    price: 35000,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80",
    isVegetarian: true,
  },
  {
    id: "dr3",
    name: "Bintang Beer",
    description: "Indonesia's favourite cold lager, 330ml bottle",
    price: 40000,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&q=80",
  },
  // Cocktails
  {
    id: "c1",
    name: "Lembongan Sunrise",
    description: "Rum, passion fruit, mango, coconut cream, lime, mint",
    price: 75000,
    category: "Cocktails",
    image:
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&q=80",
    isSignature: true,
    isVegetarian: true,
  },
  {
    id: "c2",
    name: "Bali Negroni",
    description:
      "Gin, Campari, sweet vermouth, with a twist of local citrus zest",
    price: 80000,
    category: "Cocktails",
    image:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80",
  },
  {
    id: "c3",
    name: "Tropical Mojito",
    description:
      "White rum, fresh lime, mint, sugar syrup, soda water, tropical fruit twist",
    price: 75000,
    category: "Cocktails",
    image:
      "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600&q=80",
    isVegetarian: true,
  },
];

export function getMenuByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export function getSignatureItems(): MenuItem[] {
  return menuItems.filter((item) => item.isSignature);
}
