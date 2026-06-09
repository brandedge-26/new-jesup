import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import ScrollStory from "@/components/ScrollStory";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/collectionData";

export const metadata: Metadata = {
  title: "Jesup Shop — Premium Phone Accessories & Gadgets",
  description: "Discover top-rated phone cases, screen protectors, earbuds, power banks and more. Expert-curated accessories for iPhone, Samsung, Google Pixel and Motorola.",
  openGraph: {
    title: "Jesup Shop — Premium Phone Accessories & Gadgets",
    description: "Expert-curated phone accessories — cases, audio, screen protection, power & more.",
    url: "/",
  },
};

export const dynamic = "force-dynamic";

const API = process.env.NEXT_PUBLIC_API_URL;

// ── API helpers ───────────────────────────────────────────────────────────────

function mapProduct(p: Record<string, unknown>, i: number): Product {
  return {
    id: String(p._id ?? i),
    name: p.name as string,
    brand: (p.brand as string) ?? "",
    price: p.price as number,
    originalPrice: (p.originalPrice as number) ?? undefined,
    rating: (p.rating as number) ?? 4.5,
    reviews: (p.reviews as number) ?? 0,
    image: (p.image as string) ?? "",
    badge: (p.badge as Product["badge"]) ?? undefined,
    colors: (p.colors as string[]) ?? [],
    inStock: (p.inStock as boolean) ?? true,
    slug: (p.slug && String(p.slug).length > 0) ? String(p.slug) : String(p._id ?? i),
  };
}

async function fetchFeatured(type: "trending" | "new-arrival"): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/featured?type=${type}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json() as Record<string, unknown>[];
    return data.slice(0, 4).map(mapProduct);
  } catch { return []; }
}

async function fetchNewArrivals(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/products?limit=4`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json() as { products?: Record<string, unknown>[] } | Record<string, unknown>[];
    const list = Array.isArray(data) ? data : (data as { products?: Record<string, unknown>[] }).products ?? [];
    return list.slice(0, 4).map(mapProduct);
  } catch { return []; }
}

async function fetchBestsellers(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/products/bestsellers?limit=4`, { cache: "no-store" });
    if (!res.ok) return [];
    const list = await res.json() as Record<string, unknown>[];
    return list.map((p, i) => ({
      id: String(p._id ?? i),
      name: p.name as string,
      brand: (p.brand as string) ?? "",
      price: p.price as number,
      originalPrice: (p.originalPrice as number) ?? undefined,
      rating: (p.rating as number) ?? 0,
      reviews: (p.totalSold as number) ?? 0,
      image: (p.image as string) ?? "",
      badge: "Best Seller" as Product["badge"],
      colors: [],
      inStock: true,
      slug: (p.slug as string) ?? String(p._id ?? i),
    }));
  } catch { return []; }
}

// ── Static UI data ─────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "Top Rated": "bg-emerald-500 text-white",
  "Sale": "bg-red-500 text-white",
  "New": "bg-primary text-white",
  "Limited": "bg-orange-500 text-white",
};


const phoneDevices = [
  { brand: "iPhone", sub: "Cases, chargers & more", href: "/collections/devices", image: "/home/phones/iphone.png", accent: "#8223D2" },
  { brand: "Samsung", sub: "Galaxy covers & cables", href: "/collections/devices", image: "/home/phones/samsung2.png", accent: "#1d4ed8" },
  { brand: "Google", sub: "Pixel accessories & glass", href: "/collections/devices", image: "/home/phones/google-pixel.png", accent: "#16a34a" },
  { brand: "Motorola", sub: "Moto gear & screen guards", href: "/collections/devices", image: "/home/phones/motrols.png", accent: "#dc2626" },
  { brand: "LG", sub: "LG covers & power accessories", href: "/collections/devices", image: "/home/phones/lg.png", accent: "#ea580c" },
];

