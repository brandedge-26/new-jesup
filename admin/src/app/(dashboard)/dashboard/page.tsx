import Link from "next/link";
import { ORDERS, PRODUCTS, STATS, MONTHLY_REVENUE } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ title, value, change, icon, color }: {
  title: string; value: string; change: number; icon: React.ReactNode; color: string;
}) {
  const up = change >= 0;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
        <p className={`text-[11px] font-semibold mt-0.5 ${up ? "text-emerald-600" : "text-red-500"}`}>
          {up ? "▲" : "▼"} {Math.abs(change)}% from last month
        </p>
      </div>
    </div>
  );
}

// ── Revenue Chart ─────────────────────────────────────────────────────────────

function RevenueChart() {
  const max = Math.max(...MONTHLY_REVENUE.map((d) => d.amount));
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-gray-800">Revenue — Last 6 Months</h2>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12.4%</span>
      </div>
      <div className="flex items-end gap-2 h-32">
        {MONTHLY_REVENUE.map((d) => {
          const pct = (d.amount / max) * 100;
          const isLast = d.month === MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1].month;
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex items-end" style={{ height: "100px" }}>
                <div
                  title={`$${d.amount.toLocaleString()}`}
                  className={`w-full rounded-t-md ${isLast ? "bg-primary" : "bg-gray-100 hover:bg-gray-200 transition-colors"}`}
                  style={{ height: `${pct}%`, minHeight: "4px" }}
                />
              </div>
              <span className="text-[11px] text-gray-400">{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Recent Orders ─────────────────────────────────────────────────────────────

function RecentOrders() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-800">Recent Orders</h2>
        <Link href="/orders" className="text-xs font-semibold text-primary hover:underline">View all</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400">Order</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400">Customer</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 hidden md:table-cell">Date</th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400">Status</th>
              <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-400">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ORDERS.slice(0, 6).map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-semibold text-gray-700 text-xs">{o.id}</td>
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-800 text-xs">{o.customer}</p>
                  <p className="text-gray-400 text-[11px]">{o.email}</p>
                </td>
                <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">{o.date}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3 text-right font-bold text-gray-800 text-xs">${o.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Top Products ──────────────────────────────────────────────────────────────

function TopProducts() {
  const top = [...PRODUCTS].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800">Top Products</h2>
        <Link href="/products" className="text-xs font-semibold text-primary hover:underline">View all</Link>
      </div>
      <div className="space-y-3">
        {top.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-300 w-3 shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
              <p className="text-[11px] text-gray-400">{p.category}</p>
            </div>
            <span className="text-xs font-bold text-gray-800 shrink-0">${p.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard title="Total Revenue" value="$134,500" change={STATS.revenueChange} color="bg-violet-50"
          icon={<svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard title="Total Orders" value="1,284" change={STATS.ordersChange} color="bg-blue-50"
          icon={<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard title="Customers" value="892" change={STATS.customersChange} color="bg-emerald-50"
          icon={<svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard title="Avg. Order" value="$97.10" change={STATS.avgOrderChange} color="bg-amber-50"
          icon={<svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
      </div>

      {/* Revenue chart */}
      <RevenueChart />

      {/* Orders + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RecentOrders /></div>
        <TopProducts />
      </div>
    </div>
  );
}
