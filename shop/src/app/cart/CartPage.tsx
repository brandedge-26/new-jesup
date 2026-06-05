"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, type CartItem } from "@/store/cartStore";
import { privateAxios } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { stripePromise } from "@/lib/stripe";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Loader2, X } from "lucide-react";

interface PromoData {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

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
  const saving = item.originalPrice ? (item.originalPrice - item.price) * item.qty : 0;

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
            <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
            </button>
            <span className="w-9 text-center text-sm font-bold text-gray-900 select-none">{item.qty}</span>
            <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
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
      <button onClick={() => removeItem(item.key)} className="self-start p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors mt-1 shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
}

// ─── Stripe Card Form ─────────────────────────────────────────────────────────

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      color: "#111827",
      fontFamily: "inherit",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

interface StripeCardFormProps {
  items: CartItem[];
  promoCode: string;
  shippingAddress: Record<string, string>;
  total: number;
  onClearCart: () => void;
  onBack: () => void;
}

function StripeCardForm({ items, promoCode, shippingAddress, total, onClearCart, onBack }: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState<string | null>(null);

  async function handlePay() {
    if (!stripe || !elements) return;
    setError("");
    setLoading(true);

    try {
      // 1. Create PaymentIntent server-side (amount calculated there)
      const intentRes = await privateAxios.post("/payments/create-intent", {
        items: items.map((i) => ({ productId: i.productId, slug: i.slug, name: i.name, brand: i.brand, image: i.image, price: i.price, originalPrice: i.originalPrice, color: i.color, qty: i.qty })),
        promoCode,
      });

      const { clientSecret } = intentRes.data;

      // 2. Confirm card payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found.");

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) {
        setError(stripeError.message ?? "Payment failed. Please try again.");
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setError("Payment was not completed. Please try again.");
        return;
      }

      // 3. Create order with verified paymentIntentId
      const orderRes = await privateAxios.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, slug: i.slug, name: i.name, brand: i.brand, image: i.image, price: i.price, originalPrice: i.originalPrice, color: i.color, qty: i.qty })),
        promoCode,
        shippingAddress,
        paymentMethod: "stripe",
        paymentIntentId: paymentIntent.id,
      });

      // 4. Clear cart and show success screen
      onClearCart();
      setSuccessOrder(orderRes.data.order.orderNumber);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Success Screen ────────────────────────────────────────────────────────
  if (successOrder) {
    return (
      <div className="flex flex-col items-center text-center py-4 gap-5" style={{ animation: "fadeIn 0.4s ease" }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
          @keyframes checkPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.6); opacity: 0; } }
        `}</style>

        {/* Animated checkmark */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full bg-emerald-400/20" style={{ animation: "ring 1.2s ease-out infinite" }} />
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200" style={{ animation: "checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="text-lg font-extrabold text-gray-900">Payment Successful!</p>
          <p className="text-sm text-gray-400 mt-1">Your order has been placed</p>
          <p className="text-xs font-mono font-bold text-primary mt-2 bg-primary/8 px-3 py-1.5 rounded-full inline-block">
            #{successOrder}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 w-full pt-1">
          <Link
            href={`/track-order/${successOrder}`}
            className="w-full py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors text-sm text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            Track Order
          </Link>
          <Link
            href="/my-orders"
            className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors text-sm text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            My Orders
          </Link>
        </div>
      </div>
    );
  }

  // ── Card Form ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Card Details</label>
        <div className="rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 focus-within:border-primary focus-within:bg-white transition-all">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Secured by Stripe. Your card details are never stored on our servers.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
      )}

      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">Total</span>
        <span className="text-lg font-extrabold text-gray-900">${total.toFixed(2)}</span>
      </div>

      <button
        onClick={handlePay}
        disabled={loading || !stripe}
        className="w-full py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : `Pay $${total.toFixed(2)}`}
      </button>

      <button type="button" onClick={onBack} className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
        ← Back
      </button>
    </div>
  );
}

// ─── Checkout Modal ────────────────────────────────────────────────────────────

interface CheckoutForm {
  name: string; phone: string; street: string; city: string; state: string; zip: string;
}

type PaymentMethod = "stripe" | "paypal" | "cod" | null;
type Step = "shipping" | "payment";

function CheckoutModal({
  subtotal, shipping, discount, total, items, promoCode,
  onClose, onSuccess,
}: {
  subtotal: number; shipping: number; discount: number; total: number; items: CartItem[];
  promoCode: string;
  onClose: () => void; onSuccess: (orderNumber: string) => void;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const [step, setStep] = useState<Step>("shipping");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

  const [form, setForm] = useState<CheckoutForm>({
    name: user ? `${user.fname} ${user.lname}` : "",
    phone: "", street: "", city: "", state: "", zip: "",
  });

  const [codLoading, setCodLoading] = useState(false);
  const [codSuccess, setCodSuccess] = useState<string | null>(null);
  const [paypalSuccess, setPaypalSuccess] = useState<string | null>(null);
  const [paypalError, setPaypalError] = useState("");
  const [error, setError] = useState("");

  const setField = (k: keyof CheckoutForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls = "w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all";

  function handleShippingContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/login"); return; }
    setStep("payment");
  }

  async function handleCodOrder() {
    setError("");
    setCodLoading(true);
    try {
      const res = await privateAxios.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, slug: i.slug, name: i.name, brand: i.brand, image: i.image, price: i.price, originalPrice: i.originalPrice, color: i.color, qty: i.qty })),
        promoCode,
        shippingAddress: { ...form },
        paymentMethod: "cod",
      });
      onSuccess("__stripe__"); // clears cart, no redirect
      setCodSuccess(res.data.order.orderNumber);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setCodLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            {step === "payment" && (
              <button onClick={() => { setStep("shipping"); setPaymentMethod(null); setError(""); }} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <h2 className="text-base font-bold text-gray-900">
              {step === "shipping" ? "Shipping Details" : "Payment"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 py-5">

          {/* ── Step 1: Shipping ── */}
          {step === "shipping" && (
            <form onSubmit={handleShippingContinue} className="space-y-3">
              {!isAuthenticated && (
                <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
                  Please <button type="button" onClick={() => router.push("/login")} className="font-bold underline">sign in</button> to place an order.
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                <input required value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Ali Khan" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                <input required type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+1 234 567 8900" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Street Address</label>
                <input required value={form.street} onChange={(e) => setField("street", e.target.value)} placeholder="123 Main St" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">City</label>
                  <input required value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="New York" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">State</label>
                  <input required value={form.state} onChange={(e) => setField("state", e.target.value)} placeholder="NY" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ZIP Code</label>
                <input required value={form.zip} onChange={(e) => setField("zip", e.target.value)} placeholder="10001" className={inputCls} />
              </div>

              {/* Order summary */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo discount</span><span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isAuthenticated}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                Continue to Payment →
              </button>
            </form>
          )}

          {/* ── Step 2: Payment ── */}
          {step === "payment" && (
            <div className="space-y-4">

              {/* Method selector */}
              {!paymentMethod && (
                <>
                  <p className="text-sm text-gray-500 mb-2">Choose how you want to pay:</p>

                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 overflow-hidden">
                      <Image src="/payment/credit-card.png" alt="Credit Card" width={32} height={32} className="object-contain" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">Credit / Debit Card</p>
                      <p className="text-xs text-gray-400 mt-0.5">Visa, Mastercard, Amex — powered by Stripe</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-primary ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>

                  {/* PayPal */}
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-gray-100 hover:border-[#0070ba] hover:bg-[#0070ba]/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#e8f4fd] flex items-center justify-center shrink-0 overflow-hidden">
                      <Image src="/payment/paypal-icon.png" alt="PayPal" width={32} height={32} className="object-contain" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#0070ba] transition-colors">PayPal</p>
                      <p className="text-xs text-gray-400 mt-0.5">Fast & secure PayPal checkout</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-[#0070ba] ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-gray-100 hover:border-[#FFD992] hover:bg-[#ffd99245] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                      <Image src="/payment/cash-on-delivery.png" alt="Cash on Delivery" width={32} height={32} className="object-contain" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900 transition-colors">Cash on Delivery</p>
                      <p className="text-xs text-gray-400 mt-0.5">Pay when your order arrives</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}

              {/* ── Stripe card form ── */}
              {paymentMethod === "stripe" && (
                <Elements stripe={stripePromise}>
                  <StripeCardForm
                    items={items}
                    promoCode={promoCode}
                    shippingAddress={{ ...form }}
                    total={total}
                    onClearCart={() => onSuccess("__stripe__")}
                    onBack={() => setPaymentMethod(null)}
                  />
                </Elements>
              )}

              {/* ── PayPal ── */}
              {paymentMethod === "paypal" && (
                <div className="space-y-4">
                  {paypalSuccess ? (
                    <div className="flex flex-col items-center text-center py-4 gap-5" style={{ animation: "fadeIn 0.4s ease" }}>
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-20 h-20 rounded-full bg-emerald-400/20" style={{ animation: "ring 1.2s ease-out infinite" }} />
                        <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200" style={{ animation: "checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-extrabold text-gray-900">Payment Successful!</p>
                        <p className="text-sm text-gray-400 mt-1">Paid via PayPal</p>
                        <p className="text-xs font-mono font-bold text-primary mt-2 bg-primary/8 px-3 py-1.5 rounded-full inline-block">
                          #{paypalSuccess}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2.5 w-full pt-1">
                        <Link
                          href={`/track-order/${paypalSuccess}`}
                          className="w-full py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors text-sm text-center flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                          Track Order
                        </Link>
                        <Link
                          href="/my-orders"
                          className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors text-sm text-center flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          My Orders
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-[#e8f4fd] border border-[#0070ba]/20 rounded-xl px-4 py-3 text-sm text-[#003087]">
                        You will be charged <strong>${total.toFixed(2)}</strong> via PayPal.
                      </div>

                      {paypalError && (
                        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{paypalError}</div>
                      )}

                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">Total</span>
                        <span className="text-lg font-extrabold text-gray-900">${total.toFixed(2)}</span>
                      </div>

                      <PayPalButtons
                        style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay" }}
                        createOrder={async () => {
                          setPaypalError("");
                          const res = await privateAxios.post("/payments/paypal/create-order", {
                            items: items.map((i) => ({ productId: i.productId, slug: i.slug, name: i.name, brand: i.brand, image: i.image, price: i.price, originalPrice: i.originalPrice, color: i.color, qty: i.qty })),
                            promoCode,
                          });
                          return res.data.orderID;
                        }}
                        onApprove={async (data) => {
                          setPaypalError("");
                          try {
                            const res = await privateAxios.post("/payments/paypal/capture-order", {
                              orderID: data.orderID,
                              items: items.map((i) => ({ productId: i.productId, slug: i.slug, name: i.name, brand: i.brand, image: i.image, price: i.price, originalPrice: i.originalPrice, color: i.color, qty: i.qty })),
                              promoCode,
                              shippingAddress: { ...form },
                            });
                            onSuccess("__stripe__"); // clear cart, no redirect
                            setPaypalSuccess(res.data.order.orderNumber);
                          } catch (err: unknown) {
                            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
                            setPaypalError(msg || "Failed to complete PayPal payment. Please try again.");
                          }
                        }}
                        onError={() => setPaypalError("PayPal payment failed. Please try again.")}
                      />

                      <button type="button" onClick={() => { setPaymentMethod(null); setPaypalError(""); }} className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
                        ← Back
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* ── Cash on Delivery ── */}
              {paymentMethod === "cod" && (
                <div className="space-y-4">
                  {codSuccess ? (
                    // Success screen
                    <div className="flex flex-col items-center text-center py-4 gap-5" style={{ animation: "fadeIn 0.4s ease" }}>
                      <style>{`
                        @keyframes fadeIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
                        @keyframes checkPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
                        @keyframes ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.6); opacity: 0; } }
                      `}</style>

                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-20 h-20 rounded-full bg-emerald-400/20" style={{ animation: "ring 1.2s ease-out infinite" }} />
                        <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200" style={{ animation: "checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>

                      <div>
                        <p className="text-lg font-extrabold text-gray-900">Order Placed!</p>
                        <p className="text-sm text-gray-400 mt-1">Pay in cash when delivered</p>
                        <p className="text-xs font-mono font-bold text-primary mt-2 bg-primary/8 px-3 py-1.5 rounded-full inline-block">
                          #{codSuccess}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2.5 w-full pt-1">
                        <Link
                          href={`/track-order/${codSuccess}`}
                          className="w-full py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors text-sm text-center flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                          Track Order
                        </Link>
                        <Link
                          href="/my-orders"
                          className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors text-sm text-center flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          My Orders
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // COD form
                    <>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
                        You will pay <strong>${total.toFixed(2)}</strong> in cash when your order is delivered.
                      </div>

                      {error && <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}

                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">Total</span>
                        <span className="text-lg font-extrabold text-gray-900">${total.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={handleCodOrder}
                        disabled={codLoading}
                        className="w-full py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                      >
                        {codLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : "Place Order →"}
                      </button>

                      <button type="button" onClick={() => setPaymentMethod(null)} className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
                        ← Back
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);

  // Promo state
  const [promoInput, setPromoInput] = useState("");
  const [promoData, setPromoData] = useState<PromoData | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price) * i.qty, 0);
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 4.99;
  const discount = promoData?.discountAmount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  async function applyPromo() {
    if (!promoInput.trim()) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    setPromoError("");
    setPromoLoading(true);
    try {
      const res = await privateAxios.post("/promos/validate", { code: promoInput.trim(), subtotal });
      setPromoData(res.data.promo);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPromoError(msg || "Invalid promo code.");
      setPromoData(null);
    } finally {
      setPromoLoading(false);
    }
  }

  function removePromo() {
    setPromoData(null);
    setPromoInput("");
    setPromoError("");
  }

  function handleOrderSuccess(orderNumber: string) {
    clearCart();
    setPromoData(null);
    setPromoInput("");
    // Stripe handles its own navigation via success screen buttons
    if (orderNumber === "__stripe__") return;
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
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      Promo
                      <span className="font-mono text-[10px] font-bold bg-emerald-100 px-1.5 py-0.5 rounded">{promoData?.code}</span>
                    </span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
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
                {["VISA", "MC", "AMEX", "STRIPE"].map((p) => (
                  <span key={p} className="px-2.5 py-1 bg-gray-100 rounded text-[9px] font-bold text-gray-500 tracking-widest">{p}</span>
                ))}
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-bold text-gray-900 mb-3">Promo Code</p>
              {promoData ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs font-bold text-emerald-700 font-mono tracking-widest">{promoData.code}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {promoData.discountType === "percentage" ? `${promoData.discountValue}% off` : `$${promoData.discountValue.toFixed(2)} off`}
                      {" · "}<span className="font-semibold">-${promoData.discountAmount.toFixed(2)} saved</span>
                    </p>
                  </div>
                  <button onClick={removePromo} className="p-1 text-emerald-500 hover:text-emerald-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                    />
                    <button
                      onClick={applyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {promoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 px-1">{promoError}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: "USD", intent: "capture" }}>
          <CheckoutModal
            subtotal={subtotal} shipping={shipping} discount={discount} total={total} items={items}
            promoCode={promoData?.code ?? ""}
            onClose={() => setShowCheckout(false)}
            onSuccess={handleOrderSuccess}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
}
