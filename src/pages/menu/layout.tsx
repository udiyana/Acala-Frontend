import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Nusa Dua Indonesian Cuisine & Nusa Lembongan Brunch",
  description:
    "Browse Acala menus by branch: Nusa Dua for Indonesian cuisine, seafood, Western dishes, and dinner; Nusa Lembongan for brunch, breakfast, coffee, pizza, lunch, drinks, and bar favorites.",
  keywords: [
    "indonesian cuisine bali",
    "dinner nusa dua",
    "seafood food near me",
    "best western restaurant",
    "brunch lembongan",
    "breakfast near me",
    "coffee near me",
    "pizza nusa lembongan",
    "lunch lembongan",
    "drinks near me",
  ],
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
