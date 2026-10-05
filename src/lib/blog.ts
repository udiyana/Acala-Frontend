export type BlogPost = {
  author?: string;
  body?: string;
  category?: string;
  cta?: string;
  date?: string;
  excerpt?: string;
  href?: string;
  image?: string;
  readTime?: string;
  slug?: string;
  title?: string;
};

export function blogPostSlug(post: BlogPost): string {
  return slugify(post.slug || post.title || "story");
}

export function blogPostUrl(post: BlogPost): string {
  return `/blog/${blogPostSlug(post)}`;
}

export function blogPostCtaHref(post: BlogPost): string {
  const href = post.href?.trim();
  return href && href !== blogPostUrl(post) ? href : "/branches";
}

export function findBlogPost(posts: readonly BlogPost[], slug: string): BlogPost | undefined {
  const normalizedSlug = slugify(slug);
  return posts.find((post) => blogPostSlug(post) === normalizedSlug);
}

export function blogPostParagraphs(post: BlogPost): string[] {
  const source = post.body?.trim() || post.excerpt?.trim() || "";

  return source
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
