import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import BranchCard from "@/components/BranchCard";
import { cmsText, usePublishedCmsPage } from "@/lib/cms";
import { useSiteData } from "@/lib/site-data-store";

export const metadata: Metadata = {
  title: "Restaurants in Nusa Dua & Nusa Lembongan",
  description:
    "Choose Acala Nusa Dua for Indonesian cuisine, seafood, Bali Collection restaurants, and dinner, or Acala Nusa Lembongan for brunch, breakfast, coffee, pizza, lunch, drinks, and bar moments.",
  keywords: [
    "restaurant in nusa dua",
    "best restaurant in nusa dua",
    "bali collection restaurants",
    "restaurant nusa lembongan",
    "best restaurant nusa lembongan",
    "places to eat in nusa lembongan",
    "brunch lembongan",
    "pizza nusa lembongan",
  ],
};

export default function BranchesPage() {
  const { branches } = useSiteData();
  const { blocks } = usePublishedCmsPage("branches");
  const heroBlock = blocks.hero;
  const locationsBlock = blocks.locations_intro;
  const spiritBlock = blocks.spirit;

  return (
    <>
      <section className="relative h-[45vh] min-h-72 flex items-center">
        <Image
          src={cmsText(heroBlock, "image", "/Branch/Acala nusa dua/DSC00742-HDR.jpg")}
          alt="Acala Bar & Bistro locations"
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.58)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <AnimatedSection>
            <span className="badge mb-4 inline-flex" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
              <MapPin className="w-3 h-3 mr-1" />
              {cmsText(heroBlock, "eyebrow", "2 Locations Across Bali")}
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              {cmsText(heroBlock, "title", "Our Locations")}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <p className="apple-label mb-3">{cmsText(locationsBlock, "eyebrow", "Where to Find Us")}</p>
            <h2 className="apple-h2 mb-4">{cmsText(locationsBlock, "title", "Choose Your Acala")}</h2>
            <p className="apple-body mx-auto">
              {cmsText(
                locationsBlock,
                "body",
                "Lembongan is for brunch, breakfast, coffee, pizza, lunch, drinks, and bar energy. Nusa Dua is for Indonesian cuisine, seafood, Western dishes, and dinner at Bali Collection.",
              )}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map((branch, i) => (
              <AnimatedSection key={branch.slug} delay={i * 0.15}>
                <BranchCard branch={branch} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-neutral-800)" }}>
              {cmsText(spiritBlock, "title", "Two Locations, One Spirit")}
            </h2>
            <div className="divider mx-auto mb-6" />
            <p className="text-base leading-relaxed mb-10" style={{ color: "var(--color-neutral-600)" }}>
              {cmsText(
                spiritBlock,
                "body",
                "Whether you are searching for places to eat in Nusa Lembongan or a restaurant in Nusa Dua near Bali Collection, Acala keeps each branch distinct while carrying the same warm service, fresh food, and relaxed Bali hospitality.",
              )}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {branches.map((branch) => (
                <Link key={branch.slug} href={`/branches/${branch.slug}`} className="btn btn-primary">
                  <MapPin className="w-4 h-4" />
                  {branch.name.replace("Acala ", "")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
