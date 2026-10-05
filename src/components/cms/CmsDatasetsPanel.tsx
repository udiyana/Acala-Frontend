import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarCheck,
  Camera,
  ChevronDown,
  Database,
  Download,
  Eye,
  EyeOff,
  FileText,
  Globe2,
  ImageIcon,
  Loader2,
  MapPin,
  MessageCircle,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Utensils,
  Users,
  X,
  Upload,
} from "lucide-react";
import {
  CmsDataset,
  CmsDatasetPayload,
  createCmsDataset,
  deleteCmsDataset,
  fetchCmsDatasets,
  updateCmsDataset,
  uploadCmsMedia,
} from "@/lib/cms";
import type { BlogPost } from "@/lib/blog";
import { blogPostUrl, slugify } from "@/lib/blog";
import CmsBranchMenuEditor from "./CmsBranchMenuEditor";

type IconComponent = typeof Database;

type DatasetMeta = {
  category: string;
  description: string;
  icon: IconComponent;
  key: string;
  title: string;
  usedOn: string;
};

type ParsedData = {
  data: unknown;
  isValid: boolean;
  message?: string;
};

type BlogArticleDraft = Required<Pick<BlogPost, "title">> &
  Pick<BlogPost, "author" | "body" | "category" | "cta" | "date" | "excerpt" | "href" | "image" | "readTime" | "slug">;

const datasetCatalog: DatasetMeta[] = [
  {
    key: "branches",
    title: "Branch Profiles",
    category: "Cabang & Lokasi",
    description: "Profil cabang, kontak, jam buka, galeri, SEO, dan menu lengkap.",
    icon: MapPin,
    usedOn: "Branches, Contact, Menu, Reservation",
  },
  {
    key: "branch_booking_urls",
    title: "Branch Booking Links",
    category: "Booking",
    description: "Link reservasi Chope untuk masing-masing cabang.",
    icon: CalendarCheck,
    usedOn: "Reservation, Branch Detail",
  },
  {
    key: "contact_links",
    title: "Contact Channels",
    category: "Kontak",
    description: "WhatsApp, email reservasi, dan link booking global.",
    icon: MessageCircle,
    usedOn: "Navbar, Contact, Footer",
  },
  {
    key: "booking_actions",
    title: "Booking Buttons",
    category: "Booking",
    description: "Tombol utama untuk WhatsApp, email, dan booking table.",
    icon: CalendarCheck,
    usedOn: "Home, Reservation, Branch Detail",
  },
  {
    key: "booking_action_cards",
    title: "Contact Action Cards",
    category: "Kontak",
    description: "Kartu aksi cepat di halaman Contact.",
    icon: MessageCircle,
    usedOn: "Contact",
  },
  {
    key: "blog_highlights",
    title: "Blog Articles",
    category: "Blog",
    description: "Daftar artikel dan story cards untuk halaman Blog serta highlight di halaman lain.",
    icon: BookOpen,
    usedOn: "Blog, Home, About, Gallery",
  },
  {
    key: "hero_collage_images",
    title: "Hero Visuals",
    category: "Visual",
    description: "Koleksi gambar untuk area visual dan hero.",
    icon: ImageIcon,
    usedOn: "Home",
  },
  {
    key: "branch_moments",
    title: "Branch Moments",
    category: "Cabang & Lokasi",
    description: "Kartu momen makan untuk detail cabang.",
    icon: Camera,
    usedOn: "Branch Detail",
  },
  {
    key: "gallery_branches",
    title: "Gallery by Branch",
    category: "Visual",
    description: "Kelompok galeri, kategori foto, dan gambar per cabang.",
    icon: Camera,
    usedOn: "Home, Gallery, Branch Detail",
  },
  {
    key: "reviews",
    title: "Guest Reviews",
    category: "Editorial",
    description: "Review tamu untuk social proof dan highlight.",
    icon: Users,
    usedOn: "Home, Footer",
  },
  {
    key: "menu_categories",
    title: "Menu Categories",
    category: "Menu",
    description: "Nama kategori menu yang dipakai untuk pengelompokan.",
    icon: Utensils,
    usedOn: "Menu",
  },
  {
    key: "menu_items",
    title: "Shared Menu Items",
    category: "Menu",
    description: "Item menu legacy yang masih dipakai helper lama.",
    icon: Utensils,
    usedOn: "Menu",
  },
  {
    key: "branch_options",
    title: "Branch Selector",
    category: "Cabang & Lokasi",
    description: "Label selector cabang pada section USP.",
    icon: Globe2,
    usedOn: "Home",
  },
  {
    key: "branch_usps",
    title: "Branch USP Cards",
    category: "Cabang & Lokasi",
    description: "Kartu alasan memilih masing-masing cabang.",
    icon: Sparkles,
    usedOn: "Home",
  },
  {
    key: "home_menu_groups",
    title: "Home Menu Groups",
    category: "Menu",
    description: "Grouping menu di homepage: appetizer, main course, dessert, drink.",
    icon: Utensils,
    usedOn: "Home",
  },
];

const emptyDataset = (sortOrder = 10): CmsDatasetPayload => ({
  key: "",
  label: "",
  description: "",
  data: {},
  sort_order: sortOrder,
  is_published: true,
});

