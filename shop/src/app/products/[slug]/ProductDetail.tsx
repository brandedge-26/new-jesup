"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { COLOR_HEX, type Product } from "@/lib/collectionData";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { publicAxios } from "@/lib/axios";
import ReviewModal, { type ReviewData } from "@/components/ReviewModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "Top Rated":   "bg-emerald-500 text-white",
  "Sale":        "bg-red-500 text-white",
  "New":         "bg-primary text-white",
  "Limited":     "bg-orange-500 text-white",
};

function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "fill-amber-400" : "fill-gray-200"}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-700">{rating}</span>
      <span className="text-sm text-gray-400">({count.toLocaleString()} reviews)</span>
    </div>
  );
}

function RatingBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-4 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-6 shrink-0">{pct}%</span>
    </div>
  );
}

// Fake review distribution based on rating
function getRatingBars(rating: number) {
  const r = Math.round(rating * 10);
  return [
    { label: "5", pct: Math.min(95, Math.max(40, r * 6)) },
    { label: "4", pct: Math.min(40, Math.max(10, (r - 35) * 2)) },
    { label: "3", pct: Math.max(2, 50 - r * 3) },
    { label: "2", pct: Math.max(1, 20 - r * 2) },
    { label: "1", pct: Math.max(1, 10 - r) },
  ];
}

// Generate a 2-sentence product description
function getDescription(name: string, brand: string): string {
  const n = name.toLowerCase();
  const parts: string[] = [];

  if (n.includes("magsafe")) parts.push("Designed with MagSafe compatibility for effortless snap-on attachment");
  else if (n.includes("defender") || n.includes("rugged") || n.includes("military")) parts.push("Built with military-grade toughness to protect your device from everyday drops and bumps");
  else if (n.includes("commuter") || n.includes("slim")) parts.push("A slim yet protective case that fits seamlessly into your daily routine");
  else if (n.includes("tempered glass") || n.includes("glass screen") || n.includes("privacy xtr")) parts.push("Crystal-clear tempered glass that guards your screen against scratches and cracks");
  else if (n.includes("privacy")) parts.push("Features a built-in privacy filter to protect your screen from prying eyes");
  else if (n.includes("power bank") || n.includes("powercore") || n.includes("powerstation")) parts.push("A high-capacity portable power bank that keeps your devices charged all day long");
  else if (n.includes("wireless") && n.includes("ear")) parts.push("True wireless earbuds that deliver rich, high-fidelity audio without the tangle of cables");
  else if (n.includes("speaker")) parts.push("A powerful portable speaker that fills any room with bold, room-filling sound");
  else if (n.includes("headphone") || n.includes("headset") || n.includes("over-ear")) parts.push("Comfortable over-ear headphones engineered for long listening sessions");
  else if (n.includes("car charger")) parts.push("A compact car charger that rapidly powers up your devices during every commute");
  else if (n.includes("wall charger") || n.includes("gan")) parts.push("A fast, efficient wall charger built with GaN technology to charge smarter and run cooler");
  else if (n.includes("wireless charg") || n.includes("chargepad")) parts.push("Effortless wireless charging — just set your phone down and it starts charging immediately");
  else if (n.includes("cable")) parts.push("A durable, high-speed charging cable built to handle thousands of plug-ins without fraying");
  else if (n.includes("mount") || n.includes("dash")) parts.push("A secure car mount that keeps your phone perfectly positioned for hands-free navigation");
  else if (n.includes("wallet") || n.includes("popwallet")) parts.push("Combines a sleek phone grip with a built-in wallet to carry your essentials in style");
  else if (n.includes("popgrip") || n.includes("popsocket")) parts.push("The iconic phone grip that makes holding your phone more comfortable and secure");
  else parts.push(`The ${name} from ${brand} is built to the highest standard of quality and durability`);

  // Deterministic "random" number derived from the name string (avoids SSR/client mismatch)
  const seed = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const second = `Trusted by over ${((seed % 50) + 10) * 100}+ customers and backed by ${brand}'s quality guarantee, this is the accessory your device deserves.`;
  return `${parts[0]}. ${second}`;
}

