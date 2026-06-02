import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { type Product } from "@/lib/collectionData";

export const metadata: Metadata = {
  title: "All Collections — Shop by Category",
  description: "Browse all accessory collections at Jesup Shop — cases, audio, screen protection, power, and accessories for every device.",
  openGraph: {
    title: "All Collections | Jesup Shop",
    description: "Shop cases, audio, screen protection, power accessories and more — all in one place.",
    url: "/collections",
  },
};

// ─── API helper ───────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL;

async function fetchFeaturedByCategory(category: string, limit = 4): Promise<Product[]> {
  try {
    const res = await fetch(
      `${API}/products?category=${encodeURIComponent(category)}&status=Active&limit=${limit}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json() as { products: Record<string, unknown>[] };
    return (data.products ?? []).map((p, i) => ({
      id:            String(p._id ?? i),
      name:          p.name as string,
      brand:         (p.brand as string) ?? "",
      price:         p.price as number,
      originalPrice: (p.originalPrice as number) ?? undefined,
      rating:        (p.rating as number) ?? 4.5,
      reviews:       (p.reviews as number) ?? 0,
      colors:        (p.colors as string[]) ?? [],
      image:         (p.image as string) ?? "",
      badge:         (p.badge as Product["badge"]) ?? undefined,
      inStock:       (p.inStock as boolean) ?? true,
      slug:          (p.slug as string) || String(p._id ?? i),
    }));
  } catch { return []; }
}

// ─── Static collection meta ────────────────────────────────────────────────

const collectionMeta = [
  {
    id: "audio",
    label: "Audio",
    description: "Premium sound for every lifestyle — earbuds, over-ear, gaming, and more.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    typeItems: [
      { label: "Premium",         href: "/collections/audio" },
      { label: "Gaming",          href: "/collections/audio" },
      { label: "Noise-Canceling", href: "/collections/audio" },
      { label: "In-Ear",          href: "/collections/audio" },
      { label: "Over-Ear",        href: "/collections/audio" },
      { label: "Bluetooth",       href: "/collections/audio" },
    ],
  },
  {
    id: "cases",
    label: "Cases",
    description: "Every style, every device — slim, rugged, wallet, and MagSafe-ready.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    typeItems: [
      { label: "MagSafe",      href: "/collections/cases" },
      { label: "Fashion",      href: "/collections/cases" },
      { label: "Case Wallets", href: "/collections/cases" },
      { label: "Rugged",       href: "/collections/cases" },
      { label: "Slim",         href: "/collections/cases" },
      { label: "Waterproof",   href: "/collections/cases" },
    ],
    deviceGroups: [
      {
        heading: "Apple",
        items: ["iPhone 17 Pro Max","iPhone 17 Pro","iPhone 17","iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16","iPhone 16e","iPhone 15 Pro Max","iPhone 15 Pro","iPhone 15"],
      },
      {
        heading: "Samsung",
        items: ["Galaxy S26 Ultra","Galaxy S26 Plus","Galaxy S26","Galaxy S25 Ultra","Galaxy S25","Galaxy S24 Ultra","Galaxy Z Fold 6","Galaxy Z Flip 6","Galaxy A16 5G"],
      },
      {
        heading: "Google",
        items: ["Pixel 9A","Pixel 9 Pro XL","Pixel 9 Pro","Pixel 9 Pro Fold","Pixel 9","Pixel 8 Pro","Pixel 8","Pixel 8A"],
      },
      {
        heading: "Motorola",
        items: ["Moto G Power 5G","Moto G Stylus 5G","Moto G Power","Motorola Edge","Motorola Razr"],
      },
    ],
  },
  {
    id: "screen-protection",
    label: "Screen Protection",
    description: "Tempered glass and film protectors for every screen size.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    typeItems: [
      { label: "iPhone",    href: "/collections/screen-protection" },
      { label: "Galaxy",    href: "/collections/screen-protection" },
      { label: "Pixel",     href: "/collections/screen-protection" },
      { label: "Motorola",  href: "/collections/screen-protection" },
      { label: "Tablet",    href: "/collections/screen-protection" },
      { label: "Wearables", href: "/collections/screen-protection" },
    ],
  },
  {
    id: "power",
    label: "Power",
    description: "Stay charged anywhere — cables, power banks, wireless pads, and car chargers.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    typeItems: [
      { label: "Cables & Adapters", href: "/collections/power" },
      { label: "Power Banks",       href: "/collections/power" },
      { label: "Charging Stands",   href: "/collections/power" },
      { label: "Car Chargers",      href: "/collections/power" },
      { label: "Wireless Charging", href: "/collections/power" },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    description: "Grips, mounts, organizers, gaming gear, and every everyday essential.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    typeItems: [
      { label: "Grips & Stands",   href: "/collections/accessories" },
      { label: "Gaming",           href: "/collections/accessories" },
      { label: "Car Mounts",       href: "/collections/accessories" },
      { label: "Wallets & Charms", href: "/collections/accessories" },
      { label: "MagSafe",          href: "/collections/accessories" },
    ],
  },
];

// ─── Gradient palette per collection ─────────────────────────────────────────

const TYPE_CARD_GRADIENTS: Record<string, string[]> = {
  audio:             ["from-violet-600 to-purple-500","from-purple-500 to-pink-500","from-blue-600 to-indigo-500","from-indigo-500 to-violet-600","from-fuchsia-500 to-purple-600","from-sky-500 to-blue-600"],
  cases:             ["from-gray-700 to-gray-500","from-slate-600 to-blue-500","from-zinc-600 to-gray-500","from-neutral-600 to-stone-500","from-gray-600 to-slate-700","from-stone-500 to-zinc-600"],
  "screen-protection":["from-emerald-500 to-teal-400","from-teal-500 to-cyan-400","from-cyan-500 to-sky-400","from-sky-500 to-blue-400","from-green-500 to-emerald-400","from-lime-500 to-green-500"],
  power:             ["from-yellow-500 to-amber-400","from-amber-400 to-orange-400","from-orange-400 to-yellow-500","from-lime-500 to-yellow-400","from-green-500 to-lime-400"],
  accessories:       ["from-rose-500 to-pink-400","from-pink-500 to-fuchsia-400","from-fuchsia-400 to-violet-500","from-purple-500 to-indigo-400","from-indigo-400 to-blue-500"],
};

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
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-amber-400" : "fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Type card (image or gradient) ───────────────────────────────────────────

function TypeCard({ label, href, gradient, image }: { label: string; href: string; gradient: string; image?: string }) {
  if (image) {
    return (
      <Link href={href} className="group relative overflow-hidden rounded-xl block aspect-square bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
        <Image src={image} alt={label} fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-xs font-bold text-white leading-tight drop-shadow-sm">{label}</p>
          <span className="mt-1 inline-flex items-center gap-0.5 text-[10px] font-medium text-white/70 group-hover:text-white transition-colors">
            Shop
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    );
  }
  return (
    <Link href={href} className={`group relative overflow-hidden rounded-xl block aspect-square bg-gradient-to-br ${gradient} shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]`}>
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
        <p className="text-xs font-bold text-white leading-tight drop-shadow-sm">{label}</p>
        <span className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-medium text-white/70 group-hover:text-white transition-colors">
          Shop
          <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

// ─── Mini product card ────────────────────────────────────────────────────────

function MiniProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image src={product.image} alt={product.name} fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw" />
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 ${BADGE_STYLES[product.badge]}`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{product.brand}</p>
        <p className="text-xs font-semibold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-2 flex-1">{product.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Stars rating={product.rating} />
          <span className="text-[10px] text-gray-400">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-100">
          <p className="text-sm font-extrabold text-gray-900">${product.price.toFixed(2)}</p>
          <span className="text-[10px] font-bold text-primary group-hover:underline">View →</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Device list item ─────────────────────────────────────────────────────────

function DeviceItem({ label }: { label: string }) {
  return (
    <Link href="/collections/cases"
      className="group flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm text-gray-700 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all">
      <span className="font-medium text-sm">{label}</span>
      <svg className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CollectionsPage() {
  const CATEGORY_MAP: Record<string, string> = {
    audio:              "Audio",
    cases:              "Cases",
    "screen-protection":"Screen Protection",
    power:              "Power",
    accessories:        "Accessories",
  };

  // Fetch featured products + card images for all sections in parallel
  const [featuredMap, cardImageMap] = await Promise.all([
    Promise.all(
      Object.entries(CATEGORY_MAP).map(async ([id, category]) => [
        id,
        await fetchFeaturedByCategory(category, 4),
      ])
    ).then(Object.fromEntries) as Promise<Record<string, Product[]>>,
    Promise.all(
      Object.entries(CATEGORY_MAP).map(async ([id, category]) => [
        id,
        await fetchFeaturedByCategory(category, 6),
      ])
    ).then(Object.fromEntries) as Promise<Record<string, Product[]>>,
  ]);

  return (
    <>
      <Header />

      <main className="flex-1 bg-white">

        {/* ── Hero — clean white ── */}
        <section className="bg-white border-b border-gray-100 px-4 py-12 lg:py-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="max-w-2xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
                All Collections
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                Shop Every Collection
              </h1>
              <p className="mt-4 text-gray-500 text-base lg:text-lg max-w-lg">
                Cases, audio, power, screen protection, and accessories — curated for your device.
              </p>
            </div>

            {/* Quick jump pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {collectionMeta.map((col) => (
                <a key={col.id} href={`#${col.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm">
                  {col.icon}
                  {col.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sections ── */}
        <div className="mx-auto max-w-screen-xl px-3 sm:px-4 lg:px-6 py-14 space-y-20">

          {collectionMeta.map((col, colIdx) => {
            const featured = featuredMap[col.id] ?? [];
            const gradients = TYPE_CARD_GRADIENTS[col.id] ?? [];
            const cardImages = cardImageMap[col.id] ?? [];

            return (
              <section key={col.id} id={col.id} className="scroll-mt-6">

                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
                      {col.icon}
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">{col.label}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{col.description}</p>
                    </div>
                  </div>
                  <Link href={`/collections/${col.id}`}
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold rounded-full border border-gray-200 px-5 py-2 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shrink-0">
                    Shop all {col.label}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Type gradient cards */}
                <div className={`grid gap-3 mb-10 ${col.typeItems.length === 5 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"}`}>
                  {col.typeItems.map((item, i) => (
                    <TypeCard
                      key={item.label}
                      label={item.label}
                      href={item.href}
                      gradient={gradients[i] ?? "from-gray-600 to-gray-400"}
                      image={cardImages[i]?.image || undefined}
                    />
                  ))}
                </div>

                {/* Cases: device groups */}
                {"deviceGroups" in col && col.deviceGroups && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {col.deviceGroups.map((group) => (
                      <div key={group.heading}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{group.heading}</h3>
                          <Link href="/collections/cases" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                            Shop all →
                          </Link>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {group.items.map((item) => <DeviceItem key={item} label={item} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Featured products from API */}
                {featured.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Featured Products</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                      {featured.map((product) => (
                        <MiniProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile shop all */}
                <Link href={`/collections/${col.id}`}
                  className="sm:hidden mt-6 inline-flex items-center gap-2 text-sm font-semibold rounded-full border border-gray-200 px-5 py-2.5 text-gray-700">
                  Shop all {col.label} →
                </Link>

                {colIdx < collectionMeta.length - 1 && (
                  <div className="mt-14 border-b border-gray-100" />
                )}
              </section>
            );
          })}

        </div>
      </main>

      <Footer />
    </>
  );
}
