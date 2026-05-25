"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COLLECTIONS, COLOR_HEX, type Product } from "@/lib/collectionData";
import { useWishlistStore } from "@/store/wishlistStore";

// ─── Backend Product Integration ──────────────────────────────────────────────

interface _BPOption  { label: string }
interface _BPVariant { name: string; options: _BPOption[] }
interface _BackendProduct {
  _id: string; name: string; brand?: string; price: number;
  originalPrice?: number; rating?: number; reviews?: number;
  image?: string; badge?: string; inStock?: boolean;
  slug?: string; colors?: string[];
  variants?: _BPVariant[];
}

const SLUG_TO_CATEGORY: Record<string, string> = {
  audio:              "Audio",
  cases:              "Cases",
  "screen-protection":"Screen Protection",
  power:              "Power",
  accessories:        "Accessories",
};

function mapBackendProduct(p: _BackendProduct): Product {
  const colorVariant = p.variants?.find((v) => v.name.toLowerCase() === "color");
  const variantColors = colorVariant?.options.map((o) => o.label) ?? [];
  const colors = (p.colors && p.colors.length > 0) ? p.colors : variantColors;
  return {
    id:            p._id,
    name:          p.name,
    brand:         p.brand ?? "",
    price:         p.price,
    originalPrice: p.originalPrice,
    rating:        p.rating ?? 4.5,
    reviews:       p.reviews ?? 0,
    colors,
    image:         p.image ?? "",
    badge:         p.badge as Product["badge"],
    inStock:       p.inStock ?? true,
    slug:          p.slug || p._id,
  };
}

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

