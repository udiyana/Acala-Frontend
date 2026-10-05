import { useEffect, useState } from "react";
import {
  AlertCircle, BookOpen, CalendarCheck, CheckCircle2, Database,
  Eye, FileText, Globe2, Home, ImageIcon, LayoutDashboard,
  Phone, RefreshCw, TrendingUp, Utensils, BarChart3, Search
} from "lucide-react";
import { CmsContent, CmsDataset, fetchCmsAnalytics, CmsAnalyticsData } from "@/lib/cms";
import { CmsSection } from "@/components/cms/CmsLayout";

interface CmsOverviewProps {
  contents: CmsContent[];
  datasets: CmsDataset[];
  isLoading: boolean;
  onSectionChange: (section: CmsSection) => void;
  onRefresh: () => void;
}

const PAGE_CARDS = [
  { id: "home" as CmsSection,        label: "Home",        icon: Home,          color: "#db0e0f", path: "/" },
  { id: "about" as CmsSection,       label: "About",       icon: FileText,      color: "#47c1d9", path: "/about" },
  { id: "branches" as CmsSection,    label: "Location",    icon: Globe2,        color: "#f8b95e", path: "/branches" },
  { id: "menu" as CmsSection,        label: "Menu",        icon: Utensils,      color: "#db0e0f", path: "/menu" },
  { id: "gallery" as CmsSection,     label: "Gallery",     icon: ImageIcon,     color: "#47c1d9", path: "/gallery" },
  { id: "blog" as CmsSection,        label: "Blog",        icon: BookOpen,      color: "#f8b95e", path: "/blog" },
  { id: "contact" as CmsSection,     label: "Contact",     icon: Phone,         color: "#db0e0f", path: "/contact" },
  { id: "reservation" as CmsSection, label: "Reservation", icon: CalendarCheck, color: "#47c1d9", path: "/reservation" },
];


