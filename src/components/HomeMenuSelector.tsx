import { useMemo, useState } from "react";
import Image from "next/image";
import { CakeSlice, CupSoda, MessageCircle, Soup, UtensilsCrossed } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useSiteData } from "@/lib/site-data-store";
import type { IconName } from "@/lib/ui-data";
import type { Branch } from "@/lib/branches";

type MenuCategory = Branch["fullMenu"][number];

const iconMap: Record<IconName, typeof UtensilsCrossed> = {
  "cake-slice": CakeSlice,
  "cup-soda": CupSoda,
  fish: UtensilsCrossed,
  heart: UtensilsCrossed,
  pizza: UtensilsCrossed,
  soup: Soup,
  users: UtensilsCrossed,
  "utensils-crossed": UtensilsCrossed,
};

function groupMenu(
  fullMenu: MenuCategory[],
  homeMenuGroups: ReturnType<typeof useSiteData>["homeMenuGroups"],
) {
  const grouped = homeMenuGroups.map((group) => ({
    ...group,
    categories: [] as MenuCategory[],
  }));

  fullMenu.forEach((category) => {
    const haystack = `${category.id} ${category.name}`.toLowerCase();
    const match = grouped.find((group) => group.matchers.some((matcher) => haystack.includes(matcher)));
    if (match) {
      match.categories.push(category);
    } else {
      grouped[1].categories.push(category);
    }
  });

  return grouped;
}

export default function HomeMenuSelector() {
  const { branches, bookingActions, homeMenuGroups } = useSiteData();
  const [activeBranch, setActiveBranch] = useState(branches[0].slug);
  const [activeCategory, setActiveCategory] = useState("appetizer");

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.slug === activeBranch) ?? branches[0],
    [activeBranch],
  );

  const groupedMenu = useMemo(() => groupMenu(selectedBranch.fullMenu, homeMenuGroups), [homeMenuGroups, selectedBranch]);
  const selectedGroup = groupedMenu.find((group) => group.id === activeCategory) ?? groupedMenu[0];
  const SelectedIcon = iconMap[selectedGroup.icon] ?? UtensilsCrossed;

  return (
    <div>
      <AnimatedSection delay={0.08} className="flex justify-center mb-10">
        <div
          role="radiogroup"
          aria-label="Choose menu branch"
          className="flex flex-col sm:flex-row gap-2 p-1 rounded-3xl sm:rounded-full bg-gray-100"
        >
          {branches.map((branch) => {
            const active = activeBranch === branch.slug;
            return (
              <label
                key={branch.slug}
                className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center"
                style={{
                  background: active ? "var(--color-primary)" : "transparent",
                  color: active ? "#fff" : "var(--color-neutral-600)",
                  boxShadow: active ? "0 2px 10px rgba(219,14,15,0.22)" : "none",
                }}
              >
                <input
                  type="radio"
                  name="home-menu-branch"
                  value={branch.slug}
                  checked={active}
                  onChange={() => setActiveBranch(branch.slug)}
                  className="sr-only"
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border flex items-center justify-center"
                  style={{ borderColor: active ? "#fff" : "var(--color-neutral-300)" }}
                  aria-hidden="true"
                >
                  {active ? <span className="w-1.5 h-1.5 rounded-full bg-white" /> : null}
                </span>
                {branch.name.replace("Acala ", "")}
              </label>
            );
          })}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.12} className="mb-8">
        <div
          role="tablist"
          aria-label="Choose menu category"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {groupedMenu.map((group) => {
            const active = activeCategory === group.id;
            const Icon = iconMap[group.icon] ?? UtensilsCrossed;

            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(group.id)}
                className="h-12 rounded-full px-4 text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2"
                style={{
                  background: active ? "var(--color-primary)" : "var(--color-surface)",
                  color: active ? "#fff" : "var(--color-neutral-700)",
                  border: active ? "1px solid var(--color-primary)" : "1px solid var(--color-neutral-200)",
                  boxShadow: active ? "0 6px 20px rgba(219,14,15,0.18)" : "var(--shadow-sm)",
                }}
              >
                <Icon className="w-4 h-4" />
                {group.name}
              </button>
            );
          })}
        </div>
      </AnimatedSection>

      <AnimatedSection key={`${selectedBranch.slug}-${selectedGroup.id}`} delay={0.08}>
        <article
          className="bg-surface overflow-hidden"
          style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[280px] lg:min-h-[420px] overflow-hidden">
              <Image
                src={selectedGroup.image}
                alt={`${selectedBranch.name} ${selectedGroup.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 62%)" }} />
              <div className="absolute left-5 right-5 bottom-5">
                <p className="text-white/78 text-xs font-semibold uppercase tracking-wider mb-1">
                  {selectedBranch.name.replace("Acala ", "")}
                </p>
                <h3 className="font-heading font-bold text-3xl text-white leading-tight">
                  {selectedGroup.name}
                </h3>
              </div>
            </div>
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                style={{ background: "var(--color-primary-alpha)", color: "var(--color-primary)" }}
              >
                <SelectedIcon className="w-6 h-6" />
              </div>
              <p className="apple-label mb-3">Selected Category</p>
              <h3 className="font-heading font-bold text-3xl mb-4" style={{ color: "var(--color-neutral-900)" }}>
                {selectedGroup.name}
              </h3>
              <p className="apple-body">
                {selectedGroup.copy}
              </p>
            </div>
          </div>
        </article>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="mt-10 flex justify-center">
        <a
          href={bookingActions.contactUs.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <MessageCircle className="w-4 h-4" />
          {bookingActions.contactUs.label}
        </a>
      </AnimatedSection>
    </div>
  );
}
