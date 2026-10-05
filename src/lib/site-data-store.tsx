import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { branches as fallbackBranches, getBranchBySlug as getFallbackBranchBySlug } from "@/lib/branches";
import type { Branch } from "@/lib/branches";
import {
  bookingActionCards as fallbackBookingActionCards,
  bookingActions as fallbackBookingActions,
  branchBookingUrls as fallbackBranchBookingUrls,
  contactLinks as fallbackContactLinks,
} from "@/lib/booking-data";
import {
  blogHighlights as fallbackBlogHighlights,
  branchMoments as fallbackBranchMoments,
  galleryBranches as fallbackGalleryBranches,
  heroCollageImages as fallbackHeroCollageImages,
} from "@/lib/site-data";
import { menuCategories as fallbackMenuCategories, menuItems as fallbackMenuItems } from "@/lib/menu";
import { reviews as fallbackReviews } from "@/lib/reviews";
import {
  branchOptions as fallbackBranchOptions,
  branchUsps as fallbackBranchUsps,
  homeMenuGroups as fallbackHomeMenuGroups,
} from "@/lib/ui-data";
import type { BranchKey } from "@/lib/ui-data";

type DatasetMap = Record<string, unknown>;

type BookingAction = (typeof fallbackBookingActionCards)[number];

type SiteDataState = {
  branches: Branch[];
  branchBookingUrls: typeof fallbackBranchBookingUrls;
  contactLinks: typeof fallbackContactLinks;
  bookingActions: typeof fallbackBookingActions;
  bookingActionCards: readonly BookingAction[];
  blogHighlights: typeof fallbackBlogHighlights;
  heroCollageImages: typeof fallbackHeroCollageImages;
  branchMoments: typeof fallbackBranchMoments;
  galleryBranches: typeof fallbackGalleryBranches;
  reviews: typeof fallbackReviews;
  menuCategories: typeof fallbackMenuCategories;
  menuItems: typeof fallbackMenuItems;
  branchOptions: typeof fallbackBranchOptions;
  branchUsps: typeof fallbackBranchUsps;
  homeMenuGroups: typeof fallbackHomeMenuGroups;
  isLoading: boolean;
  error: string | null;
  getBranchBySlug: (slug: string) => Branch | undefined;
};

const fallbackSiteData = {
  branches: fallbackBranches,
  branchBookingUrls: fallbackBranchBookingUrls,
  contactLinks: fallbackContactLinks,
  bookingActions: fallbackBookingActions,
  bookingActionCards: fallbackBookingActionCards,
  blogHighlights: fallbackBlogHighlights,
  heroCollageImages: fallbackHeroCollageImages,
  branchMoments: fallbackBranchMoments,
  galleryBranches: fallbackGalleryBranches,
  reviews: fallbackReviews,
  menuCategories: fallbackMenuCategories,
  menuItems: fallbackMenuItems,
  branchOptions: fallbackBranchOptions,
  branchUsps: fallbackBranchUsps,
  homeMenuGroups: fallbackHomeMenuGroups,
};

const SiteDataContext = createContext<SiteDataState | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [datasets, setDatasets] = useState<DatasetMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Increment to trigger a re-fetch when the tab becomes visible
  const [fetchKey, setFetchKey] = useState(0);

  // When the user switches back to the frontend tab after editing in CMS,
  // automatically re-fetch all datasets so changes appear immediately.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setFetchKey((k) => k + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    let active = true;

    fetch("/api/cms/public-datasets", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Dataset request failed with status ${response.status}.`);
        }

        return (await response.json()) as { data: DatasetMap };
      })
      .then((payload) => {
        if (active) {
          setDatasets(payload.data ?? {});
        }
      })
      .catch((datasetError: unknown) => {
        if (active) {
          setError(datasetError instanceof Error ? datasetError.message : "Failed to load site datasets.");
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  // fetchKey re-triggers this effect when tab becomes visible
  }, [fetchKey]);

  const value = useMemo<SiteDataState>(() => {
    const branches = readDataset<Branch[]>(datasets, "branches", fallbackSiteData.branches);

    return {
      branches,
      branchBookingUrls: readDataset(datasets, "branch_booking_urls", fallbackSiteData.branchBookingUrls),
      contactLinks: readDataset(datasets, "contact_links", fallbackSiteData.contactLinks),
      bookingActions: readDataset(datasets, "booking_actions", fallbackSiteData.bookingActions),
      bookingActionCards: readDataset(datasets, "booking_action_cards", fallbackSiteData.bookingActionCards),
      blogHighlights: readDataset(datasets, "blog_highlights", fallbackSiteData.blogHighlights),
      heroCollageImages: readDataset(datasets, "hero_collage_images", fallbackSiteData.heroCollageImages),
      branchMoments: readDataset(datasets, "branch_moments", fallbackSiteData.branchMoments),
      galleryBranches: readDataset(datasets, "gallery_branches", fallbackSiteData.galleryBranches),
      reviews: readDataset(datasets, "reviews", fallbackSiteData.reviews),
      menuCategories: readDataset(datasets, "menu_categories", fallbackSiteData.menuCategories),
      menuItems: readDataset(datasets, "menu_items", fallbackSiteData.menuItems),
      branchOptions: readDataset(datasets, "branch_options", fallbackSiteData.branchOptions),
      branchUsps: readDataset(datasets, "branch_usps", fallbackSiteData.branchUsps),
      homeMenuGroups: readDataset(datasets, "home_menu_groups", fallbackSiteData.homeMenuGroups),
      isLoading,
      error,
      getBranchBySlug: (slug: string) => branches.find((branch) => branch.slug === slug) ?? getFallbackBranchBySlug(slug),
    };
  }, [datasets, error, isLoading]);

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteDataState {
  const value = useContext(SiteDataContext);

  if (!value) {
    throw new Error("useSiteData must be used inside SiteDataProvider.");
  }

  return value;
}

export function isBranchKey(value: string): value is BranchKey {
  return value === "nusa-lembongan" || value === "nusa-dua";
}

function readDataset<T>(datasets: DatasetMap, key: string, fallback: T): T {
  const value = datasets[key];

  return value === undefined || value === null ? fallback : (value as T);
}
