import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import CmsLoginPage from "@/pages/cms/login/page";
import CmsLayout, { CmsSection } from "@/components/cms/CmsLayout";
import CmsOverview from "@/components/cms/CmsOverview";
import CmsPageEditor, { WebsitePage } from "@/components/cms/CmsPageEditor";
import CmsDatasetsPanel from "@/components/cms/CmsDatasetsPanel";
import CmsBlogPanel from "@/components/cms/CmsBlogPanel";
import CmsScriptsPanel from "@/components/cms/CmsScriptsPanel";
import {
  CmsContent,
  CmsDataset,
  CmsUser,
  fetchCmsContents,
  fetchCmsDatasets,
  fetchCmsMe,
  logoutCms,
} from "@/lib/cms";
import { branchOptions as defaultBranchOptions, branchUsps as defaultBranchUsps } from "@/lib/ui-data";
import { branches as defaultBranches } from "@/lib/branches";

// ─── Page Definitions ────────────────────────────────────────────────────────


const websitePages: WebsitePage[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    sections: [
      { id: "hero", label: "Hero", description: "Headline, intro, background, dan CTA utama.", fields: ["eyebrow", "title", "body", "cta", "branch_links", "images"], sortOrder: 10, defaults: { eyebrow: "Two Bali Branches, Two Distinct Moods", title: "Acala Bar & Bistro", body: "Acala has two Bali branches with their own character: Nusa Lembongan is the relaxed island restaurant for brunch, breakfast, coffee, pizza, lunch, drinks, and bar moments, while Nusa Dua is a tropical restaurant in Bali Collection for Indonesian cuisine, seafood, Western favorites, and dinner.", cta_label: "Book a Table", metadata: { branch_links: [{ title: "Nusa Lembongan", href: "/branches/nusa-lembongan", copy: "Brunch, coffee, pizza, lunch, drinks, and bar energy" }, { title: "Nusa Dua", href: "/branches/nusa-dua", copy: "Indonesian cuisine, seafood, Western dishes, and dinner" }] } } },
      { id: "why_acala", label: "Why Choose Acala", description: "Judul dan intro section USP branch.", fields: ["title", "body", "usp_cards"], sortOrder: 20, defaults: { title: "Why Choose Acala ?", metadata: { branchOptions: defaultBranchOptions, branchUsps: defaultBranchUsps } } },
      { id: "locations", label: "Our Locations", description: "Copy pembuka kartu lokasi Nusa Dua dan Lembongan.", fields: ["eyebrow", "title", "body", "branch_cards"], sortOrder: 30, defaults: { eyebrow: "Our Locations", title: "Find Your Acala", metadata: { branchCards: defaultBranches } } },
      { id: "story", label: "Our Story", description: "Narasi singkat brand di homepage.", fields: ["eyebrow", "title", "body"], sortOrder: 40 },
      { id: "staff", label: "Our Staff", description: "Intro section team dan hospitality.", fields: ["eyebrow", "title", "body"], sortOrder: 50 },
      { id: "staff_lembongan", label: "Staff: Lembongan", description: "Foto dan teks tim Nusa Lembongan.", fields: ["title", "body", "image"], sortOrder: 51, defaults: { title: "Nusa Lembongan", body: "Warm service, easy smiles, and the casual rhythm of island hospitality.", image: "/About/staff nusa lembongan.jpg" } },
      { id: "staff_nusa_dua", label: "Staff: Nusa Dua", description: "Foto dan teks tim Nusa Dua.", fields: ["title", "body", "image"], sortOrder: 52, defaults: { title: "Nusa Dua", body: "A dedicated kitchen and service team behind every family lunch and dinner reservation.", image: "/Branch/Acala nusa dua/Copy of DSC03521.jpg" } },
      { id: "menu_categories", label: "Menu Categories", description: "Intro selector kategori menu di home.", fields: ["eyebrow", "title", "body"], sortOrder: 60 },
      { id: "branch_gallery", label: "Branch Gallery", description: "Intro gallery dua cabang.", fields: ["eyebrow", "title", "body"], sortOrder: 65, defaults: { eyebrow: "Branch Gallery", title: "Two Locations, Two Moods" } },
      { id: "blog_highlight", label: "Blog Highlight", description: "Intro kartu artikel/highlight.", fields: ["eyebrow", "title", "body"], sortOrder: 70 },
      { id: "cta", label: "Booking CTA", description: "Section penutup untuk booking dan kontak.", fields: ["eyebrow", "title", "body", "image"], sortOrder: 80, defaults: { image: "/Branch/Acala nusa dua/DSC00742-HDR.jpg" } },
    ],
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    sections: [
      { id: "hero", label: "Hero", description: "Banner pembuka About.", fields: ["eyebrow", "title", "image"], sortOrder: 10, defaults: { image: "/About/staff nusa lembongan.jpg" } },
      { id: "story", label: "Story", description: "Paragraf utama tentang perjalanan Acala.", fields: ["eyebrow", "title", "body"], sortOrder: 20 },
      { id: "nusa_dua_team", label: "Nusa Dua Team", description: "Copy section tim Nusa Dua.", fields: ["eyebrow", "title", "body", "image", "cta"], sortOrder: 30, defaults: { eyebrow: "Our Staff", title: "Nusa Dua Team", image: "/Branch/Acala nusa dua/Copy of DSC03521.jpg" } },
      { id: "nusa_lembongan_team", label: "Nusa Lembongan Team", description: "Copy section tim Nusa Lembongan.", fields: ["eyebrow", "title", "body", "image", "cta"], sortOrder: 40, defaults: { eyebrow: "Our Staff", title: "Nusa Lembongan Team", image: "/About/staff nusa lembongan.jpg" } },
      { id: "blog_highlight", label: "Blog Highlight", description: "Intro highlight di halaman About.", fields: ["eyebrow", "title", "body"], sortOrder: 50 },
      { id: "visit_cta", label: "Visit CTA", description: "Ajakan mengunjungi cabang.", fields: ["title", "body", "cta"], sortOrder: 60 },
    ],
  },
  {
    id: "branches",
    label: "Location",
    path: "/branches",
    sections: [
      { id: "hero", label: "Hero", description: "Banner dan badge halaman lokasi.", fields: ["eyebrow", "title", "image"], sortOrder: 10, defaults: { eyebrow: "2 Locations Across Bali", title: "Our Locations", image: "/Branch/Acala nusa dua/DSC00742-HDR.jpg" } },
      { id: "locations_intro", label: "Locations Intro", description: "Headline sebelum kartu cabang.", fields: ["eyebrow", "title", "body"], sortOrder: 20 },
      { id: "branch_cards", label: "Branch Cards", description: "Kartu cabang diambil dari dataset Branches.", fields: ["body"], sortOrder: 30 },
      { id: "spirit", label: "Two Locations Spirit", description: "Copy penutup halaman branches.", fields: ["title", "body", "cta"], sortOrder: 40 },
    ],
  },
  {
    id: "menu",
    label: "Menu",
    path: "/menu",
    sections: [
      { id: "hero", label: "Hero", description: "Banner menu dan intro branch selector.", fields: ["eyebrow", "title", "body", "image"], sortOrder: 10, defaults: { image: "/Branch/Acala nusa dua/DSC03517.jpg" } },
      { id: "branch_tabs", label: "Branch Tabs", description: "Selector cabang untuk menu.", fields: ["title", "body"], sortOrder: 20 },
      { id: "menu_section", label: "Menu Section", description: "Isi full menu bersumber dari dataset Branches.", fields: ["title", "body"], sortOrder: 30 },
      { id: "notice", label: "Price Notice", description: "Catatan pajak, service, dan alergi.", fields: ["body"], sortOrder: 40, defaults: { body: "All prices are in thousands of Rupiah (k) and are subject to 10% service charge and applicable government tax." } },
    ],
  },
  {
    id: "gallery",
    label: "Gallery",
    path: "/gallery",
    sections: [
      { id: "hero", label: "Hero", description: "Banner gallery.", fields: ["eyebrow", "title", "body", "image"], sortOrder: 10, defaults: { image: "/About/staff nusa lembongan.jpg" } },
      { id: "branch_gallery", label: "Branch Gallery", description: "Slider gallery per cabang.", fields: ["eyebrow", "title", "body"], sortOrder: 20 },
      { id: "branch_cta", label: "Branch CTA", description: "Ajakan melihat full branch experience.", fields: ["eyebrow", "title", "body", "cta"], sortOrder: 30 },
      { id: "blog_highlight", label: "Blog Highlight", description: "Intro stories behind the gallery.", fields: ["eyebrow", "title", "body"], sortOrder: 40 },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    path: "/blog",
    sections: [
      { id: "hero", label: "Hero", description: "Banner utama halaman blog.", fields: ["eyebrow", "title", "body", "image"], sortOrder: 10, defaults: { eyebrow: "Acala Journal", title: "Stories from Acala", image: "/Branch/Acala nusa dua/Copy of DSC03456.jpg" } },
      { id: "featured_story", label: "Featured Story", description: "Intro artikel unggulan.", fields: ["eyebrow", "title", "body", "cta"], sortOrder: 20, defaults: { eyebrow: "Featured Story", cta_label: "Read Story" } },
      { id: "article_list", label: "Article List", description: "Headline dan intro untuk daftar artikel blog.", fields: ["eyebrow", "title", "body"], sortOrder: 30 },
      { id: "branch_notes", label: "Branch Notes", description: "Section pendek untuk mengarahkan pembaca ke dua cabang.", fields: ["eyebrow", "title", "body"], sortOrder: 40 },
      { id: "closing_cta", label: "Closing CTA", description: "Ajakan booking setelah membaca blog.", fields: ["eyebrow", "title", "body", "image", "cta"], sortOrder: 50, defaults: { eyebrow: "Plan Your Visit", cta_label: "Book a Table", image: "/Branch/Acala lembongan/galery/Copy of DSC08301.jpg" } },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    sections: [
      { id: "hero", label: "Hero", description: "Banner halaman contact.", fields: ["title", "body", "image"], sortOrder: 10, defaults: { image: "/Branch/Acala nusa dua/DSC00742-HDR.jpg" } },
      { id: "fast_actions", label: "Fast Actions", description: "Intro kartu WhatsApp, reserve, dan Chope.", fields: ["eyebrow", "title", "body"], sortOrder: 20 },
      { id: "branch_contacts", label: "Branch Contacts", description: "Kontak cabang dan map dari dataset Branches.", fields: ["eyebrow", "title", "body"], sortOrder: 30 },
      { id: "blog_highlight", label: "Blog Highlight", description: "Intro highlight di halaman contact.", fields: ["eyebrow", "title", "body"], sortOrder: 40 },
    ],
  },
  {
    id: "reservation",
    label: "Reservation",
    path: "/reservation",
    sections: [
      { id: "hero", label: "Hero", description: "Banner halaman reservation.", fields: ["eyebrow", "title", "body", "image"], sortOrder: 10, defaults: { eyebrow: "Online Booking", title: "Reserve a Table", image: "/Branch/Acala nusa dua/DSC00742-HDR.jpg" } },
      { id: "booking_intro", label: "Booking Intro", description: "Copy sebelum kartu cabang booking.", fields: ["eyebrow", "title", "body"], sortOrder: 20 },
      { id: "branch_booking_cards", label: "Branch Booking Cards", description: "Kartu booking per cabang dari dataset Branches.", fields: ["body", "cta"], sortOrder: 30 },
    ],
  },
  {
    id: "branch-nusa-dua",
    label: "Branch: Nusa Dua",
    path: "/branches/nusa-dua",
    sections: [
      { id: "hero", label: "Hero", description: "Banner hero khusus cabang Nusa Dua.", fields: ["title", "subtitle", "image"], sortOrder: 10, defaults: { image: "/Branch/Acala nusa dua/DSC00742-HDR.jpg" } },
      { id: "seo_story", label: "Branch Story", description: "Cerita cabang Nusa Dua (SEO content).", fields: ["eyebrow", "title", "body"], sortOrder: 20 },
      { id: "moments", label: "Moments", description: "Highlight momen cabang Nusa Dua.", fields: ["eyebrow", "title", "body"], sortOrder: 30 },
      { id: "menu", label: "Menu Highlight", description: "Intro menu khusus cabang Nusa Dua.", fields: ["eyebrow", "title", "body"], sortOrder: 40 },
      { id: "gallery", label: "Gallery", description: "Intro galeri cabang Nusa Dua.", fields: ["title", "body"], sortOrder: 50 },
      { id: "map_contact", label: "Map & Contact", description: "Teks section kontak dan map.", fields: ["title", "subtitle"], sortOrder: 60 },
    ],
  },
  {
    id: "branch-nusa-lembongan",
    label: "Branch: Nusa Lembongan",
    path: "/branches/nusa-lembongan",
    sections: [
      { id: "hero", label: "Hero", description: "Banner hero khusus cabang Nusa Lembongan.", fields: ["title", "subtitle", "image"], sortOrder: 10, defaults: { image: "/About/staff nusa lembongan.jpg" } },
      { id: "seo_story", label: "Branch Story", description: "Cerita cabang Nusa Lembongan (SEO content).", fields: ["eyebrow", "title", "body"], sortOrder: 20 },
      { id: "moments", label: "Moments", description: "Highlight momen cabang Nusa Lembongan.", fields: ["eyebrow", "title", "body"], sortOrder: 30 },
      { id: "menu", label: "Menu Highlight", description: "Intro menu khusus cabang Nusa Lembongan.", fields: ["eyebrow", "title", "body"], sortOrder: 40 },
      { id: "gallery", label: "Gallery", description: "Intro galeri cabang Nusa Lembongan.", fields: ["title", "body"], sortOrder: 50 },
      { id: "map_contact", label: "Map & Contact", description: "Teks section kontak dan map.", fields: ["title", "subtitle"], sortOrder: 60 },
    ],
  },
];

// ─── Page to CmsSection map ───────────────────────────────────────────────────

const PAGE_SECTIONS = new Set(websitePages.map((p) => p.id));

function getWebsitePage(id: string): WebsitePage | undefined {
  return websitePages.find((p) => p.id === id);
}

// ─── Main CmsPage ─────────────────────────────────────────────────────────────

type AuthState = "checking" | "unauthenticated" | "authenticated";

export default function CmsPage() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [user, setUser] = useState<CmsUser | null>(null);
  const [activeSection, setActiveSection] = useState<CmsSection>("overview");
  const [contents, setContents] = useState<CmsContent[]>([]);
  const [datasets, setDatasets] = useState<CmsDataset[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Check session on mount
  useEffect(() => {
    fetchCmsMe()
      .then((response) => {
        if (response.authenticated && response.user) {
          setUser(response.user);
          setAuthState("authenticated");
        } else {
          setAuthState("unauthenticated");
        }
      })
      .catch(() => setAuthState("unauthenticated"));
  }, []);

  // Load admin data after auth
  const loadAdminData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [contentData, datasetData] = await Promise.all([
        fetchCmsContents(),
        fetchCmsDatasets(),
      ]);
      setContents(contentData);
      setDatasets(datasetData);
    } catch {
      // silent – panels will show their own errors
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authState === "authenticated") {
      void loadAdminData();
    }
  }, [authState, loadAdminData]);

  const handleLogin = (loggedUser: CmsUser) => {
    setUser(loggedUser);
    setAuthState("authenticated");
  };

  const handleLogout = async () => {
    await logoutCms();
    setUser(null);
    setContents([]);
    setDatasets([]);
    setAuthState("unauthenticated");
  };

  // ── Auth States ──

  if (authState === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <Loader2 size={28} className="animate-spin text-[var(--color-primary)] mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-semibold">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <CmsLoginPage onLogin={handleLogin} />;
  }

  if (!user) return null;

  // ── Authenticated CMS ──

  const renderContent = () => {
    if (activeSection === "overview") {
      return (
        <CmsOverview
          contents={contents}
          datasets={datasets}
          isLoading={isLoadingData}
          onSectionChange={setActiveSection}
          onRefresh={loadAdminData}
        />
      );
    }

    if (activeSection === "datasets") {
      return <div className="p-4"><CmsDatasetsPanel /></div>;
    }


    if (activeSection === "blog") {
      return (
        <div className="p-4">
          <CmsBlogPanel
            initialDatasets={datasets}
            onDatasetsChange={setDatasets}
          />
        </div>
      );
    }

    if (activeSection === "scripts") {
      return (
        <div className="p-4">
          <CmsScriptsPanel
            initialDatasets={datasets}
            onDatasetsChange={setDatasets}
          />
        </div>
      );
    }

    if (PAGE_SECTIONS.has(activeSection)) {
      const page = getWebsitePage(activeSection);
      if (page) {
        return (
          <CmsPageEditor
            page={page}
            allContents={contents}
            onContentsChange={setContents}
          />
        );
      }
    }

    return (
      <div className="flex items-center justify-center py-20 text-white/20 text-sm">
        Section tidak ditemukan.
      </div>
    );
  };

  return (
    <CmsLayout
      user={user}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onLogout={() => void handleLogout()}
    >
      {renderContent()}
    </CmsLayout>
  );
}