const valueProps = [
  { title: "Fast, Tracked Shipping", body: "Most orders ship within one business day so you can gear up quickly.", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" /> },
  { title: "Easy 30-Day Returns", body: "Changed your mind? Hassle-free returns on eligible items within 30 days.", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> },
  { title: "Expert-Approved Picks", body: "Curated accessories tested by repair pros for fit, finish, and durability.", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
      {children}
    </span>
  );
}

function ProductCard({ item, showBadge = true }: { item: Product; showBadge?: boolean }) {
  const discountPct = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : null;

  return (
    <article className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Link href={`/products/${item.slug}`} className="block w-full h-full">
          <Image
            src={item.image} alt={item.name} fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </Link>
        {showBadge && item.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1 shadow ${BADGE_STYLES[item.badge]}`}>
            {item.badge}
          </span>
        )}
        {discountPct && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-1">
            -{discountPct}%
          </span>
        )}
        {!showBadge && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1">New</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{item.brand}</p>
        <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors leading-snug line-clamp-2 flex-1">
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
          <Link href={`/products/${item.slug}`} className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-hover active:scale-95 transition-all shadow-sm shrink-0">
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

// Bestseller card — horizontal layout
function BestsellerCard({ item }: { item: Product }) {
  return (
    <Link href={`/products/${item.slug}`} className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-3 hover:border-primary/30 hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-50">
        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="64px" />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary truncate">{item.brand}</p>
        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">{item.name}</p>
        {item.reviews > 0 && (
          <div className="mt-1 flex items-center gap-2">
            <Stars rating={item.rating} />
            <span className="text-[11px] text-gray-400">{item.reviews.toLocaleString()} units sold</span>
          </div>
        )}
      </div>
      {/* Price */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-extrabold text-gray-900">${item.price.toFixed(2)}</p>
        {item.originalPrice && (
          <p className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
        )}
      </div>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const [trending, rawNewArrivals, bestsellers] = await Promise.all([
    fetchFeatured("trending"),
    fetchNewArrivals(),
    fetchBestsellers(),
  ]);

  const trendingSlugs = new Set(trending.map((p) => p.slug));
  const newArrivals = rawNewArrivals.filter((p) => !trendingSlugs.has(p.slug));


  return (
    <>
      <Header />

      <main className="flex-1 bg-white">

        {/* ── Hero Banner ── */}
        <HeroBanner />

        <div className="mx-auto max-w-screen-xl px-3 sm:px-4 lg:px-6 mt-10 space-y-20 pb-24">

          {/* ── New Arrivals ── */}
          {newArrivals.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-7">
                <div>
                  <SectionLabel>Just landed</SectionLabel>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">New Arrivals</h2>
                  <p className="mt-1.5 text-gray-500 text-sm lg:text-base">Fresh drops — the latest products just added to the store.</p>
                </div>
                <Link href="/new-arrivals" className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1 items-center">
                  View all <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
                {newArrivals.map((item) => <ProductCard key={item.id} item={item} showBadge={false} />)}
              </div>
              <Link href="/new-arrivals" className="sm:hidden mt-4 flex items-center justify-center text-sm font-semibold text-primary transition-colors gap-1">
                View all →
              </Link>
            </section>
          )}

          {/* ── Shop by Phone ── */}
          <section>
            <div className="flex items-end justify-between mb-7">
              <div>
                <SectionLabel>By Device</SectionLabel>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Shop by Phone</h2>
                <p className="mt-1.5 text-gray-500 text-sm lg:text-base">Accessories made for your exact device.</p>
              </div>
              <Link href="/collections/devices" className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1 items-center">
                All devices <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
              {phoneDevices.map((d) => (
                <Link
                  key={d.brand}
                  href={d.href}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col"
                >
                  {/* Phone image */}
                  <div className="relative h-40 lg:h-48 bg-gray-50 overflow-hidden flex items-center justify-center">
                    <Image
                      src={d.image}
                      alt={`${d.brand} accessories`}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 20vw"
                    />
                    {/* Subtle accent glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `radial-gradient(circle at 50% 80%, ${d.accent}18 0%, transparent 70%)` }} />
                  </div>

                  {/* Text */}
                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Accessories</p>
                    <h3 className="text-base font-extrabold text-gray-900 leading-tight">{d.brand}</h3>
                    <p className="text-xs text-gray-500 leading-snug hidden sm:block">{d.sub}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                      Shop now
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to right, ${d.accent}, transparent)` }} />
                </Link>
              ))}
            </div>

            <Link href="/collections/devices" className="sm:hidden mt-4 flex items-center justify-center text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1">
              Browse all devices →
            </Link>
          </section>

          {/* ── Promo strip ── */}
          <section className="relative overflow-hidden rounded-2xl bg-[#0a0a0f]">
            <div className="absolute -left-20 -top-20 w-72 h-72 bg-[#8223D2]/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-[#8223D2]/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="relative px-6 py-10 lg:px-14 lg:py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
              <div className="max-w-lg">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#c084fc] bg-[#8223D2]/20 border border-[#8223D2]/30 rounded-full px-3 py-1 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
                  Limited time offer
                </span>
                <h2 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                  Bundle &amp; save —<br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#818cf8]">cases + screen protection</span>
                </h2>
                <p className="mt-3 text-white/60 text-sm lg:text-base leading-relaxed">
                  Pair a slim case with tempered glass and save automatically at checkout.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/collections/deals"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#8223D2] to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#8223D2]/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Shop bundles
                </Link>
                <Link href="/collections"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/15 text-white/80 font-semibold text-sm hover:bg-white/10 hover:border-white/30 hover:text-white transition-all backdrop-blur-sm">
                  Browse all
                </Link>
              </div>
            </div>
          </section>

          {/* ── Trending Now ── */}
          {trending.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-7">
                <div>
                  <SectionLabel>Top picks</SectionLabel>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Trending Now</h2>
                  <p className="mt-1.5 text-gray-500 text-sm lg:text-base">Top-rated accessories customers love this week.</p>
                </div>
                <Link href="/trending" className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1 items-center">
                  See all →
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
                {trending.map((item) => <ProductCard key={item.id} item={item} showBadge />)}
              </div>
              <Link href="/trending" className="sm:hidden mt-4 flex items-center justify-center text-sm font-semibold text-primary transition-colors gap-1">
                See all trending →
              </Link>
            </section>
          )}

          {/* ── Bestsellers ── */}
          {bestsellers.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-7">
                <div>
                  <SectionLabel>Most loved</SectionLabel>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Bestsellers</h2>
                  <p className="mt-1.5 text-gray-500 text-sm lg:text-base">We can&apos;t keep these off the shelves.</p>
                </div>
                <Link href="/collections" className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1 items-center">
                  Shop all →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {bestsellers.map((item) => (
                  <BestsellerCard key={item.id} item={item} />
                ))}
              </div>

              <Link href="/collections" className="sm:hidden mt-4 flex items-center justify-center text-sm font-semibold text-primary transition-colors gap-1">
                Shop all →
              </Link>
            </section>
          )}

          {/* ── Split feature ── */}
          <section className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="relative min-h-[280px] lg:min-h-[420px] rounded-3xl overflow-hidden group shadow-lg">
              <Image src="/home/tech-arrivals-banner.jpg" alt="New Tech Arrivals" fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw" />
              {/* Gradient from bottom + slight left tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-7 lg:p-10">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Just Dropped
                </span>
                <h3 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight mb-2">
                  Fresh Tech,<br />Every Week.
                </h3>
                <p className="text-sm text-white/70 max-w-xs leading-relaxed mb-6">
                  The latest gadgets, accessories & drops — curated by our repair pros before anyone else gets them.
                </p>
                <div className="flex gap-3">
                  <Link href="/new-arrivals"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-primary-hover transition-all">
                    Shop new arrivals
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/trending"
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-all">
                    Trending
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-gray-100 bg-gray-50 p-7 lg:p-10 shadow-sm">
              <SectionLabel>Built for real life</SectionLabel>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Protection that fits your routine</h3>
              <p className="mt-3 text-gray-500 text-sm lg:text-base leading-relaxed">
                Whether you commute, travel, or work from home — we stock screen protectors, cases, and chargers chosen for real-world wear.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                {["Oleophobic coatings that stay clearer, longer", "Qi2 and MagSafe compatible power accessories", "Cases rated for drops without the bulk"].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex gap-3">
                <Link href="/collections/screen-protection" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors text-sm gap-2 shadow-sm">
                  Shop protection
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link href="/collections/cases" className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition-colors text-sm">
                  Shop cases
                </Link>
              </div>
            </div>
          </section>

        </div>

        {/* ── Scroll Story ── */}
        <ScrollStory />

        {/* ── Why Jesup Shop ── */}
        <div className="mx-auto max-w-screen-xl px-3 sm:px-4 lg:px-6 py-16">
          <div className="text-center mb-10">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
              Why Jesup
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              We do things better at Jesup Wireless
            </h2>
            <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Our accessories are hand-tested and recommended by the same repair technicians who fix your devices every day — so you always get the right gear.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5" style={{ gridTemplateRows: "auto auto" }}>

            {/* ── Left large card — Expert techs (row-span-2) ── */}
            <div className="relative rounded-3xl overflow-hidden bg-[#0f0a1a] sm:row-span-2 min-h-[320px] lg:min-h-[480px] flex flex-col justify-between p-7">
              {/* Glow */}
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/40 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c084fc]">Expert Approved</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight max-w-xs">
                  Recommended by our repair techs
                </h3>
                <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-xs">
                  Every product is tested and approved by our in-store technicians — the same experts who repair your devices daily.
                </p>
              </div>

              {/* Team image — replace with your Pinterest image */}
              <div className="relative z-10 mt-6 rounded-2xl overflow-hidden h-44 lg:h-56 bg-white/5">
                <Image
                  src="/home/repair-team.jpg"
                  alt="Jesup Wireless repair team"
                  fill
                  className="object-cover object-top opacity-90"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                {/* Fallback gradient if image missing */}
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div> */}
              </div>
            </div>

            {/* ── Top right — Free Returns (photo card) ── */}
            <div className="relative rounded-3xl overflow-hidden min-h-[220px] lg:col-span-2">
              <Image
                src="/home/free-banner.webp"
                alt="Free returns"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 66vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 p-7 flex flex-col justify-center h-full">
                <h3 className="text-xl lg:text-2xl font-extrabold text-white leading-tight max-w-xs">
                  Free returns, no questions asked
                </h3>
                <p className="mt-2 text-sm text-white/70 max-w-xs leading-relaxed">
                  Not satisfied? Return any item within 30 days — hassle-free, no stress.
                </p>
              </div>
            </div>

            {/* ── Bottom right — two small icon cards ── */}
            <div className="rounded-3xl bg-primary/5 border border-primary/10 p-6 flex flex-col gap-4 hover:bg-primary/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Fast & free delivery</h3>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">Free shipping on all orders over $50. Get your gear delivered fast.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-gray-50 border border-gray-100 p-6 flex flex-col gap-4 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">100% authentic products</h3>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">Every item is sourced directly from verified brands — no knock-offs, ever.</p>
              </div>
            </div>

          </div>
        </div>

        <div className="mx-auto max-w-screen-xl px-3 sm:px-4 lg:px-6 pb-24">

          {/* ── Value props ── */}
          <section className="grid md:grid-cols-3 gap-4 lg:gap-5">
            {valueProps.map((vp) => (
              <div key={vp.title} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>{vp.icon}</svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{vp.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{vp.body}</p>
                </div>
              </div>
            ))}
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
