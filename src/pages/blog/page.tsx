import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import type { BlogPost } from "@/lib/blog";
import { blogPostUrl } from "@/lib/blog";
import { cmsText, cmsImg, usePublishedCmsPage, usePublishedCmsImages } from "@/lib/cms";
import { useSiteData } from "@/lib/site-data-store";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read Acala Bar & Bistro stories, branch notes, food highlights, and Bali dining inspiration from Nusa Dua and Nusa Lembongan.",
};

const BRANCH_NOTES_FALLBACKS = [
  {
    key: "blog.branch_notes.nusa_lembongan",
    branch: "Nusa Lembongan",
    href: "/branches/nusa-lembongan",
    src: "/Branch/Acala lembongan/galery/Copy of ADS01942.jpg",
    alt: "Acala Nusa Lembongan – breakfast, pizza, and island dining",
    copy: "Breakfast, pizza, seafood, drinks, and slower island afternoons.",
  },
  {
    key: "blog.branch_notes.nusa_dua",
    branch: "Nusa Dua",
    href: "/branches/nusa-dua",
    src: "/Branch/Acala nusa dua/Copy of RSK-133.jpg",
    alt: "Acala Nusa Dua – Indonesian food and garden dinners",
    copy: "Indonesian favorites, seafood plates, garden dinners, and Bali Collection ease.",
  },
];

