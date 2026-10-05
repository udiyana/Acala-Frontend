import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSiteData } from "@/lib/site-data-store";

interface BranchMomentsProps {
  eyebrow?: string;
  intro?: string;
  slug: string;
  title?: string;
  reservationUrl: string;
}

export default function BranchMoments({
  eyebrow = "Branch Highlight",
  intro = "Each Acala branch has its own rhythm, from sunny lunches to relaxed dinners.",
  reservationUrl,
  slug,
  title = "Dining by the Moment",
}: BranchMomentsProps) {
  const { branchMoments } = useSiteData();
  const moments = branchMoments[slug as keyof typeof branchMoments] ?? [];

  return (
    <section className="section" style={{ background: "var(--color-surface-warm)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="apple-label mb-3">{eyebrow}</p>
          <h2 className="apple-h2 mb-4">{title}</h2>
          <p className="apple-body mx-auto">{intro}</p>
        </div>

        <div className={`grid grid-cols-1 ${moments.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6`}>
          {moments.map((moment) => (
            <article
              key={moment.label}
              className="bg-surface overflow-hidden flex flex-col"
              style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={moment.image}
                  alt={moment.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="badge" style={{ background: "rgba(255,255,255,0.92)", color: "var(--color-neutral-800)" }}>
                    {moment.label}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3
                  className="font-heading font-bold text-xl leading-tight mb-3"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  {moment.headline}
                </h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--color-neutral-500)" }}>
                  {moment.copy}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={reservationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Book a Table
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link href="/gallery" className="btn btn-outline-dark">
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
