import { ReactNode, useState } from "react";
import {
  BookOpen, CalendarCheck, ChevronRight, Database, FileText,
  Home, ImageIcon, LayoutDashboard, LogOut, MapPin, Menu, Phone, Utensils, X, ExternalLink, Code,
} from "lucide-react";
import { CmsUser } from "@/lib/cms";

export type CmsSection =
  | "overview" | "home" | "about" | "branches" | "branch-nusa-dua" | "branch-nusa-lembongan" | "menu"
  | "gallery" | "blog" | "contact" | "reservation" | "datasets" | "scripts";

interface NavItem {
  id: CmsSection;
  label: string;
  icon: typeof LayoutDashboard;
  group: "pages" | "data";
}

const NAV: NavItem[] = [
  { id: "overview",    label: "Dashboard",   icon: LayoutDashboard, group: "pages" },
  { id: "home",        label: "Home",         icon: Home,            group: "pages" },
  { id: "about",       label: "About",        icon: FileText,        group: "pages" },
  { id: "branches",    label: "Location",     icon: MapPin,          group: "pages" },
  { id: "branch-nusa-dua", label: "Nusa Dua", icon: MapPin,          group: "pages" },
  { id: "branch-nusa-lembongan", label: "Lembongan", icon: MapPin,   group: "pages" },
  { id: "menu",        label: "Menu",         icon: Utensils,        group: "pages" },
  { id: "gallery",     label: "Gallery",      icon: ImageIcon,       group: "pages" },
  { id: "blog",        label: "Blog",         icon: BookOpen,        group: "pages" },
  { id: "contact",     label: "Contact",      icon: Phone,           group: "pages" },
  { id: "reservation", label: "Reservation",  icon: CalendarCheck,   group: "data"  },
  { id: "datasets",    label: "Datasets",     icon: Database,        group: "data"  },
  { id: "scripts",     label: "Meta Scripts", icon: Code,            group: "data"  },
];

interface CmsLayoutProps {
  user: CmsUser;
  activeSection: CmsSection;
  onSectionChange: (s: CmsSection) => void;
  onLogout: () => void;
  children?: ReactNode;
}

function NavButton({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 relative ${
        isActive
          ? "text-[var(--color-primary)] bg-[var(--color-primary-alpha)]"
          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[var(--color-primary)]" />
      )}
      <Icon size={15} className={`flex-shrink-0 ${isActive ? "text-[var(--color-primary)]" : "text-neutral-400 group-hover:text-neutral-500"}`} />
      <span className="flex-1 text-left">{item.label}</span>
      {isActive && <ChevronRight size={12} className="opacity-45" />}
    </button>
  );
}

function Sidebar({ user, activeSection, onSectionChange, onLogout, onClose }: CmsLayoutProps & { onClose?: () => void }) {
  const pages = NAV.filter((n) => n.group === "pages");
  const data  = NAV.filter((n) => n.group === "data");

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-neutral-100 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
          style={{ background: "var(--color-primary-alpha)", border: "1px solid rgba(219, 14, 15, 0.2)" }}>
          ⚡
        </div>
        <div>
          <p className="text-neutral-900 text-[13px] font-bold tracking-tight leading-none">Acala CMS</p>
          <p className="text-[var(--color-primary)] text-[10px] font-bold mt-1 uppercase tracking-wider">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-neutral-400 hover:text-neutral-600 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" style={{ scrollbarWidth: "none" }}>
        {/* Pages */}
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[1.5px] px-3 pt-1 pb-2">Halaman</p>
        {pages.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeSection === item.id}
            onClick={() => { onSectionChange(item.id); onClose?.(); }}
          />
        ))}

        {/* Data */}
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[1.5px] px-3 pt-4 pb-2">Data</p>
        {data.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeSection === item.id}
            onClick={() => { onSectionChange(item.id); onClose?.(); }}
          />
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-neutral-100 flex-shrink-0 space-y-2.5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-neutral-100 bg-neutral-50/50">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-tertiary))" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-neutral-900 text-[12px] font-semibold truncate leading-tight">{user.name}</p>
            <p className="text-neutral-400 text-[10px] truncate mt-0.5">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[12px] font-semibold text-red-650 border border-red-200 bg-white hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function CmsLayout({ user, activeSection, onSectionChange, onLogout, children }: CmsLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeLabel = NAV.find((n) => n.id === activeSection)?.label ?? activeSection;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f8f9fa" }}>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0 border-r border-neutral-200">
        <Sidebar user={user} activeSection={activeSection} onSectionChange={onSectionChange} onLogout={onLogout} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} />
      )}

      {/* Mobile sidebar */}
      <aside
        className="fixed top-0 left-0 bottom-0 z-50 w-[240px] md:hidden flex flex-col border-r border-neutral-200 transition-transform duration-250"
        style={{ transform: mobileOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        <Sidebar user={user} activeSection={activeSection} onSectionChange={onSectionChange} onLogout={onLogout} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-6 h-14 flex-shrink-0 border-b border-neutral-200 bg-white shadow-sm shadow-neutral-100/50">
          <button className="md:hidden text-neutral-500 hover:text-neutral-800 transition-colors"
            onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-400 font-medium">CMS</span>
            <span className="text-neutral-300">/</span>
            <span className="font-bold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-heading)" }}>{activeLabel}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] font-semibold px-3 py-1.5 rounded-lg border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/5 transition-all"
            >
              <ExternalLink size={11} />
              Frontend
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ background: "#FAF6F0" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
