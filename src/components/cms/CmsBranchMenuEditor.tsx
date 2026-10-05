import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  isMarketPrice?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface Branch {
  slug: string;
  name: string;
  fullMenu: MenuCategory[];
  [key: string]: any;
}

interface Props {
  branches: Branch[];
  onChange: (branches: Branch[]) => void;
}

export default function CmsBranchMenuEditor({ branches, onChange }: Props) {
  const [activeBranch, setActiveBranch] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  if (!branches || !Array.isArray(branches) || branches.length === 0) {
    return <div className="text-sm text-neutral-500 p-4">Format data branches tidak valid.</div>;
  }

  const branch = branches[activeBranch];
  if (!branch) return null;

  const handleUpdateBranchMenu = (newFullMenu: MenuCategory[]) => {
    const newBranches = [...branches];
    newBranches[activeBranch] = { ...branch, fullMenu: newFullMenu };
    onChange(newBranches);
  };

  const handleAddCategory = () => {
    const newMenu = [...(branch.fullMenu || [])];
    newMenu.push({
      id: `category-${Date.now()}`,
      name: "New Category",
      items: [],
    });
    handleUpdateBranchMenu(newMenu);
    setActiveCategory(newMenu.length - 1);
  };

  const handleUpdateCategory = (catIndex: number, field: keyof MenuCategory, value: any) => {
    const newMenu = [...(branch.fullMenu || [])];
    newMenu[catIndex] = { ...newMenu[catIndex], [field]: value };
    handleUpdateBranchMenu(newMenu);
  };

  const handleDeleteCategory = (catIndex: number) => {
    if (!confirm("Hapus kategori ini beserta seluruh menunya?")) return;
    const newMenu = [...(branch.fullMenu || [])];
    newMenu.splice(catIndex, 1);
    handleUpdateBranchMenu(newMenu);
    setActiveCategory(null);
  };

  const handleAddItem = (catIndex: number) => {
    const newMenu = [...(branch.fullMenu || [])];
    newMenu[catIndex].items.push({
      name: "New Item",
      description: "",
      price: "0k",
    });
    handleUpdateBranchMenu(newMenu);
  };

  const handleUpdateItem = (catIndex: number, itemIndex: number, field: keyof MenuItem, value: any) => {
    const newMenu = [...(branch.fullMenu || [])];
    newMenu[catIndex].items[itemIndex] = { ...newMenu[catIndex].items[itemIndex], [field]: value };
    handleUpdateBranchMenu(newMenu);
  };

  const handleDeleteItem = (catIndex: number, itemIndex: number) => {
    const newMenu = [...(branch.fullMenu || [])];
    newMenu[catIndex].items.splice(itemIndex, 1);
    handleUpdateBranchMenu(newMenu);
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === (branch.fullMenu || []).length - 1) return;
    
    const newMenu = [...(branch.fullMenu || [])];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newMenu[index], newMenu[swapIndex]] = [newMenu[swapIndex], newMenu[index]];
    
    if (activeCategory === index) setActiveCategory(swapIndex);
    else if (activeCategory === swapIndex) setActiveCategory(index);
    
    handleUpdateBranchMenu(newMenu);
  };
  
  const moveItem = (catIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    if (direction === 'up' && itemIndex === 0) return;
    if (direction === 'down' && itemIndex === branch.fullMenu[catIndex].items.length - 1) return;
    
    const newMenu = [...(branch.fullMenu || [])];
    const swapIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    [newMenu[catIndex].items[itemIndex], newMenu[catIndex].items[swapIndex]] = [newMenu[catIndex].items[swapIndex], newMenu[catIndex].items[itemIndex]];
    
    handleUpdateBranchMenu(newMenu);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="flex items-center gap-2 p-3 bg-neutral-50 border-b border-neutral-200 overflow-x-auto">
        {branches.map((b, idx) => (
          <button
            key={b.slug || idx}
            type="button"
            onClick={() => { setActiveBranch(idx); setActiveCategory(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
              activeBranch === idx 
                ? "bg-[var(--color-primary)] text-white shadow-sm" 
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
            }`}
          >
            Menu {b.name}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-neutral-200 bg-neutral-50/50 flex flex-col">
          <div className="p-3 border-b border-neutral-200 flex items-center justify-between bg-white">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Kategori Menu</span>
            <button
              type="button"
              onClick={handleAddCategory}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition-colors"
              title="Tambah Kategori"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {(branch.fullMenu || []).map((cat, idx) => (
              <div
                key={cat.id || idx}
                className={`flex flex-col rounded-lg border transition-all overflow-hidden ${
                  activeCategory === idx 
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-alpha,rgba(255,116,72,0.1))]" 
                    : "border-transparent hover:border-neutral-200 hover:bg-white"
                }`}
              >
                <div 
                  className="flex items-center gap-2 p-2 cursor-pointer group"
                  onClick={() => setActiveCategory(idx)}
                >
                  <div className="flex flex-col gap-0.5 opacity-30 group-hover:opacity-100">
                    <button type="button" onClick={(e) => { e.stopPropagation(); moveCategory(idx, 'up'); }} className="hover:text-[var(--color-primary)]" disabled={idx===0}>▲</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); moveCategory(idx, 'down'); }} className="hover:text-[var(--color-primary)]" disabled={idx===(branch.fullMenu||[]).length-1}>▼</button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${activeCategory === idx ? "text-[var(--color-primary)]" : "text-neutral-700"}`}>
                      {cat.name || "Unnamed Category"}
                    </p>
                    <p className="text-[10px] text-neutral-400">{cat.items?.length || 0} items</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(idx); }}
                    className={`p-1.5 rounded-md transition-colors ${activeCategory === idx ? "text-red-500 hover:bg-red-50" : "text-neutral-400 hover:text-red-500 hover:bg-neutral-100 opacity-0 group-hover:opacity-100"}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {(!branch.fullMenu || branch.fullMenu.length === 0) && (
              <div className="text-center py-8 opacity-50">
                <p className="text-xs font-semibold">Belum ada kategori</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {activeCategory !== null && branch.fullMenu && branch.fullMenu[activeCategory] ? (
            <>
              <div className="p-4 border-b border-neutral-200 flex items-end gap-3 bg-neutral-50/50">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Edit Kategori</label>
                  <input
                    value={branch.fullMenu[activeCategory].name}
                    onChange={(e) => handleUpdateCategory(activeCategory, "name", e.target.value)}
                    className="w-full px-3 py-2 text-sm font-bold text-neutral-800 rounded-lg border border-neutral-200 outline-none focus:border-[var(--color-primary)] transition-all bg-white"
                    placeholder="Nama Kategori (contoh: Appetizer)"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">ID</label>
                  <input
                    value={branch.fullMenu[activeCategory].id}
                    onChange={(e) => handleUpdateCategory(activeCategory, "id", e.target.value)}
                    className="w-full px-3 py-2 text-sm text-neutral-600 rounded-lg border border-neutral-200 outline-none focus:border-[var(--color-primary)] bg-neutral-100"
                    placeholder="kategori-id"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Daftar Menu Makanan/Minuman</span>
                  <button
                    type="button"
                    onClick={() => handleAddItem(activeCategory)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg text-xs font-semibold transition-opacity shadow-sm"
                  >
                    <Plus size={14} /> Tambah Menu
                  </button>
                </div>

                {(branch.fullMenu[activeCategory].items || []).map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-3 shadow-sm flex gap-3 group">
                    <div className="flex flex-col gap-1 items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => moveItem(activeCategory, idx, 'up')} disabled={idx===0} className="hover:text-[var(--color-primary)]">▲</button>
                      <button type="button" onClick={() => moveItem(activeCategory, idx, 'down')} disabled={idx===branch.fullMenu[activeCategory].items.length-1} className="hover:text-[var(--color-primary)]">▼</button>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Nama Menu</label>
                          <input
                            value={item.name}
                            onChange={(e) => handleUpdateItem(activeCategory, idx, "name", e.target.value)}
                            className="w-full px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg border border-neutral-200 outline-none focus:border-[var(--color-primary)] transition-colors"
                            placeholder="Tuna Salad..."
                          />
                        </div>
                        <div className="w-28">
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Harga</label>
                          <input
                            value={item.price}
                            onChange={(e) => handleUpdateItem(activeCategory, idx, "price", e.target.value)}
                            className="w-full px-3 py-2 text-sm font-semibold text-neutral-800 rounded-lg border border-neutral-200 outline-none focus:border-[var(--color-primary)] transition-colors"
                            placeholder="69k"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Deskripsi</label>
                        <input
                          value={item.description}
                          onChange={(e) => handleUpdateItem(activeCategory, idx, "description", e.target.value)}
                          className="w-full px-3 py-2 text-sm text-neutral-600 rounded-lg border border-neutral-200 outline-none focus:border-[var(--color-primary)] transition-colors"
                          placeholder="Bahan-bahan..."
                        />
                      </div>
                    </div>
                    <div className="flex items-start pt-5">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(activeCategory, idx)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!branch.fullMenu[activeCategory].items || branch.fullMenu[activeCategory].items.length === 0) && (
                  <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl">
                    <p className="text-sm font-semibold text-neutral-400">Belum ada menu di kategori ini</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-3">
              <UtensilsIcon size={48} />
              <p className="text-sm font-semibold">Pilih atau buat kategori menu di sebelah kiri</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const UtensilsIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
);
