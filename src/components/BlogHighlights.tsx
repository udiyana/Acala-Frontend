import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPostUrl } from "@/lib/blog";
import { useSiteData } from "@/lib/site-data-store";

interface BlogHighlightsProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
}

export default function BlogHighlights({
  eyebrow = "Blog Highlight",
  title = "Stories from Acala",
  intro = "A quick look at the food, people, and two Bali locations behind the Acala experience.",
}: BlogHighlightsProps) {
  const { blogHighlights } = useSiteData();

  return (
    <section className="section" style={{ background: "var(--color-surface-warm)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="apple-label mb-3">{eyebrow}</p>
          <h2 className="apple-h2 mb-4">{title}</h2>
          <p className="apple-body mx-auto">{intro}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogHighlights.map((post) => (
            <article
              key={post.slug || post.title}
              className="bg-surface overflow-hidden flex flex-col"
              style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}
            >
              <Link href={blogPostUrl(post)} className="relative block aspect-[4/3] overflow-hidden group">
                <Image
                  src={post.image || "/Branch/Acala nusa dua/DSC00742-HDR.jpg"}
                  alt={post.title || "Acala story"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <h3
                  className="font-heading font-bold text-xl leading-tight mb-3"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  {post.title || "Acala Story"}
                </h3>
                <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "var(--color-neutral-500)" }}>
                  {post.excerpt || "A quick note from Acala Bar & Bistro."}
                </p>
                <Link
                  href={blogPostUrl(post)}
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {post.cta || "Read More"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
