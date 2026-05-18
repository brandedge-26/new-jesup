import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, type Product } from "@/lib/collectionData";

export const metadata: Metadata = {
  title: "Jesup Shop — Premium Phone Accessories & Gadgets",
  description: "Discover top-rated phone cases, screen protectors, earbuds, power banks and more. Expert-curated accessories for iPhone, Samsung, Google Pixel and Motorola.",
  openGraph: {
    title: "Jesup Shop — Premium Phone Accessories & Gadgets",
    description: "Expert-curated phone accessories — cases, audio, screen protection, power & more.",
    url: "/",
  },
};

// ── Data ───────────────────────────────────────────────────────────────────────

const categories = [
  { title: "Cases", subtitle: "Slim, rugged & MagSafe-ready", href: "/collections/cases", image: COLLECTIONS.cases.products[7].image },
  { title: "Audio", subtitle: "Earbuds & over-ear picks", href: "/collections/audio", image: COLLECTIONS.audio.products[6].image },
  { title: "Power & Cables", subtitle: "Fast charge, travel-ready", href: "/collections/power", image: COLLECTIONS.power.products[0].image },
  { title: "Screen Protection", subtitle: "Tempered glass for every screen", href: "/collections/screen-protection", image: COLLECTIONS["screen-protection"].products[0].image },
] as const;

const trending: Product[] = [
  COLLECTIONS.audio.products.find((p) => p.badge === "Best Seller")!,
  COLLECTIONS.cases.products.find((p) => p.badge === "Best Seller")!,
  COLLECTIONS["screen-protection"].products.find((p) => p.badge === "Top Rated")!,
  COLLECTIONS.power.products.find((p) => p.badge === "Top Rated")!,
];

const newArrivals: Product[] = [
  ...COLLECTIONS.cases.products.filter((p) => p.badge === "New"),
  ...COLLECTIONS.audio.products.filter((p) => p.badge === "New"),
  ...COLLECTIONS.power.products.filter((p) => p.badge === "New"),
].slice(0, 4);

