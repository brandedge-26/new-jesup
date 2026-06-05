"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/collectionData";
import { useWishlistStore } from "@/store/wishlistStore";

const API = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

interface _BP {
  _id: string; name: string; brand?: string; price: number;
  originalPrice?: number; rating?: number; reviews?: number;
  image?: string; badge?: string; inStock?: boolean;
  slug?: string; colors?: string[];
  variants?: { name: string; options: { label: string }[] }[];
}

function mapProduct(p: _BP): Product {
  const colorVariant = p.variants?.find((v) => v.name.toLowerCase() === "color");
  const variantColors = colorVariant?.options.map((o) => o.label) ?? [];
  return {
    id: p._id, name: p.name, brand: p.brand ?? "",
    price: p.price, originalPrice: p.originalPrice,
    rating: p.rating ?? 4.5, reviews: p.reviews ?? 0,
    colors: (p.colors && p.colors.length > 0) ? p.colors : variantColors,
    image: p.image ?? "", badge: p.badge as Product["badge"],
    inStock: p.inStock ?? true, slug: p.slug || p._id,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BRANDS = ["Apple", "Samsung", "Google", "Motorola", "Sony", "Microsoft", "Nintendo"];

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "Top Rated":   "bg-emerald-500 text-white",
  "Sale":        "bg-red-500 text-white",
  "New":         "bg-primary text-white",
  "Limited":     "bg-orange-500 text-white",
};

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-amber-400" : "fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const { addItem, removeItem, isWishlisted } = useWishlistStore();
  const wished = isWishlisted(product.id);
  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
      <button
        onClick={() => wished ? removeItem(product.id) : addItem({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, image: product.image, price: product.price, originalPrice: product.originalPrice, rating: product.rating, reviews: product.reviews, badge: product.badge })}
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
      >
        <svg className={`w-3.5 h-3.5 ${wished ? "fill-red-500 text-red-500" : "fill-none text-gray-400 hover:text-red-400"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" />
          {product.badge && (
            <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 ${BADGE_STYLES[product.badge] ?? "bg-gray-200 text-gray-700"}`}>{product.badge}</span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-500 bg-white rounded-full px-3 py-1 shadow">Out of stock</span>
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col gap-1.5 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{product.brand}</p>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-2 flex-1">{product.name}</p>
          {product.reviews > 0 && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Stars rating={product.rating} />
              <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-100">
            <div>
              <p className="text-base font-extrabold text-gray-900">${product.price.toFixed(2)}</p>
              {product.originalPrice && <p className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>}
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">View →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
        <div className="h-3.5 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DevicesView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q         = searchParams.get("q") ?? "";
  const brandParam = searchParams.get("brand") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(false);
  const [total, setTotal]       = useState(0);
  const [sort, setSort]         = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = useCallback(() => {
    const controller = new AbortController();
    setLoading(true);

    const params = new URLSearchParams();
    params.set("category", "Devices");
    params.set("limit", "60");
    if (q)          params.set("search", q);
    if (brandParam) params.set("search", brandParam);

    fetch(`${API}/products?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        let mapped = (data.products ?? []).map(mapProduct);
        if (inStockOnly) mapped = mapped.filter((p) => p.inStock);
        if (sort === "price-asc")  mapped.sort((a, b) => a.price - b.price);
        if (sort === "price-desc") mapped.sort((a, b) => b.price - a.price);
        setProducts(mapped);
        setTotal(data.total ?? mapped.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [q, brandParam, sort, inStockOnly]);

  useEffect(() => {
    const cleanup = fetchProducts();
    return cleanup;
  }, [fetchProducts]);

  function setUrlParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/collections/devices?${params}`);
  }

  function clearAll() {
    router.push("/collections/devices");
    setSort("newest");
    setInStockOnly(false);
  }

  const hasFilters = q || brandParam || inStockOnly || sort !== "newest";

  const Sidebar = (
    <div className="space-y-6">
      {/* Brand */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Brand</p>
        <div className="space-y-1.5">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setUrlParam("brand", brandParam === b ? "" : b)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                brandParam === b
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              {b}
              {brandParam === b && (
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Sort By</p>
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                sort === opt.value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              {opt.label}
              {sort === opt.value && (
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Availability</p>
        <button
          onClick={() => setInStockOnly((v) => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
            inStockOnly ? "bg-primary/10 text-primary font-semibold" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${inStockOnly ? "bg-primary border-primary" : "border-gray-300"}`}>
            {inStockOnly && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
          In Stock Only
        </button>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button onClick={clearAll} className="w-full py-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors border border-red-100 rounded-xl hover:bg-red-50">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8 lg:py-12">
      <div className="flex gap-8">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            {Sidebar}
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Devices</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
              Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
            </button>
          </div>

          {/* Active filters row */}
          {(q || brandParam) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {q && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  Search: {q}
                  <button onClick={() => setUrlParam("q", "")} className="hover:text-primary-hover">×</button>
                </span>
              )}
              {brandParam && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {brandParam}
                  <button onClick={() => setUrlParam("brand", "")} className="hover:text-primary-hover">×</button>
                </span>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="w-14 h-14 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <p className="text-base font-semibold text-gray-700">No devices found</p>
              {hasFilters && (
                <button onClick={clearAll} className="mt-3 text-sm text-primary font-semibold hover:underline">Clear filters</button>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="font-bold text-gray-900">Filters</p>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {Sidebar}
          </div>
        </div>
      )}
    </div>
  );
}
