import type { Metadata } from "next";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import NotFoundPage from "@/pages/not-found";
import {
  blogPostCtaHref,
  blogPostParagraphs,
  blogPostUrl,
  findBlogPost,
  slugify,
} from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import { cmsText, usePublishedCmsPage } from "@/lib/cms";
import { blogHighlights as fallbackBlogPosts } from "@/lib/site-data";
import { useSiteData } from "@/lib/site-data-store";

export function getBlogMetadata(slug: string): Metadata {
  const post = findBlogPost(fallbackBlogPosts, slug);

  return {
    title: post?.title ?? "Blog Story",
    description: post?.excerpt ?? "Read stories from Acala Bar & Bistro.",
  };
}

export default function BlogPostPage({ slug }: { slug: string }) {
  const { blogHighlights, bookingActions, isLoading } = useSiteData();
  const { blocks } = usePublishedCmsPage("blog");
  const post = findBlogPost(blogHighlights as readonly BlogPost[], slug);
  const ctaBlock = blocks.closing_cta;
  const articleListBlock = blocks.article_list;

  useEffect(() => {
    if (!post) {
      return;
    }

    document.title = `${post.title ?? "Blog Story"} | Acala Bar & Bistro`;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = post.excerpt ?? "Read stories from Acala Bar & Bistro.";
  }, [post]);

  if (!post && isLoading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4 pt-24" style={{ background: "var(--color-surface-warm)" }}>
        <div className="text-center">
          <p className="apple-label mb-3">Acala Journal</p>
          <h1 className="font-heading text-3xl font-bold" style={{ color: "var(--color-neutral-900)" }}>Loading Story</h1>
        </div>
      </section>
    );
  }

  if (!post) {
    return <NotFoundPage />;
  }

  const paragraphs = blogPostParagraphs(post);
  const relatedPosts = (blogHighlights as readonly BlogPost[])
    .filter((item) => slugify(item.slug || item.title || "") !== slugify(slug))
    .slice(0, 2);
  const articleCtaHref = blogPostCtaHref(post);
  const articleCtaIsExternal = /^https?:\/\//.test(articleCtaHref);
  const closingCtaHref = cmsText(ctaBlock, "cta_url", bookingActions.bookTable.href);
  const closingCtaLabel = cmsText(ctaBlock, "cta_label", bookingActions.bookTable.label);
  const closingCtaIsExternal = /^https?:\/\//.test(closingCtaHref);

  return (
    <>
      <section className="relative min-h-[62vh] overflow-hidden flex items-end">
        <Image
          src={post.image ?? "/Branch/Acala nusa dua/DSC00742-HDR.jpg"}
          alt={post.title ?? "Acala blog story"}
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.76), rgba(0,0,0,0.28))" }} />
        <div className="relative max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <AnimatedSection>
            <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/82 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="badge inline-flex" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
                {post.category ?? "Acala Story"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75">
                <CalendarDays className="w-4 h-4" />
                {post.date ?? "Acala Journal"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75">
                <Clock3 className="w-4 h-4" />
                {post.readTime ?? "Quick Read"}
              </span>
            </div>
            <h1 className="font-heading font-bold text-white leading-tight mb-5" style={{ fontSize: "clamp(2.9rem, 7vw, 5.4rem)" }}>
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="max-w-3xl text-lg sm:text-xl leading-relaxed text-white/80">{post.excerpt}</p>
            ) : null}
          </AnimatedSection>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <article className="blog-rich-content text-lg leading-8" style={{ color: "var(--color-neutral-700)" }}>
              {/<\/?[a-z][\s\S]*>/i.test(post.body || post.excerpt || "") ? (
                <div dangerouslySetInnerHTML={{ __html: post.body || post.excerpt || "" }} />
              ) : (
                paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))
              )}
            </article>

            <div className="mt-10 flex flex-wrap gap-3">
              {articleCtaIsExternal ? (
                <a href={articleCtaHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  {post.cta ?? "Explore More"}
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <Link href={articleCtaHref} className="btn btn-primary">
                  {post.cta ?? "Explore More"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link href="/blog" className="btn btn-outline">
                More Stories
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="section" style={{ background: "var(--color-surface-warm)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="max-w-2xl mb-10">
              <p className="apple-label mb-3">{cmsText(articleListBlock, "eyebrow", "Latest Reads")}</p>
              <h2 className="apple-h2 mb-4">Read Another Story</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((item, index) => (
                <AnimatedSection key={blogPostUrl(item)} delay={index * 0.1}>
                  <Link
                    href={blogPostUrl(item)}
                    className="relative block min-h-[330px] overflow-hidden group"
                    style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}
                  >
                    <Image
                      src={item.image ?? "/Branch/Acala nusa dua/DSC00742-HDR.jpg"}
                      alt={item.title ?? "Acala story"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.68), rgba(0,0,0,0.1))" }} />
                    <div className="absolute left-6 right-6 bottom-6">
                      <span className="badge mb-3 inline-flex" style={{ background: "rgba(255,255,255,0.9)", color: "var(--color-neutral-800)" }}>
                        {item.category ?? "Acala Story"}
                      </span>
                      <h3 className="font-heading text-2xl font-bold leading-tight text-white">{item.title}</h3>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
            <p className="apple-label mb-5 inline-flex items-center justify-center gap-2" style={{ color: "#fff" }}>
              <MapPin className="w-4 h-4" />
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
