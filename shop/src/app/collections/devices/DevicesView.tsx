"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/collectionData";
import { useWishlistStore } from "@/store/wishlistStore";

// ─── Device data ──────────────────────────────────────────────────────────────

const BRANDS = [
  { id: "apple",   label: "Apple",   icon: "🍎" },
  { id: "samsung", label: "Samsung", icon: "📱" },
];

const DEVICE_MODELS: Record<string, { label: string; query: string }[]> = {
  apple: [
    { label: "iPhone 17 Pro Max", query: "iPhone 17 Pro Max" },
    { label: "iPhone 17 Pro",     query: "iPhone 17 Pro" },
    { label: "iPhone 17",         query: "iPhone 17" },
    { label: "iPhone 16 Pro Max", query: "iPhone 16 Pro Max" },
    { label: "iPhone 16 Pro",     query: "iPhone 16 Pro" },
    { label: "iPhone 16 Plus",    query: "iPhone 16 Plus" },
    { label: "iPhone 16",         query: "iPhone 16" },
    { label: "iPhone 16e",        query: "iPhone 16e" },
    { label: "iPhone 15 Pro Max", query: "iPhone 15 Pro Max" },
    { label: "iPhone 15 Pro",     query: "iPhone 15 Pro" },
    { label: "iPhone 15 Plus",    query: "iPhone 15 Plus" },
    { label: "iPhone 15",         query: "iPhone 15" },
  ],
  samsung: [
    { label: "Galaxy S26 Ultra",  query: "Galaxy S26 Ultra" },
    { label: "Galaxy S26 Plus",   query: "Galaxy S26 Plus" },
    { label: "Galaxy S26",        query: "Galaxy S26" },
    { label: "Galaxy S25 Ultra",  query: "Galaxy S25 Ultra" },
    { label: "Galaxy S25 Plus",   query: "Galaxy S25 Plus" },
    { label: "Galaxy S25",        query: "Galaxy S25" },
    { label: "Galaxy S24 Ultra",  query: "Galaxy S24 Ultra" },
    { label: "Galaxy S24 Plus",   query: "Galaxy S24 Plus" },
    { label: "Galaxy S24",        query: "Galaxy S24" },
    { label: "Galaxy Z Fold 6",   query: "Galaxy Z Fold" },
    { label: "Galaxy Z Flip 6",   query: "Galaxy Z Flip" },
    { label: "Galaxy A16 5G",     query: "Galaxy A16" },
  ],
};

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
    id:            p._id,
    name:          p.name,
    brand:         p.brand ?? "",
    price:         p.price,
    originalPrice: p.originalPrice,
    rating:        p.rating ?? 4.5,
    reviews:       p.reviews ?? 0,
    colors:        (p.colors && p.colors.length > 0) ? p.colors : variantColors,
    image:         p.image ?? "",
    badge:         p.badge as Product["badge"],
    inStock:       p.inStock ?? true,
    slug:          p.slug || p._id,
  };
}

const API = process.env.NEXT_PUBLIC_API_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "Top Rated":   "bg-emerald-500 text-white",
  "Sale":        "bg-red-500 text-white",
  "New":         "bg-primary text-white",
  "Limited":     "bg-orange-500 text-white",
};

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
      {/* Wishlist */}
      <button
        onClick={() => wished ? removeItem(product.id) : addItem({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, image: product.image, price: product.price, originalPrice: product.originalPrice, rating: product.rating, reviews: product.reviews, badge: product.badge })}
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        aria-label="Wishlist"
      >
        <svg className={`w-3.5 h-3.5 transition-colors ${wished ? "fill-red-500 text-red-500" : "fill-none text-gray-400 hover:text-red-400"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image src={product.image} alt={product.name} fill
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
          {product.badge && (
            <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 ${BADGE_STYLES[product.badge] ?? "bg-gray-200 text-gray-700"}`}>
              {product.badge}
            </span>
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
          <div className="flex items-center gap-1.5 mt-0.5">
            <Stars rating={product.rating} />
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-100">
            <div>
              <p className="text-base font-extrabold text-gray-900">${product.price.toFixed(2)}</p>
              {product.originalPrice && (
                <p className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
              )}
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DevicesView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";

  // Determine active brand from query
  const activeBrand = useMemo(() => {
    if (!q) return "apple";
    const lower = q.toLowerCase();
    if (lower.includes("galaxy") || lower.includes("samsung")) return "samsung";
    return "apple";
  }, [q]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Selected model
  const selectedModel = useMemo(() => {
    if (!q) return null;
    return DEVICE_MODELS[activeBrand]?.find((m) => m.query === q) ?? null;
  }, [q, activeBrand]);

  useEffect(() => {
    if (!q) { setProducts([]); setTotal(0); return; }
    const controller = new AbortController();
    setLoading(true);
    fetch(
      `${API}/products?search=${encodeURIComponent(q)}&limit=40`,
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        const mapped = (data.products ?? []).map(mapProduct);
        setProducts(mapped);
        setTotal(data.total ?? mapped.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [q]);

  function selectModel(query: string) {
    router.push(`/collections/devices?q=${encodeURIComponent(query)}`);
  }

  function switchBrand(brandId: string) {
    // Reset to first model of that brand
    const first = DEVICE_MODELS[brandId]?.[0];
    if (first) router.push(`/collections/devices?q=${encodeURIComponent(first.query)}`);
    else router.push("/collections/devices");
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar ── */}
        <aside className="lg:w-64 shrink-0">
          {/* Brand tabs */}
          <div className="flex gap-2 mb-5">
            {BRANDS.map((brand) => (
              <button
                key={brand.id}
                onClick={() => switchBrand(brand.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all border
                  ${activeBrand === brand.id
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >
                <span>{brand.icon}</span>
                {brand.label}
              </button>
            ))}
          </div>

          {/* Model list */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {activeBrand === "apple" ? "Apple iPhone" : "Samsung Galaxy"}
              </p>
            </div>
            <ul className="divide-y divide-gray-50">
              {DEVICE_MODELS[activeBrand].map((model) => {
                const isActive = q === model.query;
                return (
                  <li key={model.query}>
                    <button
                      onClick={() => selectModel(model.query)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all text-left
                        ${isActive
                          ? "bg-primary/5 text-primary font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium"}`}
                    >
                      {model.label}
                      {isActive && (
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* ── Products ── */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              {selectedModel ? (
                <>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{selectedModel.label} Accessories</h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {loading ? "Loading…" : `${total} products found`}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Shop by Device</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Select a device from the left to see compatible accessories</p>
                </>
              )}
            </div>
          </div>

          {/* No device selected */}
          {!q && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-3xl">📱</div>
              <p className="text-base font-semibold text-gray-700">Pick your device</p>
              <p className="text-sm text-gray-400 mt-1">Choose a model from the sidebar to browse compatible accessories</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!loading && q && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="w-14 h-14 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <p className="text-base font-semibold text-gray-700">No products found</p>
              <p className="text-sm text-gray-400 mt-1">No accessories found for {q}</p>
            </div>
          )}

          {/* Product grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