const brands = ["JBL", "OtterBox", "Anker", "ZAGG", "mophie", "Belkin", "UAG", "PopSockets", "Oladance", "Ventev", "Gadget Guard", "Case-Mate"];

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "Top Rated": "bg-emerald-500 text-white",
  "Sale": "bg-red-500 text-white",
  "New": "bg-primary text-white",
  "Limited": "bg-orange-500 text-white",
};

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
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        <Link
          href={`/products/${item.slug}`}

          className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors leading-snug line-clamp-2 flex-1"
        >
          {item.name}
        </Link>
        <div className="flex items-center gap-1.5">
          <Stars rating={item.rating} />
          <span className="text-[11px] text-gray-400">{item.rating} · {item.reviews.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-100 pt-2 flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-extrabold text-gray-900 leading-tight">${item.price.toFixed(2)}</p>
            {item.originalPrice && (
              <p className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
            )}
          </div>
          <Link
            href={`/products/${item.slug}`}

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

const valueProps = [
  {
    title: "Fast, Tracked Shipping",
    body: "Most orders ship within one business day so you can gear up quickly.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" />,
  },
  {
    title: "Easy 30-Day Returns",
    body: "Changed your mind? Hassle-free returns on eligible items within 30 days.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
  },
  {
    title: "Expert-Approved Picks",
    body: "Curated accessories tested by repair pros for fit, finish, and durability.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  },
] as const;

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-white">

        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden mx-3 sm:mx-4 lg:mx-6 mt-4 rounded-2xl" style={{ height: "calc(100vh - 100px)" }}>
          {/* Images */}
          <Image src="/home/desktpo-banner.png" alt="Jesup Shop — Premium Accessories" fill
            className="object-cover hidden md:block" priority />
          <Image src="/home/mobile-banner.png" alt="Jesup Shop — Premium Accessories" fill
            className="object-cover block md:hidden" priority />

          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-2xl" />

          {/* Text + CTA */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-14">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-white/70 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 w-fit mb-3">
              New Collection
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight max-w-lg drop-shadow-md">
              Gear Up.<br className="hidden sm:block" /> Stay Protected.
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white/80 max-w-sm leading-relaxed drop-shadow">
              Premium cases, audio &amp; power accessories — expert-picked for every device.
            </p>
            <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row gap-3 items-start">
              <Link href="/collections"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-bold text-gray-900 shadow-lg hover:bg-gray-100 transition-all group">
                Shop Collections
                <svg className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/collections/deals"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-hover transition-all border border-primary/60">
                View Deals
              </Link>
            </div>
          </div>
        </section>

        {/* ── Brand trust bar ── */}
        <div className="border-y border-gray-100 bg-gray-50 overflow-hidden py-4 mt-6">
          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="text-sm font-bold text-gray-400 tracking-wide shrink-0">{b}</span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl px-3 sm:px-4 lg:px-6 mt-14 space-y-20 pb-24">

          {/* ── Shop by Category ── */}
          <section>
            <div className="flex items-end justify-between mb-7">
              <div>
                <SectionLabel>Collections</SectionLabel>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
                <p className="mt-1.5 text-gray-500 text-sm lg:text-base">Find the perfect accessories for your device.</p>
              </div>
              <Link href="/collections" className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1 items-center">
                View all <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {categories.map((cat) => (
                <Link key={cat.title} href={cat.href} className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image src={cat.image} alt={cat.title} fill
                      className="object-cover transition-transform duration-600 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                    <p className="font-bold text-white text-sm lg:text-base leading-tight">{cat.title}</p>
                    <p className="mt-0.5 text-xs text-white/75 hidden sm:block">{cat.subtitle}</p>
                    <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                      Shop now
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/collections" className="sm:hidden mt-4 flex items-center justify-center text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1">
              View all categories →
            </Link>
          </section>

          {/* ── Promo strip ── */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8223D2] to-[#4a0f8a]">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            <div className="relative px-6 py-10 lg:px-14 lg:py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="max-w-lg">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/70 bg-white/10 rounded-full px-3 py-1 mb-3">
                  Limited time offer
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white leading-snug">
                  Bundle &amp; save — cases + screen protection
                </h2>
                <p className="mt-2 text-white/75 text-sm lg:text-base">
                  Pair a slim case with tempered glass and save automatically at checkout.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/collections/deals"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white text-[#8223D2] font-bold text-sm hover:bg-gray-50 transition-colors shadow-lg">
                  Shop bundles
                </Link>
                <Link href="/collections"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                  Browse all
                </Link>
              </div>
            </div>
          </section>

          {/* ── Trending Now ── */}
          <section>
            <div className="flex items-end justify-between mb-7">
              <div>
                <SectionLabel>Top picks</SectionLabel>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Trending Now</h2>
                <p className="mt-1.5 text-gray-500 text-sm lg:text-base">Top-rated accessories customers love this week.</p>
              </div>
              <Link href="/collections" className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1 items-center">
                See all →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {trending.map((item) => <ProductCard key={item.id} item={item} showBadge />)}
            </div>
          </section>

          {/* ── New Arrivals ── */}
          <section>
            <div className="flex items-end justify-between mb-7">
              <div>
                <SectionLabel>Just landed</SectionLabel>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">New Arrivals</h2>
                <p className="mt-1.5 text-gray-500 text-sm lg:text-base">Fresh drops — cases, audio &amp; power just landed.</p>
              </div>
              <Link href="/collections/deals" className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1 items-center">
                See all new →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {newArrivals.map((item) => <ProductCard key={item.id} item={item} showBadge={false} />)}
            </div>
          </section>

          {/* ── Split feature ── */}
          <section className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="relative min-h-[260px] lg:min-h-[380px] rounded-2xl overflow-hidden group shadow-md">
              <Image
                src={COLLECTIONS.cases.products[0].image}
                alt="New arrivals" fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-9 text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Just dropped</span>
                <h3 className="mt-1.5 text-xl lg:text-2xl font-bold leading-snug">New Arrivals Weekly</h3>
                <p className="mt-2 text-sm text-white/75 max-w-sm">
                  Fresh colors, limited drops, and seasonal bundles — check back often.
                </p>
                <Link href="/collections/deals" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/25 transition-all">
                  Explore new arrivals
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-gray-100 bg-gray-50 p-7 lg:p-10 shadow-sm">
              <SectionLabel>Built for real life</SectionLabel>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Protection that fits your routine</h3>
              <p className="mt-3 text-gray-500 text-sm lg:text-base leading-relaxed">
                Whether you commute, travel, or work from home — we stock screen protectors, cases, and chargers chosen for real-world wear.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                {[
                  "Oleophobic coatings that stay clearer, longer",
                  "Qi2 and MagSafe compatible power accessories",
                  "Cases rated for drops without the bulk",
                ].map((t) => (
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
                <Link href="/collections/screen-protection"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors text-sm gap-2 shadow-sm">
                  Shop protection
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/collections/cases"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition-colors text-sm">
                  Shop cases
                </Link>
              </div>
            </div>
          </section>

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
