import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const categories = [
  {
    title: "Cases & protection",
    subtitle: "Slim, rugged, MagSafe-ready",
    href: "#",
    image: unsplash("photo-1511707171634-5f897c95e88f", 900),
  },
  {
    title: "Audio",
    subtitle: "Earbuds & over-ear picks",
    href: "#",
    image: unsplash("photo-1505740420928-5e560c06d30e", 900),
  },
  {
    title: "Power & cables",
    subtitle: "Fast charge, travel-ready",
    href: "#",
    image: unsplash("photo-1626806819282-2c1dc01a75e8", 900),
  },
  {
    title: "Everyday carry",
    subtitle: "Stands, grips, organizers",
    href: "#",
    image: unsplash("photo-1523275335684-37898b6baf30", 900),
  },
] as const;

const trending = [
  {
    name: "Crystal-clear tempered glass",
    price: "$29.99",
    image: unsplash("photo-1610945415295-d9bbf067e59c", 700),
  },
  {
    name: "Studio wireless headphones",
    price: "$149.99",
    image: unsplash("photo-1546435770-a3e426bf472b", 700),
  },
  {
    name: "Compact fast wall charger",
    price: "$34.99",
    image: unsplash("photo-1583863785174-e59266333d48", 700),
  },
  {
    name: "Slim fit phone case",
    price: "$39.99",
    image: unsplash("photo-1601784551446-20c9e07cdbdb", 700),
  },
] as const;

const valueProps = [
  {
    title: "Fast, tracked shipping",
    body: "Most orders ship within one business day so you can gear up quickly.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" />
    ),
  },
  {
    title: "Easy returns",
    body: "Changed your mind? Hassle-free returns on eligible items within 30 days.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    ),
  },
  {
    title: "Expert-approved picks",
    body: "Curated accessories tested by repair pros for fit, finish, and durability.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
] as const;

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-xl mx-4 lg:mx-6 xl:mx-10 mt-6">
          {/* Desktop banner */}
          <Image
            src="/home/banner/banner.webp"
            alt="Galaxy S26 gear is here"
            width={1400}
            height={540}
            className="w-full object-cover hidden md:block"
            priority
          />
          {/* Mobile banner */}
          <Image
            src="/home/banner/mobile-banner.webp"
            alt="Galaxy S26 gear is here"
            width={600}
            height={600}
            className="w-full object-cover block md:hidden"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-xs lg:max-w-sm">
              Galaxy S26 gear is here
            </h1>
            <p className="mt-3 text-sm lg:text-base text-gray-700 max-w-xs">
              Buying the new Samsung Galaxy® S26? You&apos;ll need some expert-approved accessories too.
            </p>
            <Link
              href="#"
              className="mt-6 inline-flex items-center justify-center px-7 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors w-fit text-sm lg:text-base"
            >
              Shop Now
            </Link>
          </div>
        </section>

        <div className="mx-4 lg:mx-6 xl:mx-auto max-w-screen-2xl mt-12 lg:mt-16 space-y-16 lg:space-y-24 pb-16">
          {/* Shop by category */}
          <section aria-labelledby="shop-categories-heading">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-10">
              <div>
                <h2 id="shop-categories-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  Shop by category
                </h2>
                <p className="mt-2 text-gray-600 max-w-xl text-sm lg:text-base">
                  From everyday protection to premium audio—find the right add-ons for your device.
                </p>
              </div>
              <Link
                href="#"
                className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors shrink-0"
              >
                View all categories →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                    <Image
                      src={cat.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{cat.subtitle}</p>
                    <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary">
                      Shop now
                      <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Promo strip */}
          <section className="relative overflow-hidden rounded-2xl bg-gray-900 text-white">
            <Image
              src={unsplash("photo-1556742049-0cfed4f6a45d", 1600)}
              alt=""
              width={1600}
              height={520}
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div className="relative px-6 py-12 lg:px-12 lg:py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-lg">
                <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Limited time</p>
                <h2 className="mt-2 text-2xl lg:text-4xl font-bold leading-tight">
                  Bundle & save on cases + screen protection
                </h2>
                <p className="mt-3 text-white/85 text-sm lg:text-base max-w-md">
                  Pair a slim case with tempered glass and checkout with automatic savings—no code needed.
                </p>
              </div>
              <Link
                href="#"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors shrink-0"
              >
                Shop bundles
              </Link>
            </div>
          </section>

          {/* Trending */}
          <section aria-labelledby="trending-heading">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-10">
              <div>
                <h2 id="trending-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  Trending now
                </h2>
                <p className="mt-2 text-gray-600 text-sm lg:text-base">Top-rated accessories customers add to cart this week.</p>
              </div>
              <Link href="#" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors shrink-0">
                See all deals →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {trending.map((item) => (
                <article
                  key={item.name}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <Link href="#" className="relative aspect-square bg-gray-50 block group">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <Link href="#" className="font-semibold text-gray-900 hover:text-primary transition-colors leading-snug">
                      {item.name}
                    </Link>
                    <p className="mt-3 text-lg font-bold text-gray-900">{item.price}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex text-amber-400" aria-hidden>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(128)</span>
                    </div>
                    <Link
                      href="#"
                      className="mt-5 inline-flex items-center justify-center w-full py-3 rounded-full border-2 border-gray-200 text-sm font-semibold text-gray-900 hover:border-primary hover:text-primary transition-colors"
                    >
                      Add to cart
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Split feature */}
          <section className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
            <div className="relative min-h-[280px] lg:min-h-[360px] rounded-2xl overflow-hidden border border-gray-200">
              <Image
                src={unsplash("photo-1472851294608-062f438d9794", 1200)}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                <h3 className="text-xl lg:text-2xl font-bold">New arrivals weekly</h3>
                <p className="mt-2 text-sm text-white/90 max-w-md">
                  Fresh colors, limited drops, and seasonal bundles—check back often.
                </p>
                <Link href="#" className="mt-4 inline-flex text-sm font-semibold text-white underline underline-offset-4 hover:no-underline">
                  Explore new arrivals
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 lg:p-10">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Protection that fits your routine</h3>
              <p className="mt-3 text-gray-600 text-sm lg:text-base leading-relaxed">
                Whether you commute, travel, or work from home, we stock screen protectors, cases, and chargers chosen for real-world wear.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Oleophobic coatings that stay clearer, longer
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Qi and MagSafe compatible power accessories
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Cases rated for drops without bulk
                </li>
              </ul>
              <Link
                href="#"
                className="mt-8 inline-flex w-fit items-center justify-center px-7 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors text-sm"
              >
                Shop protection
              </Link>
            </div>
          </section>

          {/* Value props */}
          <section className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {valueProps.map((vp) => (
              <div
                key={vp.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 lg:p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    {vp.icon}
                  </svg>
                </div>
                <h3 className="mt-5 font-semibold text-gray-900 text-lg">{vp.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{vp.body}</p>
              </div>
            ))}
          </section>

          {/* Newsletter */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[240px] h-full lg:min-h-[320px]">
                <Image
                  src={unsplash("photo-1566576912321-d58ddd7a6088", 1000)}
                  alt=""
                  fill
                  className="object-cover lg:rounded-l-2xl"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Stay in the loop</h2>
                <p className="mt-3 text-gray-600 text-sm lg:text-base">
                  Get launch alerts, bundle offers, and restock notices—no spam, unsubscribe anytime.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <label htmlFor="home-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="home-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    autoComplete="email"
                  />
                  <button
                    type="button"
                    className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  By subscribing you agree to receive marketing emails. See our privacy policy for details.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
