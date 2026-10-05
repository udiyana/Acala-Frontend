import type { Metadata } from "next";
import Image from "next/image";
import { CalendarCheck, Mail, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { cmsText, usePublishedCmsPage } from "@/lib/cms";
import { useSiteData } from "@/lib/site-data-store";

export const metadata: Metadata = {
  title: "Book a Table | Acala Nusa Dua & Nusa Lembongan",
  description:
    "Book Acala Nusa Dua for Indonesian cuisine, seafood, Western dishes, and dinner at Bali Collection, or Acala Nusa Lembongan for brunch, breakfast, coffee, pizza, lunch, drinks, and bar moments.",
  keywords: [
    "best dinner nusa dua",
    "dinner nusa dua",
    "bali collection restaurants",
    "best restaurant in nusa dua",
    "brunch lembongan",
    "lunch lembongan",
    "best pizza nusa lembongan",
    "restaurant nusa lembongan",
  ],
};

export default function ReservationPage() {
  const { branches, bookingActions } = useSiteData();
  const { blocks } = usePublishedCmsPage("reservation");
  const heroBlock = blocks.hero;
  const bookingIntroBlock = blocks.booking_intro;

  return (
    <>
      <section className="relative h-[42vh] min-h-72 flex items-center">
        <Image
          src={cmsText(heroBlock, "image", "/Branch/Acala nusa dua/DSC00742-HDR.jpg")}
          alt="Reserve a table at Acala"
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.60)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <AnimatedSection>
            <span className="badge mb-4 inline-flex" style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
              {cmsText(heroBlock, "eyebrow", "Online Booking")}
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              {cmsText(heroBlock, "title", "Reserve a Table")}
            </h1>
            <p className="text-white/75 text-lg max-w-xl">
              {cmsText(heroBlock, "body", "Book directly through Chope or send your request by email.")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-surface-warm)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <p className="apple-label mb-3">{cmsText(bookingIntroBlock, "eyebrow", "Book Now")}</p>
            <h2 className="apple-h2 mb-4">{cmsText(bookingIntroBlock, "title", "Choose Your Branch")}</h2>
            <p className="apple-body mx-auto">
              {cmsText(bookingIntroBlock, "body", "Each branch uses its own Chope booking link.")}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((branch, index) => {
              const branchWhatsApp = `https://wa.me/${branch.phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(branch.name)}%2C%20I%27d%20like%20to%20reserve%20a%20table.`;
              return (
                <AnimatedSection key={branch.slug} delay={index * 0.15}>
                  <article className="bg-surface overflow-hidden" style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}>
                    <div className="relative h-72">
                      <Image src={branch.heroImage} alt={branch.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.62), transparent 60%)" }} />
                      <div className="absolute left-6 right-6 bottom-5">
                        <h3 className="font-heading font-bold text-3xl text-white">{branch.name}</h3>
                        <p className="text-white/78 text-sm">{branch.tagline}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a href={branch.reservationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary justify-center">
                          <CalendarCheck className="w-4 h-4" />
                          Book a Table
                        </a>
                        <a href={branchWhatsApp} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark justify-center">
                          <MessageCircle className="w-4 h-4" />
                          Contact Us
                        </a>
                      </div>
                      <a href={bookingActions.reserveTable.href} className="btn btn-outline-dark w-full justify-center mt-3">
                        <Mail className="w-4 h-4" />
                        Reserve a Table
                      </a>
                    </div>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
