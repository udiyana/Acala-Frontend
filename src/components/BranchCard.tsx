import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import type { Branch } from "@/lib/branches";

interface BranchCardProps {
  branch: Branch;
}

export default function BranchCard({ branch }: BranchCardProps) {
  const imageSrc = branch.frontImage ?? branch.heroImage;

  return (
    <div className="card bg-surface group overflow-hidden">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageSrc}
          alt={branch.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 gradient-hero" />

        {/* Branch name overlay */}
        <div className="absolute bottom-5 left-5 right-5">
          <h3
            className="text-2xl font-bold text-white mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {branch.name}
          </h3>
          <div className="flex items-center gap-1.5 text-white/80 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{branch.address.split(",")[0]}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-neutral-500)" }}>
          {branch.tagline}
        </p>

        {/* Features */}
        <ul className="grid grid-cols-2 gap-y-2 gap-x-3 mb-6">
          {branch.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-neutral-600)" }}>
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
              {feature}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={(branch as any).slugUrl || `/branches/${branch.slug}`}
            className="btn btn-primary justify-center group/btn"
          >
            {(branch as any).slugLabel || "Explore Branch"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
          <a
            href={branch.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-dark justify-center"
          >
            {(branch as any).mapLabel || "Direction"}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <a
          href={branch.reservationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-dark w-full justify-center mt-3"
        >
          {(branch as any).reservationLabel || "Book a Table"}
        </a>
      </div>
    </div>
  );
}