function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub: string; color: string;
}) {
  return (
    <div className="rounded-2xl p-5 border border-neutral-200 flex flex-col gap-4 hover:border-neutral-300 transition-colors bg-white shadow-sm shadow-neutral-100/50">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
          {icon}
        </div>
        <TrendingUp size={12} className="text-neutral-300" />
      </div>
      <div>
        <p className="text-3xl font-bold text-neutral-900 leading-none mb-1">{value}</p>
        <p className="text-xs font-semibold text-neutral-500">{label}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default function CmsOverview({ contents, datasets, isLoading, onSectionChange, onRefresh }: CmsOverviewProps) {
  const published  = contents.filter((c) => c.is_published).length;
  const drafts     = contents.length - published;
  const pubDatasets = datasets.filter((d) => d.is_published).length;

  const recent = [...contents]
    .sort((a, b) => new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime())
    .slice(0, 6);

  const [analyticsData, setAnalyticsData] = useState<CmsAnalyticsData | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsAnalyticsLoading(true);
    fetchCmsAnalytics()
      .then((data) => {
        if (active) setAnalyticsData(data);
      })
      .catch(() => {
        // Fallback or silent fail
      })
      .finally(() => {
        if (active) setIsAnalyticsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            Dashboard
          </h1>
          <p className="text-sm text-neutral-500">
            Ringkasan konten website Acala Bar &amp; Bistro
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-[var(--color-primary)] border border-[var(--color-primary)]/20 bg-white hover:bg-[var(--color-primary)]/5 transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<FileText size={17} color="#db0e0f" />}
          label="Total Konten" value={contents.length} sub="Semua halaman"
          color="#db0e0f"
        />
        <StatCard
          icon={<Eye size={17} color="#47c1d9" />}
          label="Published" value={published} sub="Tampil di frontend"
          color="#47c1d9"
        />
        <StatCard
          icon={<AlertCircle size={17} color="#f8b95e" />}
          label="Draft" value={drafts} sub="Belum dipublish"
          color="#f8b95e"
        />
        <StatCard
          icon={<Database size={17} color="#47c1d9" />}
          label="Datasets" value={`${pubDatasets}/${datasets.length}`} sub="Published / Total"
          color="#47c1d9"
        />
      </div>

      {/* ── Performance Analytics (Google Analytics & Search Console) ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-[1.5px]" style={{ fontFamily: "var(--font-body)" }}>
              Analisis Performa
            </h2>
            <p className="text-[11px] text-neutral-550 mt-0.5" style={{ color: "var(--color-neutral-500)" }}>Integrasi Google Analytics (GA4) &amp; Search Console (GSC)</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-600 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-sm">
              30 Hari Terakhir
            </span>
          </div>
        </div>

        {/* Analytics Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          {/* Card 1: Users */}
          <div className="rounded-2xl p-5 border border-neutral-200 bg-white shadow-sm shadow-neutral-100/50 flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">GA4 Users</p>
                {isAnalyticsLoading ? (
                  <div className="h-8 w-16 bg-neutral-100 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-neutral-850 mt-1">{analyticsData?.ga4.users.toLocaleString('id-ID')}</p>
                )}
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 flex items-center gap-0.5 border border-green-100">
                <TrendingUp size={8} /> {analyticsData?.ga4.usersTrend ?? '+0%'}
              </span>
            </div>
            {/* Sparkline */}
            <div className="h-10 w-full mt-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-teal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#47c1d9" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#47c1d9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,25 Q15,10 30,18 T60,8 T90,5 T100,2 L100,30 L0,30 Z" fill="url(#gradient-teal)" />
                <path d="M0,25 Q15,10 30,18 T60,8 T90,5 T100,2" fill="none" stroke="#47c1d9" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Card 2: Pageviews */}
          <div className="rounded-2xl p-5 border border-neutral-200 bg-white shadow-sm shadow-neutral-100/50 flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">GA4 Pageviews</p>
                {isAnalyticsLoading ? (
                  <div className="h-8 w-16 bg-neutral-100 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-neutral-850 mt-1">{analyticsData?.ga4.pageviews.toLocaleString('id-ID')}</p>
                )}
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 flex items-center gap-0.5 border border-green-100">
                <TrendingUp size={8} /> {analyticsData?.ga4.pageviewsTrend ?? '+0%'}
              </span>
            </div>
            {/* Sparkline */}
            <div className="h-10 w-full mt-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,28 Q15,20 30,22 T60,10 T90,8 T100,3 L100,30 L0,30 Z" fill="url(#gradient-teal)" />
                <path d="M0,28 Q15,20 30,22 T60,10 T90,8 T100,3" fill="none" stroke="#47c1d9" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Card 3: GSC Clicks */}
          <div className="rounded-2xl p-5 border border-neutral-200 bg-white shadow-sm shadow-neutral-100/50 flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">GSC Clicks</p>
                {isAnalyticsLoading ? (
                  <div className="h-8 w-16 bg-neutral-100 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-neutral-850 mt-1">{analyticsData?.gsc.clicks.toLocaleString('id-ID')}</p>
                )}
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 flex items-center gap-0.5 border border-green-100">
                <TrendingUp size={8} /> {analyticsData?.gsc.clicksTrend ?? '+0%'}
              </span>
            </div>
            {/* Sparkline */}
            <div className="h-10 w-full mt-2 overflow-hidden">
              <defs>
                <linearGradient id="gradient-red" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#db0e0f" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#db0e0f" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,22 Q15,15 30,12 T60,15 T90,5 T100,2 L100,30 L0,30 Z" fill="url(#gradient-red)" />
                <path d="M0,22 Q15,15 30,12 T60,15 T90,5 T100,2" fill="none" stroke="#db0e0f" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Card 4: GSC Impressions */}
          <div className="rounded-2xl p-5 border border-neutral-200 bg-white shadow-sm shadow-neutral-100/50 flex flex-col justify-between h-36">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">GSC Impressions</p>
                {isAnalyticsLoading ? (
                  <div className="h-8 w-16 bg-neutral-100 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-neutral-850 mt-1">{analyticsData?.gsc.impressions.toLocaleString('id-ID')}</p>
                )}
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 flex items-center gap-0.5 border border-green-100">
                <TrendingUp size={8} /> {analyticsData?.gsc.impressionsTrend ?? '+0%'}
              </span>
            </div>
            {/* Sparkline */}
            <div className="h-10 w-full mt-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,25 Q15,22 30,18 T60,20 T90,12 T100,6 L100,30 L0,30 Z" fill="url(#gradient-red)" />
                <path d="M0,25 Q15,22 30,18 T60,20 T90,12 T100,6" fill="none" stroke="#db0e0f" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {!analyticsData?.isConfigured && !isAnalyticsLoading && (
          <div className="bg-yellow-50 text-yellow-800 text-xs px-4 py-3 rounded-xl border border-yellow-100 mb-5 flex items-center gap-2">
            <AlertCircle size={14} />
            <span>Kredensial Service Account belum dikonfigurasi. Data di bawah ini adalah data dummy.</span>
          </div>
        )}

        {/* Detailed Grid: GA top pages vs GSC top queries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Pages (GA) */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm shadow-neutral-100/50">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={15} className="text-[var(--color-secondary)]" />
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Top Pages (Google Analytics)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-[10px] uppercase text-neutral-400 font-bold tracking-wider">
                    <th className="pb-2 font-bold">Halaman</th>
                    <th className="pb-2 text-right font-bold">Tampilan</th>
                    <th className="pb-2 text-right font-bold">Durasi Rerata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 text-xs">
                  {isAnalyticsLoading ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-neutral-400">Loading...</td>
                    </tr>
                  ) : analyticsData?.ga4.topPages.map((page, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium text-neutral-700">{page.path}</td>
                      <td className="py-2.5 text-right font-semibold text-neutral-850">{page.views.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 text-right text-neutral-500">{page.avgDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Queries (GSC) */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm shadow-neutral-100/50">
            <div className="flex items-center gap-2 mb-4">
              <Search size={14} className="text-[var(--color-primary)]" />
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Top Keywords (Search Console)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-[10px] uppercase text-neutral-400 font-bold tracking-wider">
                    <th className="pb-2 font-bold">Kata Kunci</th>
                    <th className="pb-2 text-right font-bold">Klik</th>
                    <th className="pb-2 text-right font-bold">Impresi</th>
                    <th className="pb-2 text-right font-bold">Posisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 text-xs">
                  {isAnalyticsLoading ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-neutral-400">Loading...</td>
                    </tr>
                  ) : analyticsData?.gsc.topKeywords.map((kw, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium text-neutral-700">{kw.keyword}</td>
                      <td className="py-2.5 text-right font-semibold text-neutral-850">{kw.clicks.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 text-right text-neutral-500">{kw.impressions.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 text-right text-neutral-500">{kw.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Page shortcuts */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-[1.5px] mb-4">Edit per Halaman</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          {PAGE_CARDS.map((page) => {
            const Icon = page.icon;
            const count = contents.filter((c) => c.page === page.id).length;
            const hasContent = count > 0;
            return (
              <button
                key={page.id}
                onClick={() => onSectionChange(page.id)}
                className="group text-left p-4 rounded-2xl border transition-all hover:-translate-y-0.5 bg-white shadow-sm shadow-neutral-100/50"
                style={{
                  background: hasContent ? `${page.color}05` : "#ffffff",
                  borderColor: hasContent ? `${page.color}15` : "rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${page.color}35`;
                  (e.currentTarget as HTMLButtonElement).style.background = `${page.color}0a`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = hasContent ? `${page.color}15` : "rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.background = hasContent ? `${page.color}05` : "#ffffff";
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon size={18} color={page.color} />
                  {hasContent
                    ? <CheckCircle2 size={13} color="#22c55e" />
                    : <div className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                  }
                </div>
                <p className="text-neutral-800 text-[13px] font-semibold">{page.label}</p>
                <p className="text-neutral-400 text-[11px] mt-0.5">{count} section{count !== 1 ? "s" : ""}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-[1.5px] mb-4">Baru Diperbarui</h2>
          <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm shadow-neutral-100/50">
            {recent.map((content, idx) => (
              <div key={content.id}
                className={`flex items-center gap-3 px-5 py-3.5 ${idx < recent.length - 1 ? "border-b border-neutral-100" : ""}`}>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${content.is_published ? "bg-green-500" : "bg-amber-500"}`} />
                <p className="text-[13px] text-neutral-850 font-medium flex-1 truncate">
                  {content.label ?? `${content.page}/${content.section}`}
                </p>
                <span className="text-[11px] text-neutral-400 flex-shrink-0">
                  {content.page} <span className="text-neutral-200">›</span> {content.section}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  content.is_published ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                }`}>
                  {content.is_published ? "Live" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {contents.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <LayoutDashboard size={40} className="mx-auto mb-4 text-neutral-200" />
          <p className="text-neutral-400 text-sm">Belum ada konten. Mulai dari halaman Home.</p>
        </div>
      )}
    </div>
  );
}
