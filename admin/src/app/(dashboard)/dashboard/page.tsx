"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminAxios } from "@/lib/axios";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Order {
  _id: string;
  orderNumber: string;
  userId: { fname: string; lname: string; email: string } | null;
  items: { name: string; qty: number }[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  title, value, sub, icon, color, href, loading,
}: {
  title: string; value: string | number; sub?: string; icon: React.ReactNode;
  color: string; href?: string; loading?: boolean;
}) {
  const card = (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm transition-all ${href ? "hover:shadow-md hover:-translate-y-px cursor-pointer" : ""}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 font-medium">{title}</p>
        {loading ? (
          <div className="h-6 w-20 bg-gray-100 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        )}
        {sub && !loading && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

// ── Status Badge ──────────────────────────────────────────────────────────────

const ORDER_STATUS_STYLES: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Shipped:    "bg-blue-50 text-blue-700 border-blue-200",
  Delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled:  "bg-red-50 text-red-600 border-red-200",
};

function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ORDER_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [orders, setOrders]                 = useState<Order[]>([]);
  const [appointmentCount, setAppointmentCount] = useState<number | null>(null);
  const [pendingAppt, setPendingAppt]       = useState<number | null>(null);
  const [contactCount, setContactCount]     = useState<number | null>(null);
  const [ordersLoading, setOrdersLoading]   = useState(true);
  const [repairLoading, setRepairLoading]   = useState(true);

  useEffect(() => {
    // Orders
    adminAxios.get("/orders")
      .then((res) => setOrders(res.data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));

    // Appointments + Contacts
    Promise.all([
      adminAxios.get("/appointments").catch(() => ({ data: { appointments: [] } })),
      adminAxios.get("/contacts").catch(() => ({ data: { count: 0 } })),
    ]).then(([apptRes, contactRes]) => {
      const list: { status: string }[] = apptRes.data.appointments ?? [];
      setAppointmentCount(list.length);
      setPendingAppt(list.filter((a) => a.status === "pending").length);
      setContactCount(contactRes.data.count ?? 0);
    }).finally(() => setRepairLoading(false));
  }, []);

  // Computed order stats
  const totalRevenue   = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders    = orders.length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const recentOrders   = [...orders].slice(0, 6);

  const deliveredPct = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0;

  return (
    <div className="space-y-5">

      {/* ── Store Overview ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Store Overview</p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard
            title="Total Revenue" loading={ordersLoading}
            value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            sub="from all orders" color="bg-violet-50" href="/orders"
            icon={<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            title="Total Orders" value={totalOrders} loading={ordersLoading}
            sub={`${processingCount} processing`} color="bg-blue-50" href="/orders"
            icon={<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard
            title="Delivered" value={deliveredCount} loading={ordersLoading}
            sub={totalOrders > 0 ? `${deliveredPct}% success rate` : "no orders yet"} color="bg-emerald-50" href="/orders"
            icon={<svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            title="Avg. Order Value" loading={ordersLoading}
            value={totalOrders > 0 ? `$${(totalRevenue / totalOrders).toFixed(2)}` : "$0.00"}
            sub="per order" color="bg-amber-50"
            icon={<svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          />
        </div>
      </div>

      {/* ── Repair Center ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Repair Center</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            title="Total Appointments" value={appointmentCount ?? "—"} loading={repairLoading}
            sub="repair bookings" color="bg-purple-50" href="/repair/booking"
            icon={<svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <StatCard
            title="Pending Appointments" value={pendingAppt ?? "—"} loading={repairLoading}
            sub="awaiting confirmation" color="bg-yellow-50" href="/repair/booking"
            icon={<svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            title="Contact Messages" value={contactCount ?? "—"} loading={repairLoading}
            sub="from contact form" color="bg-pink-50" href="/repair/applications"
            icon={<svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Recent Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest store transactions</p>
          </div>
          <Link href="/orders" className="text-xs font-semibold text-primary hover:underline">View all →</Link>
        </div>

        {ordersLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-gray-400">No orders yet.</p>
            <p className="text-xs text-gray-300 mt-1">Orders will appear here once customers start purchasing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Order</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Customer</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Items</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-primary text-xs whitespace-nowrap">#{o.orderNumber}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800 text-xs whitespace-nowrap">
                        {o.userId ? `${o.userId.fname} ${o.userId.lname}` : "Guest"}
                      </p>
                      <p className="text-gray-400 text-[11px]">{o.userId?.email ?? "—"}</p>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 hidden md:table-cell">
                      {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell whitespace-nowrap">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-right font-bold text-gray-800 text-xs whitespace-nowrap">${o.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
