"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package } from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) return;
    router.push(`/track-order/${trimmed}`);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Package className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Enter your order number (e.g. <span className="font-mono font-semibold text-gray-700">JW-10001</span>) to see the latest status of your order.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Order Number
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="JW-10001"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-900 font-mono text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors shadow-sm text-sm"
          >
            Track Order →
          </button>
        </form>

        {/* Info box */}
        <div className="mt-6 px-4 py-4 bg-amber-50 border border-amber-100 rounded-2xl">
          <p className="text-xs text-amber-700 font-semibold mb-1">Where is my order number?</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            Your order number was shown right after you placed your order, and it starts with <span className="font-mono font-bold">JW-</span>. You can also find it in <a href="/my-orders" className="underline font-semibold">My Orders</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
