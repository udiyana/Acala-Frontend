import { FormEvent, useCallback, useEffect, useMemo, useState, useRef } from "react";
import type { ReactNode } from "react";
import JoditEditor from "jodit-react";
import {
  BookOpen,
  CalendarDays,
  Eye,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
  Upload,
} from "lucide-react";

import type { BlogPost } from "@/lib/blog";
import { blogPostUrl, slugify } from "@/lib/blog";
import {
  CmsDataset,
  CmsDatasetPayload,
  createCmsDataset,
  fetchCmsDatasets,
  updateCmsDataset,
  uploadCmsMedia,
} from "@/lib/cms";

type BlogDraft = Required<Pick<BlogPost, "title">> &
  Pick<BlogPost, "author" | "body" | "category" | "cta" | "date" | "excerpt" | "href" | "image" | "readTime" | "slug">;

const BLOG_DATASET_KEY = "blog_highlights";
const BLOG_DATASET_LABEL = "Blog Articles";
const BLOG_DATASET_DESCRIPTION = "Daftar artikel blog Acala yang tampil di halaman Blog dan highlight website.";

export default function CmsBlogPanel({
  initialDatasets,
  onDatasetsChange,
}: {
  initialDatasets: CmsDataset[];
  onDatasetsChange: (datasets: CmsDataset[]) => void;
}) {
  const [datasets, setDatasets] = useState<CmsDataset[]>(initialDatasets);
  const [posts, setPosts] = useState<BlogDraft[]>(() => readBlogPosts(findBlogDataset(initialDatasets)?.data));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<BlogDraft>(() => emptyBlogDraft(0));
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const joditConfig = useMemo(() => {
    return {
      readonly: false,
      height: 600,
      placeholder: "Tulis artikel lengkap dengan gambar di sini...",
      extraButtons: [
        {
          name: "uploadImage",
          icon: "image",
          tooltip: "Upload Image",
          exec: (editor: any) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async (e: any) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              const id = `upload-${Date.now()}`;
              editor.selection.insertHTML(`<span id="${id}">[Mengunggah gambar...]</span>`);
              
              try {
                const url = await uploadCmsMedia(file);
                const placeholder = editor.editorDocument.getElementById(id);
                if (placeholder) {
                  placeholder.outerHTML = `<img src="${url}" alt="Article image" style="max-width: 100%; border-radius: 8px; margin: 1rem 0;" />`;
                } else {
                  editor.selection.insertImage(url);
                }
              } catch (err) {
                alert("Gagal upload gambar");
                const placeholder = editor.editorDocument.getElementById(id);
                if (placeholder) placeholder.remove();
              }
            };
            input.click();
          }
        }
      ],
      buttons: [
        'source', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'ul', 'ol', '|',
        'paragraph', 'fontsize', 'brush', '|',
        'uploadImage', 'link', '|',
        'align', 'undo', 'redo', '|',
        'hr', 'fullsize'
      ]
    };
  }, []);

  const blogDataset = useMemo(() => findBlogDataset(datasets), [datasets]);
  const filteredPosts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return posts;
    }

    return posts.filter((post) =>
      [post.title, post.category, post.excerpt, post.body, post.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [posts, search]);
  const featuredPost = posts[0];
  const totalWords = posts.reduce((total, post) => total + wordCount(post.body || post.excerpt || ""), 0);

  const syncDatasets = useCallback(
    (nextDatasets: CmsDataset[]) => {
      setDatasets(nextDatasets);
      onDatasetsChange(nextDatasets);
      setPosts(readBlogPosts(findBlogDataset(nextDatasets)?.data));
    },
    [onDatasetsChange],
  );

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setSelectedIndex(null);
    setDraft(emptyBlogDraft(posts.length));
  }, [posts.length]);

  const loadDatasets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextDatasets = await fetchCmsDatasets();
      syncDatasets(nextDatasets);
      setMessage("Blog CMS tersinkron dari database.");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat artikel blog.");
    } finally {
      setIsLoading(false);
    }
  }, [syncDatasets]);

  useEffect(() => {
    setDatasets(initialDatasets);
    setPosts(readBlogPosts(findBlogDataset(initialDatasets)?.data));
  }, [initialDatasets]);

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

  const openNewPost = () => {
    setSelectedIndex(null);
    setDraft(emptyBlogDraft(posts.length));
    setEditorOpen(true);
    setMessage(null);
    setError(null);
  };

  const openEditPost = (post: BlogDraft) => {
    const index = posts.findIndex((item) => blogPostUrl(item) === blogPostUrl(post));

    setSelectedIndex(index >= 0 ? index : null);
    setDraft(post);
    setEditorOpen(true);
    setMessage(null);
    setError(null);
  };

  const savePosts = async (nextPosts: BlogDraft[], successMessage: string) => {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = blogDatasetPayload(blogDataset, datasets, nextPosts);
      const saved = blogDataset
        ? await updateCmsDataset(blogDataset.id, payload)
        : await createCmsDataset(payload);
      const nextDatasets = mergeDataset(datasets, saved);

      syncDatasets(nextDatasets);
      setMessage(successMessage);
      closeEditor();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Artikel blog gagal disimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedDraft = normalizeBlogPost(draft, selectedIndex ?? posts.length);

    if (!normalizedDraft.title.trim()) {
      setError("Judul artikel wajib diisi.");
      return;
    }

    const nextPosts =
      selectedIndex === null
        ? [...posts, normalizedDraft]
        : posts.map((post, index) => (index === selectedIndex ? normalizedDraft : post));

    await savePosts(ensureUniqueSlugs(nextPosts), "Artikel blog tersimpan dan langsung terupdate ke frontend.");
  };

  const handleDelete = async () => {
    if (selectedIndex === null) {
      return;
    }

    const confirmed = window.confirm(`Hapus artikel "${draft.title}"?`);

    if (!confirmed) {
      return;
    }

    const nextPosts = posts.filter((_, index) => index !== selectedIndex);
    await savePosts(nextPosts, "Artikel blog dihapus dari frontend.");
  };

  const updateDraft = (updates: Partial<BlogDraft>) => {
    setDraft((current) => ({ ...current, ...updates }));
  };

  const updateTitle = (title: string) => {
    setDraft((current) => {
      const previousGeneratedSlug = slugify(current.title);
      const shouldSyncSlug = !current.slug || current.slug === previousGeneratedSlug;

      return {
        ...current,
        title,
        slug: shouldSyncSlug ? slugify(title) : current.slug,
      };
    });
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-lg border border-[#dfe3e8] bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#ff7448]">Acala Blog CMS</p>
            <h2 className="mt-1 text-2xl font-bold text-[#171717]">Buat dan kelola artikel blog</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#6f7885]">
              Artikel yang disimpan di sini akan otomatis muncul di halaman Blog, halaman detail artikel, dan blog highlight di frontend.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ToolbarButton onClick={() => void loadDatasets()} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </ToolbarButton>
              <ToolbarButton dark onClick={openNewPost}>
                <Plus className="h-4 w-4" />
                New Blog
              </ToolbarButton>
              <a href="/blog" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#dfe3e8] bg-white px-3 text-xs font-bold text-[#343b45] shadow-sm transition hover:bg-[#f7f8fa]">
                <Eye className="h-4 w-4" />
                View Blog
              </a>
            </div>
          </div>

          <div className="border-t border-[#edf0f4] bg-[#fbfcfd] p-5 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-3 gap-3">
              <SummaryStat label="Articles" value={posts.length} />
              <SummaryStat label="Words" value={totalWords} />
              <SummaryStat label="Dataset" value={blogDataset?.is_published ? "Live" : "Draft"} />
            </div>
            {featuredPost ? (
              <div className="mt-4 rounded-lg border border-[#dfe3e8] bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#a6aeb9]">Featured</p>
                <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#171717]">{featuredPost.title}</p>
                <p className="mt-1 text-[11px] font-semibold text-[#8d96a3]">{blogPostUrl(featuredPost)}</p>
              </div>
            ) : null}
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

      <section className="rounded-lg border border-[#dfe3e8] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#edf0f4] p-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex h-9 min-w-[260px] flex-1 items-center gap-2 rounded-md border border-[#dfe3e8] bg-[#f8f9fb] px-3 sm:max-w-md">
            <Search className="h-4 w-4 text-[#9aa2ad]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none"
              placeholder="Cari judul, kategori, isi artikel..."
            />
          </label>
          <p className="text-xs font-semibold text-[#8d96a3]">
            {filteredPosts.length} dari {posts.length} artikel
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#fff3ef] text-[#ff7448]">
              <BookOpen className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-[#171717]">Belum ada artikel blog</p>
            <p className="mt-1 text-xs text-[#8d96a3]">Mulai dari tombol New Blog untuk membuat artikel pertama.</p>
            <ToolbarButton dark onClick={openNewPost} className="mt-5">
              <Plus className="h-4 w-4" />
              New Blog
            </ToolbarButton>
          </div>
        ) : (
          <div className="grid gap-0 md:grid-cols-2 2xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <button
                key={blogPostUrl(post)}
                type="button"
                onClick={() => openEditPost(post)}
                className="group min-h-[300px] border-b border-r border-[#edf0f4] bg-white p-4 text-left transition hover:bg-[#fff8f5]"
              >
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-lg bg-[#f3f5f8]">
                  <img
                    src={post.image || "/Branch/Acala nusa dua/DSC00742-HDR.jpg"}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded bg-[#fff3ef] px-2 py-1 text-[10px] font-bold uppercase text-[#f05a28]">
                    {post.category || "Acala Story"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-[#f3f5f8] px-2 py-1 text-[10px] font-bold text-[#6f7885]">
                    <CalendarDays className="h-3 w-3" />
                    {post.date || "No date"}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[#171717]">{post.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#6f7885]">
                  {post.excerpt || "Belum ada ringkasan artikel."}
                </p>
                <p className="mt-4 text-[11px] font-semibold text-[#a6aeb9]">{blogPostUrl(post)}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {editorOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#111827]/45 px-3 py-4 backdrop-blur-sm sm:px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-editor-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Tutup editor blog"
            onClick={closeEditor}
          />
          <section className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-[#dfe3e8] bg-white shadow-[0_24px_80px_rgba(17,24,39,0.28)]">
            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="flex flex-shrink-0 flex-col gap-3 border-b border-[#edf0f4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#a6aeb9]">
                    {selectedIndex === null ? "New blog article" : "Edit blog article"}
                  </p>
                  <h2 id="blog-editor-title" className="mt-1 flex items-center gap-2 text-xl font-bold text-[#171717]">
                    <BookOpen className="h-5 w-5 text-[#ff7448]" />
                    {draft.title || "Untitled Blog"}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIndex !== null ? (
                    <ToolbarButton onClick={() => void handleDelete()} disabled={isSaving}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </ToolbarButton>
                  ) : null}
                  <ToolbarButton onClick={closeEditor}>
                    <X className="h-4 w-4" />
                    Close
                  </ToolbarButton>
                  <ToolbarButton dark submit disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Blog
                  </ToolbarButton>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_340px]">
                  <div>
                    <FormGroup title="Konten Artikel" subtitle="Isi utama yang akan tampil pada halaman detail blog.">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <Field label="Judul artikel">
                          <input
                            value={draft.title}
                            onChange={(event) => updateTitle(event.target.value)}
                            className="admin-input"
                            placeholder="A Tale of Two Acala Branches"
                            required
                          />
                        </Field>
                        <Field label="Custom URL (Slug)">
                          <input
                            value={draft.slug ?? ""}
                            onChange={(event) => updateDraft({ slug: slugify(event.target.value) })}
                            className="admin-input"
                            placeholder="a-tale-of-two-acala-branches"
                          />
                        </Field>
                        <Field label="Kategori">
                          <input
                            value={draft.category ?? ""}
                            onChange={(event) => updateDraft({ category: event.target.value })}
                            className="admin-input"
                            placeholder="Branches"
                          />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Tanggal">
                            <input
                              value={draft.date ?? ""}
                              onChange={(event) => updateDraft({ date: event.target.value })}
                              className="admin-input"
                              placeholder="July 2026"
                            />
                          </Field>
                          <Field label="Durasi baca">
                            <input
                              value={draft.readTime ?? ""}
                              onChange={(event) => updateDraft({ readTime: event.target.value })}
                              className="admin-input"
                              placeholder="3 min read"
                            />
                          </Field>
                        </div>
                        <Field label="Thumbnail / Cover image" className="lg:col-span-2">
                          <div className="mt-1">
                            {draft.image ? (
                              <div className="group relative rounded-xl overflow-hidden border border-[#dfe3e8] h-48 bg-[#f3f5f8]">
                                <img src={draft.image} alt="Cover preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                  <label className={`flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold cursor-pointer transition-colors text-white ${isUploadingImage ? 'opacity-50 cursor-wait' : ''}`}>
                                    {isUploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                    {isUploadingImage ? "Uploading..." : "Ganti Gambar"}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      disabled={isUploadingImage}
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIsUploadingImage(true);
                                        setError(null);
                                        try {
                                          const url = await uploadCmsMedia(file);
                                          updateDraft({ image: url });
                                        } catch (err) {
                                          setError(err instanceof Error ? err.message : "Gagal upload gambar.");
                                        } finally {
                                          setIsUploadingImage(false);
                                          e.target.value = "";
                                        }
                                      }}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => updateDraft({ image: "" })}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[#dfe3e8] hover:border-[#a6aeb9] rounded-xl cursor-pointer transition-colors bg-[#f8f9fb] hover:bg-[#f3f5f8]">
                                {isUploadingImage ? (
                                  <>
                                    <Loader2 size={24} className="animate-spin text-[#8d96a3] mb-2" />
                                    <span className="text-sm text-[#4f5865] font-semibold">Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload size={24} className="text-[#8d96a3] mb-2" />
                                    <span className="text-sm text-[#4f5865] font-semibold">Klik untuk upload gambar cover</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={isUploadingImage}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setIsUploadingImage(true);
                                    setError(null);
                                    try {
                                      const url = await uploadCmsMedia(file);
                                      updateDraft({ image: url });
                                    } catch (err) {
                                      setError(err instanceof Error ? err.message : "Gagal upload gambar.");
                                    } finally {
                                      setIsUploadingImage(false);
                                      e.target.value = "";
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </Field>
                        <Field label="Ringkasan" className="lg:col-span-2">
                          <textarea
                            value={draft.excerpt ?? ""}
                            onChange={(event) => updateDraft({ excerpt: event.target.value })}
                            className="admin-input min-h-24 resize-y"
                            placeholder="Ringkasan singkat untuk card blog dan meta artikel."
                          />
                        </Field>
                        <Field label="Isi artikel" className="lg:col-span-2">
                          <JoditEditor
                            value={draft.body ?? ""}
                            config={joditConfig}
                            onBlur={(newContent) => updateDraft({ body: newContent })}
                          />
                        </Field>
                      </div>
                    </FormGroup>

                    <FormGroup title="CTA Artikel" subtitle="Link lanjutan setelah pembaca selesai membaca artikel.">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <Field label="CTA label">
                          <input
                            value={draft.cta ?? ""}
                            onChange={(event) => updateDraft({ cta: event.target.value })}
                            className="admin-input"
                            placeholder="Explore Locations"
                          />
                        </Field>
                        <Field label="CTA link">
                          <input
                            value={draft.href ?? ""}
                            onChange={(event) => updateDraft({ href: event.target.value })}
                            className="admin-input"
                            placeholder="/branches/nusa-dua"
                          />
                        </Field>
                      </div>
                    </FormGroup>
                  </div>

                  <aside className="border-t border-[#edf0f4] bg-[#fbfcfd] p-4 xl:border-l xl:border-t-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#a6aeb9]">Frontend Preview</p>
                    <div className="mt-4 overflow-hidden rounded-lg border border-[#dfe3e8] bg-white">
                      <div className="relative aspect-[4/3] bg-[#f3f5f8] overflow-hidden">
                        <img
                          src={draft.image || "/Branch/Acala nusa dua/DSC00742-HDR.jpg"}
                          alt={draft.title || "Blog preview"}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span className="rounded bg-[#fff3ef] px-2 py-1 text-[10px] font-bold uppercase text-[#f05a28]">
                            {draft.category || "Acala Story"}
                          </span>
                          <span className="rounded bg-[#f3f5f8] px-2 py-1 text-[10px] font-bold text-[#6f7885]">
                            {draft.readTime || "Quick Read"}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold leading-tight text-[#171717]">{draft.title || "Untitled Blog"}</h3>
                        <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-[#6f7885]">
                          {draft.excerpt || "Ringkasan artikel akan tampil di sini."}
                        </p>
                      </div>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3">
                      <SummaryStat label="URL" value={blogPostUrl(draft)} />
                      <SummaryStat label="Words" value={wordCount(draft.body || draft.excerpt || "")} />
                    </dl>
                    <div className="mt-4 rounded-lg border border-[#dfe3e8] bg-white p-3">
                      <p className="flex items-center gap-2 text-xs font-bold text-[#171717]">
                        <FileText className="h-4 w-4 text-[#ff7448]" />
                        Penyimpanan
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#8d96a3]">
                        Artikel disimpan ke dataset Blog Articles dan langsung dibaca oleh frontend.
                      </p>
                    </div>
                  </aside>
                </div>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="min-h-[74px] rounded-lg border border-[#dfe3e8] bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#a6aeb9]">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-bold leading-tight text-[#171717]">{value}</p>
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
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-bold text-[#4f5865]">{label}</span>
      {children}
    </label>
  );
}

function ToolbarButton({
  children,
  className = "",
  dark = false,
  disabled = false,
  onClick,
  submit = false,
}: {
  children: ReactNode;
  className?: string;
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
      } ${className}`}
    >
      {children}
    </button>
  );
}

function findBlogDataset(datasets: CmsDataset[]): CmsDataset | undefined {
  return datasets.find((dataset) => dataset.key === BLOG_DATASET_KEY);
}

function readBlogPosts(data: unknown): BlogDraft[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeBlogPost);
}

function emptyBlogDraft(index: number): BlogDraft {
  const title = `New Acala Story ${index + 1}`;

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

function normalizeBlogPost(value: unknown, index = 0): BlogDraft {
  const record = toRecord(value);
  const title = stringField(record, "title") || `Blog Article ${index + 1}`;
  const excerpt = stringField(record, "excerpt");

  return {
    title,
    slug: slugify(stringField(record, "slug") || title) || `blog-article-${index + 1}`,
    category: stringField(record, "category") || "Acala Story",
    date: stringField(record, "date"),
    readTime: stringField(record, "readTime") || "3 min read",
    excerpt,
    body: stringField(record, "body") || excerpt,
    image: stringField(record, "image") || "/Branch/Acala nusa dua/DSC00742-HDR.jpg",
    href: stringField(record, "href") || "/branches",
    cta: stringField(record, "cta") || "Explore More",
    author: stringField(record, "author") || "Acala Team",
  };
}

function ensureUniqueSlugs(posts: BlogDraft[]): BlogDraft[] {
  const seen = new Map<string, number>();

  return posts.map((post, index) => {
    const normalized = normalizeBlogPost(post, index);
    const baseSlug = normalized.slug || `blog-article-${index + 1}`;
    const count = seen.get(baseSlug) ?? 0;
    seen.set(baseSlug, count + 1);

    return {
      ...normalized,
      slug: count === 0 ? baseSlug : `${baseSlug}-${count + 1}`,
    };
  });
}

function blogDatasetPayload(
  dataset: CmsDataset | undefined,
  datasets: CmsDataset[],
  posts: BlogDraft[],
): CmsDatasetPayload {
  const nextSortOrder = datasets.reduce((max, item) => Math.max(max, item.sort_order), 0) + 10;

  return {
    key: BLOG_DATASET_KEY,
    label: dataset?.label || BLOG_DATASET_LABEL,
    description: dataset?.description ?? BLOG_DATASET_DESCRIPTION,
    data: ensureUniqueSlugs(posts),
    sort_order: dataset?.sort_order ?? nextSortOrder,
    is_published: true,
  };
}

function mergeDataset(datasets: CmsDataset[], saved: CmsDataset): CmsDataset[] {
  const exists = datasets.some((dataset) => dataset.id === saved.id);
  const next = exists
    ? datasets.map((dataset) => (dataset.id === saved.id ? saved : dataset))
    : [...datasets, saved];

  return [...next].sort((a, b) => a.sort_order - b.sort_order || a.key.localeCompare(b.key));
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
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
