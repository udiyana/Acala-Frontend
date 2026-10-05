import { Leaf, Flame, Star } from "lucide-react";
import Image from "next/image";

interface MenuCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  isSignature?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  category?: string;
}

export default function MenuCard({
  name,
  description,
  price,
  image,
  isSignature,
  isVegetarian,
  isSpicy,
  category,
}: MenuCardProps) {
  return (
    <div className="card bg-surface group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {isSignature && (
            <span
              className="badge text-white flex items-center gap-1"
              style={{ background: "var(--color-primary)" }}
            >
              <Star className="w-3 h-3" />
              Signature
            </span>
          )}
          {category && !isSignature && (
            <span className="badge badge-primary">
              {category}
            </span>
          )}
        </div>
        {/* Dietary icons */}
        <div className="absolute top-3 right-3 flex gap-1">
          {isVegetarian && (
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.9)" }}
              title="Vegetarian"
            >
              <Leaf className="w-3.5 h-3.5 text-white" />
            </span>
          )}
          {isSpicy && (
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.9)" }}
              title="Spicy"
            >
              <Flame className="w-3.5 h-3.5 text-white" />
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            className="font-semibold text-base leading-snug"
            style={{ color: "var(--color-neutral-800)", fontFamily: "var(--font-heading)" }}
          >
            {name}
          </h3>
          <span
            className="font-bold text-base whitespace-nowrap"
            style={{ color: "var(--color-primary)" }}
          >
            Rp {price.toLocaleString("id-ID")}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-neutral-500)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}
