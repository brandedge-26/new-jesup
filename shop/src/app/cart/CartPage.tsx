"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, type CartItem } from "@/store/cartStore";
import { privateAxios } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

// ─── Trust badges ─────────────────────────────────────────────────────────────

const TRUST = [
  { icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 1 0 0-4h14a2 2 0 1 0 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4" /></svg>), label: "Free Shipping", sub: "On orders over $50" },
  { icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 15v1a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1M21 12H9m0 0 3-3m-3 3 3 3" /></svg>), label: "30-Day Returns", sub: "Hassle-free guarantee" },
  { icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>), label: "Secure Checkout", sub: "256-bit SSL encryption" },
  { icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" /></svg>), label: "Expert Support", sub: "Mon–Sat, 9am–6pm" },
];

// ─── Cart Row ─────────────────────────────────────────────────────────────────

function CartRow({ item }: { item: CartItem }) {
  const { removeItem, updateQty } = useCartStore();
  const lineTotal = item.price * item.qty;
  const saving    = item.originalPrice ? (item.originalPrice - item.price) * item.qty : 0;

  return (
    <div className="flex gap-5 py-6 border-b border-gray-100 last:border-0">
      <Link href={`/products/${item.slug}`} className="shrink-0">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100">
          <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="112px" />
        </div>
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-0.5">{item.brand}</p>
          <Link href={`/products/${item.slug}`}>
            <p className="text-sm sm:text-base font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 leading-snug">{item.name}</p>
          </Link>
          {item.color && <p className="text-xs text-gray-400 mt-1">Color: {item.color}</p>}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
            <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Decrease">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
            </button>
            <span className="w-9 text-center text-sm font-bold text-gray-900 select-none">{item.qty}</span>
            <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Increase">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          <div className="text-right">
            <p className="text-base font-extrabold text-gray-900">${lineTotal.toFixed(2)}</p>
            {item.originalPrice && <p className="text-xs text-gray-400 line-through">${(item.originalPrice * item.qty).toFixed(2)}</p>}
            {saving > 0 && <p className="text-xs text-emerald-600 font-semibold">Save ${saving.toFixed(2)}</p>}
          </div>
        </div>
      </div>
      <button onClick={() => removeItem(item.key)} className="self-start p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors mt-1 shrink-0" aria-label="Remove item">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
}

// ─── Checkout Modal ────────────────────────────────────────────────────────────

interface CheckoutForm {
  name: string; phone: string; street: string; city: string; state: string; zip: string;
}

function CheckoutModal({
  subtotal, shipping, total, items,
  onClose, onSuccess,
}: {
  subtotal: number; shipping: number; total: number; items: CartItem[];
  onClose: () => void; onSuccess: (orderNumber: string) => void;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState<CheckoutForm>({
    name: user ? `${user.fname} ${user.lname}` : "",
    phone: "", street: "", city: "", state: "", zip: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof CheckoutForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls = "w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/login"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await privateAxios.post("/orders", {
        items: items.map((i) => ({
          productId: i.productId, slug: i.slug, name: i.name,
          brand: i.brand, image: i.image, price: i.price,
          originalPrice: i.originalPrice, color: i.color, qty: i.qty,
        })),
        subtotal, shipping, total,
        shippingAddress: { ...form },
      });
      onSuccess(res.data.order.orderNumber);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Shipping Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          {!isAuthenticated && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
              Please <button type="button" onClick={() => router.push("/login")} className="font-bold underline">sign in</button> to place an order.
            </div>
          )}
          {error && <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ali Khan" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
            <input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 234 567 8900" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Street Address</label>
            <input required value={form.street} onChange={(e) => set("street", e.target.value)} placeholder="123 Main St" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">City</label>
              <input required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="New York" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">State</label>
              <input required value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="NY" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ZIP Code</label>
            <input required value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="10001" className={inputCls} />
          </div>

          {/* Order total */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Order Total</span>
            <span className="text-lg font-extrabold text-gray-900">${total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={loading || !isAuthenticated}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : "Place Order →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);
  const savings   = items.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price) * i.qty, 0);
  const shipping  = subtotal >= 50 || subtotal === 0 ? 0 : 4.99;
  const total     = subtotal + shipping;
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  function handleOrderSuccess(orderNumber: string) {
    clearCart();
    setShowCheckout(false);
    router.push(`/track-order/${orderNumber}`);
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8 lg:py-12">

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Cart</h1>
        {items.length > 0 && <p className="text-sm text-gray-500 mt-1">{itemCount} item{itemCount !== 1 ? "s" : ""} in your cart</p>}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <svg className="w-11 h-11 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8M7 13L5.4 5M17 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 max-w-sm mb-8">Looks like you haven&apos;t added anything yet. Browse our collections to find something you&apos;ll love.</p>
          <Link href="/collections" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors shadow-sm">
            Shop Collections
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* Left — items */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-6">
              {items.map((item) => <CartRow key={item.key} item={item} />)}
            </div>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <Link href="/collections" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium">Clear cart</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {TRUST.map((t) => (
                <div key={t.label} className="flex flex-col items-center text-center gap-2 bg-white rounded-2xl border border-gray-100 p-4">
                  <span className="text-primary">{t.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{t.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — order summary */}
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Savings</span>
                    <span className="font-semibold">-${savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? <span className="font-semibold text-emerald-600">Free</span> : <span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>}
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                    Add <span className="font-bold text-amber-700">${(50 - subtotal).toFixed(2)}</span> more for free shipping
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Proceed to Checkout
              </button>

              <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                {["VISA", "MC", "AMEX", "PAYPAL", "APPLE"].map((p) => (
                  <span key={p} className="px-2.5 py-1 bg-gray-100 rounded text-[9px] font-bold text-gray-500 tracking-widest">{p}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-bold text-gray-900 mb-3">Promo Code</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter code" className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-700 transition-colors">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <CheckoutModal
          subtotal={subtotal} shipping={shipping} total={total} items={items}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}
