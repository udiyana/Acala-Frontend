export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  platform: "Google" | "TripAdvisor" | "Direct";
  date: string;
  avatar: string;
}

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Sarah M.",
    location: "Sydney, Australia",
    rating: 5,
    text: "Absolute paradise! The Lembongan Sunrise pizza was the best I've had in Bali. Perfect spot to watch the sunset with ice cold Bintangs. The staff were incredibly warm and welcoming.",
    platform: "Google",
    date: "March 2025",
    avatar: "https://i.pravatar.cc/80?img=1",
  },
  {
    id: "r2",
    name: "James T.",
    location: "London, UK",
    rating: 5,
    text: "We stumbled upon Acala on our last night in Nusa Lembongan and it became an instant highlight. The Nasi Goreng was authentic and generous, and the live music was wonderful.",
    platform: "TripAdvisor",
    date: "February 2025",
    avatar: "https://i.pravatar.cc/80?img=3",
  },
  {
    id: "r3",
    name: "Mei Lin",
    location: "Singapore",
    rating: 5,
    text: "Best breakfast on the island, hands down. The Tropical Brekkie Board is enormous and so fresh. Coming back every trip to Lembongan!",
    platform: "Google",
    date: "April 2025",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    id: "r4",
    name: "Marco R.",
    location: "Milan, Italy",
    rating: 5,
    text: "The pizza surprised me — authentic wood-fired dough with brilliant tropical twists. I'm Italian and this passed my test! Great cocktails and lovely atmosphere.",
    platform: "TripAdvisor",
    date: "January 2025",
    avatar: "https://i.pravatar.cc/80?img=7",
  },
  {
    id: "r5",
    name: "Priya K.",
    location: "Mumbai, India",
    rating: 5,
    text: "We reserved a table for our anniversary and they made it so special with decorations. The chicken satay and grilled barramundi were incredible. Will definitely be back.",
    platform: "Google",
    date: "May 2025",
    avatar: "https://i.pravatar.cc/80?img=9",
  },
  {
    id: "r6",
    name: "Tom H.",
    location: "New York, USA",
    rating: 5,
    text: "Centrally located in Jungutbatu, friendly staff, amazing food at very fair prices. The live music in the evening creates the perfect island vibe. Don't miss it!",
    platform: "Direct",
    date: "June 2025",
    avatar: "https://i.pravatar.cc/80?img=11",
  },
];