export default function CmsDatasetsPanel() {
  const [datasets, setDatasets] = useState<CmsDataset[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<CmsDatasetPayload>(() => emptyDataset());
  const [dataText, setDataText] = useState("{}");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortMode, setSortMode] = useState<"order" | "updated" | "name">("order");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDatasets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCmsDatasets();
      setDatasets(data);
      setMessage("Data frontend tersinkron dari database.");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data frontend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDatasets();
  }, []);

  const parsedData = useMemo(() => parseDataText(dataText), [dataText]);
  const previewData = parsedData.isValid ? parsedData.data : form.data;
  const isBlogArticlesDataset = datasetKey(form.key) === "blog_highlights";
  const blogArticles = useMemo(
    () => (isBlogArticlesDataset && parsedData.isValid ? readBlogArticles(parsedData.data) : []),
    [isBlogArticlesDataset, parsedData],
  );
  const updateBlogArticles = useCallback((articles: BlogArticleDraft[]) => {
    setDataText(JSON.stringify(articles.map(normalizeBlogArticle), null, 2));
  }, []);

  const isBranchesDataset = datasetKey(form.key) === "branches";
  const branchProfiles = useMemo(
    () => (isBranchesDataset && parsedData.isValid ? parsedData.data as any[] : []),
    [isBranchesDataset, parsedData],
  );
  const updateBranchProfiles = useCallback((branches: any[]) => {
    setDataText(JSON.stringify(branches, null, 2));
  }, []);

  const filteredDatasets = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = datasets.filter((dataset) => {
      const meta = getDatasetMeta(dataset);
      const matchesCategory = categoryFilter === "all" || meta.category === categoryFilter;
      const haystack = [
        dataset.key,
        dataset.label,
        dataset.description,
        meta.title,
        meta.category,
        meta.usedOn,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!keyword || haystack.includes(keyword));
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "updated") {
        return dateValue(b.updated_at) - dateValue(a.updated_at);
      }

      if (sortMode === "name") {
        return displayDatasetTitle(a).localeCompare(displayDatasetTitle(b));
      }

      return a.sort_order - b.sort_order || displayDatasetTitle(a).localeCompare(displayDatasetTitle(b));
    });
  }, [categoryFilter, datasets, search, sortMode]);

  const selectedDataset = useMemo(
    () => datasets.find((dataset) => dataset.id === selectedId),
    [datasets, selectedId],
  );

  const categories = useMemo(() => {
    const names = new Set(datasets.map((dataset) => getDatasetMeta(dataset).category));
    return Array.from(names).sort();
  }, [datasets]);

  const publishedCount = datasets.filter((dataset) => dataset.is_published).length;
  const totalRecords = datasets.reduce((total, dataset) => total + countDataItems(dataset.data), 0);
  const activeCategories = new Set(datasets.map((dataset) => getDatasetMeta(dataset).category)).size;

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setSelectedId(null);
    setForm(emptyDataset());
    setDataText("{}");
    setAdvancedOpen(false);
  }, []);

  useEffect(() => {
    if (!editorOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeEditor();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeEditor, editorOpen]);

  const handleNew = () => {
    const nextSort = datasets.reduce((max, dataset) => Math.max(max, dataset.sort_order), 0) + 10;
    const next = emptyDataset(nextSort);
    setSelectedId(null);
    setForm(next);
    setDataText(JSON.stringify(next.data, null, 2));
    setEditorOpen(true);
    setAdvancedOpen(false);
    setMessage(null);
    setError(null);
  };

  const handleEdit = (dataset: CmsDataset) => {
    setSelectedId(dataset.id);
    setForm({
      key: dataset.key,
      label: dataset.label,
      description: dataset.description ?? "",
      data: dataset.data,
      sort_order: dataset.sort_order,
      is_published: dataset.is_published,
    });
    setDataText(JSON.stringify(dataset.data, null, 2));
    setEditorOpen(true);
    setAdvancedOpen(false);
    setMessage(null);
    setError(null);
  };

  const handleNewBlogArticle = () => {
    const blogDataset = datasets.find((dataset) => dataset.key === "blog_highlights");
    const meta = getDatasetMetaByKey("blog_highlights");

    if (blogDataset) {
      const articles = readBlogArticles(blogDataset.data);
      const nextArticles = [...articles, createEmptyBlogArticle(articles.length)];

      setSelectedId(blogDataset.id);
      setForm({
        key: blogDataset.key,
        label: blogDataset.label || meta.title,
        description: blogDataset.description ?? meta.description,
        data: nextArticles,
        sort_order: blogDataset.sort_order,
        is_published: blogDataset.is_published,
      });
      setDataText(JSON.stringify(nextArticles.map(normalizeBlogArticle), null, 2));
    } else {
      const nextSort = datasets.reduce((max, dataset) => Math.max(max, dataset.sort_order), 0) + 10;
      const article = createEmptyBlogArticle(0);
      const nextData = [article];

      setSelectedId(null);
      setForm({
        key: "blog_highlights",
        label: meta.title,
        description: meta.description,
        data: nextData,
        sort_order: nextSort,
        is_published: true,
      });
      setDataText(JSON.stringify(nextData.map(normalizeBlogArticle), null, 2));
    }

    setEditorOpen(true);
    setAdvancedOpen(false);
    setMessage(null);
    setError(null);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = normalizeDataset(form, dataText);
      const saved = selectedId
        ? await updateCmsDataset(selectedId, payload)
        : await createCmsDataset(payload);

      setDatasets((current) => {
        const exists = current.some((dataset) => dataset.id === saved.id);
        const next = exists
          ? current.map((dataset) => (dataset.id === saved.id ? saved : dataset))
          : [...current, saved];

        return [...next].sort(sortDatasets);
      });
      setSelectedId(saved.id);
      setForm({
        key: saved.key,
        label: saved.label,
        description: saved.description ?? "",
        data: saved.data,
        sort_order: saved.sort_order,
        is_published: saved.is_published,
      });
      setDataText(JSON.stringify(saved.data, null, 2));
      setEditorOpen(true);
      setAdvancedOpen(false);
      setMessage("Data frontend tersimpan dan siap dipakai website.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Data frontend gagal disimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || !selectedDataset) {
      return;
    }

    const confirmed = window.confirm(`Hapus "${displayDatasetTitle(selectedDataset)}"?`);

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await deleteCmsDataset(selectedId);
      setDatasets((current) => current.filter((dataset) => dataset.id !== selectedId));
      closeEditor();
      setMessage("Data frontend dihapus.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Data frontend gagal dihapus.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    downloadJson("acala-frontend-data.json", filteredDatasets);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-[#dfe3e8] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#ff7448]">Frontend Data Library</p>
            <h2 className="mt-1 text-2xl font-bold text-[#171717]">Kelola data website tanpa melihat kode</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6f7885]">
              Data cabang, menu, galeri, review, booking, dan CTA disusun sebagai modul bisnis yang langsung dipakai frontend.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolbarButton onClick={() => void loadDatasets()} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </ToolbarButton>
            <ToolbarButton onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </ToolbarButton>
            <ToolbarButton onClick={handleNewBlogArticle}>
              <BookOpen className="h-4 w-4" />
              Add Blog Article
            </ToolbarButton>
            <ToolbarButton dark onClick={handleNew}>
              <Plus className="h-4 w-4" />
              Add Data Module
            </ToolbarButton>
          </div>
        </div>
      </section>

      {(message || error) ? (
        <div
          className={`rounded-md px-3 py-2 text-xs font-semibold ${
            error ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {error ?? message}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Data Modules" value={datasets.length} helper="modul tersedia" trend={`${publishedCount} live`} />
        <MetricCard label="Frontend Records" value={totalRecords} helper="total item konten" trend="+ready" />
        <MetricCard label="Content Groups" value={activeCategories} helper="kategori data" trend="organized" />
        <MetricCard label="Live API" value={`${publishedCount}/${datasets.length || 0}`} helper="dipakai frontend" trend="synced" />
      </div>

      <section className="rounded-lg border border-[#dfe3e8] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#edf0f4] p-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex h-9 min-w-[260px] flex-1 items-center gap-2 rounded-md border border-[#dfe3e8] bg-[#f8f9fb] px-3 xl:flex-none">
              <Search className="h-4 w-4 text-[#9aa2ad]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none"
                placeholder="Cari cabang, menu, booking, gallery..."
              />
            </label>
            <label className="inline-flex h-9 items-center gap-2 rounded-md border border-[#dfe3e8] bg-white px-3 text-xs font-bold text-[#343b45]">
              <FileText className="h-4 w-4" />
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="bg-transparent text-xs font-bold outline-none"
              >
                <option value="all">Semua kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex h-9 items-center gap-2 rounded-md border border-[#dfe3e8] bg-white px-3 text-xs font-bold text-[#343b45]">
              <Settings2 className="h-4 w-4" />
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as "order" | "updated" | "name")}
                className="bg-transparent text-xs font-bold outline-none"
              >
                <option value="order">Urutan CMS</option>
                <option value="name">Nama modul</option>
                <option value="updated">Terbaru</option>
              </select>
            </label>
          </div>

          <p className="text-xs font-semibold text-[#8d96a3]">
            {filteredDatasets.length} dari {datasets.length} modul data
          </p>
        </div>

        <div className="grid gap-3 p-3 md:grid-cols-2 2xl:grid-cols-3">
          {filteredDatasets.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-[#dfe3e8] p-10 text-center">
              <p className="text-sm font-bold text-[#171717]">Data tidak ditemukan</p>
              <p className="mt-1 text-xs text-[#8d96a3]">Coba ganti kata kunci atau kategori.</p>
            </div>
          ) : (
            filteredDatasets.map((dataset) => (
              <DatasetModuleCard
                key={dataset.id}
                dataset={dataset}
                selected={dataset.id === selectedId}
                onClick={() => handleEdit(dataset)}
              />
            ))
          )}
        </div>
      </section>

      {editorOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#111827]/45 px-3 py-4 backdrop-blur-sm sm:px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dataset-editor-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Tutup editor data"
            onClick={closeEditor}
          />
          <section
            id="dataset-editor-form"
            className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-[#dfe3e8] bg-white shadow-[0_24px_80px_rgba(17,24,39,0.28)]"
          >
          <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
            <div className="flex flex-shrink-0 flex-col gap-3 border-b border-[#edf0f4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#a6aeb9]">
                  {selectedId ? "Edit data module" : "New data module"}
                </p>
                <h2 id="dataset-editor-title" className="mt-1 flex items-center gap-2 text-xl font-bold text-[#171717]">
                  <DatasetIcon dataset={selectedDataset} fallbackKey={form.key} />
                  {form.label || getDatasetMetaByKey(form.key).title || "Data Module"}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedId ? (
                  <ToolbarButton onClick={() => void handleDelete()} disabled={isSaving}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </ToolbarButton>
                ) : null}
                <ToolbarButton
                  onClick={closeEditor}
                >
                  <X className="h-4 w-4" />
                  Close
                </ToolbarButton>
                <ToolbarButton dark submit disabled={isSaving || !parsedData.isValid}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Data
                </ToolbarButton>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_420px]">
              <div>
                <FormGroup
                  subtitle="Informasi ini tampil di admin agar modul mudah dikenali oleh tim."
                  title="Informasi Modul"
                >
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="Nama modul">
                      <input
                        value={form.label}
                        onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
                        className="admin-input"
                        placeholder="Branch Profiles"
                        required
                      />
                    </Field>
                    <Field label="Urutan tampil">
                      <input
                        type="number"
                        min={0}
                        value={form.sort_order}
                        onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) }))}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Deskripsi modul" className="lg:col-span-2">
                      <textarea
                        value={form.description ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                        className="admin-input min-h-24 resize-y"
                        placeholder="Jelaskan data ini dipakai untuk bagian website apa."
                      />
                    </Field>
                    <Field label="Status frontend">
                      <label className="inline-flex h-11 items-center gap-3 rounded-md border border-[#dfe3e8] px-3">
                        <input
                          type="checkbox"
                          checked={form.is_published}
                          onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.checked }))}
                          className="h-4 w-4 accent-[#ff7448]"
                        />
                        <span className="text-xs font-bold text-[#343b45]">Aktif di frontend</span>
                        {form.is_published ? (
                          <Eye className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-[#8d96a3]" />
                        )}
                      </label>
                    </Field>
                  </div>
                </FormGroup>

                {isBlogArticlesDataset ? (
                  <FormGroup
                    subtitle="Tambah, urutkan, dan isi artikel blog yang langsung tampil di halaman Blog."
                    title="Blog Articles"
                  >
                    <BlogArticlesEditor
                      articles={blogArticles}
                      invalidMessage={parsedData.isValid ? undefined : parsedData.message}
                      onChange={updateBlogArticles}
                    />
                  </FormGroup>
                ) : null}

                {isBranchesDataset ? (
                  <FormGroup
                    subtitle="Atur kategori dan daftar menu untuk masing-masing cabang."
                    title="Branch Menus"
                  >
                    <CmsBranchMenuEditor
                      branches={branchProfiles}
                      onChange={updateBranchProfiles}
                    />
                  </FormGroup>
                ) : null}

                <FormGroup
                  subtitle="Preview ini membantu mengecek isi data tanpa membaca struktur teknisnya."
                  title={isBlogArticlesDataset ? "Preview Tabel Artikel" : "Preview Isi Data"}
                >
                  <DataPreview data={previewData} invalidMessage={parsedData.isValid ? undefined : parsedData.message} />
                </FormGroup>

                <section className="border-b border-[#edf0f4] p-4 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setAdvancedOpen((current) => !current)}
                    className="flex w-full items-center justify-between gap-3 rounded-md border border-[#dfe3e8] bg-[#fbfcfd] px-4 py-3 text-left transition hover:bg-[#f7f8fa]"
                  >
                    <span>
                      <span className="block text-sm font-bold text-[#171717]">Advanced Data Editor</span>
                      <span className="block text-xs leading-relaxed text-[#8d96a3]">
                        Buka hanya saat perlu mengubah isi data mentah seperti daftar menu, link, atau gambar.
                      </span>
                    </span>
                    <ChevronDown className={`h-4 w-4 text-[#8d96a3] transition ${advancedOpen ? "rotate-180" : ""}`} />
                  </button>

                  {advancedOpen ? (
                    <div className="mt-4 space-y-4">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <Field label="Kode data">
                          <input
                            value={form.key}
                            onChange={(event) => setForm((current) => ({ ...current, key: datasetKey(event.target.value) }))}
                            className="admin-input"
                            placeholder="branches"
                            required
                          />
                        </Field>
                        <Field label="Format data">
                          <div className="flex h-11 items-center rounded-md border border-[#dfe3e8] bg-[#f8f9fb] px-3 text-xs font-bold text-[#6f7885]">
                            {describeDataType(previewData)}
                          </div>
                        </Field>
                      </div>
                      <Field label="Isi data mentah">
                        <textarea
                          value={dataText}
                          onChange={(event) => setDataText(event.target.value)}
                          className="admin-input min-h-[26rem] resize-y font-mono text-xs"
                          spellCheck={false}
                          required
                        />
                      </Field>
                      {!parsedData.isValid ? (
                        <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                          {parsedData.message}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </section>
              </div>

              <DatasetSummary
                data={previewData}
                form={form}
                selectedDataset={selectedDataset}
              />
            </div>
            </div>
          </form>
        </section>
        </div>
      ) : null}
    </div>
  );
}

function DatasetModuleCard({
  dataset,
  onClick,
  selected,
}: {
  dataset: CmsDataset;
  onClick: () => void;
  selected: boolean;
}) {
  const meta = getDatasetMeta(dataset);
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[190px] rounded-lg border p-4 text-left transition hover:border-[#ffb49c] hover:bg-[#fff8f5] ${
        selected ? "border-[#ff7448] bg-[#fff3ef] shadow-[inset_3px_0_0_#ff7448]" : "border-[#edf0f4] bg-white"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f3f5f8] text-[#4f5865]">
          <Icon className="h-5 w-5" />
        </span>
        <StatusBadge published={dataset.is_published} />
      </div>
      <p className="text-sm font-bold text-[#171717]">{displayDatasetTitle(dataset)}</p>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#6f7885]">
        {dataset.description || meta.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded bg-[#f3f5f8] px-2 py-1 text-[10px] font-bold text-[#6f7885]">{meta.category}</span>
        <span className="rounded bg-[#f3f5f8] px-2 py-1 text-[10px] font-bold text-[#6f7885]">{countDataItems(dataset.data)} items</span>
      </div>
      <p className="mt-4 text-[11px] font-semibold text-[#a6aeb9]">Dipakai di: {meta.usedOn}</p>
    </button>
  );
}

function DatasetSummary({
  data,
  form,
  selectedDataset,
}: {
  data: unknown;
  form: CmsDatasetPayload;
  selectedDataset: CmsDataset | undefined;
}) {
  const meta = selectedDataset ? getDatasetMeta(selectedDataset) : getDatasetMetaByKey(form.key);
  const Icon = meta.icon;

  return (
    <aside className="border-t border-[#edf0f4] bg-[#fbfcfd] p-4 xl:border-l xl:border-t-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#a6aeb9]">Module Summary</p>
          <h3 className="mt-1 text-sm font-bold text-[#171717]">
            {selectedDataset ? "Data tersimpan" : "Draft baru"}
          </h3>
        </div>
        <StatusBadge published={form.is_published} />
      </div>

      <div className="rounded-lg border border-[#dfe3e8] bg-white p-4">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-[#fff3ef] text-[#ff7448]">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#ff7448]">{meta.category}</p>
        <h4 className="mt-2 text-xl font-bold leading-tight text-[#171717]">
          {form.label || meta.title || "Data Module"}
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-[#6f7885]">
          {form.description || meta.description}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <PreviewStat label="Records" value={countDataItems(data)} />
        <PreviewStat label="Used On" value={meta.usedOn} />
        <PreviewStat label="Format" value={describeDataType(data)} />
        <PreviewStat label="Updated" value={formatDate(selectedDataset?.updated_at)} />
      </dl>
    </aside>
  );
}

function DataPreview({
  data,
  invalidMessage,
}: {
  data: unknown;
  invalidMessage?: string;
}) {
  if (invalidMessage) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4">
        <p className="text-sm font-bold text-red-700">Data belum bisa dipreview</p>
        <p className="mt-1 text-xs leading-relaxed text-red-600">{invalidMessage}</p>
      </div>
    );
  }

  const rows = getPreviewRows(data);
  const columns = getPreviewColumns(rows);

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#dfe3e8] p-8 text-center">
        <p className="text-sm font-bold text-[#171717]">Belum ada isi data</p>
        <p className="mt-1 text-xs text-[#8d96a3]">Tambahkan isi lewat Advanced Data Editor bila diperlukan.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#dfe3e8]">
      <div className="grid border-b border-[#edf0f4] bg-[#fbfcfd]" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
        {columns.map((column) => (
          <div key={column} className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#8d96a3]">
            {humanizeKey(column)}
          </div>
        ))}
      </div>
      <div className="divide-y divide-[#edf0f4]">
        {rows.slice(0, 6).map((row, index) => (
          <div
            key={`${index}-${columns.join("-")}`}
            className="grid bg-white"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            {columns.map((column) => (
              <div key={column} className="min-h-11 px-3 py-2 text-xs font-medium leading-relaxed text-[#4f5865]">
                {formatPreviewCell(row[column])}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogArticlesEditor({
  articles,
  invalidMessage,
  onChange,
}: {
  articles: BlogArticleDraft[];
  invalidMessage?: string;
  onChange: (articles: BlogArticleDraft[]) => void;
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateArticle = (index: number, updates: Partial<BlogArticleDraft>) => {
    onChange(articles.map((article, currentIndex) => (currentIndex === index ? { ...article, ...updates } : article)));
  };

  const updateTitle = (index: number, title: string) => {
    const article = articles[index];
    const previousGeneratedSlug = slugify(article.title);
    const shouldSyncSlug = !article.slug || article.slug === previousGeneratedSlug;

    updateArticle(index, {
      title,
      slug: shouldSyncSlug ? slugify(title) : article.slug,
    });
  };

  const addArticle = () => {
    onChange([...articles, createEmptyBlogArticle(articles.length)]);
  };

  const removeArticle = (index: number) => {
    onChange(articles.filter((_, currentIndex) => currentIndex !== index));
  };

  if (invalidMessage) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4">
        <p className="text-sm font-bold text-red-700">Editor artikel belum bisa dibuka</p>
        <p className="mt-1 text-xs leading-relaxed text-red-600">{invalidMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-[#dfe3e8] bg-[#fbfcfd] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#171717]">{articles.length} artikel blog</p>
          <p className="text-xs leading-relaxed text-[#8d96a3]">Artikel tersimpan otomatis sebagai URL dinamis di halaman Blog.</p>
        </div>
        <ToolbarButton onClick={addArticle}>
          <Plus className="h-4 w-4" />
          Add Article
        </ToolbarButton>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#dfe3e8] p-8 text-center">
          <p className="text-sm font-bold text-[#171717]">Belum ada artikel</p>
          <p className="mt-1 text-xs text-[#8d96a3]">Klik Add Article untuk membuat artikel blog pertama.</p>
        </div>
      ) : null}

      <div className="space-y-4">
        {articles.map((article, index) => (
          <article key={`${article.slug || article.title}-${index}`} className="rounded-lg border border-[#dfe3e8] bg-white p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#a6aeb9]">Article {index + 1}</p>
                <h4 className="mt-1 text-base font-bold text-[#171717]">{article.title || "Untitled Blog Article"}</h4>
                <p className="mt-1 text-xs font-semibold text-[#8d96a3]">{blogPostUrl(article)}</p>
              </div>
              <ToolbarButton onClick={() => removeArticle(index)}>
                <Trash2 className="h-4 w-4" />
                Remove
              </ToolbarButton>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Judul artikel">
                <input
                  value={article.title}
                  onChange={(event) => updateTitle(index, event.target.value)}
                  className="admin-input"
                  placeholder="A Tale of Two Acala Branches"
                  required
                />
              </Field>
              <Field label="Slug URL">
                <input
                  value={article.slug ?? ""}
                  onChange={(event) => updateArticle(index, { slug: slugify(event.target.value) })}
                  className="admin-input"
                  placeholder="a-tale-of-two-acala-branches"
                />
              </Field>
              <Field label="Kategori">
                <input
                  value={article.category ?? ""}
                  onChange={(event) => updateArticle(index, { category: event.target.value })}
                  className="admin-input"
                  placeholder="Branches"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tanggal">
                  <input
                    value={article.date ?? ""}
                    onChange={(event) => updateArticle(index, { date: event.target.value })}
                    className="admin-input"
                    placeholder="July 2026"
                  />
                </Field>
                <Field label="Durasi baca">
                  <input
                    value={article.readTime ?? ""}
                    onChange={(event) => updateArticle(index, { readTime: event.target.value })}
                    className="admin-input"
                    placeholder="4 min read"
                  />
                </Field>
              </div>
              <Field label="Cover image" className="lg:col-span-2">
                {article.image ? (
                  <div className="group relative h-48 w-full sm:w-80 rounded-md overflow-hidden border border-[#dfe3e8]">
                    <img src={article.image} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className={`flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-xs font-semibold cursor-pointer text-[#171717] hover:bg-[#f7f8fa] ${uploadingIndex === index ? 'opacity-50 cursor-wait' : ''}`}>
                        {uploadingIndex === index ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploadingIndex === index ? "Uploading..." : "Ganti"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingIndex !== null}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingIndex(index);
                            setUploadError(null);
                            try {
                              const url = await uploadCmsMedia(file);
                              updateArticle(index, { image: url });
                            } catch (err) {
                              setUploadError(err instanceof Error ? err.message : "Gagal upload gambar.");
                            } finally {
                              setUploadingIndex(null);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                      <button type="button" onClick={() => updateArticle(index, { image: "" })} className="p-1.5 bg-white text-red-600 rounded-md hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 w-full sm:w-80 border-2 border-dashed border-[#dfe3e8] rounded-md cursor-pointer hover:border-[#a6aeb9] hover:bg-[#fbfcfd] transition-colors">
                    {uploadingIndex === index ? (
                      <>
                        <Loader2 size={20} className="animate-spin text-[#8d96a3] mb-2" />
                        <span className="text-xs text-[#6f7885] font-semibold">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={20} className="text-[#a6aeb9] mb-2" />
                        <span className="text-xs text-[#6f7885] font-semibold">Upload gambar</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingIndex !== null}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingIndex(index);
                        setUploadError(null);
                        try {
                          const url = await uploadCmsMedia(file);
                          updateArticle(index, { image: url });
                        } catch (err) {
                          setUploadError(err instanceof Error ? err.message : "Gagal upload gambar.");
                        } finally {
                          setUploadingIndex(null);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                )}
                {uploadError && uploadingIndex === null && (
                  <p className="mt-2 text-xs text-red-500">{uploadError}</p>
                )}
              </Field>
              <Field label="Ringkasan" className="lg:col-span-2">
                <textarea
                  value={article.excerpt ?? ""}
                  onChange={(event) => updateArticle(index, { excerpt: event.target.value })}
                  className="admin-input min-h-24 resize-y"
                  placeholder="Ringkasan singkat yang tampil di card blog."
                />
              </Field>
              <Field label="Isi artikel" className="lg:col-span-2">
                <textarea
                  value={article.body ?? ""}
                  onChange={(event) => updateArticle(index, { body: event.target.value })}
                  className="admin-input min-h-48 resize-y"
                  placeholder="Pisahkan paragraf dengan satu baris kosong."
                />
              </Field>
              <Field label="CTA label">
                <input
                  value={article.cta ?? ""}
                  onChange={(event) => updateArticle(index, { cta: event.target.value })}
                  className="admin-input"
                  placeholder="Explore Locations"
                />
              </Field>
              <Field label="CTA link terkait">
                <input
                  value={article.href ?? ""}
                  onChange={(event) => updateArticle(index, { href: event.target.value })}
                  className="admin-input"
                  placeholder="/branches/nusa-dua"
                />
              </Field>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FormGroup({
  children,
  subtitle,
  title,
}: {
  children: ReactNode;
  subtitle?: string;
  title: string;
}) {
  return (
    <section className="border-b border-[#edf0f4] p-4 last:border-b-0">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#171717]">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs leading-relaxed text-[#8d96a3]">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-bold text-[#4f5865]">{label}</span>
      {children}
    </label>
  );
}

function MetricCard({
  helper,
  label,
  trend,
  value,
}: {
  helper: string;
  label: string;
  trend: string;
  value: number | string;
}) {
  return (
    <article className="min-h-[104px] rounded-lg border border-[#dfe3e8] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-1.5">
        <p className="text-xs font-semibold text-[#6f7885]">{label}</p>
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#d8dde5] text-[9px] font-bold text-[#a6aeb9]">i</span>
      </div>
      <p className="text-[26px] font-bold leading-none text-[#171717]">{value}</p>
      <p className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#8d96a3]">
        {helper}
        <span className="rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-600">{trend}</span>
      </p>
    </article>
  );
}

function PreviewStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-[#edf0f4] bg-white p-3">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a6aeb9]">{label}</dt>
      <dd className="mt-1 line-clamp-2 text-xs font-bold text-[#343b45]">{value}</dd>
    </div>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded px-2 text-[11px] font-bold ${
        published ? "bg-emerald-50 text-emerald-700" : "bg-[#fff3d8] text-[#9a6a05]"
      }`}
    >
      {published ? "Live" : "Draft"}
    </span>
  );
}

function ToolbarButton({
  children,
  dark = false,
  disabled = false,
  onClick,
  submit = false,
}: {
  children: ReactNode;
  dark?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  submit?: boolean;
}) {
  return (
    <button
      type={submit ? "submit" : "button"}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
        dark
          ? "bg-[#161616] text-white hover:bg-[#2c2c2c]"
          : "border border-[#dfe3e8] bg-white text-[#343b45] hover:bg-[#f7f8fa]"
      }`}
    >
      {children}
    </button>
  );
}

function DatasetIcon({
  dataset,
  fallbackKey,
}: {
  dataset: CmsDataset | undefined;
  fallbackKey: string;
}) {
  const meta = dataset ? getDatasetMeta(dataset) : getDatasetMetaByKey(fallbackKey);
  const Icon = meta.icon;

  return <Icon className="h-5 w-5 text-[#ff7448]" />;
}

function createEmptyBlogArticle(index: number): BlogArticleDraft {
  const title = `New Blog Article ${index + 1}`;

  return {
    title,
    slug: slugify(title),
    category: "Acala Story",
    date: "",
    readTime: "3 min read",
    excerpt: "",
    body: "",
    image: "/Branch/Acala nusa dua/DSC00742-HDR.jpg",
    href: "/branches",
    cta: "Explore More",
    author: "Acala Team",
  };
}

function readBlogArticles(data: unknown): BlogArticleDraft[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeBlogArticle);
}

function normalizeBlogArticle(value: unknown, index = 0): BlogArticleDraft {
  const record = toRecord(value);
  const title = stringField(record, "title") || `Blog Article ${index + 1}`;
  const slug = slugify(stringField(record, "slug") || title) || `blog-article-${index + 1}`;
  const excerpt = stringField(record, "excerpt");
  const body = stringField(record, "body") || excerpt;

  return {
    title,
    slug,
    category: stringField(record, "category") || "Acala Story",
    date: stringField(record, "date"),
    readTime: stringField(record, "readTime") || "3 min read",
    excerpt,
    body,
    image: stringField(record, "image") || "/Branch/Acala nusa dua/DSC00742-HDR.jpg",
    href: stringField(record, "href") || "/branches",
    cta: stringField(record, "cta") || "Explore More",
    author: stringField(record, "author") || "Acala Team",
  };
}

function normalizeDataset(form: CmsDatasetPayload, dataText: string): CmsDatasetPayload {
  const key = datasetKey(form.key);
  const parsedData = JSON.parse(dataText) as unknown;

  if (key === "blog_highlights" && !Array.isArray(parsedData)) {
    throw new Error("Blog Articles harus berupa daftar artikel.");
  }

  return {
    key,
    label: form.label.trim(),
    description: nullableString(form.description),
    data: key === "blog_highlights" ? readBlogArticles(parsedData) : parsedData,
    sort_order: Number(form.sort_order) || 0,
    is_published: Boolean(form.is_published),
  };
}

function parseDataText(value: string): ParsedData {
  try {
    return {
      data: JSON.parse(value) as unknown,
      isValid: true,
    };
  } catch (parseError) {
    return {
      data: null,
      isValid: false,
      message: parseError instanceof Error ? parseError.message : "Format data belum valid.",
    };
  }
}

function nullableString(value: string | null): string | null {
  const trimmed = value?.trim() ?? "";

  return trimmed === "" ? null : trimmed;
}

function datasetKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function stringField(record: Record<string, unknown>, key: string): string {
  const value = record[key];

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function sortDatasets(a: CmsDataset, b: CmsDataset): number {
  return a.sort_order - b.sort_order || displayDatasetTitle(a).localeCompare(displayDatasetTitle(b));
}

function getDatasetMeta(dataset: CmsDataset): DatasetMeta {
  return getDatasetMetaByKey(dataset.key);
}

function getDatasetMetaByKey(key: string): DatasetMeta {
  const match = datasetCatalog.find((item) => item.key === key);

  if (match) {
    return match;
  }

  if (key.includes("menu")) {
    return fallbackMeta(key, "Menu", Utensils, "Menu");
  }

  if (key.includes("gallery") || key.includes("image")) {
    return fallbackMeta(key, "Visual", ImageIcon, "Gallery");
  }

  if (key.includes("booking") || key.includes("contact")) {
    return fallbackMeta(key, "Booking & Kontak", CalendarCheck, "Contact, Reservation");
  }

  if (key.includes("branch")) {
    return fallbackMeta(key, "Cabang & Lokasi", MapPin, "Branches");
  }

  return fallbackMeta(key, "Lainnya", Database, "Website");
}

function fallbackMeta(key: string, category: string, icon: IconComponent, usedOn: string): DatasetMeta {
  return {
    key,
    category,
    description: "Modul data frontend yang bisa dipakai website.",
    icon,
    title: humanizeKey(key || "Data Module"),
    usedOn,
  };
}

function displayDatasetTitle(dataset: CmsDataset): string {
  const meta = getDatasetMeta(dataset);
  return dataset.label || meta.title || humanizeKey(dataset.key);
}

function countDataItems(data: unknown): number {
  if (Array.isArray(data)) {
    return data.length;
  }

  if (data && typeof data === "object") {
    return Object.keys(data).length;
  }

  return data ? 1 : 0;
}

function describeDataType(data: unknown): string {
  if (Array.isArray(data)) {
    return "Daftar item";
  }

  if (data && typeof data === "object") {
    return "Kelompok data";
  }

  if (typeof data === "string") {
    return "Teks";
  }

  if (typeof data === "number") {
    return "Angka";
  }

  if (typeof data === "boolean") {
    return "Pilihan aktif/nonaktif";
  }

  return "Kosong";
}

function getPreviewRows(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.slice(0, 6).map((item) => normalizePreviewRow(item));
  }

  if (data && typeof data === "object") {
    return Object.entries(data as Record<string, unknown>)
      .slice(0, 6)
      .map(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          return {
            name: humanizeKey(key),
            ...normalizePreviewRow(value),
          };
        }

        return {
          name: humanizeKey(key),
          value: summarizeValue(value),
          items: countDataItems(value),
        };
      });
  }

  return data ? [{ value: data }] : [];
}

function normalizePreviewRow(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    return {
      ...record,
      items: record.items ? countDataItems(record.items) : record.categories ? countDataItems(record.categories) : undefined,
      images: record.images ? countDataItems(record.images) : record.galleryImages ? countDataItems(record.galleryImages) : undefined,
    };
  }

  if (Array.isArray(value)) {
    return {
      type: "List",
      items: value.length,
    };
  }

  return {
    value,
  };
}

function getPreviewColumns(rows: Record<string, unknown>[]): string[] {
  const preferred = [
    "name",
    "label",
    "title",
    "branch",
    "slug",
    "category",
    "description",
    "copy",
    "value",
    "items",
    "images",
    "href",
  ];
  const rowKeys = Array.from(new Set(rows.flatMap((row) => Object.keys(row).filter((key) => row[key] !== undefined))));
  const ordered = preferred.filter((key) => rowKeys.includes(key));
  const extra = rowKeys.filter((key) => !ordered.includes(key));

  return [...ordered, ...extra].slice(0, 4);
}

function summarizeValue(value: unknown): string | number | boolean {
  if (Array.isArray(value)) {
    return `${value.length} items`;
  }

  if (value && typeof value === "object") {
    return `${Object.keys(value as Record<string, unknown>).length} fields`;
  }

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  return String(value);
}

function formatPreviewCell(value: unknown): string {
  const summarized = summarizeValue(value);
  const text = String(summarized);

  return text.length > 82 ? `${text.slice(0, 82)}...` : text;
}

function humanizeKey(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dateValue(value?: string): number {
  if (!value) {
    return 0;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
