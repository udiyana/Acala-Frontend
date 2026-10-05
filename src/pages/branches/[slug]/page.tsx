import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GalleryGrid from "@/components/GalleryGrid";
import BranchMenuSection from "@/components/BranchMenuSection";
import BranchMoments from "@/components/BranchMoments";
import { cmsParagraphs, cmsText, usePublishedCmsPage } from "@/lib/cms";
import { getAllBranchSlugs, getBranchBySlug } from "@/lib/branches";
import { useSiteData } from "@/lib/site-data-store";

// Generate static params using the new Next.js convention
export function generateStaticParams() {
  return getAllBranchSlugs().map((slug) => ({ slug }));
}

// Generate metadata dynamically — params is now a Promise
export function getBranchMetadata(slug: string): Metadata {
  const branch = getBranchBySlug(slug);
  if (!branch) return { title: "Branch Not Found" };
  return {
    title: branch.seo.title,
    description: branch.seo.description,
    keywords: branch.seo.keywords,
    alternates: {
      canonical: `/branches/${branch.slug}`,
    },
    openGraph: {
      title: branch.seo.title,
      description: branch.seo.description,
      url: `/branches/${branch.slug}`,
      type: "website",
      siteName: "Acala Bar & Bistro",
      images: [
        {
          url: branch.heroImage,
          alt: branch.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: branch.seo.title,
      description: branch.seo.description,
      images: [branch.heroImage],
    },
  };
}

export function generateMetadata({ slug }: { slug: string }): Metadata {
  return getBranchMetadata(slug);
}

export default function BranchPage({ slug }: { slug: string }) {
  const { bookingActions, getBranchBySlug: getCmsBranchBySlug } = useSiteData();
  const { blocks } = usePublishedCmsPage("branch-" + slug);
  const branch = getCmsBranchBySlug(slug);

  if (!branch) return null;

  const heroBlock = blocks.hero;
  const storyBlock = blocks.seo_story;
  const momentsBlock = blocks.moments;
  const menuBlock = blocks.menu;
  const galleryBlock = blocks.gallery;
  const mapContactBlock = blocks.map_contact;
  const storyParagraphs = cmsParagraphs(storyBlock, branch.seo.content.paragraphs);
  const galleryWithMeta = branch.galleryImages.map((src, i) => ({
    src,
    alt: `${branch.name} gallery photo ${i + 1}`,
    category: i % 3 === 0 ? "Ambiance" : i % 3 === 1 ? "Food" : "Drinks",
  }));
  const branchWhatsApp = `https://wa.me/${branch.phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(branch.name)}%2C%20I%27d%20like%20to%20ask%20about%20table%20availability.`;
  const baseUrl = "https://acalabar.com";
  const branchUrl = `${baseUrl}/branches/${branch.slug}`;
  const branchImages = [branch.frontImage, branch.heroImage, ...branch.galleryImages]
    .filter((src): src is string => Boolean(src))
    .filter((src, index, images) => images.indexOf(src) === index)
    .map((src) => `${baseUrl}${src}`);
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${branchUrl}#restaurant`,
    name: branch.name,
    url: branchUrl,
    image: branchImages,
    description: branch.seo.description,
    telephone: branch.phone,
    email: branch.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressRegion: "Bali",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: branch.coordinates.lat,
      longitude: branch.coordinates.lng,
    },
    hasMap: branch.mapUrl,
    priceRange: "Rp",
    servesCuisine: branch.seo.servesCuisine,
    openingHours: branch.seo.openingHours,
    menu: `${baseUrl}/menu`,
    acceptsReservations: true,
    keywords: branch.seo.keywords.join(", "),
    areaServed: branch.slug === "nusa-dua" ? "Nusa Dua, Bali" : "Nusa Lembongan, Bali",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-96 flex items-end">
        <div className="absolute inset-0">
          <Image
            src={cmsText(heroBlock, "image", branch.heroImage)}
            alt={branch.name}
            fill
            className="object-cover"
            preload
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-24 w-full">
          <AnimatedSection>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/branches" className="hover:text-white transition-colors">Branches</Link>
              <span>/</span>
              <span className="text-white">{branch.name}</span>
            </nav>

            <h1
              className="text-5xl lg:text-6xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {cmsText(heroBlock, "title", branch.name)}
            </h1>
            <div className="flex items-center gap-2 text-white/80 text-lg">
              <MapPin className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
              <span>{cmsText(heroBlock, "subtitle", branch.tagline)}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Info Bar */}
      <section className="py-6" style={{ background: "#0a2a3a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {[
              { icon: MapPin, label: branch.address },
              { icon: Phone, label: branch.phone, href: `tel:${branch.phone.replace(/\s/g, "")}` },
              { icon: Mail, label: branch.email, href: `mailto:${branch.email}` },
              { icon: Clock, label: `Mon–Fri: ${branch.hours.weekdays}` },
            ].map(({ icon: Icon, label, href }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
                {href ? (
                  <a href={href} className="text-sm text-white/75 hover:text-white transition-colors">{label}</a>
                ) : (
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-sm" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {branch.features.map((f) => (
              <span
                key={f}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-surface"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <CheckCircle className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                <span style={{ color: "var(--color-neutral-800)" }}>{f}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-14 items-start">
            <AnimatedSection>
              <p className="apple-label mb-3">{cmsText(storyBlock, "eyebrow", branch.seo.content.eyebrow)}</p>
              <h2 className="apple-h2 mb-6">{cmsText(storyBlock, "title", branch.seo.content.title)}</h2>
              <div className="space-y-5 text-base leading-relaxed" style={{ color: "var(--color-neutral-600)" }}>
                {storyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <div className="space-y-4">
                {branch.seo.content.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex gap-3 border-t pt-4"
                    style={{ borderColor: "var(--color-neutral-200)" }}
                  >
                    <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-neutral-700)" }}>
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <BranchMoments
        eyebrow={cmsText(momentsBlock, "eyebrow", "Branch Highlight")}
        intro={cmsText(momentsBlock, "body", "Each Acala branch has its own rhythm, from sunny lunches to relaxed dinners.")}
        slug={branch.slug}
        title={cmsText(momentsBlock, "title", "Dining by the Moment")}
        reservationUrl={branch.reservationUrl}
      />

      {/* Branch Menu */}
      <BranchMenuSection
        eyebrow={cmsText(menuBlock, "eyebrow", "Our Menu")}
        fullMenu={branch.fullMenu}
        intro={cmsText(menuBlock, "body", "Appetizer, main course, dessert, and drink selections are grouped for easier browsing.")}
        title={cmsText(menuBlock, "title", "Menu by Category")}
      />

      {/* Gallery */}
      <section className="section" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10">
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-neutral-800)" }}
            >
              {cmsText(galleryBlock, "title", "Branch Gallery")}
            </h2>
            {cmsText(galleryBlock, "body", "") ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--color-neutral-500)" }}>
                {cmsText(galleryBlock, "body", "")}
              </p>
            ) : null}
          </AnimatedSection>
          <GalleryGrid images={galleryWithMeta} />
        </div>
      </section>

      {/* Map & Contact */}
      <section className="section bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Map */}
            <AnimatedSection direction="left">
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-neutral-800)" }}
              >
                {cmsText(mapContactBlock, "title", "Find Us")}
              </h2>
              <div className="rounded-2xl overflow-hidden" style={{ height: 380 }}>
                <iframe
                  src={branch.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${branch.name}`}
                />
              </div>
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark mt-4 inline-flex"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
              </a>
            </AnimatedSection>

            {/* Contact Details */}
            <AnimatedSection direction="right">
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-neutral-800)" }}
              >
                {cmsText(mapContactBlock, "subtitle", "Contact Details")}
              </h2>
              <div className="space-y-5">
                {[
                  { icon: MapPin, label: "Address", value: branch.address },
                  { icon: Phone, label: "Phone", value: branch.phone, href: `tel:${branch.phone.replace(/\s/g, "")}` },
                  { icon: Mail, label: "Email", value: branch.email, href: `mailto:${branch.email}` },
                  {
                    icon: Clock,
                    label: "Opening Hours",
                    value: `Mon–Fri: ${branch.hours.weekdays}\nSat–Sun: ${branch.hours.weekends}`,
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "var(--color-primary-alpha)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-neutral-400)" }}>
                        {label}
                      </p>
                      {href ? (
                        <a href={href} className="text-sm font-medium hover:underline" style={{ color: "var(--color-neutral-800)" }}>
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium whitespace-pre-line" style={{ color: "var(--color-neutral-800)" }}>
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a href={branch.reservationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center">
                  Book a Table
                  <ArrowRight className="w-4 h-4" />
                </a>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <a href={branchWhatsApp} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark justify-center">
                    <MessageCircle className="w-4 h-4" />
                    Contact Us
                  </a>
                  <a href={bookingActions.reserveTable.href} className="btn btn-outline-dark justify-center">
                    <Mail className="w-4 h-4" />
                    Reserve a Table
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      
    </>
  );
}
