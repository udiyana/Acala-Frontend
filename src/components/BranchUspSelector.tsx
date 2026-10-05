import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Fish, Heart, Pizza, Users, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { isBranchKey, useSiteData } from "@/lib/site-data-store";
import type { IconName } from "@/lib/ui-data";

const iconMap: Record<IconName, typeof Pizza> = {
  fish: Fish,
  heart: Heart,
  pizza: Pizza,
  users: Users,
  "utensils-crossed": UtensilsCrossed,
  "cake-slice": UtensilsCrossed,
  "cup-soda": UtensilsCrossed,
  soup: UtensilsCrossed,
};

export default function BranchUspSelector({
  customBranchOptions,
  customBranchUsps,
}: {
  customBranchOptions?: any[];
  customBranchUsps?: any;
} = {}) {
  const siteData = useSiteData();
  const branchOptions = customBranchOptions?.length ? customBranchOptions : siteData.branchOptions;
  const branchUsps = customBranchUsps && Object.keys(customBranchUsps).length ? customBranchUsps : siteData.branchUsps;
  const [selectedBranch, setSelectedBranch] = useState(branchOptions[0]?.key || "nusa-lembongan");
  const selectedOption = branchOptions.find((option: any) => option.key === selectedBranch) ?? branchOptions[0];
  const selectedKey = isBranchKey(selectedBranch) ? selectedBranch : selectedBranch;
  const selectedUsps = branchUsps[selectedKey] ?? [];

  return (
    <div className="space-y-8">
      <fieldset className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        <legend className="sr-only">Choose Acala branch</legend>
        {branchOptions.map((option) => {
          const active = option.key === selectedBranch;

          return (
            <label
              key={option.key}
              className="flex cursor-pointer items-center gap-3 rounded-full border px-4 py-3 transition"
              style={{
                background: active ? "var(--color-primary)" : "var(--color-surface)",
                borderColor: active ? "var(--color-primary)" : "var(--color-neutral-200)",
                color: active ? "#fff" : "var(--color-neutral-800)",
                boxShadow: active ? "var(--shadow-md)" : "none",
              }}
            >
              <input
                type="radio"
                name="branch-usp"
                value={option.key}
                checked={active}
                onChange={() => setSelectedBranch(option.key)}
                className="h-4 w-4 accent-current"
              />
              <span>
                <span className="block text-sm font-semibold leading-tight">{option.label}</span>
                <span className="block text-xs leading-snug opacity-75">{option.summary}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {selectedUsps.map((usp: any) => {
          const Icon = (iconMap as Record<string, typeof Pizza>)[usp.icon] ?? UtensilsCrossed;

          return (
            <article
              key={usp.title}
              className="group overflow-hidden bg-surface"
              style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={usp.image}
                  alt={usp.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.42), transparent 62%)" }} />
                <div
                  className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: "rgba(255,255,255,0.92)", color: "var(--color-neutral-900)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="p-6">
                <p className="apple-label mb-2">{selectedOption.label}</p>
                <h3 className="font-heading text-xl font-bold leading-tight" style={{ color: "var(--color-neutral-900)" }}>
                  {usp.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-neutral-500)" }}>
                  {usp.copy}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="text-center">
        <Link href={`/branches/${selectedBranch}`} className="btn btn-primary">
          Explore Acala
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
