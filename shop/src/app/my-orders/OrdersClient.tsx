"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { privateAxios } from "@/lib/axios";
import { Package, Truck, CheckCircle2, XCircle, Clock, ChevronRight, ShoppingBag, Loader2, Search } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

interface OrderItem {
  name: string; brand: string; image: string; price: number; qty: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  tracking?: string;
  estimatedDelivery?: string;
}

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  Processing: { label: "Processing", color: "text-amber-600",  bg: "bg-amber-50 border-amber-100",   icon: <Clock className="w-3.5 h-3.5" /> },
  Shipped:    { label: "Shipped",    color: "text-blue-600",   bg: "bg-blue-50 border-blue-100",     icon: <Truck className="w-3.5 h-3.5" /> },
  Delivered:  { label: "Delivered",  color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-100",icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  Cancelled:  { label: "Cancelled",  color: "text-red-500",    bg: "bg-red-50 border-red-100",       icon: <XCircle className="w-3.5 h-3.5" /> },
};

const TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
type Tab = typeof TABS[number];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Components ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function CancelConfirmModal({ orderNumber, onConfirm, onClose, loading }: {
  orderNumber: string; onConfirm: () => void; onClose: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <XCircle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Cancel Order?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to cancel order <span className="font-mono font-bold text-gray-800">#{orderNumber}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Keep Order
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onCancelled }: { order: Order; onCancelled: (id: string) => void }) {
  const [expanded,      setExpanded]      = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const previewItems = expanded ? order.items : order.items.slice(0, 2);
  const hiddenCount  = order.items.length - 2;

  async function handleCancel() {
    setCancelLoading(true);
    try {
      await privateAxios.patch(`/orders/${order._id}/cancel`);
      onCancelled(order._id);
      setShowConfirm(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || "Failed to cancel order.");
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <>
    {showConfirm && (
      <CancelConfirmModal
        orderNumber={order.orderNumber}
        onConfirm={handleCancel}
        onClose={() => setShowConfirm(false)}
        loading={cancelLoading}
      />
    )}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Order</p>
            <p className="text-sm font-bold text-gray-900">#{order.orderNumber}</p>
          </div>
          <div className="w-px h-8 bg-gray-100 hidden sm:block" />
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Placed</p>
            <p className="text-sm font-semibold text-gray-700">{formatDate(order.createdAt)}</p>
          </div>
          <div className="w-px h-8 bg-gray-100 hidden sm:block" />
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Total</p>
            <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="divide-y divide-gray-50">
        {previewItems.map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{item.brand}</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</p>
            </div>
            <p className="text-sm font-bold text-gray-900 shrink-0">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {order.items.length > 2 && (
        <button onClick={() => setExpanded((p) => !p)}
          className="w-full px-5 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-gray-50 text-center">
          {expanded ? "Show less" : `+ ${hiddenCount} more item${hiddenCount > 1 ? "s" : ""}`}
        </button>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-0.5">
          {order.tracking && <p>Tracking: <span className="font-mono font-semibold text-gray-700">{order.tracking}</span></p>}
          {order.estimatedDelivery && order.status !== "Delivered" && order.status !== "Cancelled" && (
            <p>Est. delivery: <span className="font-semibold text-gray-700">{order.estimatedDelivery}</span></p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/track-order/${order.orderNumber}`}
            className="px-4 py-2 rounded-full bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" /> Track Order
          </Link>
          {order.status === "Processing" && (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 rounded-full bg-red-50 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors flex items-center gap-1.5 border border-red-100"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <ShoppingBag className="w-9 h-9 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">
        {tab === "All" ? "No orders yet" : `No ${tab.toLowerCase()} orders`}
      </h3>
      <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">
        {tab === "All" ? "When you place your first order, it'll show up here." : `You don't have any ${tab.toLowerCase()} orders right now.`}
      </p>
      {tab === "All" && (
        <Link href="/collections" className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
          Start shopping <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function OrdersClient() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;
    privateAxios.get("/orders/my")
      .then((res) => setOrders(res.data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to view your orders</h2>
        <p className="mt-2 text-sm text-gray-400">You need to be logged in to see your order history.</p>
        <button onClick={() => router.push("/login")}
          className="mt-6 px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
          Sign in
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }

  function handleCancelled(id: string) {
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: "Cancelled" as OrderStatus } : o));
  }

  const filtered = activeTab === "All" ? orders : orders.filter((o) => o.status === activeTab);

  const counts: Record<Tab, number> = {
    All:        orders.length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Shipped:    orders.filter((o) => o.status === "Shipped").length,
    Delivered:  orders.filter((o) => o.status === "Delivered").length,
    Cancelled:  orders.filter((o) => o.status === "Cancelled").length,
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Account</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
        {user && <p className="mt-1 text-sm text-gray-400">Logged in as <span className="font-semibold text-gray-600">{user.fname} {user.lname}</span></p>}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {(["Processing", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setActiveTab(s)}
              className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${activeTab === s ? `${cfg.bg} border-opacity-100` : "bg-white border-gray-100 hover:border-gray-200"}`}>
              <div className={`p-2 rounded-xl mb-2 ${activeTab === s ? "bg-white/60" : "bg-gray-50"}`}>
                <span className={cfg.color}>{cfg.icon}</span>
              </div>
              <p className={`text-xl font-extrabold ${activeTab === s ? cfg.color : "text-gray-900"}`}>{counts[s]}</p>
              <p className="text-xs text-gray-400 font-medium">{s}</p>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 mb-6 overflow-x-auto scrollbar-none shadow-sm">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
            {tab}
            {counts[tab] > 0 && (
              <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => <OrderCard key={order._id} order={order} onCancelled={handleCancelled} />)}
        </div>
      )}
    </div>
  );
}
