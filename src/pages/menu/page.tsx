import { useState } from "react";
import Image from "next/image";
import { Utensils } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import BranchMenuSection from "@/components/BranchMenuSection";
import { cmsText, usePublishedCmsPage } from "@/lib/cms";
import { useSiteData } from "@/lib/site-data-store";

export default function MenuPage() {
  const { branches } = useSiteData();
  const [activeBranch, setActiveBranch] = useState(branches[0].slug);
  const { blocks } = usePublishedCmsPage("menu");
  const heroBlock = blocks.hero;
  const branchTabsBlock = blocks.branch_tabs;
  const menuSectionBlock = blocks.menu_section;
  const noticeBlock = blocks.notice;

  const selectedBranch = branches.find((b) => b.slug === activeBranch);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[46vh] overflow-hidden pt-28 pb-16 flex items-center bg-black">
        <Image
          src={cmsText(heroBlock, "image", "/Menu/home-menu.jpg")}
          alt="Acala Bar & Bistro menu dishes"
          fill
          preload
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.54)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="badge mb-4 inline-flex" style={{ background: "rgba(219,14,15,0.18)", color: "#fff" }}>
              <Utensils className="w-3 h-3 mr-1" />
              {cmsText(heroBlock, "eyebrow", "Branch Menus")}
            </span>
            <h1
              className="text-5xl lg:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {cmsText(heroBlock, "title", "Our Menu")}
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              {cmsText(heroBlock, "body", "Choose a branch and browse Appetizer, Main Course, Dessert, and Drink categories.")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Branch Tabs */}
      <section className="sticky top-[60px] z-30 py-4" style={{ background: "var(--color-surface)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(cmsText(branchTabsBlock, "title", "") || cmsText(branchTabsBlock, "body", "")) ? (
            <div className="mb-4 text-center">
              {cmsText(branchTabsBlock, "title", "") ? (
                <p className="text-sm font-bold" style={{ color: "var(--color-neutral-800)" }}>
                  {cmsText(branchTabsBlock, "title", "")}
                </p>
              ) : null}
              {cmsText(branchTabsBlock, "body", "") ? (
                <p className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
                  {cmsText(branchTabsBlock, "body", "")}
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="flex justify-center">
          <div className="flex gap-2 p-1 rounded-full bg-gray-100">
            {branches.map((branch) => (
              <button
                key={branch.slug}
                onClick={() => setActiveBranch(branch.slug)}
                className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0"
                style={{
                  background: activeBranch === branch.slug ? "var(--color-primary)" : "transparent",
                  color: activeBranch === branch.slug ? "#fff" : "var(--color-neutral-600)",
                  boxShadow: activeBranch === branch.slug ? "0 2px 10px rgba(219,14,15,0.22)" : "none"
                }}
              >
                {branch.name}
              </button>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <div className="pt-8 pb-20">
        {selectedBranch && (
          <BranchMenuSection
            eyebrow={cmsText(menuSectionBlock, "eyebrow", "Our Menu")}
            fullMenu={selectedBranch.fullMenu}
            intro={cmsText(menuSectionBlock, "body", "Appetizer, main course, dessert, and drink selections are grouped for easier browsing.")}
            title={cmsText(menuSectionBlock, "title", "Menu by Category")}
          />
        )}
      </div>

      {/* Notice */}
      <section className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm" style={{ color: "var(--color-neutral-400)" }}>
            {cmsText(
              noticeBlock,
              "body",
              "All prices are in thousands of Rupiah (k) and are subject to 10% service charge and applicable government tax. Please inform our staff of any allergies or dietary requirements.",
            )}
          </p>
        </div>
      </section>
    </>
  );
}
