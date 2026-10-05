import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import BlogHighlights from "@/components/BlogHighlights";
import { cmsParagraphs, cmsText, usePublishedCmsPage } from "@/lib/cms";
import { useSiteData } from "@/lib/site-data-store";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story of Acala Bar & Bistro, from Nusa Lembongan to Nusa Dua, Bali.",
};

const staff = [
  {
    branch: "Nusa Dua",
    slug: "nusa-dua",
    title: "Nusa Dua Team",
    image: "/Branch/Acala nusa dua/Copy of DSC03521.jpg",
    copy:
      "A focused kitchen and service team behind Indonesian classics, seafood, and romantic dinner moments.",
  },
  {
    branch: "Nusa Lembongan",
    slug: "nusa-lembongan",
    title: "Nusa Lembongan Team",
    image: "/About/staff nusa lembongan.jpg",
    copy:
      "A relaxed island team serving breakfast, pizza lunches, seafood dinners, and easy hospitality.",
  },
];

export default function AboutPage() {
  const { branches } = useSiteData();
  const { blocks } = usePublishedCmsPage("about");
  const heroBlock = blocks.hero;
  const storyBlock = blocks.story;
  const blogBlock = blocks.blog_highlight;
  const visitBlock = blocks.visit_cta;
  const teamBlocks = {
    "nusa-dua": blocks.nusa_dua_team,
    "nusa-lembongan": blocks.nusa_lembongan_team,
  };
  const storyParagraphs = cmsParagraphs(storyBlock, [
    "Acala Bar & Bistro began in Nusa Lembongan as a place for people to slow down, eat well, and feel at home after a day on the island.",
    "As Acala grew to Nusa Dua, the heart stayed the same. Lembongan carries a casual pizza, seafood, and chill hangout energy, while Nusa Dua brings authentic Indonesian food, seafood, and a romantic dining mood at Bali Collection.",
    "The name Acala reflects steadiness: quality food, thoughtful service, and spaces made for shared moments.",
  ]);

  return (
    <>
      <section className="relative h-[48vh] min-h-80 flex items-center">
        <Image
          src={cmsText(heroBlock, "image", "/About/staff nusa lembongan.jpg")}
          alt="Acala Nusa Lembongan team"
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.58)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <AnimatedSection>
            <span className="badge mb-4 inline-flex" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
              {cmsText(heroBlock, "eyebrow", "Our Story")}
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              {cmsText(heroBlock, "title", "About Acala")}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="apple-label mb-3">{cmsText(storyBlock, "eyebrow", "Our Story")}</p>
            <h2 className="apple-h2 mb-6">{cmsText(storyBlock, "title", "Two Bali Branches, One Warm Welcome")}</h2>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: "var(--color-neutral-600)" }}>
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {staff.map((item, index) => (
        <section
          key={item.branch}
          className="section"
          style={{ background: index === 0 ? "var(--color-surface-warm)" : "var(--color-surface)" }}
        >
          {(() => {
            const teamBlock = teamBlocks[item.slug as keyof typeof teamBlocks];

            return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <AnimatedSection direction={index === 0 ? "left" : "right"} className={index === 1 ? "lg:order-2" : ""}>
                <div
                  className="relative overflow-hidden min-h-[360px] lg:min-h-[460px]"
                  style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}
                >
                  <Image
                    src={cmsText(teamBlock, "image", item.image)}
                    alt={`${item.branch} staff`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 62%)" }} />
                  <div className="absolute left-5 bottom-5">
                    <span className="badge" style={{ background: "rgba(255,255,255,0.92)", color: "var(--color-neutral-800)" }}>
                      {item.branch}
                    </span>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection direction={index === 0 ? "right" : "left"}>
                <div className="max-w-xl">
                  <p className="apple-label mb-3">{cmsText(teamBlock, "eyebrow", "Our Staff")}</p>
                  <h2 className="apple-h2 mb-5">{cmsText(teamBlock, "title", item.title)}</h2>
                  <p className="apple-body mb-7">
                    {cmsText(teamBlock, "body", item.copy)}
                  </p>
                  <Link href={`/branches/${item.slug}`} className="btn btn-primary">
                    {cmsText(teamBlock, "cta_label", "View Branch")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
            );
          })()}
        </section>
      ))}

      <BlogHighlights
        eyebrow={cmsText(blogBlock, "eyebrow", "Blog Highlight")}
        title={cmsText(blogBlock, "title", "Acala Highlights")}
        intro={cmsText(blogBlock, "body", "Branch stories, food moments, and the dining moods guests can expect.")}
      />

      <section className="section-sm bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-heading font-bold text-3xl mb-4" style={{ color: "var(--color-neutral-900)" }}>
              {cmsText(visitBlock, "title", "Visit the Acala That Fits Your Day")}
            </h2>
            {cmsText(visitBlock, "body", "") ? (
              <p className="apple-body mx-auto mb-6">{cmsText(visitBlock, "body", "")}</p>
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
    </>
  );
}
