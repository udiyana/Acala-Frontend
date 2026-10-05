import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useSiteData } from "@/lib/site-data-store";

type BranchGallerySliderProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
};

export default function BranchGallerySlider({
  eyebrow = "Branch Gallery",
  title = "Two Locations, Two Moods",
  intro = "Browse food, ambience, and video-style highlights from Nusa Lembongan and Nusa Dua.",
}: BranchGallerySliderProps) {
  const { galleryBranches } = useSiteData();

  return (
    <section className="section bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="apple-label mb-3">{eyebrow}</p>
          <h2 className="apple-h2 mb-4">{title}</h2>
          <p className="apple-body mx-auto">{intro}</p>
        </div>

        <div className="space-y-12">
          {galleryBranches.map((branch) => (
            <div key={branch.slug}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
                <div>
                  <h3
                    className="font-heading font-bold text-2xl"
                    style={{ color: "var(--color-neutral-900)" }}
                  >
                    {branch.branch}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>
                    Food and ambience highlights
                  </p>
                </div>
                <Link
                  href={`/branches/${branch.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  Explore Branch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {branch.categories.flatMap((category) =>
                  category.images.map((src, index) => (
                    <div
                      key={`${category.name}-${src}`}
                      className="relative flex-[0_0_82%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] snap-start overflow-hidden group"
                      style={{ borderRadius: "var(--radius-md)", aspectRatio: "4/5", boxShadow: "var(--shadow-md)" }}
                    >
                      <Image
                        src={src}
                        alt={`${branch.branch} ${category.name} ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 30vw"
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 58%)" }} />
                      <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between gap-3">
                        <span className="badge" style={{ background: "rgba(255,255,255,0.92)", color: "var(--color-neutral-800)" }}>
                          {category.name}
                        </span>
                        {category.videoLabel && index === category.images.length - 1 ? (
                          <span
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ background: "var(--color-primary)", color: "#fff" }}
                            aria-label={category.videoLabel}
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
