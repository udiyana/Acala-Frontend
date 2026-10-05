import { useState, useEffect } from "react";
import { Save, AlertCircle, Code, Loader2 } from "lucide-react";
import { CmsDataset, createCmsDataset, updateCmsDataset } from "@/lib/cms";

interface ScriptData {
  head?: string;
  body?: string;
  footer?: string;
}

const defaultData: ScriptData = { head: "", body: "", footer: "" };

export default function CmsScriptsPanel({
  initialDatasets,
  onDatasetsChange,
}: {
  initialDatasets: CmsDataset[];
  onDatasetsChange: (ds: CmsDataset[]) => void;
}) {
  const [datasetId, setDatasetId] = useState<number | null>(null);
  const [data, setData] = useState<ScriptData>(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const ds = initialDatasets.find(d => d.key === "site_scripts");
    if (ds) {
      setDatasetId(ds.id);
      setData((ds.data as ScriptData) || defaultData);
    }
  }, [initialDatasets]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      let saved: CmsDataset;
      const payload = {
        key: "site_scripts",
        label: "Site Meta Scripts",
        description: "Custom scripts for Head, Body, and Footer tags",
        data: data,
        sort_order: 1,
        is_published: true,
      };

      if (datasetId) {
        saved = await updateCmsDataset(datasetId, payload);
      } else {
        saved = await createCmsDataset(payload);
        setDatasetId(saved.id);
      }

      onDatasetsChange(
        datasetId
          ? initialDatasets.map((d) => (d.id === saved.id ? saved : d))
          : [...initialDatasets, saved]
      );
      setMessage("Scripts berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan scripts.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-alpha)] text-[var(--color-primary)] flex items-center justify-center">
          <Code size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold font-[var(--font-heading)] text-neutral-900 leading-tight">Meta Scripts</h1>
          <p className="text-sm text-neutral-500 mt-1">Kelola custom javascript seperti GTM, Facebook Pixel, Analytics, atau chat widget.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] hover:bg-red-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-red-900/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2">
          <AlertCircle size={16} />
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
            <h3 className="font-semibold text-neutral-800">&lt;head&gt; Scripts</h3>
            <p className="text-xs text-neutral-500 mt-1">Disisipkan tepat sebelum penutup tag &lt;/head&gt;. Cocok untuk Google Analytics atau GTM.</p>
          </div>
          <div className="p-4">
            <textarea
              value={data.head ?? ""}
              onChange={(e) => setData({ ...data, head: e.target.value })}
              className="w-full h-48 font-mono text-sm bg-neutral-900 text-emerald-400 p-4 rounded-xl border border-neutral-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              placeholder="<!-- Paste kode script head di sini -->"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
            <h3 className="font-semibold text-neutral-800">&lt;body&gt; Scripts (Start)</h3>
            <p className="text-xs text-neutral-500 mt-1">Disisipkan tepat setelah tag &lt;body&gt; dibuka. Cocok untuk GTM (noscript).</p>
          </div>
          <div className="p-4">
            <textarea
              value={data.body ?? ""}
              onChange={(e) => setData({ ...data, body: e.target.value })}
              className="w-full h-48 font-mono text-sm bg-neutral-900 text-emerald-400 p-4 rounded-xl border border-neutral-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              placeholder="<!-- Paste kode script body start di sini -->"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
            <h3 className="font-semibold text-neutral-800">Footer Scripts (End of body)</h3>
            <p className="text-xs text-neutral-500 mt-1">Disisipkan tepat sebelum penutup tag &lt;/body&gt;. Cocok untuk custom JS atau chat widget.</p>
          </div>
          <div className="p-4">
            <textarea
              value={data.footer ?? ""}
              onChange={(e) => setData({ ...data, footer: e.target.value })}
              className="w-full h-48 font-mono text-sm bg-neutral-900 text-emerald-400 p-4 rounded-xl border border-neutral-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
              placeholder="<!-- Paste kode script footer di sini -->"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
