import { Star, Quote } from "lucide-react";
import Image from "next/image";
import type { Review } from "@/lib/reviews";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div
      className="relative p-6 rounded-2xl bg-surface h-full flex flex-col"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
    >
      {/* Quote icon */}
      <Quote
        className="absolute top-5 right-5 w-8 h-8 opacity-10"
        style={{ color: "var(--color-primary)" }}
      />

      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current star" />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm leading-relaxed flex-1 mb-5 italic" style={{ color: "var(--color-neutral-600)" }}>
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Reviewer */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={review.avatar}
            alt={review.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: "var(--color-neutral-800)" }}>
            {review.name}
          </p>
          <p className="text-xs" style={{ color: "var(--color-neutral-400)" }}>
            {review.location} · {review.date}
          </p>
        </div>
        <span
          className="ml-auto badge badge-primary text-xs"
          style={{ fontSize: "0.65rem" }}
        >
          {review.platform}
        </span>
      </div>
    </div>
  );
}
