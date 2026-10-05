import Image from "next/image";
import Link from "next/link";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useSiteData } from "@/lib/site-data-store";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/branches", label: "Branches" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const { branches, bookingActions } = useSiteData();
  const currentYear = new Date().getFullYear();
  const footerAccent = "#fff";
  const footerMuted = "rgba(255,255,255,0.72)";
  const footerSubtle = "rgba(255,255,255,0.52)";

  return (
    <footer style={{ background: "#171717", color: footerAccent }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo-acala.png"
                alt="Acala Logo"
                width={44}
                height={44}
                className="object-contain logo-mark-on-hero"
              />
              <div>
                <span
                  className="text-xl font-bold block leading-none logo-copy-on-hero"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Acala
                </span>
                <span className="text-xs tracking-widest uppercase logo-copy-on-hero">
                  Bar & Bistro
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: footerMuted }}>
              Two Bali dining destinations: pizza, seafood, and chill island energy in Nusa Lembongan;
              authentic Indonesian food, seafood, and romantic evenings in Nusa Dua.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={bookingActions.contactUs.href} target="_blank" rel="noopener noreferrer" className="btn btn-outline px-5 py-2.5 text-sm">
                {bookingActions.contactUs.label}
              </a>
              <a href={bookingActions.reserveTable.href} className="btn btn-outline px-5 py-2.5 text-sm">
                {bookingActions.reserveTable.label}
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: footerAccent }}>
              Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: footerMuted }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {branches.map((branch) => (
            <div key={branch.slug}>
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: footerAccent }}>
                {branch.name.replace("Acala ", "")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: footerAccent }} />
                  <span className="text-sm" style={{ color: footerMuted }}>
                    {branch.address}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: footerAccent }} />
                  <a
                    href={`tel:${branch.phone.replace(/\s|-/g, "")}`}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: footerMuted }}
                  >
                    {branch.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: footerAccent }} />
                  <a
                    href={`mailto:${branch.email}`}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: footerMuted }}
                  >
                    {branch.email}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: footerAccent }} />
                  <span className="text-sm" style={{ color: footerMuted }}>
                    Daily: {branch.hours.weekdays}
                  </span>
                </li>
              </ul>
              <div className="flex gap-3 mt-5">
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: footerAccent }}
                >
                  Get Direction
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: footerSubtle }}>
            &copy; {currentYear} Acala Bar & Bistro. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: footerSubtle }}>
            Made in Bali, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
