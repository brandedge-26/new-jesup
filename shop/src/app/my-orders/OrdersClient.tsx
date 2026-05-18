"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Package, Truck, CheckCircle2, XCircle, Clock, ChevronRight, ShoppingBag } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

interface OrderItem {
  name: string;
  brand: string;
  image: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  tracking?: string;
  estimatedDelivery?: string;
}

// ── Mock Orders ────────────────────────────────────────────────────────────

const MOCK_ORDERS: Order[] = [
  {
    id: "JW-10042",
    date: "May 14, 2026",
    status: "Shipped",
    total: 74.97,
    tracking: "1Z999AA10123456784",
    estimatedDelivery: "May 19, 2026",
    items: [
      { name: "iPhone 16 Pro Max MagSafe Case", brand: "OtterBox", image: "/shop/cases/case-1.png", price: 34.99, qty: 1 },
      { name: "USB-C to Lightning Braided Cable", brand: "Anker", image: "/shop/power/power-1.png", price: 19.99, qty: 2 },
    ],
  },
  {
    id: "JW-10039",
    date: "May 8, 2026",
    status: "Delivered",
    total: 129.98,
    items: [
      { name: "Galaxy S25 Ultra Tempered Glass", brand: "ZAGG", image: "/shop/screen-protection/sp-1.png", price: 44.99, qty: 1 },
      { name: "Pro Noise-Canceling Earbuds", brand: "JBL", image: "/shop/audio/audio-1.png", price: 84.99, qty: 1 },
    ],
  },
  {
    id: "JW-10031",
    date: "Apr 25, 2026",
    status: "Delivered",
    total: 49.99,
    items: [
      { name: "Wireless MagSafe Charging Stand", brand: "mophie", image: "/shop/power/power-3.png", price: 49.99, qty: 1 },
    ],
  },
  {
    id: "JW-10028",
    date: "Apr 18, 2026",
    status: "Cancelled",
    total: 24.99,
    items: [
      { name: "Pixel 9 Pro Slim Case", brand: "Case-Mate", image: "/shop/cases/case-3.png", price: 24.99, qty: 1 },
    ],
  },
  {
    id: "JW-10055",
    date: "May 17, 2026",
    status: "Processing",
    total: 39.99,
    estimatedDelivery: "May 22, 2026",
    items: [
      { name: "20W Fast Charge Power Bank", brand: "Anker", image: "/shop/power/power-2.png", price: 39.99, qty: 1 },
    ],
  },
];

// ── Config ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  Processing: {
    label: "Processing",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  Shipped: {
    label: "Shipped",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-100",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  Delivered: {
    label: "Delivered",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  Cancelled: {
    label: "Cancelled",
    color: "text-red-500",
    bg: "bg-red-50 border-red-100",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

// ── Components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const previewItems = expanded ? order.items : order.items.slice(0, 2);
  const hiddenCount = order.items.length - 2;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Order</p>
            <p className="text-sm font-bold text-gray-900">#{order.id}</p>
          </div>
          <div className="w-px h-8 bg-gray-100 hidden sm:block" />
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Placed</p>
            <p className="text-sm font-semibold text-gray-700">{order.date}</p>
          </div>
          <div className="w-px h-8 bg-gray-100 hidden sm:block" />
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Total</p>
            <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
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

      {/* Show more toggle */}
      {order.items.length > 2 && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full px-5 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-gray-50 text-center"
        >
          {expanded ? "Show less" : `+ ${hiddenCount} more item${hiddenCount > 1 ? "s" : ""}`}
        </button>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-0.5">
          {order.tracking && (
            <p>Tracking: <span className="font-mono font-semibold text-gray-700">{order.tracking}</span></p>
          )}
          {order.estimatedDelivery && order.status !== "Delivered" && order.status !== "Cancelled" && (
            <p>Est. delivery: <span className="font-semibold text-gray-700">{order.estimatedDelivery}</span></p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {order.status === "Delivered" && (
            <button className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Buy again
            </button>
          )}
          {order.status === "Shipped" && (
            <button className="px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Track order
            </button>
          )}
          <button className="px-4 py-2 rounded-full bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors flex items-center gap-1">
            Details
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
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
        {tab === "All"
          ? "When you place your first order, it'll show up here."
          : `You don't have any ${tab.toLowerCase()} orders right now.`}
      </p>
      {tab === "All" && (
        <Link
          href="/collections"
          className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          Start shopping
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function OrdersClient() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to view your orders</h2>
        <p className="mt-2 text-sm text-gray-400">You need to be logged in to see your order history.</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-6 px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          Sign in
        </button>
      </div>
    );
  }

  const filtered = activeTab === "All"
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((o) => o.status === activeTab);

  const counts: Record<Tab, number> = {
    All: MOCK_ORDERS.length,
    Processing: MOCK_ORDERS.filter((o) => o.status === "Processing").length,
    Shipped: MOCK_ORDERS.filter((o) => o.status === "Shipped").length,
    Delivered: MOCK_ORDERS.filter((o) => o.status === "Delivered").length,
    Cancelled: MOCK_ORDERS.filter((o) => o.status === "Cancelled").length,
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Account</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
        {user && (
          <p className="mt-1 text-sm text-gray-400">
            Logged in as <span className="font-semibold text-gray-600">{user.fname} {user.lname}</span>
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {(["Processing", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${activeTab === s ? `${cfg.bg} border-opacity-100` : "bg-white border-gray-100 hover:border-gray-200"}`}
            >
              <div className={`p-2 rounded-xl mb-2 ${activeTab === s ? "bg-white/60" : "bg-gray-50"}`}>
                <span className={cfg.color}>{cfg.icon}</span>
              </div>
              <p className={`text-xl font-extrabold ${activeTab === s ? cfg.color : "text-gray-900"}`}>
                {counts[s]}
              </p>
              <p className="text-xs text-gray-400 font-medium">{s}</p>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 mb-6 overflow-x-auto scrollbar-none shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-primary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

    </div>
  );
}
