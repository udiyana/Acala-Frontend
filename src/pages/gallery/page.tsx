import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import BranchGallerySlider from "@/components/BranchGallerySlider";
import BlogHighlights from "@/components/BlogHighlights";
import { cmsText, usePublishedCmsPage } from "@/lib/cms";
import { useSiteData } from "@/lib/site-data-store";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse Acala Bar & Bistro gallery highlights by branch, including Nusa Lembongan and Nusa Dua food, ambience, and video-style moments.",
};

export default function GalleryPage() {
  const { branches } = useSiteData();
  const { blocks } = usePublishedCmsPage("gallery");
  const heroBlock = blocks.hero;
  const branchGalleryBlock = blocks.branch_gallery;
  const branchCtaBlock = blocks.branch_cta;
  const blogBlock = blocks.blog_highlight;

  return (
    <>
      <section className="relative h-[46vh] min-h-80 flex items-center">
        <Image
          src={cmsText(heroBlock, "image", "/Branch/Acala lembongan/galery/Copy of ADS01942.jpg")}
          alt="Acala gallery"
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.58)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <AnimatedSection>
            <span className="badge mb-4 inline-flex" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
              <Camera className="w-3 h-3 mr-1" />
              {cmsText(heroBlock, "eyebrow", "Gallery")}
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              {cmsText(heroBlock, "title", "Acala Gallery")}
            </h1>
            <p className="text-white/75 text-lg max-w-xl">
              {cmsText(heroBlock, "body", "Food, ambience, and video-style highlights from Nusa Lembongan and Nusa Dua.")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <BranchGallerySlider
        eyebrow={cmsText(branchGalleryBlock, "eyebrow", "Branch Gallery")}
        title={cmsText(branchGalleryBlock, "title", "Two Locations, Two Moods")}
        intro={cmsText(branchGalleryBlock, "body", "Browse food, ambience, and video-style highlights from Nusa Lembongan and Nusa Dua.")}
      />

      <section className="section-sm" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="apple-label mb-3">{cmsText(branchCtaBlock, "eyebrow", "Choose Your Branch")}</p>
            <h2 className="font-heading font-bold text-3xl mb-6" style={{ color: "var(--color-neutral-900)" }}>
              {cmsText(branchCtaBlock, "title", "See the Full Branch Experience")}
            </h2>
            {cmsText(branchCtaBlock, "body", "") ? (
              <p className="apple-body mx-auto mb-6">{cmsText(branchCtaBlock, "body", "")}</p>
            ) : null}
            <div className="flex flex-wrap justify-center gap-3">
              {branches.map((branch) => (
                <Link key={branch.slug} href={`/branches/${branch.slug}`} className="btn btn-primary">
                  {branch.name.replace("Acala ", "")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <BlogHighlights
        eyebrow={cmsText(blogBlock, "eyebrow", "Blog Highlight")}
        title={cmsText(blogBlock, "title", "Stories Behind the Gallery")}
        intro={cmsText(blogBlock, "body", "A few highlights from the food, branch atmosphere, and people who make Acala feel alive.")}
      />
    </>
  );
}