// Generate feature bullets from product name
function getFeatures(name: string, brand: string): string[] {
  const n = name.toLowerCase();
  const features: string[] = [];

  if (n.includes("magsafe")) features.push("MagSafe compatible — snap-on magnetic attachment");
  if (n.includes("waterproof") || n.includes("waterproof")) features.push("Waterproof construction for worry-free use");
  if (n.includes("wireless")) features.push("Wireless charging compatible");
  if (n.includes("noise cancell")) features.push("Active Noise Cancellation for immersive sound");
  if (n.includes("gaming")) features.push("Optimized for gaming audio and communication");
  if (n.includes("bluetooth")) features.push("Bluetooth wireless connectivity");
  if (n.includes("rugged") || n.includes("defender") || n.includes("military") || n.includes("drop")) features.push("Military-grade drop protection");
  if (n.includes("slim") || n.includes("commuter") || n.includes("clear")) features.push("Slim, low-profile design that doesn't add bulk");
  if (n.includes("wallet") || n.includes("popwallet")) features.push("Built-in card holder for cards and cash");
  if (n.includes("tempered glass") || n.includes("glass screen")) features.push("Tempered glass for maximum screen clarity and hardness");
  if (n.includes("privacy")) features.push("Privacy filter — limits side-angle viewing");
  if (n.includes("power bank") || n.includes("powercore") || n.includes("powerstation")) features.push("Portable charging to power your devices on the go");
  if (n.includes("car charger") || n.includes("car charging")) features.push("Compact design fits any 12V car outlet");
  if (n.includes("usb-c")) features.push("USB-C fast charging support");
  if (n.includes("gan")) features.push("GaN technology — smaller and cooler than traditional chargers");
  if (n.includes("kids") || n.includes("junior") || n.includes("jr")) features.push("Volume-limited for safe listening for kids");
  if (n.includes("true wireless") || n.includes("tws")) features.push("True wireless stereo — no wires, no compromise");
  if (n.includes("mount") || n.includes("dash")) features.push("Secure mounting for hands-free phone use while driving");

  if (features.length < 3) {
    features.push(`Engineered by ${brand} for premium performance`);
    features.push("Compatible with leading device models");
    features.push("Backed by manufacturer warranty");
  }

  return features.slice(0, 5);
}

// ─── Image Zoom (Amazon-style) ────────────────────────────────────────────────

const ZOOM_FACTOR = 2.5;   // how much to magnify in the result panel
const LENS_SIZE   = 120;   // lens box side length in px

function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos]         = useState({ x: 0.5, y: 0.5 }); // 0-1
  const [active, setActive]   = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left)  / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top)   / rect.height));
    setPos({ x, y });
  }, []);

  // Lens position (clamp so lens doesn't overflow container)
  const lensLeft = `calc(${pos.x * 100}% - ${LENS_SIZE / 2}px)`;
  const lensTop  = `calc(${pos.y * 100}% - ${LENS_SIZE / 2}px)`;

  // Zoom result panel: position so the hovered point is centred in the panel.
  // bg-size = ZOOM_FACTOR * 100%. bg-position offsets are in % of (bgSize - panelSize).
  // Simplest accurate formula: use pixel offsets via a fixed image size.
  // We know the panel = square, image fills it at ZOOM_FACTOR scale.
  // bg-position-x% = pos.x * 100 maps linearly → gives correct result.
  const bgX = pos.x * 100;
  const bgY = pos.y * 100;

  return (
    <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
      {/* Main image container */}
      <div
        ref={containerRef}
        className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm cursor-crosshair select-none"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onMouseMove={handleMove}
      >
        {src.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="w-full h-full object-cover pointer-events-none" />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        )}

        {/* Lens overlay */}
        {active && (
          <div
            className="absolute border-2 border-primary/60 bg-primary/10 backdrop-blur-[1px] rounded-md pointer-events-none transition-none"
            style={{
              width:  LENS_SIZE,
              height: LENS_SIZE,
              left:   lensLeft,
              top:    lensTop,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.04)",
            }}
          />
        )}
      </div>

      {/* Zoom result panel — floats to the right on lg screens */}
      {active && (
        <div
          className="hidden lg:block absolute top-0 left-[calc(100%+16px)] w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-2xl z-30 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize:  `${ZOOM_FACTOR * 100}% ${ZOOM_FACTOR * 100}%`,
            backgroundPosition: `${bgX}% ${bgY}%`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </div>
  );
}

