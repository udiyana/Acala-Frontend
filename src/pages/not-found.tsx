import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 pt-16"
      style={{ background: "var(--color-surface-warm)" }}
    >
      <div className="text-center">
        <p
          className="text-8xl font-bold mb-4"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-primary)" }}
        >
          404
        </p>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-neutral-800)" }}
        >
          Page Not Found
        </h1>
        <p className="text-base mb-8" style={{ color: "var(--color-neutral-500)" }}>
          Looks like you&apos;ve wandered off the island trail. Let&apos;s get you back.
        </p>
        <Link href="/" className="btn btn-primary">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
