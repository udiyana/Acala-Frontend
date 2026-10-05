import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarCheck,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import BlogHighlights from "@/components/BlogHighlights";
import { cmsText, usePublishedCmsPage } from "@/lib/cms";
import { useSiteData } from "@/lib/site-data-store";

export const metadata: Metadata = {
  title: "Contact Acala | Nusa Dua & Nusa Lembongan Restaurants",
  description:
    "Contact Acala Nusa Dua for Bali Collection dinner, Indonesian cuisine, seafood, and Western dishes, or Acala Nusa Lembongan for brunch, breakfast, coffee, pizza, lunch, drinks, and bar plans.",
  keywords: [
    "restaurant near me",
    "place to eat near me",
    "restaurant in nusa dua",
    "bali collection restaurants",
    "restaurant nusa lembongan",
    "brunch lembongan",
    "coffee near me",
    "pizza nusa lembongan",
  ],
};

const bookingActionIcons = {
  "contact-us": MessageCircle,
  "reserve-table": Mail,
  "book-table": CalendarCheck,
} as const;

export default function ContactPage() {
  const { branches, bookingActionCards } = useSiteData();
  const { blocks } = usePublishedCmsPage("contact");
  const heroBlock = blocks.hero;
  const fastActionsBlock = blocks.fast_actions;
  const branchContactsBlock = blocks.branch_contacts;
  const blogBlock = blocks.blog_highlight;

  return (
    <>
      <section className="relative h-[42vh] min-h-72 flex items-center">
        <Image
          src={cmsText(heroBlock, "image", "/Branch/Acala nusa dua/DSC00742-HDR.jpg")}
          alt="Contact Acala Bar & Bistro"
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.60)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <AnimatedSection>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              {cmsText(heroBlock, "title", "Contact Us")}
            </h1>
            <p className="text-white/75 text-lg max-w-xl">
              {cmsText(heroBlock, "body", "Reach Acala by WhatsApp, email reservation, Chope booking, or branch directions.")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <p className="apple-label mb-3">{cmsText(fastActionsBlock, "eyebrow", "Fast Actions")}</p>
            <h2 className="apple-h2 mb-4">{cmsText(fastActionsBlock, "title", "Message, Reserve, or Book")}</h2>
            <p className="apple-body mx-auto">
              {cmsText(fastActionsBlock, "body", "Choose the quickest channel for your dining plan.")}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bookingActionCards.map((item) => {
              const Icon = bookingActionIcons[item.id];
              return (
                <AnimatedSection key={item.title}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="block h-full bg-surface p-7"
                    style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                      style={{ background: "var(--color-primary-alpha)", color: "var(--color-primary)" }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-2" style={{ color: "var(--color-neutral-900)" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-neutral-500)" }}>
                      {item.copy}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                      {item.label}
                      {item.external ? <ExternalLink className="w-4 h-4" /> : null}
                    </span>
                  </a>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <p className="apple-label mb-3">{cmsText(branchContactsBlock, "eyebrow", "Branch Contacts")}</p>
            <h2 className="apple-h2 mb-4">{cmsText(branchContactsBlock, "title", "Nusa Lembongan and Nusa Dua")}</h2>
            {cmsText(branchContactsBlock, "body", "") ? (
              <p className="apple-body mx-auto">{cmsText(branchContactsBlock, "body", "")}</p>
            ) : null}
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map((branch, i) => {
              const branchWhatsApp = `https://wa.me/${branch.phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(branch.name)}%2C%20I%27d%20like%20to%20ask%20about%20table%20availability.`;
              return (
                <AnimatedSection key={branch.slug} delay={i * 0.15}>
                  <article className="bg-surface overflow-hidden" style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}>
                    <div className="relative h-64">
                      <Image src={branch.heroImage} alt={branch.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.58), transparent)" }} />
                      <div className="absolute left-6 right-6 bottom-5">
                        <h3 className="font-heading font-bold text-2xl text-white">{branch.name}</h3>
                        <p className="text-white/78 text-sm">{branch.tagline}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {[
                          { icon: MapPin, label: "Address", value: branch.address },
                          { icon: Phone, label: "Phone", value: branch.phone, href: `tel:${branch.phone.replace(/\s|-/g, "")}` },
                          { icon: Mail, label: "Email", value: branch.email, href: `mailto:${branch.email}` },
                          { icon: Clock, label: "Hours", value: `Daily: ${branch.hours.weekdays}` },
                        ].map(({ icon: Icon, label, value, href }) => (
                          <div key={label} className="flex gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: "var(--color-primary-alpha)", color: "var(--color-primary)" }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--color-neutral-400)" }}>
                                {label}
                              </p>
                              {href ? (
                                <a href={href} className="text-sm hover:underline" style={{ color: "var(--color-neutral-800)" }}>
                                  {value}
                                </a>
                              ) : (
                                <p className="text-sm" style={{ color: "var(--color-neutral-800)" }}>
                                  {value}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark justify-center">
                          <MapPin className="w-4 h-4" />
                          Direction
                        </a>
                        <a href={branchWhatsApp} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark justify-center">
                          <MessageCircle className="w-4 h-4" />
                          Contact Us
                        </a>
                      </div>
                      <a href={branch.reservationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center">
                        Book a Table
                      </a>

                      <div className="mt-6 overflow-hidden" style={{ height: 220, borderRadius: "var(--radius-sm)" }}>
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
                    </div>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <BlogHighlights
        eyebrow={cmsText(blogBlock, "eyebrow", "Blog Highlight")}
        title={cmsText(blogBlock, "title", "Acala Highlights")}
        intro={cmsText(blogBlock, "body", "A few quick stories before you choose your branch.")}
      />
    </>
  );
}
