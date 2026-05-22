"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { adminAxios } from "@/lib/axios";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────

type ProductStatus = "Active" | "Draft" | "Out of Stock";
type FeaturedType  = "none" | "trending" | "new-arrival";

interface VariantOption { label: string }
interface Variant       { name: string; options: VariantOption[] }
interface Specification { key: string;  value: string }

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  company: string;
  price: number;
  originalPrice?: number;
  stock: number;
  revenue: number;
  rating: number;
  reviews: number;
  badge: string;
  status: ProductStatus;
  inStock: boolean;
  featured: FeaturedType;
  image: string;
  variantImages: string[];
  variants: Variant[];
  specifications: Specification[];
  createdAt: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;
const CATS = ["All", "Audio", "Cases", "Power", "Accessories", "Screen Protection", "Devices"];

const CAT_COLOR: Record<string, string> = {
  Audio:              "bg-violet-100 text-violet-700",
  Cases:              "bg-rose-100   text-rose-700",
  Power:              "bg-amber-100  text-amber-700",
  Accessories:        "bg-emerald-100 text-emerald-700",
  "Screen Protection":"bg-blue-100   text-blue-700",
};

const FEATURED_BADGE: Record<FeaturedType, { label: string; cls: string } | null> = {
  none:         null,
  trending:     { label: "🔥 Trending",   cls: "bg-amber-100 text-amber-700" },
  "new-arrival":{ label: "✨ New Arrival", cls: "bg-primary/10 text-primary"  },
};

const FIELD = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-primary" : "bg-gray-200"}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({ name, onConfirm, onCancel, loading }: {
  name: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-900 text-center">Delete Product?</h3>
        <p className="text-sm text-gray-500 text-center mt-1">
          <span className="font-semibold text-gray-700">{name}</span> will be permanently deleted.
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

interface VariantRow { name: string; optionsStr: string }
interface SpecRow    { key: string;  value: string }

function readFile(file: File): Promise<string> {
  return new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(file); });
}

