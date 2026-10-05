import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  MessageCircle,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import BranchUspSelector from "@/components/BranchUspSelector";
import BranchCard from "@/components/BranchCard";
import BlogHighlights from "@/components/BlogHighlights";
import BranchGallerySlider from "@/components/BranchGallerySlider";
import HeroSlider from "@/components/HeroSlider";
import HomeMenuSelector from "@/components/HomeMenuSelector";
import { cmsText, usePublishedCmsPage } from "@/lib/cms";
import { useSiteData } from "@/lib/site-data-store";

export const metadata: Metadata = {
  title: "Acala Bar & Bistro | Restaurant in Nusa Dua & Nusa Lembongan",
  description:
    "Acala Bar & Bistro has two Bali branches: Acala Nusa Dua for Indonesian cuisine, seafood, Bali Collection restaurants, and dinner; Acala Nusa Lembongan for brunch, breakfast, coffee, pizza, lunch, drinks, and bar moments.",
  keywords: [
    "acala nusa dua",
    "restaurant in nusa dua",
    "best restaurant in nusa dua",
    "bali collection restaurants",
    "indonesian cuisine bali",
    "dinner nusa dua",
    "restaurant nusa lembongan",
    "brunch lembongan",
    "breakfast near me",
    "coffee near me",
    "pizza nusa lembongan",
    "bar lembongan",
  ],
};



