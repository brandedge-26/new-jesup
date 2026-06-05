import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending Now — Jesup Shop",
  description: "Top-rated accessories customers love this week. Best sellers & trending picks.",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  inStock: boolean;
  slug?: string;
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function getTrendingProducts(): Promise<Product[]> {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API}/featured?type=trending`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-amber-400" : "fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ item }: { item: Product }) {
  const discountPct = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : null;
  const href = item.slug ? `/products/${item.slug}` : "#";

  return (
    <article className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Link href={href} className="block w-full h-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </Link>

        {/* Badge */}
        {item.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1 shadow ${BADGE_STYLES[item.badge] ?? "bg-gray-700 text-white"}`}>
            {item.badge}
          </span>
        )}

        {discountPct && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-1">
            -{discountPct}%
          </span>
        )}

        {!item.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 bg-white rounded-full px-3 py-1 shadow">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{item.brand}</p>
        <Link href={href} className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors leading-snug line-clamp-2 flex-1">
          {item.name}
        </Link>
        {item.reviews > 0 && (
          <div className="flex items-center gap-1.5">
            <Stars rating={item.rating} />
            <span className="text-[11px] text-gray-400">{item.rating} · {item.reviews.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t border-gray-100 pt-2 flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-extrabold text-gray-900 leading-tight">${item.price.toFixed(2)}</p>
            {item.originalPrice && (
              <p className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
            )}
          </div>
          <Link
            href={href}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-hover active:scale-95 transition-all shadow-sm shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8M7 13L5.4 5M17 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            Shop
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TrendingPage() {
  const products = await getTrendingProducts();

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-[#0a0a0f]">
          {/* Glow blobs */}
          <div className="absolute -left-24 -top-24 w-96 h-96 bg-[#8223D2]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

          <div className="relative mx-auto max-w-screen-xl px-4 py-16 lg:py-20 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#c084fc] bg-[#8223D2]/20 border border-[#8223D2]/30 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
              Top picks this week
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Trending Now
            </h1>
            <p className="mt-3 text-white/60 text-sm lg:text-base max-w-md mx-auto leading-relaxed">
              The accessories everyone is buying right now — handpicked and flying off the shelves.
            </p>

            {products.length > 0 && (
              <p className="mt-5 text-white/40 text-xs font-semibold uppercase tracking-widest">
                {products.length} trending {products.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="mx-auto max-w-screen-xl px-3 sm:px-4 lg:px-6 py-12">

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">No trending products yet</h2>
              <p className="text-sm text-gray-500 max-w-xs">Check back soon — new trending picks are added regularly.</p>
              <Link href="/collections" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover transition-colors shadow-md">
                Browse Collections
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
              {products.map((item) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