// Related product mini card
function RelatedCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <Image src={product.image} alt={product.name} fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw" />
        )}
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 ${BADGE_STYLES[product.badge]}`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{product.brand}</p>
        <p className="text-xs font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{product.name}</p>
        <p className="text-sm font-extrabold text-gray-900 mt-1">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  product: Product;
  collectionId: string;
  collectionTitle: string;
  related: Product[];
}

export default function ProductDetail({ product, collectionId, collectionTitle, related }: Props) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"features" | "reviews">("features");
  const [activeImage, setActiveImage] = useState(product.image);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const isDbProduct = /^[a-f\d]{24}$/i.test(product.id);
  const [reviewCount, setReviewCount] = useState(isDbProduct ? 0 : product.reviews);
  const [avgRating, setAvgRating] = useState(isDbProduct ? 0 : product.rating);
  const [showModal, setShowModal] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: wishAdd, removeItem: wishRemove, isWishlisted } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const wished = isWishlisted(product.id);

  // Fetch first page of reviews on mount (count shows in tab immediately)
  useEffect(() => {
    if (!isDbProduct) { setReviewsLoaded(true); return; }
    publicAxios.get(`/reviews/${product.id}?page=1&limit=6`)
      .then((res) => {
        const { reviews: data, total, totalPages } = res.data;
        setReviews(data);
        setReviewsLoaded(true);
        setReviewCount(total);
        setReviewTotalPages(totalPages);
        setReviewPage(1);
        if (total > 0) {
          const avg = data.reduce((s: number, r: ReviewData) => s + r.rating, 0) / data.length;
          setAvgRating(Math.round(avg * 10) / 10);
        } else {
          setAvgRating(0);
        }
      })
      .catch(() => setReviewsLoaded(true));
  }, [product.id]); // eslint-disable-line

  async function loadMoreReviews() {
    if (loadingMore || reviewPage >= reviewTotalPages) return;
    setLoadingMore(true);
    try {
      const res = await publicAxios.get(`/reviews/${product.id}?page=${reviewPage + 1}&limit=6`);
      setReviews((prev) => [...prev, ...res.data.reviews]);
      setReviewPage((p) => p + 1);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleReviewSuccess(review: ReviewData) {
    setReviews((prev) => [review, ...prev]);
    setReviewCount((c) => c + 1);
    const updated = [review, ...reviews];
    const avg = updated.reduce((s, r) => s + r.rating, 0) / updated.length;
    setAvgRating(Math.round(avg * 10) / 10);
    setShowModal(false);
  }

  function toggleWish() {
    if (wished) {
      wishRemove(product.id);
    } else {
      wishAdd({
        id: product.id, slug: product.slug, name: product.name,
        brand: product.brand, image: product.image, price: product.price,
        originalPrice: product.originalPrice, rating: product.rating,
        reviews: product.reviews, badge: product.badge,
      });
    }
  }

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const features = getFeatures(product.name, product.brand);
  const description = product.description || getDescription(product.name, product.brand);
  const ratingBars = getRatingBars(avgRating);

  // Build gallery: main image + variant images (deduped)
  const gallery = [product.image, ...(product.variantImages ?? [])].filter(
    (src, idx, arr) => src && arr.indexOf(src) === idx
  );

  function handleAdd() {
    if (added) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      color: selectedColor,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <>
      {showModal && isDbProduct && (
        <ReviewModal
          productId={product.id}
          productName={product.name}
          onClose={() => setShowModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-3 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/collections" className="hover:text-primary transition-colors">Collections</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/collections/${collectionId}`} className="hover:text-primary transition-colors">{collectionTitle}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main product section */}
      <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ── Left: Image ── */}
          <div className="space-y-4">
            {/* Main image with zoom */}
            <div className="relative">
              <ImageZoom src={activeImage} alt={product.name} />

              {/* Badges & wishlist — overlay on top of zoom component */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                {product.badge && (
                  <span className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1.5 shadow ${BADGE_STYLES[product.badge]}`}>
                    {product.badge}
                  </span>
                )}
                {discountPct && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full px-3 py-1.5 shadow">
                    -{discountPct}% OFF
                  </span>
                )}
              </div>
              <button
                onClick={toggleWish}
                className={`absolute bottom-4 right-4 p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all z-10
                  ${wished ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={wished ? "currentColor" : "none"}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Variant image thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {gallery.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(src)}
                    className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all bg-gray-50 ${
                      activeImage === src ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {src.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Image src={src} alt="" fill className="object-contain" sizes="64px" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Color thumbnails (when no variant images — static products) */}
            {gallery.length <= 1 && product.colors.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-10 h-10 rounded-xl border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary shadow-md scale-110"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{
                      backgroundColor: COLOR_HEX[color] ?? "#e5e7eb",
                      ...(color === "Clear" ? { background: "linear-gradient(135deg,#e5e7eb 40%,#fff 40%)" } : {}),
                    }}
                  >
                    {selectedColor === color && (
                      <svg
                        className={`absolute inset-0 m-auto w-4 h-4 ${["White","Clear","Silver","Starlight","Cream"].includes(color) ? "text-gray-700" : "text-white"}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="space-y-6">

            {/* Brand + name */}
            <div>
              <Link href={`/collections/${collectionId}`}
                className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors">
                {product.brand}
              </Link>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{product.name}</h1>
            </div>

            {/* Rating */}
            <Stars rating={product.rating} count={product.reviews} />

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through mb-0.5">${product.originalPrice.toFixed(2)}</span>
                  <span className="mb-0.5 text-sm font-bold text-red-500">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                </>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
                <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
              <span className="text-gray-300">·</span>
              <Link href={`/collections/${collectionId}`} className="text-sm text-gray-500 hover:text-primary transition-colors">
                {collectionTitle}
              </Link>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

            <div className="border-t border-gray-100" />

            {/* Color picker */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">
                  Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        selectedColor === color
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                        style={{
                          backgroundColor: COLOR_HEX[color] ?? "#e5e7eb",
                          ...(color === "Clear" ? { background: "linear-gradient(135deg,#e5e7eb 40%,#fff 40%)" } : {}),
                        }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-gray-900 select-none">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    disabled={qty >= 10}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                {qty > 1 && (
                  <span className="text-sm text-gray-500">
                    Subtotal: <span className="font-bold text-gray-900">${(product.price * qty).toFixed(2)}</span>
                  </span>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all shadow-sm
                  ${added
                    ? "bg-emerald-500 text-white"
                    : product.inStock
                      ? "bg-primary text-white hover:bg-primary-hover active:scale-[0.98]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {added ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8M7 13L5.4 5M17 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={toggleWish}
                className={`flex items-center justify-center w-13 h-13 rounded-full border-2 transition-all px-3.5 py-3.5
                  ${wished ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"}`}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={wished ? "currentColor" : "none"}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-3 pt-1">
              {[
                { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8", label: "Fast Shipping" },
                { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "30-Day Returns" },
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Genuine Product" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
                  <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                  </svg>
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Features / Reviews ── */}
        <div className="mt-14 lg:mt-20">
          <div className="flex gap-1 border-b border-gray-100 mb-8">
            {(["features", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 mr-6 text-sm font-semibold capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab === "features" ? "Features & Details" : `Reviews (${reviewCount.toLocaleString()})`}
              </button>
            ))}
          </div>

          {activeTab === "features" ? (
            <div className="grid md:grid-cols-2 gap-10">
              {/* Feature list */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product specs */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">Specifications</h3>
                <dl className="space-y-3">
                  {/* Always show base specs */}
                  {[
                    { label: "Brand",        value: product.brand },
                    ...(product.colors.length > 0 ? [{ label: "Colors", value: product.colors.join(", ") }] : []),
                    { label: "Rating",       value: `${product.rating} / 5.0` },
                    { label: "Reviews",      value: product.reviews.toLocaleString() },
                    { label: "Availability", value: product.inStock ? "In Stock" : "Out of Stock" },
                    // Append product-specific specs from backend
                    ...(product.specifications ?? []).map((s) => ({ label: s.key, value: s.value })),
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-start gap-4 py-2.5 border-b border-gray-100 last:border-0">
                      <dt className="text-sm font-semibold text-gray-500 w-28 shrink-0">{spec.label}</dt>
                      <dd className="text-sm text-gray-900">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-10">
              {/* Rating summary */}
              <div className="md:col-span-1">
                {reviewCount > 0 ? (
                  <>
                    <div className="text-center mb-6">
                      <p className="text-6xl font-extrabold text-gray-900">{avgRating}</p>
                      <div className="flex justify-center mt-2">
                        <Stars rating={avgRating} count={reviewCount} />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{reviewCount.toLocaleString()} total reviews</p>
                    </div>
                    <div className="space-y-2">
                      {ratingBars.map((b) => <RatingBar key={b.label} label={b.label} pct={b.pct} />)}
                    </div>
                  </>
                ) : (
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-400">No ratings yet</p>
                  </div>
                )}

                {/* Write a Review button — only for DB products */}
                {isDbProduct && (
                  <div className="mt-6">
                    {isAuthenticated ? (
                      <button
                        onClick={() => setShowModal(true)}
                        className="w-full rounded-full bg-primary text-white py-3 text-sm font-bold hover:bg-primary-hover active:scale-[0.98] transition-all"
                      >
                        Write a Review
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="flex items-center justify-center w-full rounded-full border-2 border-primary text-primary py-3 text-sm font-bold hover:bg-primary/5 transition-all"
                      >
                        Login to Write a Review
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Reviews list */}
              <div className="md:col-span-2 space-y-5">
                {!reviewsLoaded ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-5 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                        <div className="h-3 bg-gray-200 rounded w-4/5" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <svg className="w-14 h-14 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-base font-semibold text-gray-700">No reviews yet</p>
                    <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
                  </div>
                ) : (
                  reviews.map((review) => {
                    const initials = review.userName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                    <div key={review._id} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {initials}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{review.userName}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400" : "fill-gray-200"}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.title && <p className="text-sm font-semibold text-gray-800 mb-1">{review.title}</p>}
                      <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
                    </div>
                  );})
                )}

                {/* Load More */}
                {reviewsLoaded && reviewPage < reviewTotalPages && (
                  <button
                    onClick={loadMoreReviews}
                    disabled={loadingMore}
                    className="w-full mt-2 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
                  >
                    {loadingMore ? "Loading…" : `Load More (${reviewCount - reviews.length} remaining)`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <div className="flex items-end justify-between mb-7">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
                  From {collectionTitle}
                </span>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">You May Also Like</h2>
              </div>
              <Link href={`/collections/${collectionId}`}
                className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-hover transition-colors gap-1 items-center">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
