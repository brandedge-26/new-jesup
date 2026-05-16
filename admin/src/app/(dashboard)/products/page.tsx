"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useProductsStore } from "@/store/adminStore";
import type { Product, ProductStatus, Variant, Specification } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 8;
const CATS = ["All", "Audio", "Cases", "Power", "Accessories", "Screen Protection"];

const CAT_COLOR: Record<string, string> = {
  Audio:              "bg-violet-100 text-violet-700",
  Cases:              "bg-rose-100   text-rose-700",
  Power:              "bg-amber-100  text-amber-700",
  Accessories:        "bg-emerald-100 text-emerald-700",
  "Screen Protection":"bg-blue-100   text-blue-700",
};

// ── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({ product, onConfirm, onCancel }: {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-base font-bold text-gray-900 text-center">Delete Product?</h3>
        <p className="text-sm text-gray-500 text-center mt-1">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">{product.name}</span>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

interface VariantRow { name: string; optionsStr: string }
interface SpecRow    { key: string;  value: string }

const FIELD = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

function readFile(file: File): Promise<string> {
  return new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(file); });
}

function EditImageSlot({ value, onChange, onClear, tall }: { value: string; onChange: (v: string) => void; onClear: () => void; tall?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const h = tall ? "h-28" : "h-16";
  return (
    <div className="relative group">
      {value ? (
        <div className={`relative w-full ${h} rounded-lg overflow-hidden border border-gray-200 bg-gray-50`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-contain" />
          <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100`}>
            <button type="button" onClick={() => ref.current?.click()} className="p-1 rounded bg-white/90 text-gray-700 text-[10px] font-semibold">Replace</button>
            <button type="button" onClick={onClear} className="p-1 rounded bg-red-500 text-white text-[10px] font-semibold">Remove</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} className={`w-full ${h} rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-primary/40 hover:text-primary/40 transition-colors`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {tall && <span className="text-[10px] font-medium">Upload</span>}
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) onChange(await readFile(f)); e.target.value = ""; }} />
    </div>
  );
}

function EditModal({ product, onSave, onCancel }: {
  product: Product;
  onSave: (updates: Partial<Omit<Product, "id">>) => void;
  onCancel: () => void;
}) {
  const [name,     setName]     = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price,    setPrice]    = useState(String(product.price));
  const [stock,    setStock]    = useState(String(product.stock));
  const [status,   setStatus]   = useState<ProductStatus>(product.status);
  const [brand,    setBrand]    = useState(product.brand ?? "");
  const [company,  setCompany]  = useState(product.company ?? "");
  const [image,    setImage]    = useState(product.image ?? "");

  // 4 variant image slots
  const [variantImages, setVariantImages] = useState<string[]>(() => {
    const base = product.variantImages ?? [];
    return [...base, "", "", "", ""].slice(0, 4);
  });
  function setVI(i: number, url: string) { setVariantImages((v) => v.map((x, idx) => idx === i ? url : x)); }

  const [variants, setVariants] = useState<VariantRow[]>(
    product.variants?.length
      ? product.variants.map((v) => ({ name: v.name, optionsStr: v.options.map((o) => o.label).join(", ") }))
      : [{ name: "Color", optionsStr: "" }]
  );
  const [specs, setSpecs] = useState<SpecRow[]>(
    product.specifications?.length
      ? product.specifications.map((s) => ({ key: s.key, value: s.value }))
      : [{ key: "", value: "" }]
  );

  function addVariant()             { setVariants((v) => [...v, { name: "", optionsStr: "" }]); }
  function removeVariant(i: number) { setVariants((v) => v.filter((_, idx) => idx !== i)); }
  function setVField(i: number, field: keyof VariantRow, val: string) { setVariants((v) => v.map((r, idx) => idx === i ? { ...r, [field]: val } : r)); }

  function addSpec()             { setSpecs((s) => [...s, { key: "", value: "" }]); }
  function removeSpec(i: number) { setSpecs((s) => s.filter((_, idx) => idx !== i)); }
  function setSField(i: number, field: keyof SpecRow, val: string) { setSpecs((s) => s.map((r, idx) => idx === i ? { ...r, [field]: val } : r)); }

  function handleSave() {
    if (!name.trim()) return;
    const parsedVariants: Variant[] = variants
      .filter((v) => v.name.trim())
      .map((v) => ({ name: v.name.trim(), options: v.optionsStr.split(",").map((o) => o.trim()).filter(Boolean).map((label) => ({ label })) }));
    const parsedSpecs: Specification[] = specs.filter((s) => s.key.trim()).map((s) => ({ key: s.key.trim(), value: s.value.trim() }));
    onSave({ name: name.trim(), category, price: parseFloat(price) || 0, stock: parseInt(stock) || 0, sku: product.sku, status, brand: brand.trim(), company: company.trim(), image, variantImages: variantImages.filter(Boolean), variants: parsedVariants, specifications: parsedSpecs });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-bold text-gray-900">Edit Product</h3>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

          {/* Basic */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Basic</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={FIELD} placeholder="Product name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${FIELD} bg-white cursor-pointer`}>
                    {CATS.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className={`${FIELD} bg-white cursor-pointer`}>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price ($)</label>
                  <input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(e.target.value)} className={FIELD} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock</label>
                  <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className={FIELD} />
                </div>
              </div>
            </div>
          </section>

          {/* Brand & Company */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Brand & Company</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand</label>
                <input value={brand} onChange={(e) => setBrand(e.target.value)} className={FIELD} placeholder="e.g. JBL" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Company</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} className={FIELD} placeholder="e.g. HARMAN International" />
              </div>
            </div>
          </section>

          {/* Media */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Media</p>
            <EditImageSlot value={image} onChange={setImage} onClear={() => setImage("")} tall />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <EditImageSlot key={i} value={variantImages[i] ?? ""} onChange={(url) => setVI(i, url)} onClear={() => setVI(i, "")} />
              ))}
            </div>
          </section>

          {/* Variants */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Variants</p>
              <button type="button" onClick={addVariant} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add
              </button>
            </div>
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={v.name} onChange={(e) => setVField(i, "name", e.target.value)} placeholder="Type (e.g. Color)" className={`${FIELD} flex-1`} />
                  <input value={v.optionsStr} onChange={(e) => setVField(i, "optionsStr", e.target.value)} placeholder="Options (e.g. Black, Blue, Red)" className={`${FIELD} flex-[2]`} />
                  <button type="button" onClick={() => removeVariant(i)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {variants.length === 0 && <p className="text-xs text-gray-400">No variants.</p>}
            </div>
          </section>

          {/* Specifications */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Specifications</p>
              <button type="button" onClick={addSpec} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s.key}   onChange={(e) => setSField(i, "key",   e.target.value)} placeholder="Key"   className={`${FIELD} flex-1`} />
                  <input value={s.value} onChange={(e) => setSField(i, "value", e.target.value)} placeholder="Value" className={`${FIELD} flex-1`} />
                  <button type="button" onClick={() => removeSpec(i)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {specs.length === 0 && <p className="text-xs text-gray-400">No specifications.</p>}
            </div>
          </section>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const { products, deleteProduct, updateProduct } = useProductsStore();

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [statusF,  setStatusF]  = useState<ProductStatus | "All">("All");
  const [page,     setPage]     = useState(1);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editTarget,   setEditTarget]   = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let data = products;
    if (category !== "All") data = data.filter((p) => p.category === category);
    if (statusF  !== "All") data = data.filter((p) => p.status   === statusF);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return data;
  }, [products, search, category, statusF]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetPage() { setPage(1); }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Products</h1>
            <p className="text-xs text-gray-400 mt-0.5">{products.length} products in catalog</p>
          </div>
          <Link
            href="/products/add"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b border-gray-100">
            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCategory(c); resetPage(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    category === c ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              {/* Status */}
              <select
                value={statusF}
                onChange={(e) => { setStatusF(e.target.value as ProductStatus | "All"); resetPage(); }}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer"
              >
                {["All", "Active", "Draft", "Out of Stock"].map((s) => (
                  <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>
                ))}
              </select>

              {/* Search */}
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-40"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400">Product</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400">Price</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 hidden md:table-cell">Stock</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 hidden lg:table-cell">Revenue</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400">Status</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                      No products match your filters.
                    </td>
                  </tr>
                ) : (
                  pageData.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${CAT_COLOR[p.category] ?? "bg-gray-100 text-gray-600"}`}>
                            {p.category[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate max-w-[160px]">{p.name}</p>
                            <p className="text-[11px] text-gray-400">{p.id} · {p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${CAT_COLOR[p.category] ?? "bg-gray-100 text-gray-600"}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-800">${p.price.toFixed(2)}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs font-semibold ${p.stock === 0 ? "text-red-500" : p.stock < 20 ? "text-amber-500" : "text-gray-700"}`}>
                          {p.stock} {p.stock > 0 && p.stock < 20 && <span className="text-[10px] text-amber-500">(low)</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-600 hidden lg:table-cell">
                        ${p.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditTarget(p)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 px-4">
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onPage={setPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={() => { deleteProduct(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          product={editTarget}
          onSave={(updates) => { updateProduct(editTarget.id, updates); setEditTarget(null); }}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </>
  );
}
