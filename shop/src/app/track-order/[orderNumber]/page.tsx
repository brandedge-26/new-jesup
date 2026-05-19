"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { publicAxios } from "@/lib/axios";
import {
  Package, Clock, Truck, CheckCircle2, XCircle,
  Loader2, Search, ChevronRight,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface TrackedOrder {
  orderNumber: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  itemCount: number;
  items: { name: string; brand: string; image: string; qty: number; price: number }[];
  tracking?: string;
  estimatedDelivery?: string;
  shippingName: string;
  shippingCity: string;
  createdAt: string;
}

// ── Config ─────────────────────────────────────────────────────────────────────

const STEPS = [
  { key: "Processing", label: "Order Placed",     icon: Package,      desc: "We received your order." },
  { key: "Shipped",    label: "Shipped",           icon: Truck,        desc: "Your order is on its way." },
  { key: "Delivered",  label: "Delivered",         icon: CheckCircle2, desc: "Order delivered successfully." },
] as const;

const STATUS_ORDER = ["Processing", "Shipped", "Delivered"];

function stepIndex(status: string) {
  return STATUS_ORDER.indexOf(status);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TrackOrderPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder]   = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!orderNumber) return;
    publicAxios.get(`/orders/track/${orderNumber}`)
      .then((res) => setOrder(res.data.order))
      .catch((err) => setError(err?.response?.data?.message ?? "Order not found."))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
        <p className="mt-2 text-sm text-gray-400 max-w-xs">{error}</p>
        <Link href="/track-order"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
          <Search className="w-4 h-4" /> Try again
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "Cancelled";
  const currentStep = isCancelled ? -1 : stepIndex(order.status);

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-10">

      {/* ── Success banner (shown right after placing) ── */}
      <div className="mb-6 px-5 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-emerald-800">Your order has been placed!</p>
          <p className="text-xs text-emerald-600 mt-0.5">
            Save your order number <span className="font-mono font-bold">{order.orderNumber}</span> — you can use it anytime to track your order at{" "}
            <Link href="/track-order" className="underline font-semibold">jesupwireless.com/track-order</Link>.
          </p>
        </div>
      </div>

      {/* ── Order header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Order Number</p>
            <p className="text-2xl font-extrabold text-gray-900 font-mono mt-0.5">{order.orderNumber}</p>
            <p className="text-xs text-gray-400 mt-1">Placed {formatDate(order.createdAt)} · {order.itemCount} item{order.itemCount !== 1 ? "s" : ""} · ${order.total.toFixed(2)}</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border self-start sm:self-auto ${
            isCancelled          ? "bg-red-50 text-red-600 border-red-100" :
            order.status === "Delivered"  ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
            order.status === "Shipped"    ? "bg-blue-50 text-blue-600 border-blue-100" :
                                           "bg-amber-50 text-amber-600 border-amber-100"
          }`}>
            {isCancelled          ? <XCircle className="w-4 h-4" /> :
             order.status === "Delivered"  ? <CheckCircle2 className="w-4 h-4" /> :
             order.status === "Shipped"    ? <Truck className="w-4 h-4" /> :
                                            <Clock className="w-4 h-4" />}
            {order.status}
          </div>
        </div>
      </div>

      {/* ── Progress tracker ── */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-6 mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Order Progress</p>
          <div className="relative">
            {/* connecting line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
            <div
              className="absolute left-5 top-5 w-0.5 bg-primary transition-all duration-700"
              style={{ height: currentStep === 0 ? "0%" : currentStep === 1 ? "50%" : "100%" }}
            />

            <div className="space-y-8">
              {STEPS.map((step, i) => {
                const done    = i <= currentStep;
                const active  = i === currentStep;
                const Icon    = step.icon;
                return (
                  <div key={step.key} className="relative flex items-start gap-5">
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      done ? "bg-primary border-primary" : "bg-white border-gray-200"
                    }`}>
                      <Icon className={`w-4 h-4 ${done ? "text-white" : "text-gray-300"}`} />
                    </div>
                    <div className="pt-1.5">
                      <p className={`text-sm font-bold ${done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                      <p className={`text-xs mt-0.5 ${active ? "text-primary font-semibold" : "text-gray-400"}`}>
                        {active ? step.desc : done ? "Completed" : "Pending"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking & ETA */}
          {(order.tracking || order.estimatedDelivery) && (
            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {order.tracking && (
                <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-0.5">Tracking #</p>
                  <p className="font-mono font-bold text-blue-700">{order.tracking}</p>
                </div>
              )}
              {order.estimatedDelivery && order.status !== "Delivered" && (
                <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-0.5">Est. Delivery</p>
                  <p className="font-semibold text-amber-700">{order.estimatedDelivery}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Cancelled notice ── */}
      {isCancelled && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-5">
          <p className="text-sm font-bold text-red-700">This order has been cancelled.</p>
          <p className="text-xs text-red-500 mt-0.5">If you have questions, please contact us.</p>
        </div>
      )}

      {/* ── Items ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-5 pt-5 pb-3">Items in this order</p>
        <div className="divide-y divide-gray-50">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{item.brand}</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.qty}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 shrink-0">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/my-orders"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <Package className="w-4 h-4" /> All My Orders
        </Link>
        <Link href="/track-order"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
          <Search className="w-4 h-4" /> Track Another Order <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
