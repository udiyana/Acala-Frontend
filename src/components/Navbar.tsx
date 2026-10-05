import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useSiteData } from "@/lib/site-data-store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/branches", label: "Locations" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { bookingActions } = useSiteData();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isHome = pathname === "/";
  const logoOnSurface = scrolled || !isHome || isOpen;
  const logoCopyClass = logoOnSurface ? "logo-copy" : "logo-copy-on-hero";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome || isOpen
            ? "glass shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
              <div className="relative flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/logo-acala.png"
                  alt="Acala Logo"
                  width={44}
                  height={44}
                  className={`object-contain drop-shadow-md ${logoOnSurface ? "logo-mark" : "logo-mark-on-hero"}`}
                />
              </div>
              <div>
                <span
                  className={`text-xl font-bold leading-none block ${logoCopyClass}`}
                  style={{
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Acala
                </span>
                <span
                  className={`text-xs leading-none tracking-widest uppercase ${logoCopyClass}`}
                >
                  Bar & Bistro
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors link-underline ${
                      active
                        ? "text-primary"
                        : scrolled || !isHome
                        ? "text-charcoal hover:text-primary"
                        : "text-white/90 hover:text-white"
                    }`}
                    style={{
                      color: active
                        ? "var(--color-primary)"
                        : scrolled || !isHome
                        ? "var(--color-neutral-800)"
                        : "rgba(255,255,255,0.9)",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={bookingActions.bookTable.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-sm px-5 py-2.5"
              >
                {bookingActions.bookTable.label}
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-black/5"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6" style={{ color: "var(--color-neutral-800)" }} />
                ) : (
                  <Menu
                    className="w-6 h-6"
                    style={{ color: scrolled || !isHome ? "var(--color-neutral-800)" : "#fff" }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 lg:hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "var(--color-surface)" }}
      >
        <div className="p-6 pt-20 flex flex-col gap-2 h-full overflow-y-auto">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  active
                    ? "text-white"
                    : "text-charcoal hover:bg-gray-50"
                }`}
                style={{
                  background: active ? "var(--color-primary)" : "",
                  color: active ? "#fff" : "var(--color-neutral-800)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href={bookingActions.bookTable.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="btn btn-primary w-full justify-center"
            >
              {bookingActions.bookTable.label}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
