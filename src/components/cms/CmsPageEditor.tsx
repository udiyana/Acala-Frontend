import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, CheckCircle2, Edit3, ExternalLink, Loader2,
  RefreshCw, Save, Trash2, X, Upload, ChevronLeft, ChevronRight
} from "lucide-react";
import {
  CmsContent, CmsContentPayload,
  createCmsContent, deleteCmsContent, fetchCmsContents, updateCmsContent, uploadCmsMedia
} from "@/lib/cms";

type CmsField = "eyebrow" | "title" | "subtitle" | "body" | "image" | "images" | "cta" | "branch_links" | "usp_cards" | "branch_cards";

interface WebsiteSection {
  id: string;
  label: string;
  description: string;
  fields: CmsField[];
  sortOrder: number;
  defaults?: Partial<CmsContentPayload>;
}

export interface WebsitePage {
  id: string;
  label: string;
  path: string;
  sections: WebsiteSection[];
}

interface Props {
  page: WebsitePage;
  allContents: CmsContent[];
  onContentsChange: (contents: CmsContent[]) => void;
}

function emptyPayload(pageId: string, section?: WebsiteSection): CmsContentPayload {
  return {
    page: pageId,
    section: section?.id ?? "",
    label: section?.label ?? "",
    eyebrow: section?.defaults?.eyebrow ?? "",
    title: section?.defaults?.title ?? "",
    subtitle: "",
    body: section?.defaults?.body ?? "",
    image: section?.defaults?.image ?? "",
    cta_label: section?.defaults?.cta_label ?? "",
    cta_url: section?.defaults?.cta_url ?? "",
    metadata: section?.defaults?.metadata ?? null,
    sort_order: section?.sortOrder ?? 10,
    is_published: true,
  };
}

function sortContents(a: CmsContent, b: CmsContent) {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  return a.section.localeCompare(b.section);
}

function normalizePayload(form: CmsContentPayload): CmsContentPayload {
  return {
    ...form,
    label: form.label || null,
    eyebrow: form.eyebrow || null,
    title: form.title || null,
    subtitle: form.subtitle || null,
    body: form.body || null,
    image: form.image || null,
    cta_label: form.cta_label || null,
    cta_url: form.cta_url || null,
  };
}

const inputCls = `w-full px-3 py-2.5 text-sm text-neutral-800 rounded-xl outline-none transition-all resize-none`
const inputStyle = {
  background: "#ffffff",
  border: "1px solid #dfe3e8",
  caretColor: "var(--color-primary)",
};
const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = "var(--color-primary)";
  e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-alpha)";
};
const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = "#dfe3e8";
  e.currentTarget.style.boxShadow = "none";
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">
      {children}
    </label>
  );
}