function ImageSlot({ value, onChange, onClear, tall }: {
  value: string; onChange: (v: string) => void; onClear: () => void; tall?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const h = tall ? "h-28" : "h-16";
  return (
    <div className="relative group">
      {value ? (
        <div className={`relative w-full ${h} rounded-lg overflow-hidden border border-gray-200 bg-gray-50`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => ref.current?.click()} className="p-1 rounded bg-white/90 text-gray-700 text-[10px] font-semibold">Replace</button>
            <button type="button" onClick={onClear} className="p-1 rounded bg-red-500 text-white text-[10px] font-semibold">Remove</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()}
          className={`w-full ${h} rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-primary/40 hover:text-primary/40 transition-colors`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {tall && <span className="text-[10px] font-medium">Upload</span>}
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={async (e) => { const f = e.target.files?.[0]; if (f) onChange(await readFile(f)); e.target.value = ""; }} />
    </div>
  );
}

function EditModal({ product, onSave, onCancel }: {
  product: Product;
  onSave: (updates: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}) {
  const [name,     setName]     = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [brand,    setBrand]    = useState(product.brand ?? "");
  const [price,    setPrice]    = useState(String(product.price));
  const [origPrice,setOrigPrice]= useState(String(product.originalPrice ?? ""));
  const [stock,    setStock]    = useState(String(product.stock));
  const [status,   setStatus]   = useState<ProductStatus>(product.status);
  const [inStock,  setInStock]  = useState(product.inStock ?? true);
  const [featured, setFeatured] = useState<FeaturedType>(product.featured ?? "none");
  const [rating,   setRating]   = useState(String(product.rating ?? 4.5));
  const [reviews,  setReviews]  = useState(String(product.reviews ?? 0));
  const [badge,    setBadge]    = useState(product.badge ?? "");
  const [image,    setImage]    = useState(product.image ?? "");
  const [variantImages, setVI]  = useState<string[]>(() => [...(product.variantImages ?? []), "", "", "", ""].slice(0, 4));
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
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    const parsedVariants: Variant[] = variants.filter((v) => v.name.trim())
      .map((v) => ({ name: v.name.trim(), options: v.optionsStr.split(",").map((o) => o.trim()).filter(Boolean).map((label) => ({ label })) }));
    const parsedSpecs: Specification[] = specs.filter((s) => s.key.trim())
      .map((s) => ({ key: s.key.trim(), value: s.value.trim() }));
    await onSave({
      name: name.trim(), category, brand: brand.trim(),
      price: parseFloat(price) || 0,
      originalPrice: origPrice ? parseFloat(origPrice) : undefined,
      stock: parseInt(stock) || 0,
      status: !inStock ? "Out of Stock" : status,
      inStock, featured,
      rating: parseFloat(rating) || 4.5,
      reviews: parseInt(reviews) || 0,
      badge,
      image, variantImages: variantImages.filter(Boolean),
      variants: parsedVariants, specifications: parsedSpecs,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-bold text-gray-900">Edit Product</h3>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
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
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand</label>
                  <input value={brand} onChange={(e) => setBrand(e.target.value)} className={FIELD} placeholder="e.g. JBL" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price ($)</label>
                  <input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(e.target.value)} className={FIELD} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Original Price ($)</label>
                  <input type="number" min={0} step={0.01} value={origPrice} onChange={(e) => setOrigPrice(e.target.value)} className={FIELD} placeholder="Optional" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock</label>
                  <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className={FIELD} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rating / Reviews</label>
                  <div className="flex gap-2">
                    <input type="number" min={0} max={5} step={0.1} value={rating} onChange={(e) => setRating(e.target.value)} className={FIELD} placeholder="4.5" />
                    <input type="number" min={0} value={reviews} onChange={(e) => setReviews(e.target.value)} className={FIELD} placeholder="0" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Status & Featured */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Status & Featured</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">In Stock</p>
                  <p className="text-xs text-gray-400">{inStock ? "Available for purchase" : "Out of Stock"}</p>
                </div>
                <Toggle checked={inStock} onChange={setInStock} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className={`${FIELD} bg-white cursor-pointer`}>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Badge</label>
                  <select value={badge} onChange={(e) => setBadge(e.target.value)} className={`${FIELD} bg-white cursor-pointer`}>
                    {["", "Best Seller", "Top Rated", "New", "Sale", "Limited"].map((b) => <option key={b} value={b}>{b || "— None —"}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Featured Section</label>
                <select value={featured} onChange={(e) => setFeatured(e.target.value as FeaturedType)} className={`${FIELD} bg-white cursor-pointer`}>
                  <option value="none">None</option>
                  <option value="trending">🔥 Trending Now</option>
                  <option value="new-arrival">✨ New Arrivals</option>
                </select>
              </div>
            </div>
          </section>

          {/* Media */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Media</p>
            <ImageSlot value={image} onChange={setImage} onClear={() => setImage("")} tall />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <ImageSlot key={i} value={variantImages[i] ?? ""} onChange={(url) => setVI((v) => v.map((x, idx) => idx === i ? url : x))} onClear={() => setVI((v) => v.map((x, idx) => idx === i ? "" : x))} />
              ))}
            </div>
          </section>

          {/* Variants */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Variants</p>
              <button type="button" onClick={() => setVariants((v) => [...v, { name: "", optionsStr: "" }])}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> Add
              </button>
            </div>
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={v.name} onChange={(e) => setVariants((vv) => vv.map((r, idx) => idx === i ? { ...r, name: e.target.value } : r))} placeholder="Type" className={`${FIELD} flex-1`} />
                  <input value={v.optionsStr} onChange={(e) => setVariants((vv) => vv.map((r, idx) => idx === i ? { ...r, optionsStr: e.target.value } : r))} placeholder="Options (comma separated)" className={`${FIELD} flex-[2]`} />
                  <button type="button" onClick={() => setVariants((vv) => vv.filter((_, idx) => idx !== i))} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Specifications */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Specifications</p>
              <button type="button" onClick={() => setSpecs((s) => [...s, { key: "", value: "" }])}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> Add
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s.key}   onChange={(e) => setSpecs((ss) => ss.map((r, idx) => idx === i ? { ...r, key:   e.target.value } : r))} placeholder="Key"   className={`${FIELD} flex-1`} />
                  <input value={s.value} onChange={(e) => setSpecs((ss) => ss.map((r, idx) => idx === i ? { ...r, value: e.target.value } : r))} placeholder="Value" className={`${FIELD} flex-1`} />
                  <button type="button" onClick={() => setSpecs((ss) => ss.filter((_, idx) => idx !== i))} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products,     setProducts]     = useState<Product[]>([]);
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [statusF,  setStatusF]  = useState<ProductStatus | "All">("All");
  const [page,     setPage]     = useState(1);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteLoading,setDeleteLoading]= useState(false);
  const [editTarget,   setEditTarget]   = useState<Product | null>(null);

  const fetchProducts = useCallback(async (p = page) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.set("category", category);
      if (statusF  !== "All") params.set("status",   statusF);
      if (search)             params.set("search",   search);
      params.set("page",  String(p));
      params.set("limit", String(PAGE_SIZE));

      const res = await adminAxios.get(`/products?${params}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load products. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [category, statusF, search, page]);

  useEffect(() => { fetchProducts(1); setPage(1); }, [category, statusF]); // eslint-disable-line
  useEffect(() => { fetchProducts(page); }, [page]); // eslint-disable-line

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { fetchProducts(1); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line

  async function handleDelete(id: string) {
    setDeleteLoading(true);
    try {
      await adminAxios.delete(`/products/${id}`);
      setDeleteTarget(null);
      fetchProducts(page);
    } catch {
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleEdit(id: string, updates: Partial<Product>) {
    await adminAxios.put(`/products/${id}`, updates);
    setEditTarget(null);
    fetchProducts(page);
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Products</h1>
            <p className="text-xs text-gray-400 mt-0.5">{total} products in catalog</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchProducts(page)}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition-colors" title="Refresh">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <Link href="/products/add"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b border-gray-100">
            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {CATS.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${category === c ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <select value={statusF} onChange={(e) => setStatusF(e.target.value as ProductStatus | "All")}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer">
                {["All", "Active", "Draft", "Out of Stock"].map((s) => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
              </select>
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input type="text" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-40" />
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
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 hidden lg:table-cell">Featured</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400">Status</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className="w-8 h-8 bg-gray-200 rounded-lg" /><div className="space-y-1.5"><div className="h-2.5 w-32 bg-gray-200 rounded" /><div className="h-2 w-20 bg-gray-200 rounded" /></div></div></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-2.5 w-16 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-2.5 w-12 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-2.5 w-10 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-2.5 w-20 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="flex justify-end gap-1"><div className="h-7 w-14 bg-gray-200 rounded-lg" /><div className="h-7 w-16 bg-gray-200 rounded-lg" /></div></td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                      {error ? "Error loading products." : "No products found."}
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const featuredBadge = FEATURED_BADGE[p.featured ?? "none"];
                    return (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {p.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" />
                            ) : (
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${CAT_COLOR[p.category] ?? "bg-gray-100 text-gray-600"}`}>
                                {p.category?.[0]}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-800 truncate max-w-[160px]">{p.name}</p>
                              <p className="text-[11px] text-gray-400">{p.sku} · {p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${CAT_COLOR[p.category] ?? "bg-gray-100 text-gray-600"}`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold text-gray-800">${p.price.toFixed(2)}</p>
                          {p.originalPrice && <p className="text-[11px] text-gray-400 line-through">${p.originalPrice.toFixed(2)}</p>}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs font-semibold ${p.stock === 0 ? "text-red-500" : p.stock < 20 ? "text-amber-500" : "text-gray-700"}`}>
                            {p.stock}{p.stock > 0 && p.stock < 20 && <span className="text-[10px] text-amber-500 ml-1">(low)</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {featuredBadge ? (
                            <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${featuredBadge.cls}`}>{featuredBadge.label}</span>
                          ) : (
                            <span className="text-[11px] text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setEditTarget(p)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary transition-colors">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              Edit
                            </button>
                            <button onClick={() => setDeleteTarget(p)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 px-4">
            <Pagination page={page} totalPages={totalPages} onPage={setPage} totalItems={total} pageSize={PAGE_SIZE} />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          loading={deleteLoading}
          onConfirm={() => handleDelete(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          product={editTarget}
          onSave={(updates) => handleEdit(editTarget._id, updates)}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </>
  );
}