const BADGE_FILTER_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-50 text-amber-700 border-amber-200",
  "Top Rated":   "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Sale":        "bg-red-50 text-red-700 border-red-200",
  "New":         "bg-violet-50 text-violet-700 border-violet-200",
  "Limited":     "bg-orange-50 text-orange-700 border-orange-200",
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
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
  const router = useRouter();
  const { addItem, removeItem, isWishlisted } = useWishlistStore();
  const wished = isWishlisted(product.id);

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function toggleWish(e: React.MouseEvent) {
    e.preventDefault();
    if (wished) {
      removeItem(product.id);
    } else {
      addItem({
        id: product.id, slug: product.slug, name: product.name,
        brand: product.brand, image: product.image, price: product.price,
        originalPrice: product.originalPrice, rating: product.rating,
        reviews: product.reviews, badge: product.badge,
      });
    }
  }

  return (
    <article className="group flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* ── Image ── */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {product.image.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </Link>

        {product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1 shadow ${BADGE_STYLES[product.badge]}`}>
            {product.badge}
          </span>
        )}

        {discountPct && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-1 shadow">
            -{discountPct}%
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center pointer-events-none">
            <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 shadow">
              Out of Stock
            </span>
          </div>
        )}

        <button
          onClick={toggleWish}
          className={`absolute ${discountPct ? "top-10 right-3 mt-1" : "top-3 right-3"} p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-200
            opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
            ${wished ? "bg-red-500 text-white opacity-100 translate-y-0" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={wished ? "currentColor" : "none"}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-semibold rounded-full px-3 py-1.5">Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{product.brand}</p>

        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors leading-snug line-clamp-2 flex-1"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-gray-400">{product.rating}</span>
          <span className="text-[11px] text-gray-300">·</span>
          <span className="text-[11px] text-gray-400">{product.reviews.toLocaleString()} reviews</span>
        </div>

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

        <div className="border-t border-gray-100 mt-1" />

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-gray-900 leading-tight">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through leading-tight">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={() => router.push(`/products/${product.slug}`)}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-hover active:scale-95 transition-all duration-200 shrink-0 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Filter Section ───────────────────────────────────────────────────────────

function FilterSection({ title, icon, children, defaultOpen = true, count }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode;
  defaultOpen?: boolean; count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-1 mb-3 group">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400 group-hover:text-primary transition-colors">{icon}</span>}
          <span className="text-sm font-bold text-gray-800">{title}</span>
          {count != null && count > 0 && (
            <span className="text-[10px] font-bold bg-primary text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {count}
            </span>
          )}
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && children}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  brands: string[]; allColors: string[]; allBadges: string[]; maxProductPrice: number;
  selectedBrands: string[]; selectedColors: string[]; selectedBadges: string[];
  minPrice: number; maxPrice: number; minRating: number; inStockOnly: boolean;
  searchQuery: string;
  onBrandToggle: (b: string) => void; onColorToggle: (c: string) => void;
  onBadgeToggle: (b: string) => void;
  onMinPrice: (v: number) => void; onMaxPrice: (v: number) => void;
  onMinRating: (v: number) => void; onInStockOnly: (v: boolean) => void;
  onSearchQuery: (q: string) => void;
  onReset: () => void; activeCount: number;
  productCounts: Record<string, number>;
}

function Sidebar(props: SidebarProps) {
  const {
    brands, allColors, allBadges, maxProductPrice,
    selectedBrands, selectedColors, selectedBadges,
    minPrice, maxPrice, minRating, inStockOnly, searchQuery,
    onBrandToggle, onColorToggle, onBadgeToggle,
    onMinPrice, onMaxPrice, onMinRating, onInStockOnly, onSearchQuery,
    onReset, activeCount, productCounts,
  } = props;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm3 4a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
          </svg>
          <h2 className="text-sm font-bold text-gray-900">Filters</h2>
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear ({activeCount})
          </button>
        )}
      </div>

      {/* Search */}
      <FilterSection
        title="Search"
        icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>}
        count={searchQuery ? 1 : 0}
      >
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {searchQuery && (
            <button onClick={() => onSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection
        title="Availability"
        icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
      >
        <label className="flex items-center gap-2.5 cursor-pointer group select-none">
          <div className="relative">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => onInStockOnly(e.target.checked)}
              className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 peer-checked:bg-primary rounded-full transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-sm text-gray-700 group-hover:text-gray-900">In Stock Only</span>
        </label>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        count={(minPrice > 0 ? 1 : 0) + (maxPrice < maxProductPrice ? 1 : 0)}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {(["Min", "Max"] as const).map((ph) => {
              const val = ph === "Min" ? minPrice : (maxPrice >= maxProductPrice ? "" : maxPrice);
              const fn  = ph === "Min" ? onMinPrice : onMaxPrice;
              return (
                <div key={ph} className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
                  <input
                    type="number" min={0} max={maxProductPrice} placeholder={ph}
                    value={val}
                    onChange={(e) => fn(Number(e.target.value) || (ph === "Max" ? maxProductPrice : 0))}
                    className="w-full pl-6 pr-2 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {([["Under $25", 0, 25], ["$25–$50", 25, 50], ["$50–$100", 50, 100], ["$100+", 100, 99999]] as const).map(([label, lo, hi]) => {
              const active = minPrice === lo && (hi === 99999 ? maxPrice >= maxProductPrice : maxPrice === hi);
              return (
                <button key={label} onClick={() => { onMinPrice(lo); onMaxPrice(hi); }}
                  className={`text-xs rounded-full px-3 py-1 border font-medium transition-all ${active ? "bg-primary text-white border-primary shadow-sm" : "border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary"}`}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </FilterSection>

      {/* Deals / Badges */}
      {allBadges.length > 0 && (
        <FilterSection
          title="Deals & Badges"
          icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
          count={selectedBadges.length}
          defaultOpen={selectedBadges.length > 0}
        >
          <div className="flex flex-wrap gap-2">
            {allBadges.map((badge) => {
              const active = selectedBadges.includes(badge);
              return (
                <button key={badge} onClick={() => onBadgeToggle(badge)}
                  className={`text-xs rounded-full px-3 py-1.5 border font-semibold transition-all ${active ? `${BADGE_FILTER_STYLES[badge] ?? "bg-primary/10 text-primary border-primary/30"} ring-1 ring-current` : "border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50"}`}>
                  {badge}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Brand */}
      <FilterSection
        title="Brand"
        icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        count={selectedBrands.length}
      >
        <div className="space-y-1.5">
          {brands.map((brand) => {
            const checked = selectedBrands.includes(brand);
            const count = productCounts[brand] ?? 0;
            return (
              <label key={brand} className="flex items-center gap-2.5 cursor-pointer group select-none py-0.5">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? "bg-primary border-primary" : "border-gray-300 group-hover:border-primary/50"}`}>
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm flex-1 transition-colors ${checked ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>{brand}</span>
                <span className="text-[11px] text-gray-400 font-medium">{count}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection
        title="Color"
        icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}
        count={selectedColors.length}
      >
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => {
            const active = selectedColors.includes(color);
            return (
              <button key={color} title={color} onClick={() => onColorToggle(color)}
                className={`relative w-7 h-7 rounded-full border-2 transition-all shadow-sm ${active ? "border-primary scale-110 shadow-md" : "border-gray-200 hover:border-gray-400 hover:scale-105"}`}
                style={{
                  backgroundColor: COLOR_HEX[color] ?? "#e5e7eb",
                  ...(color === "Clear" ? { background: "linear-gradient(135deg,#e5e7eb 40%,#fff 40%)" } : {}),
                }}>
                {active && (
                  <svg className={`absolute inset-0 m-auto w-3.5 h-3.5 ${["White","Clear","Silver","Starlight","Cream","Sand"].includes(color) ? "text-gray-700" : "text-white"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        {selectedColors.length > 0 && (
          <p className="mt-2 text-[11px] text-gray-400">{selectedColors.join(", ")}</p>
        )}
      </FilterSection>

      {/* Min Rating */}
      <FilterSection
        title="Min Rating"
        icon={<svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
        defaultOpen={false}
        count={minRating > 0 ? 1 : 0}
      >
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group select-none">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${minRating === r ? "border-primary bg-primary" : "border-gray-300 group-hover:border-primary/50"}`}>
                {minRating === r && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="flex items-center gap-1.5" onClick={() => onMinRating(minRating === r ? 0 : r)}>
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
  { value: "newest",     label: "Newest First" },
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Best Rated" },
  { value: "reviews",    label: "Most Reviewed" },
];

export default function CollectionView({ slug }: { slug: string }) {
  const collection = COLLECTIONS[slug];
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  useEffect(() => {
    const category = SLUG_TO_CATEGORY[slug];
    if (!category) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5510/api";
    fetch(`${apiUrl}/products?category=${encodeURIComponent(category)}&limit=200`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.products)) {
          setAllProducts(data.products.map(mapBackendProduct));
        }
      })
      .catch(() => {});
  }, [slug]);

  const allBrands = useMemo(() => [...new Set(allProducts.map((p) => p.brand))].sort(), [allProducts]);
  const allColors = useMemo(() => [...new Set(allProducts.flatMap((p) => p.colors))].sort(), [allProducts]);
  const allBadges = useMemo(() => [...new Set(allProducts.map((p) => p.badge).filter(Boolean))] as string[], [allProducts]);
  const maxProductPrice = useMemo(() => {
    const prices = allProducts.map((p) => p.price);
    return prices.length > 0 ? Math.ceil(Math.max(...prices) / 10) * 10 : 500;
  }, [allProducts]);

  // Skeleton state
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700);
    return () => clearTimeout(t);
  }, []);

  // Read URL params once for initial state
  const urlQ      = searchParams.get("q") ?? "";
  const urlBrand  = searchParams.get("brand") ?? "";
  const urlMaxP   = searchParams.get("maxPrice");
  const urlMinP   = searchParams.get("minPrice");
  const urlBadge  = searchParams.get("badge") ?? "";

  // Filter state
  const [searchQuery,    setSearchQuery]    = useState(urlQ);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => urlBrand ? [urlBrand] : []);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(() => urlBadge ? [urlBadge] : []);
  const [minPrice,       setMinPrice]       = useState(urlMinP ? Number(urlMinP) : 0);
  const [maxPrice,       setMaxPrice]       = useState(urlMaxP ? Number(urlMaxP) : maxProductPrice);
  const [minRating,      setMinRating]      = useState(0);
  const [inStockOnly,    setInStockOnly]    = useState(false);
  const [sortBy,         setSortBy]         = useState("newest");
  const [gridCols,       setGridCols]       = useState<2 | 3 | 4>(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFilterCount =
    selectedBrands.length + selectedColors.length + selectedBadges.length +
    (minPrice > 0 ? 1 : 0) + (maxPrice < maxProductPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0) + (searchQuery ? 1 : 0);

  function resetFilters() {
    setSearchQuery(""); setSelectedBrands([]); setSelectedColors([]); setSelectedBadges([]);
    setMinPrice(0); setMaxPrice(maxProductPrice);
    setMinRating(0); setInStockOnly(false);
  }

  const filtered = useMemo(() => allProducts.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
    if (selectedColors.length && !p.colors.some((c) => selectedColors.includes(c))) return false;
    if (selectedBadges.length && (!p.badge || !selectedBadges.includes(p.badge))) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (p.rating < minRating) return false;
    if (inStockOnly && !p.inStock) return false;
    return true;
  }), [allProducts, searchQuery, selectedBrands, selectedColors, selectedBadges, minPrice, maxPrice, minRating, inStockOnly]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":  return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "rating":     return b.rating - a.rating;
      case "reviews":    return b.reviews - a.reviews;
      // "newest" and "featured" preserve insertion order (backendProducts first = newest)
      default:           return 0;
    }
  }), [filtered, sortBy]);

  // Product count per brand (from unfiltered collection)
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => { counts[p.brand] = (counts[p.brand] ?? 0) + 1; });
    return counts;
  }, [allProducts]);

  const sidebarProps: SidebarProps = {
    brands: allBrands, allColors, allBadges, maxProductPrice, productCounts,
    selectedBrands, selectedColors, selectedBadges, minPrice, maxPrice, minRating, inStockOnly, searchQuery,
    onBrandToggle:  (b) => setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]),
    onColorToggle:  (c) => setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]),
    onBadgeToggle:  (b) => setSelectedBadges((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]),
    onMinPrice: setMinPrice, onMaxPrice: setMaxPrice,
    onMinRating: (v) => setMinRating((prev) => prev === v ? 0 : v),
    onInStockOnly: setInStockOnly, onSearchQuery: setSearchQuery,
    onReset: resetFilters, activeCount: activeFilterCount,
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
          {searchQuery && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-500">Showing results for</span>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full px-3 py-1">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery("")} className="hover:text-primary-hover">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            </div>
          )}
          <p className="mt-1 text-gray-400 text-xs">{allProducts.length} products</p>
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
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 hover:bg-primary/20 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
                    &ldquo;{searchQuery}&rdquo;
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                {selectedBrands.map((b) => (
                  <button key={b} onClick={() => sidebarProps.onBrandToggle(b)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 hover:bg-primary/20 transition-colors">
                    {b} <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                ))}
                {selectedBadges.map((b) => (
                  <button key={b} onClick={() => sidebarProps.onBadgeToggle(b)}
                    className={`inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-3 py-1.5 transition-colors ${BADGE_FILTER_STYLES[b] ?? "bg-primary/10 text-primary"} hover:opacity-80`}>
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
                {minRating > 0 && (
                  <button onClick={() => setMinRating(0)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 hover:bg-primary/20 transition-colors">
                    {minRating}★ & up
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                {inStockOnly && (
                  <button onClick={() => setInStockOnly(false)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 hover:bg-emerald-100 transition-colors">
                    In Stock
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
