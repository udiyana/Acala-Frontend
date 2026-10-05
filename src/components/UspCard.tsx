import Image from "next/image";

interface UspItem {
  tag?: string;
  headline: string;
  copy: string;
  image: string;
  alt: string;
  accent: string;
}

export default function UspCard({ usp }: { usp: UspItem }) {
  return (
    <div
      className="group relative overflow-hidden flex flex-col"
      style={{
        borderRadius: "var(--radius-xl)",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-md)",
        transition: "transform 0.4s ease, box-shadow 0.4s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
      }}
    >
      {/* Image */}
      <div
        className="relative h-72 overflow-hidden"
        style={{ borderRadius: "var(--radius-xl) var(--radius-xl) 0 0" }}
      >
        <Image
          src={usp.image}
          alt={usp.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 60%)",
          }}
        />
      
      </div>

      {/* Copy */}
      <div className="p-7 flex flex-col gap-2">
        <h3
          className="font-heading font-bold"
          style={{
            fontSize: "1.25rem",
            color: "var(--color-neutral-900)",
            letterSpacing: "-0.01em",
          }}
        >
          {usp.headline}
        </h3>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--color-neutral-500)",
            lineHeight: 1.65,
          }}
        >
          {usp.copy}
        </p>
        
      </div>
    </div>
  );
}