export default function CmsPageEditor({ page, allContents, onContentsChange }: Props) {
  const pageContents = useMemo(
    () => allContents.filter((c) => c.page === page.id).sort(sortContents),
    [allContents, page.id]
  );

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [form, setForm] = useState<CmsContentPayload>(() => emptyPayload(page.id));
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setSelectedSectionId(null);
    setSelectedContentId(null);
    setForm(emptyPayload(page.id));
    setMessage(null);
    setError(null);
    setConfirmDelete(false);
  }, [page.id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await fetchCmsContents(page.id);
      const others = allContents.filter((c) => c.page !== page.id);
      onContentsChange([...others, ...fresh].sort(sortContents));
    } catch { /* silent */ }
    finally { setIsRefreshing(false); }
  };

  const handleSelectSection = (section: WebsiteSection) => {
    const existing = pageContents.find((c) => c.section === section.id);
    if (existing) {
      setSelectedContentId(existing.id);
      setForm({
        page: existing.page, section: existing.section,
        label: existing.label || "", 
        eyebrow: existing.eyebrow || section.defaults?.eyebrow || "",
        title: existing.title || section.defaults?.title || "", 
        subtitle: existing.subtitle || section.defaults?.subtitle || "",
        body: existing.body || section.defaults?.body || "", 
        image: existing.image || section.defaults?.image || "",
        cta_label: existing.cta_label || section.defaults?.cta_label || "", 
        cta_url: existing.cta_url || section.defaults?.cta_url || "",
        metadata: existing.metadata || section.defaults?.metadata || null, 
        sort_order: existing.sort_order, 
        is_published: existing.is_published,
      });
    } else {
      setSelectedContentId(null);
      setForm(emptyPayload(page.id, section));
    }
    setSelectedSectionId(section.id);
    setMessage(null);
    setError(null);
    setConfirmDelete(false);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      const payload = normalizePayload(form);
      const saved = selectedContentId
        ? await updateCmsContent(selectedContentId, payload)
        : await createCmsContent(payload);
      const exists = allContents.some((c) => c.id === saved.id);
      const next = exists
        ? allContents.map((c) => (c.id === saved.id ? saved : c))
        : [...allContents, saved];
      onContentsChange(next.sort(sortContents));
      setSelectedContentId(saved.id);
      setForm({
        page: saved.page, section: saved.section,
        label: saved.label ?? "", eyebrow: saved.eyebrow ?? "",
        title: saved.title ?? "", subtitle: saved.subtitle ?? "",
        body: saved.body ?? "", image: saved.image ?? "",
        cta_label: saved.cta_label ?? "", cta_url: saved.cta_url ?? "",
        metadata: saved.metadata, sort_order: saved.sort_order, is_published: saved.is_published,
      });
      setMessage("Tersimpan dan langsung update ke frontend ✓");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!selectedContentId) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setIsDeleting(true);
    try {
      await deleteCmsContent(selectedContentId);
      onContentsChange(allContents.filter((c) => c.id !== selectedContentId));
      setSelectedContentId(null);
      setSelectedSectionId(null);
      setForm(emptyPayload(page.id));
      setMessage("Konten dihapus.");
      setConfirmDelete(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus.");
      setConfirmDelete(false);
    } finally { setIsDeleting(false); }
  };

  const selectedSection = page.sections.find((s) => s.id === selectedSectionId) ?? null;
  const showField = (field: CmsField) => !selectedSection || selectedSection.fields.includes(field);

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">

      {/* ── Left: Section List ─────────────────────── */}
      <div className="w-[220px] flex-shrink-0 flex flex-col border-r border-neutral-200 bg-white">

        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 flex-shrink-0">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Sections</p>
          <div className="flex items-center gap-2">
            <a href={page.path} target="_blank" rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:opacity-85 transition-colors">
              <ExternalLink size={11} />
            </a>
            <button onClick={handleRefresh} disabled={isRefreshing}
              className="text-neutral-400 hover:text-neutral-600 transition-colors">
              <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: "none" }}>
          {page.sections.map((section) => {
            const content = pageContents.find((c) => c.section === section.id);
            const isActive = selectedSectionId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleSelectSection(section)}
                className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all group ${
                  isActive
                    ? "bg-[var(--color-primary-alpha)] border border-[var(--color-primary)]/20 shadow-sm"
                    : "border border-transparent hover:bg-neutral-50 hover:border-neutral-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    !content ? "bg-neutral-200"
                      : content.is_published ? "bg-green-500"
                      : "bg-amber-500"
                  }`} />
                  <p className={`text-[12px] font-semibold truncate ${isActive ? "text-[var(--color-primary)] font-bold" : "text-neutral-600 group-hover:text-neutral-900"}`}>
                    {section.label}
                  </p>
                </div>
                {!content && (
                  <p className="text-[10px] text-neutral-400 mt-0.5 ml-3.5">Belum ada konten</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right: Editor ──────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedSection ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-30">
            <Edit3 size={36} className="text-[var(--color-primary)]" />
            <p className="text-sm text-neutral-500 font-semibold">Pilih section di sebelah kiri untuk mulai edit</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">

            {/* Editor header */}
            <div className="flex items-center gap-3 px-6 py-3.5 border-b border-neutral-200 flex-shrink-0 bg-white">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{selectedSection.label}</p>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">{selectedSection.description}</p>
              </div>

              {/* Published toggle */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-500">{form.is_published ? "Published" : "Draft"}</span>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_published: !f.is_published }))}
                  className="relative w-9 h-5 rounded-full transition-all flex-shrink-0 animate-none"
                  style={{ background: form.is_published ? "#22c55e" : "rgba(0,0,0,0.1)" }}
                >
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{ left: form.is_published ? "18px" : "2px" }} />
                </button>
              </div>

              {/* Delete */}
              {selectedContentId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                    confirmDelete
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-red-600 border border-red-100 bg-white hover:bg-red-50 hover:border-red-200 shadow-sm"
                  }`}
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  {confirmDelete ? "Yakin?" : "Hapus"}
                </button>
              )}
              {confirmDelete && (
                <button type="button" onClick={() => setConfirmDelete(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  <X size={14} />
                </button>
              )}

              {/* Save */}
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: isSaving ? "rgba(219, 14, 15, 0.5)" : "var(--color-primary)", boxShadow: isSaving ? "none" : "0 4px 14px rgba(219, 14, 15, 0.24)" }}
              >
                {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>

            {/* Notifications */}
            {message && (
              <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-200 text-sm text-green-800 bg-green-50 shadow-sm">
                <CheckCircle2 size={14} className="flex-shrink-0 text-green-600" />
                <span className="flex-1 text-[13px]">{message}</span>
                <button type="button" onClick={() => setMessage(null)} className="text-green-600/50 hover:text-green-600"><X size={12} /></button>
              </div>
            )}
            {error && (
              <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm text-red-800 bg-red-50 shadow-sm">
                <AlertTriangle size={14} className="flex-shrink-0 text-red-600" />
                <span className="flex-1 text-[13px]">{error}</span>
                <button type="button" onClick={() => setError(null)} className="text-red-600/50 hover:text-red-600"><X size={12} /></button>
              </div>
            )}

            {/* Fields */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Section key + label */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Section Key</FieldLabel>
                  <input value={form.section} readOnly className={`${inputCls} opacity-40 cursor-not-allowed`} style={inputStyle} />
                </div>
                <div>
                  <FieldLabel>Label (Admin)</FieldLabel>
                  <input
                    value={form.label ?? ""} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="Label internal"
                    onFocus={inputFocus} onBlur={inputBlur}
                  />
                </div>
              </div>

              {showField("eyebrow") && (
                <div>
                  <FieldLabel>Eyebrow</FieldLabel>
                  <input
                    value={form.eyebrow ?? ""} onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="Teks kecil di atas judul"
                    onFocus={inputFocus} onBlur={inputBlur}
                  />
                </div>
              )}

              {showField("title") && (
                <div>
                  <FieldLabel>Title</FieldLabel>
                  <input
                    value={form.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="Judul section"
                    onFocus={inputFocus} onBlur={inputBlur}
                  />
                </div>
              )}

              {showField("subtitle") && (
                <div>
                  <FieldLabel>Subtitle</FieldLabel>
                  <input
                    value={form.subtitle ?? ""} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                    className={inputCls} style={inputStyle} placeholder="Subtitle atau tagline"
                    onFocus={inputFocus} onBlur={inputBlur}
                  />
                </div>
              )}

              {showField("body") && (
                <div>
                  <FieldLabel>Body / Description</FieldLabel>
                  <textarea
                    value={form.body ?? ""} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    rows={6} className={`${inputCls} leading-relaxed`} style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="Konten paragraf..."
                    onFocus={inputFocus} onBlur={inputBlur}
                  />
                  <p className="text-[10px] text-neutral-400 mt-1.5 font-medium">Gunakan dua baris kosong untuk memisahkan paragraf.</p>
                </div>
              )}

              {showField("image") && (
                <div>
                  <FieldLabel>Image</FieldLabel>
                  <div className="mt-1">
                    {form.image ? (
                      <div className="group relative rounded-xl overflow-hidden border border-neutral-200 h-48 bg-neutral-50">
                        <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label className={`flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold cursor-pointer transition-colors text-white ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            {isUploading ? "Uploading..." : "Ganti Gambar"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploading(true);
                                setError(null);
                                try {
                                  const url = await uploadCmsMedia(file);
                                  setForm((f) => ({ ...f, image: url }));
                                } catch (err) {
                                  setError(err instanceof Error ? err.message : "Gagal upload gambar.");
                                } finally {
                                  setIsUploading(false);
                                  e.target.value = "";
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, image: "" }))}
                            className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-200 hover:border-neutral-300 rounded-xl cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50">
                        {isUploading ? (
                          <>
                            <Loader2 size={24} className="animate-spin text-neutral-400 mb-2" />
                            <span className="text-sm text-neutral-500 font-semibold">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={24} className="text-neutral-400 mb-2" />
                            <span className="text-sm text-neutral-500 font-semibold">Klik untuk upload gambar</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploading(true);
                            setError(null);
                            try {
                              const url = await uploadCmsMedia(file);
                              setForm((f) => ({ ...f, image: url }));
                            } catch (err) {
                              setError(err instanceof Error ? err.message : "Gagal upload gambar.");
                            } finally {
                              setIsUploading(false);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {showField("images") && (
                <div>
                  <FieldLabel>Slider Images</FieldLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                    {Array.isArray(form.metadata?.images) && form.metadata.images.map((imgUrl, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden border border-neutral-200 h-32 bg-neutral-50">
                        <img src={imgUrl} alt={`Slider ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            disabled={i === 0}
                            onClick={() => {
                              const newImages = [...(form.metadata?.images as string[])];
                              [newImages[i - 1], newImages[i]] = [newImages[i], newImages[i - 1]];
                              setForm(f => ({ ...f, metadata: { ...(f.metadata || {}), images: newImages } }));
                            }}
                            className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Geser ke kiri"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...(form.metadata?.images as string[])];
                              newImages.splice(i, 1);
                              setForm(f => ({ ...f, metadata: { ...(f.metadata || {}), images: newImages } }));
                            }}
                            className="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                            title="Hapus gambar"
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            type="button"
                            disabled={i === (form.metadata?.images as string[]).length - 1}
                            onClick={() => {
                              const newImages = [...(form.metadata?.images as string[])];
                              [newImages[i + 1], newImages[i]] = [newImages[i], newImages[i + 1]];
                              setForm(f => ({ ...f, metadata: { ...(f.metadata || {}), images: newImages } }));
                            }}
                            className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Geser ke kanan"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-200 hover:border-neutral-300 rounded-xl cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50">
                      {isUploading ? (
                        <Loader2 size={20} className="animate-spin text-neutral-400" />
                      ) : (
                        <>
                          <Upload size={20} className="text-neutral-400 mb-1" />
                          <span className="text-xs text-neutral-500 font-semibold">Tambah Gambar</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={isUploading}
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          setIsUploading(true);
                          setError(null);
                          try {
                            const newUrls: string[] = [];
                            for (const file of files) {
                              newUrls.push(await uploadCmsMedia(file));
                            }
                            const existingImages = Array.isArray(form.metadata?.images) ? form.metadata.images : [];
                            setForm((f) => ({
                              ...f,
                              metadata: { ...(f.metadata || {}), images: [...existingImages, ...newUrls] }
                            }));
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Gagal upload gambar.");
                          } finally {
                            setIsUploading(false);
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}

              {showField("cta") && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>CTA Label</FieldLabel>
                    <input
                      value={form.cta_label ?? ""} onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
                      className={inputCls} style={inputStyle} placeholder="Book a Table"
                      onFocus={inputFocus} onBlur={inputBlur}
                    />
                  </div>
                  <div>
                    <FieldLabel>CTA URL</FieldLabel>
                    <input
                      value={form.cta_url ?? ""} onChange={(e) => setForm((f) => ({ ...f, cta_url: e.target.value }))}
                      className={inputCls} style={inputStyle} placeholder="https://..."
                      onFocus={inputFocus} onBlur={inputBlur}
                    />
                  </div>
                </div>
              )}

              {showField("branch_links") && (
                <div>
                  <FieldLabel>Branch Quick Links (Maps)</FieldLabel>
                  <div className="space-y-3 mt-1">
                    {Array.from({ length: 2 }).map((_, i) => {
                      const links = (form.metadata?.branch_links as any[]) || [];
                      const defaultLinks = (selectedSection?.defaults?.metadata as any)?.branch_links || [];
                      const link = links[i] || defaultLinks[i] || { title: "", copy: "", href: "" };
                      
                      const updateLink = (field: "title" | "copy" | "href", val: string) => {
                        const newLinks = [...links];
                        if (newLinks.length === 0) {
                          // Initialize with defaults if empty
                          newLinks.push(...defaultLinks);
                        }
                        if (!newLinks[i]) newLinks[i] = { title: "", copy: "", href: "" };
                        newLinks[i][field] = val;
                        setForm(f => ({ ...f, metadata: { ...(f.metadata || {}), branch_links: newLinks } }));
                      };

                      return (
                        <div key={i} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                          <p className="text-xs font-semibold text-neutral-500 mb-1">Branch Link #{i + 1}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <input value={link.title} onChange={e => updateLink("title", e.target.value)} className={inputCls} style={inputStyle} placeholder="Nusa Lembongan" onFocus={inputFocus} onBlur={inputBlur} />
                            <input value={link.href} onChange={e => updateLink("href", e.target.value)} className={inputCls} style={inputStyle} placeholder="/branches/nusa-lembongan" onFocus={inputFocus} onBlur={inputBlur} />
                          </div>
                          <input value={link.copy} onChange={e => updateLink("copy", e.target.value)} className={inputCls} style={inputStyle} placeholder="Brunch, coffee, pizza..." onFocus={inputFocus} onBlur={inputBlur} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {showField("usp_cards") && (
                <div>
                  <FieldLabel>Why Choose Acala (Categories & Cards)</FieldLabel>
                  <div className="space-y-6 mt-2">
                    {Array.from({ length: 2 }).map((_, i) => {
                      const options = (form.metadata?.branchOptions as any[]) || (selectedSection?.defaults?.metadata as any)?.branchOptions || [];
                      const uspsRecord = (form.metadata?.branchUsps as any) || (selectedSection?.defaults?.metadata as any)?.branchUsps || {};
                      
                      const opt = options[i] || { key: `branch-${i}`, label: "", summary: "" };
                      const optKey = opt.key;
                      const cards = uspsRecord[optKey] || [];

                      const updateOption = (field: "label" | "summary", val: string) => {
                        const newOptions = [...options];
                        if (!newOptions[i]) newOptions[i] = { key: optKey, label: "", summary: "" };
                        newOptions[i][field] = val;
                        setForm(f => ({ ...f, metadata: { ...(f.metadata || {}), branchOptions: newOptions, branchUsps: uspsRecord } }));
                      };

                      const updateCard = (cardIdx: number, field: string, val: string) => {
                        const newUsps = { ...uspsRecord };
                        const newCards = [...(newUsps[optKey] || [])];
                        if (!newCards[cardIdx]) newCards[cardIdx] = { title: "", copy: "", icon: "pizza", image: "", alt: "" };
                        newCards[cardIdx] = { ...newCards[cardIdx], [field]: val };
                        newUsps[optKey] = newCards;
                        setForm(f => ({ ...f, metadata: { ...(f.metadata || {}), branchOptions: options, branchUsps: newUsps } }));
                      };

                      return (
                        <div key={optKey} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                          <p className="text-sm font-semibold text-neutral-800 mb-3">Category #{i + 1} ({opt.label || "Unnamed"})</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Category Label</label>
                              <input value={opt.label} onChange={e => updateOption("label", e.target.value)} className={inputCls} style={inputStyle} placeholder="Nusa Lembongan" onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Category Summary</label>
                              <input value={opt.summary} onChange={e => updateOption("summary", e.target.value)} className={inputCls} style={inputStyle} placeholder="Pizza, seafood..." onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                          </div>
                          
                          <div className="space-y-4 border-t border-neutral-200 pt-4">
                            <p className="text-xs font-semibold text-neutral-500">Feature Cards (3 Cards)</p>
                            {Array.from({ length: 3 }).map((_, cIdx) => {
                              const card = cards[cIdx] || { title: "", copy: "", icon: "", image: "", alt: "" };
                              return (
                                <div key={cIdx} className="p-3 bg-white rounded-lg border border-neutral-100 shadow-sm space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <input value={card.title} onChange={e => updateCard(cIdx, "title", e.target.value)} className={inputCls} style={inputStyle} placeholder="Card Title" onFocus={inputFocus} onBlur={inputBlur} />
                                    <input value={card.icon} onChange={e => updateCard(cIdx, "icon", e.target.value)} className={inputCls} style={inputStyle} placeholder="Icon Name (e.g. pizza)" onFocus={inputFocus} onBlur={inputBlur} />
                                  </div>
                                  <input value={card.copy} onChange={e => updateCard(cIdx, "copy", e.target.value)} className={inputCls} style={inputStyle} placeholder="Description..." onFocus={inputFocus} onBlur={inputBlur} />
                                  <div className="grid grid-cols-2 gap-3">
                                    <input value={card.image} onChange={e => updateCard(cIdx, "image", e.target.value)} className={inputCls} style={inputStyle} placeholder="Image Path" onFocus={inputFocus} onBlur={inputBlur} />
                                    <input value={card.alt} onChange={e => updateCard(cIdx, "alt", e.target.value)} className={inputCls} style={inputStyle} placeholder="Image Alt" onFocus={inputFocus} onBlur={inputBlur} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {showField("branch_cards") && (
                <div>
                  <FieldLabel>Branch Cards</FieldLabel>
                  <div className="space-y-4 mt-2">
                    {Array.from({ length: 2 }).map((_, i) => {
                      const branchCards = (form.metadata?.branchCards as any[]) || [];
                      const defaultBranchCards = (selectedSection?.defaults?.metadata as any)?.branchCards || [];
                      const card = branchCards[i] || defaultBranchCards[i] || { name: "", tagline: "", address: "", mapUrl: "", reservationUrl: "", frontImage: "", features: [] };
                      
                      const updateCard = (field: string, val: string | string[]) => {
                        const newCards = [...branchCards];
                        if (newCards.length === 0) newCards.push(...defaultBranchCards);
                        if (!newCards[i]) newCards[i] = { ...defaultBranchCards[i] };
                        newCards[i][field] = val;
                        setForm(f => ({ ...f, metadata: { ...(f.metadata || {}), branchCards: newCards } }));
                      };

                      return (
                        <div key={i} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                          <p className="text-sm font-semibold text-neutral-800 mb-2">Branch Card #{i + 1}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Branch Name</label>
                              <input value={card.name} onChange={e => updateCard("name", e.target.value)} className={inputCls} style={inputStyle} placeholder="Acala Nusa Dua" onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Image Path</label>
                              <input value={card.frontImage || card.heroImage} onChange={e => updateCard("frontImage", e.target.value)} className={inputCls} style={inputStyle} placeholder="/Branch/..." onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-500 mb-1">Description</label>
                            <input value={card.tagline} onChange={e => updateCard("tagline", e.target.value)} className={inputCls} style={inputStyle} placeholder="Short description..." onFocus={inputFocus} onBlur={inputBlur} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-500 mb-1">Address</label>
                            <input value={card.address} onChange={e => updateCard("address", e.target.value)} className={inputCls} style={inputStyle} placeholder="Address..." onFocus={inputFocus} onBlur={inputBlur} />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Explore URL</label>
                              <input value={card.slugUrl || ""} onChange={e => updateCard("slugUrl", e.target.value)} className={inputCls} style={inputStyle} placeholder="/branches/..." onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Map URL</label>
                              <input value={card.mapUrl} onChange={e => updateCard("mapUrl", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://maps..." onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Reservation URL</label>
                              <input value={card.reservationUrl} onChange={e => updateCard("reservationUrl", e.target.value)} className={inputCls} style={inputStyle} placeholder="https://chope..." onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Explore Label</label>
                              <input value={card.slugLabel || ""} onChange={e => updateCard("slugLabel", e.target.value)} className={inputCls} style={inputStyle} placeholder="Explore Branch" onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Map Label</label>
                              <input value={card.mapLabel || ""} onChange={e => updateCard("mapLabel", e.target.value)} className={inputCls} style={inputStyle} placeholder="Direction" onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-500 mb-1">Booking Label</label>
                              <input value={card.reservationLabel || ""} onChange={e => updateCard("reservationLabel", e.target.value)} className={inputCls} style={inputStyle} placeholder="Book a Table" onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-500 mb-2">Checklist Points (4 items displayed)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[0, 1, 2, 3].map((featIdx) => (
                                <div key={featIdx} className="flex items-center gap-2">
                                  <div className="flex-shrink-0 text-red-500/80">
                                    <CheckCircle2 size={14} />
                                  </div>
                                  <input 
                                    value={(card.features && card.features[featIdx]) || ""}
                                    onChange={e => {
                                      const newFeatures = [...(card.features || [])];
                                      while (newFeatures.length <= featIdx) newFeatures.push("");
                                      newFeatures[featIdx] = e.target.value;
                                      updateCard("features", newFeatures.filter((_, idx) => idx < 4 || newFeatures[idx] !== ""));
                                    }}
                                    className={inputCls} style={inputStyle} 
                                    placeholder={`Checklist item ${featIdx + 1}`} 
                                    onFocus={inputFocus} onBlur={inputBlur} 
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sort order */}
              <div className="flex items-center gap-4 pt-1">
                <div className="w-28">
                  <FieldLabel>Sort Order</FieldLabel>
                  <input
                    type="number" min={0} step={10}
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                    className={inputCls} style={inputStyle}
                    onFocus={inputFocus} onBlur={inputBlur}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-5 font-medium">Urutan tampil section (kecil = lebih atas).</p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
