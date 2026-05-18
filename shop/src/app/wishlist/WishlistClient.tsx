"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Trash2, ChevronRight, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";

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
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-amber-400" : "fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Not Logged In ──────────────────────────────────────────────────────────

function SignInPrompt() {
  const router = useRouter();
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Account</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Wishlist</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Lock className="w-9 h-9 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to save favourites</h2>
        <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">
          Create a free account or sign in to start saving the products you love.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/login")}
            className="px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-7 py-3 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            Create account
          </button>
        </div>
        <p className="mt-8 text-xs text-gray-400">
          Just browsing?{" "}
          <Link href="/collections" className="text-primary font-semibold hover:text-primary-hover transition-colors">
            Explore collections →
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Empty Wishlist ──────────────────────────────────────────────────────────

function EmptyWishlist() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Heart className="w-9 h-9 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Your wishlist is empty</h2>
      <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">
        Tap the heart icon on any product to save it here for later.
      </p>
      <Link
        href="/collections"
        className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
      >
        Browse products
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function WishlistClient() {
  const { isAuthenticated, user } = useAuthStore();
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (!isAuthenticated) return <SignInPrompt />;

  const handleAddToCart = (item: (typeof items)[number]) => {
    addToCart({
      productId: item.id,
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      color: "Default",
    });
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Account</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Wishlist</h1>
          {user && (
            <p className="mt-1 text-sm text-gray-400">
              {items.length > 0
                ? <>{items.length} saved item{items.length > 1 ? "s" : ""} for <span className="font-semibold text-gray-600">{user.fname} {user.lname}</span></>
                : <>Logged in as <span className="font-semibold text-gray-600">{user.fname} {user.lname}</span></>
              }
            </p>
          )}
        </div>
        {items.length > 0 && (
          <Link
            href="/collections"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            Add more
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const discountPct = item.originalPrice
              ? Math.round((1 - item.price / item.originalPrice) * 100)
              : null;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <Link href={`/products/${item.slug}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </Link>

                  {/* Badges */}
                  {item.badge && (
                    <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1 shadow ${BADGE_STYLES[item.badge] ?? "bg-gray-500 text-white"}`}>
                      {item.badge}
                    </span>
                  )}
                  {discountPct && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-1">
                      -{discountPct}%
                    </span>
                  )}

                  {/* Remove btn */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info */}
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

                  {/* Price + Cart */}
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-2 mt-auto">
                    <div>
                      <p className="text-base font-extrabold text-gray-900 leading-tight">${item.price.toFixed(2)}</p>
                      {item.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-hover active:scale-95 transition-all shadow-sm shrink-0"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to cart
                    </button>
                  </div>

                  {/* Added date */}
                  <p className="text-[10px] text-gray-300">
                    Saved {new Date(item.addedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