export default function BlogPage() {
  const { blogHighlights, bookingActions } = useSiteData();
  const { blocks } = usePublishedCmsPage("blog");
  const { images } = usePublishedCmsImages();
  const heroBlock = blocks.hero;
  const featuredBlock = blocks.featured_story;
  const articleListBlock = blocks.article_list;
  const branchNotesBlock = blocks.branch_notes;
  const ctaBlock = blocks.closing_cta;
  const posts = (blogHighlights as readonly BlogPost[]).filter((post) => Boolean(post.title));
  const featuredPost = posts[0] ?? {};
  const gridPosts = posts.length > 1 ? posts.slice(1) : posts;
  const closingCtaHref = cmsText(ctaBlock, "cta_url", bookingActions.bookTable.href);
  const closingCtaLabel = cmsText(ctaBlock, "cta_label", bookingActions.bookTable.label);
  const closingCtaIsExternal = /^https?:\/\//.test(closingCtaHref);

  return (
    <>
      <section className="relative min-h-[58vh] overflow-hidden flex items-center">
        <Image
          src={cmsText(heroBlock, "image", "/Branch/Acala nusa dua/Copy of DSC03456.jpg")}
          alt="Acala blog"
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.58)" }} />
        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <AnimatedSection className="max-w-3xl">
            <span className="badge mb-5 inline-flex items-center gap-2" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
              <BookOpen className="w-3.5 h-3.5" />
              {cmsText(heroBlock, "eyebrow", "Acala Journal")}
            </span>
            <h1 className="font-heading font-bold text-white leading-tight mb-5" style={{ fontSize: "clamp(3rem, 7vw, 5.8rem)" }}>
              {cmsText(heroBlock, "title", "Stories from Acala")}
            </h1>
            <p className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-2xl">
              {cmsText(heroBlock, "body", "Food notes, branch stories, and quick reads from Nusa Lembongan and Nusa Dua.")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
            <Link
              href={blogPostUrl(featuredPost)}
              className="relative block min-h-[420px] overflow-hidden group"
              style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)" }}
            >
              <Image
                src={featuredPost.image ?? cmsText(heroBlock, "image", "/Branch/Acala nusa dua/DSC00742-HDR.jpg")}
                alt={featuredPost.title ?? "Featured Acala story"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.12))" }} />
              <div className="absolute left-6 right-6 bottom-6">
                <span className="badge mb-3 inline-flex" style={{ background: "rgba(255,255,255,0.9)", color: "var(--color-neutral-800)" }}>
                  {featuredPost.category ?? cmsText(featuredBlock, "eyebrow", "Featured Story")}
                </span>
                <h2 className="font-heading text-3xl font-bold leading-tight text-white">
                  {featuredPost.title ?? cmsText(featuredBlock, "title", "A closer look at two Acala moods")}
                </h2>
              </div>
            </Link>

            <div>
              <p className="apple-label mb-3">{cmsText(featuredBlock, "eyebrow", "Featured Story")}</p>
              <h2 className="apple-h2 mb-5">
                {cmsText(featuredBlock, "title", featuredPost.title ?? "A closer look at two Acala moods")}
              </h2>
              <p className="apple-body mb-7">
                {cmsText(
                  featuredBlock,
                  "body",
                  featuredPost.excerpt ?? "Lead with the story you want guests to read first, then connect them to the right branch experience.",
                )}
              </p>
              <Link href={blogPostUrl(featuredPost)} className="btn btn-primary">
                {cmsText(featuredBlock, "cta_label", featuredPost.cta ?? "Read Story")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-2xl mb-12">
            <p className="apple-label mb-3">{cmsText(articleListBlock, "eyebrow", "Latest Reads")}</p>
            <h2 className="apple-h2 mb-4">{cmsText(articleListBlock, "title", "Food, People, and Bali Moments")}</h2>
            <p className="apple-body">
              {cmsText(articleListBlock, "body", "Keep up with stories from the kitchen, the branches, and the moments guests come back for.")}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {gridPosts.map((post, index) => (
              <AnimatedSection key={`${post.title}-${index}`} delay={index * 0.08}>
                <article
                  className="h-full overflow-hidden bg-surface flex flex-col"
                  style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}
                >
                  <Link href={blogPostUrl(post)} className="relative block aspect-[4/3] overflow-hidden group">
                    <Image
                      src={post.image ?? "/Branch/Acala nusa dua/DSC00742-HDR.jpg"}
                      alt={post.title ?? "Acala story"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold" style={{ color: "var(--color-neutral-500)" }}>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {post.date ?? "Acala Story"}
                      </span>
                      <span>{post.readTime ?? "Quick Read"}</span>
                    </div>
                    <h3 className="font-heading font-bold text-2xl leading-tight mb-3" style={{ color: "var(--color-neutral-900)" }}>
                      {post.title ?? "Acala Story"}
                    </h3>
                    <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--color-neutral-500)" }}>
                      {post.excerpt ?? "A quick note from Acala Bar & Bistro."}
                    </p>
                    <Link href={blogPostUrl(post)} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                      {post.cta ?? "Read More"}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12">
            <p className="apple-label mb-3">{cmsText(branchNotesBlock, "eyebrow", "Branch Notes")}</p>
            <h2 className="apple-h2 mb-4">{cmsText(branchNotesBlock, "title", "Choose the branch behind the story")}</h2>
            <p className="apple-body mx-auto">
              {cmsText(
                branchNotesBlock,
                "body",
                "Lembongan brings a relaxed island rhythm, while Nusa Dua brings polished dinners and Bali Collection ease.",
              )}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BRANCH_NOTES_FALLBACKS.map((note, index) => {
              const img = cmsImg(images, note.key, note.src, note.alt);
              return (
              <AnimatedSection key={note.branch} delay={index * 0.1}>
                <Link
                  href={note.href}
                  className="relative block min-h-[340px] overflow-hidden group"
                  style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.68), rgba(0,0,0,0.1))" }} />
                  <div className="absolute left-6 right-6 bottom-6">
                    <span className="badge mb-3 inline-flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.9)", color: "var(--color-neutral-800)" }}>
                      <MapPin className="w-3.5 h-3.5" />
                      {note.branch}
                    </span>
                    <p className="max-w-md text-lg font-semibold leading-snug text-white">{note.copy}</p>
                  </div>
                </Link>
              </AnimatedSection>
            );})}
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <Image
          src={cmsText(ctaBlock, "image", "/Branch/Acala lembongan/galery/Copy of DSC08301.jpg")}
          alt="Visit Acala"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.68)" }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="apple-label mb-5" style={{ color: "#fff" }}>
              {cmsText(ctaBlock, "eyebrow", "Plan Your Visit")}
            </p>
            <h2 className="font-heading font-bold text-white mb-5 leading-tight" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
              {cmsText(ctaBlock, "title", "Turn the story into a table")}
            </h2>
            <p className="text-white/78 text-lg mb-8 leading-relaxed">
              {cmsText(ctaBlock, "body", "Choose your Acala branch and reserve your next Bali dining moment.")}
            </p>
            {closingCtaIsExternal ? (
              <a href={closingCtaHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {closingCtaLabel}
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <Link href={closingCtaHref} className="btn btn-primary">
                {closingCtaLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