export default function HomePage() {
  const { branches, bookingActions } = useSiteData();
  const { blocks } = usePublishedCmsPage("home");
  const heroBlock = blocks.hero;
  const whyBlock = blocks.why_acala;
  const locationsBlock = blocks.locations;
  const storyBlock = blocks.story;
  const staffBlock = blocks.staff;
  const staffLembonganBlock = blocks.staff_lembongan;
  const staffNusaDuaBlock = blocks.staff_nusa_dua;
  const menuBlock = blocks.menu_categories;
  const galleryBlock = blocks.branch_gallery;
  const blogBlock = blocks.blog_highlight;
  const ctaBlock = blocks.cta;

  const heroImages = Array.isArray(heroBlock?.metadata?.images) ? heroBlock.metadata.images as string[] : undefined;

  return (
    <>
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <HeroSlider cmsImages={heroImages} />

        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 lg:px-8 pt-32 pb-20 text-center">
          <AnimatedSection>
            <p className="apple-label mb-5" style={{ color: "#fff" }}>
              {cmsText(heroBlock, "eyebrow", "Two Bali Branches, Two Distinct Moods")}
            </p>
            <h1
              className="font-heading font-bold text-white leading-[1.03] mb-6"
              style={{ fontSize: "clamp(3.2rem, 8vw, 6.7rem)" }}
            >
              {cmsText(heroBlock, "title", "Acala Bar & Bistro")}
            </h1>
            <p className="text-white/85 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              {cmsText(
                heroBlock,
                "body",
                "Acala has two Bali branches with their own character: Nusa Lembongan is the relaxed island restaurant for brunch, breakfast, coffee, pizza, lunch, drinks, and bar moments, while Nusa Dua is a tropical restaurant in Bali Collection for Indonesian cuisine, seafood, Western favorites, and dinner.",
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto mb-10">
              {((heroBlock?.metadata?.branch_links as any[]) || [
                {
                  href: "/branches/nusa-lembongan",
                  title: "Nusa Lembongan",
                  copy: "Brunch, coffee, pizza, lunch, drinks, and bar energy",
                },
                {
                  href: "/branches/nusa-dua",
                  title: "Nusa Dua",
                  copy: "Indonesian cuisine, seafood, Western dishes, and dinner",
                },
              ]).map((branch, i) => (
                <Link
                  key={i}
                  href={branch.href || "#"}
                  className="flex items-center gap-3 rounded-full px-4 py-3 text-left"
                  style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.24)" }}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <span className="block text-sm font-semibold leading-tight">{branch.title}</span>
                    <span className="block text-xs text-white/72 leading-snug">{branch.copy}</span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={cmsText(heroBlock, "cta_url", bookingActions.bookTable.href)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {cmsText(heroBlock, "cta_label", bookingActions.bookTable.label)}
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link href="/branches" className="btn btn-outline">
                Explore Acala
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <h2 className="apple-h2 mb-4">{cmsText(whyBlock, "title", "Why Choose Acala ?")}</h2>
            <p className="apple-body mx-auto">
              {cmsText(
                whyBlock,
                "body",
                "Choose the branch that fits your mood, then see what makes each Acala experience different.",
              )}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <BranchUspSelector 
              customBranchOptions={whyBlock?.metadata?.branchOptions as any}
              customBranchUsps={whyBlock?.metadata?.branchUsps as any}
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <p className="apple-label mb-3">{cmsText(locationsBlock, "eyebrow", "Our Locations")}</p>
            <h2 className="apple-h2 mb-4">{cmsText(locationsBlock, "title", "Find Your Acala")}</h2>
            <p className="apple-body mx-auto">
              {cmsText(locationsBlock, "body", "Get directions, explore each branch, or book directly through Chope.")}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {(((locationsBlock?.metadata?.branchCards as any[]) || branches) || []).map((branch, i) => (
              <AnimatedSection key={branch.slug || i} delay={i * 0.15}>
                <BranchCard branch={branch} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="apple-label mb-3">{cmsText(storyBlock, "eyebrow", "Our Story")}</p>
            <h2 className="apple-h2 mb-5">{cmsText(storyBlock, "title", "Built Around Food, People, and Bali Hospitality")}</h2>
            <p className="apple-body mx-auto">
              {cmsText(
                storyBlock,
                "body",
                "Acala began in Nusa Lembongan and grew into Nusa Dua with the same promise: create a comfortable place where guests can eat well, stay longer, and feel looked after. From Indonesian classics to pizza and seafood, every branch carries its own local mood.",
              )}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <p className="apple-label mb-3">{cmsText(staffBlock, "eyebrow", "Our Staff")}</p>
            <h2 className="apple-h2 mb-4">{cmsText(staffBlock, "title", "The People Behind the Welcome")}</h2>
            <p className="apple-body mx-auto">
              {cmsText(
                staffBlock,
                "body",
                "Our teams in Lembongan and Nusa Dua bring the same warmth to two very different dining settings.",
              )}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                branch: cmsText(staffLembonganBlock, "title", "Nusa Lembongan"),
                copy: cmsText(staffLembonganBlock, "body", "Warm service, easy smiles, and the casual rhythm of island hospitality."),
                src: cmsText(staffLembonganBlock, "image", "/About/staff nusa lembongan.jpg"),
              },
              {
                branch: cmsText(staffNusaDuaBlock, "title", "Nusa Dua"),
                copy: cmsText(staffNusaDuaBlock, "body", "A dedicated kitchen and service team behind every family lunch and dinner reservation."),
                src: cmsText(staffNusaDuaBlock, "image", "/Branch/Acala nusa dua/Copy of DSC03521.jpg"),
              }
            ].map((staff) => (
              <AnimatedSection key={staff.branch}>
                <div className="relative overflow-hidden min-h-[360px]" style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}>
                  <Image src={staff.src} alt={`${staff.branch} staff`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent 58%)" }} />
                  <div className="absolute left-6 right-6 bottom-6">
                    <p className="badge mb-3" style={{ background: "rgba(255,255,255,0.9)", color: "var(--color-neutral-800)" }}>
                      {staff.branch}
                    </p>
                    <p className="text-white text-lg font-semibold leading-snug">{staff.copy}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <p className="apple-label mb-3">{cmsText(menuBlock, "eyebrow", "Menu Categories")}</p>
            <h2 className="apple-h2 mb-4">{cmsText(menuBlock, "title", "Appetizer, Main Course, Dessert, Drink")}</h2>
            <p className="apple-body mx-auto">
              {cmsText(menuBlock, "body", "Choose a branch, then scan the four menu categories before contacting Acala.")}
            </p>
          </AnimatedSection>

          <HomeMenuSelector />
        </div>
      </section>

      <BranchGallerySlider
        eyebrow={cmsText(galleryBlock, "eyebrow", "Branch Gallery")}
        title={cmsText(galleryBlock, "title", "Two Locations, Two Moods")}
        intro={cmsText(galleryBlock, "body", "Browse food, ambience, and video-style highlights from Nusa Lembongan and Nusa Dua.")}
      />

      <BlogHighlights
        eyebrow={cmsText(blogBlock, "eyebrow", "Blog Highlight")}
        title={cmsText(blogBlock, "title", "Acala Highlights")}
        intro={cmsText(blogBlock, "body", "Branch stories, food moments, and quick reads from Nusa Lembongan and Nusa Dua.")}
      />

      <section className="relative py-28 overflow-hidden">
        <Image
          src={cmsText(ctaBlock, "image", "/Branch/Acala nusa dua/DSC00742-HDR.jpg")}
          alt="Book now at Acala Bar & Bistro"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.68)" }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <p className="apple-label mb-5" style={{ color: "#fff" }}>
              {cmsText(ctaBlock, "eyebrow", "Book Now")}
            </p>
            <h2 className="font-heading font-bold text-white mb-5 leading-tight" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
              {cmsText(ctaBlock, "title", "Ready for Acala?")}
            </h2>
            <p className="text-white/78 text-lg mb-9 leading-relaxed">
              {cmsText(ctaBlock, "body", "Pick your branch and book your table for Nusa Lembongan or Nusa Dua.")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {branches.map((branch) => (
                <a key={branch.slug} href={branch.reservationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  {branch.name.replace("Acala ", "")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              ))}
              <a href={bookingActions.contactUs.href} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <MessageCircle className="w-4 h-4" />
                {bookingActions.contactUs.label}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
