"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, COLOR_HEX, type Product } from "@/lib/collectionData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${cls} ${s <= Math.round(rating) ? "fill-amber-400" : "fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "Top Rated":   "bg-emerald-500 text-white",
  "Sale":        "bg-red-500 text-white",
  "New":         "bg-primary text-white",
  "Limited":     "bg-orange-500 text-white",
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-square bg-gray-200" />
      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-full bg-gray-200 rounded-full" />
          <div className="h-3.5 w-4/5 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded-sm" />
          ))}
          <div className="h-3 w-10 bg-gray-200 rounded-full ml-1" />
        </div>
        <div className="flex gap-1.5">
          {[1,2,3].map((i) => <div key={i} className="w-5 h-5 rounded-full bg-gray-200" />)}
        </div>
        <div className="pt-1 flex items-center justify-between gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-8 w-24 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!product.inStock || added) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="group flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* ── Image ── */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1 shadow ${BADGE_STYLES[product.badge]}`}>
            {product.badge}
          </span>
        )}

        {/* Discount % */}
        {discountPct && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-1 shadow">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist btn — appears on hover */}
        <button
          onClick={(e) => { e.preventDefault(); setWished((w) => !w); }}
          className={`absolute ${discountPct ? "top-10 right-3 mt-1" : "top-3 right-3"} p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-200
            opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
            ${wished ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
          aria-label="Wishlist"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={wished ? "currentColor" : "none"}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-semibold rounded-full px-3 py-1.5">Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col flex-1 gap-2">

        {/* Brand */}
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{product.brand}</p>

        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors leading-snug line-clamp-2 flex-1"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-gray-400">{product.rating}</span>
          <span className="text-[11px] text-gray-300">·</span>
          <span className="text-[11px] text-gray-400">{product.reviews.toLocaleString()} reviews</span>
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.colors.slice(0, 7).map((c) => (
              <span
                key={c}
                title={c}
                className="w-4.5 h-4.5 rounded-full border-2 border-white ring-1 ring-gray-200 shrink-0 shadow-sm"
                style={{
                  width: "18px", height: "18px",
                  backgroundColor: COLOR_HEX[c] ?? "#e5e7eb",
                  ...(c === "Clear" ? { background: "linear-gradient(135deg,#e5e7eb 40%,#fff 40%)" } : {}),
                }}
              />
            ))}
            {product.colors.length > 7 && (
              <span className="text-[10px] text-gray-400 font-medium">+{product.colors.length - 7}</span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 mt-1" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-gray-900 leading-tight">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through leading-tight">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 shrink-0 shadow-sm
              ${added
                ? "bg-emerald-500 text-white scale-95"
                : product.inStock
                  ? "bg-primary text-white hover:bg-primary-hover active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {added ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Filter Section ───────────────────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-1 mb-3">
        <span className="text-sm font-bold text-gray-900">{title}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && children}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  brands: string[]; allColors: string[]; maxProductPrice: number;
  selectedBrands: string[]; selectedColors: string[];
  minPrice: number; maxPrice: number; minRating: number; inStockOnly: boolean;
  onBrandToggle: (b: string) => void; onColorToggle: (c: string) => void;
  onMinPrice: (v: number) => void; onMaxPrice: (v: number) => void;
  onMinRating: (v: number) => void; onInStockOnly: (v: boolean) => void;
  onReset: () => void; activeCount: number;
}

function Sidebar(props: SidebarProps) {
  const { brands, allColors, maxProductPrice, selectedBrands, selectedColors, minPrice, maxPrice, minRating, inStockOnly,
    onBrandToggle, onColorToggle, onMinPrice, onMaxPrice, onMinRating, onInStockOnly, onReset, activeCount } = props;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Filters</h2>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
            Reset ({activeCount})
          </button>
        )}
      </div>

      <FilterSection title="Availability">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => onInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary accent-primary cursor-pointer" />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">In Stock Only</span>
        </label>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {[["Min", minPrice, onMinPrice], ["Max", maxPrice >= maxProductPrice ? "" : maxPrice, onMaxPrice]].map(([ph, val, fn]) => (
              <div key={ph as string} className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
                <input type="number" min={0} max={maxProductPrice} placeholder={ph as string}
                  value={val as number | ""}
                  onChange={(e) => (fn as (v: number) => void)(Number(e.target.value) || (ph === "Max" ? maxProductPrice : 0))}
                  className="w-full pl-6 pr-2 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[["Under $25", 0, 25], ["$25–$50", 25, 50], ["$50–$100", 50, 100], ["$100+", 100, 99999]].map(([label, lo, hi]) => {
              const active = minPrice === lo && (hi === 99999 ? maxPrice >= maxProductPrice : maxPrice === hi);
              return (
                <button key={label as string} onClick={() => { onMinPrice(lo as number); onMaxPrice(hi as number); }}
                  className={`text-xs rounded-full px-3 py-1 border font-medium transition-all ${active ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary"}`}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => onBrandToggle(brand)}
                className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => {
            const active = selectedColors.includes(color);
            return (
              <button key={color} title={color} onClick={() => onColorToggle(color)}
                className={`relative w-7 h-7 rounded-full border-2 transition-all ${active ? "border-primary scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                style={{ backgroundColor: COLOR_HEX[color] ?? "#e5e7eb", ...(color === "Clear" ? { background: "linear-gradient(135deg,#e5e7eb 40%,#fff 40%)" } : {}) }}>
                {active && (
                  <svg className={`absolute inset-0 m-auto w-3.5 h-3.5 ${["White","Clear","Silver","Starlight","Cream"].includes(color) ? "text-gray-700" : "text-white"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Min Rating" defaultOpen={false}>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="minRating" checked={minRating === r} onChange={() => onMinRating(minRating === r ? 0 : r)}
                className="w-4 h-4 accent-primary cursor-pointer" />
              <div className="flex items-center gap-1">
                <Stars rating={r} size="xs" />
                <span className="text-xs text-gray-500">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Best Rated" },
  { value: "reviews",    label: "Most Reviewed" },
];

export default function CollectionView({ slug }: { slug: string }) {
  const collection = COLLECTIONS[slug];

  const allBrands = useMemo(() => [...new Set(collection.products.map((p) => p.brand))].sort(), [collection]);
  const allColors = useMemo(() => [...new Set(collection.products.flatMap((p) => p.colors))].sort(), [collection]);
  const maxProductPrice = useMemo(() => Math.ceil(Math.max(...collection.products.map((p) => p.price)) / 10) * 10, [collection]);

  // Skeleton state
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
  }, []);

  // Filter state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice]   = useState(0);
  const [maxPrice, setMaxPrice]   = useState(maxProductPrice);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy]       = useState("featured");
  const [gridCols, setGridCols]   = useState<2 | 3 | 4>(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFilterCount = selectedBrands.length + selectedColors.length +
    (minPrice > 0 ? 1 : 0) + (maxPrice < maxProductPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0);

  function resetFilters() {
    setSelectedBrands([]); setSelectedColors([]);
    setMinPrice(0); setMaxPrice(maxProductPrice);
    setMinRating(0); setInStockOnly(false);
  }

  const filtered = useMemo(() => collection.products.filter((p) => {
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
    if (selectedColors.length && !p.colors.some((c) => selectedColors.includes(c))) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (p.rating < minRating) return false;
    if (inStockOnly && !p.inStock) return false;
    return true;
  }), [collection, selectedBrands, selectedColors, minPrice, maxPrice, minRating, inStockOnly]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":  return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "rating":     return b.rating - a.rating;
      case "reviews":    return b.reviews - a.reviews;
      default:           return 0;
    }
  }), [filtered, sortBy]);

  const sidebarProps: SidebarProps = {
    brands: allBrands, allColors, maxProductPrice,
    selectedBrands, selectedColors, minPrice, maxPrice, minRating, inStockOnly,
    onBrandToggle: (b) => setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]),
    onColorToggle: (c) => setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]),
    onMinPrice: setMinPrice, onMaxPrice: setMaxPrice,
    onMinRating: (v) => setMinRating((prev) => prev === v ? 0 : v),
    onInStockOnly: setInStockOnly, onReset: resetFilters, activeCount: activeFilterCount,
  };

  const gridClass = { 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-2 lg:grid-cols-3", 4: "grid-cols-2 lg:grid-cols-4" }[gridCols];
  const skeletonCount = { 2: 4, 3: 6, 4: 8 }[gridCols];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          <Link href="/collections" className="hover:text-primary transition-colors">Collections</Link>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-semibold">{collection.title}</span>
        </div>
      </div>

      {/* Page heading */}
      <div className="bg-white border-b border-gray-100 py-8 lg:py-10">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{collection.title}</h1>
          <p className="mt-2 text-gray-500 text-sm lg:text-base max-w-xl">{collection.description}</p>
          <p className="mt-1 text-gray-400 text-xs">{collection.products.length} products</p>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8">
        <div className="flex gap-8 items-start">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <Sidebar {...sidebarProps} />
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <button onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm3 4a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <p className="text-sm text-gray-500 mr-auto">
                {ready
                  ? <><span className="font-semibold text-gray-900">{sorted.length}</span> products</>
                  : <span className="inline-block h-4 w-24 bg-gray-200 rounded-full animate-pulse" />
                }
              </p>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 hidden sm:block">Sort:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="hidden sm:flex items-center rounded-xl border border-gray-200 overflow-hidden">
                {([2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => setGridCols(n)} aria-label={`${n} columns`}
                    className={`px-3 py-2 transition-colors ${gridCols === n ? "bg-primary text-white" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      {n === 2 && <><rect x="2" y="2" width="9" height="9" rx="1.5" /><rect x="13" y="2" width="9" height="9" rx="1.5" /><rect x="2" y="13" width="9" height="9" rx="1.5" /><rect x="13" y="13" width="9" height="9" rx="1.5" /></>}
                      {n === 3 && <><rect x="2" y="2" width="6" height="9" rx="1.5" /><rect x="9" y="2" width="6" height="9" rx="1.5" /><rect x="16" y="2" width="6" height="9" rx="1.5" /><rect x="2" y="13" width="6" height="9" rx="1.5" /><rect x="9" y="13" width="6" height="9" rx="1.5" /><rect x="16" y="13" width="6" height="9" rx="1.5" /></>}
                      {n === 4 && <><rect x="2" y="2" width="4.5" height="9" rx="1" /><rect x="7.5" y="2" width="4.5" height="9" rx="1" /><rect x="13" y="2" width="4.5" height="9" rx="1" /><rect x="18.5" y="2" width="4.5" height="9" rx="1" /><rect x="2" y="13" width="4.5" height="9" rx="1" /><rect x="7.5" y="13" width="4.5" height="9" rx="1" /><rect x="13" y="13" width="4.5" height="9" rx="1" /><rect x="18.5" y="13" width="4.5" height="9" rx="1" /></>}
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedBrands.map((b) => (
                  <button key={b} onClick={() => sidebarProps.onBrandToggle(b)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 hover:bg-primary/20 transition-colors">
                    {b} <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                ))}
                {selectedColors.map((c) => (
                  <button key={c} onClick={() => sidebarProps.onColorToggle(c)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 hover:bg-primary/20 transition-colors">
                    <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: COLOR_HEX[c] ?? "#e5e7eb" }} />
                    {c} <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                ))}
                {(minPrice > 0 || maxPrice < maxProductPrice) && (
                  <button onClick={() => { setMinPrice(0); setMaxPrice(maxProductPrice); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 hover:bg-primary/20 transition-colors">
                    ${minPrice}–{maxPrice >= maxProductPrice ? "∞" : `$${maxPrice}`}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            )}

            {/* Grid — skeleton or products */}
            {!ready ? (
              <div className={`grid gap-4 ${gridClass}`}>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : sorted.length > 0 ? (
              <div className={`grid gap-4 ${gridClass}`}>
                {sorted.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                <p className="text-sm text-gray-500 mb-5">Try adjusting or clearing your filters.</p>
                <button onClick={resetFilters} className="rounded-full bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-primary-hover transition-colors">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full overflow-y-auto shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900">Filters {activeFilterCount > 0 && <span className="text-primary">({activeFilterCount})</span>}</h2>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 flex-1"><Sidebar {...sidebarProps} /></div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button onClick={() => setMobileFilterOpen(false)}
                className="w-full rounded-full bg-primary text-white py-3 text-sm font-bold hover:bg-primary-hover transition-colors">
                Show {sorted.length} products
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
