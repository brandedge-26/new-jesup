"use client";

import { useEffect, useState } from "react";
import { adminAxios } from "@/lib/axios";

// ── Types ──────────────────────────────────────────────────────────────────────

interface WeeklyDay   { day: string; date: string; amount: number }
interface MonthlyMo   { month: string; key: string; amount: number }
interface Category    { cat: string; revenue: number; count: number }
interface FunnelStep  { label: string; count: number; pct: number }
interface TopProduct  { id: string; name: string; category: string; price: number; stock: number; revenue: number }

interface Analytics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    cancelRate: string;
    avgOrderValue: number;
    repeatCustomers: number;
    monthlyChange: string | null;
  };
  weekly: WeeklyDay[];
  monthly: MonthlyMo[];
  categories: Category[];
  funnel: FunnelStep[];
  topProducts: TopProduct[];
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />;
}

// ── Metric Card ───────────────────────────────────────────────────────────────

function MetricCard({ title, value, sub, icon, color, loading }: {
  title: string; value: string; sub: string; icon: React.ReactNode; color: string; loading?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium">{title}</p>
        {loading ? (
          <>
            <Skeleton className="h-6 w-24 mt-1.5" />
            <Skeleton className="h-3 w-16 mt-1.5" />
          </>
        ) : (
          <>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Weekly Bar Chart ──────────────────────────────────────────────────────────

function WeeklyBarChart({ data, loading }: { data: WeeklyDay[]; loading: boolean }) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Daily Revenue</h2>
          <p className="text-sm text-gray-400 mt-0.5">This week</p>
        </div>
        {loading ? <Skeleton className="h-6 w-20" /> : (
          <p className="text-lg font-extrabold text-gray-900">
            ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        )}
      </div>
      {loading ? (
        <div className="flex items-end gap-2 h-36">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full bg-gray-100 animate-pulse rounded-t-xl" style={{ height: `${40 + Math.random() * 60}px` }} />
              <Skeleton className="h-3 w-6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-end gap-2 h-36">
          {data.map((d, i) => {
            const pct = (d.amount / max) * 100;
            const isToday = i === data.length - 1;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-gray-700 hidden sm:block">
                  {d.amount >= 1000 ? `$${(d.amount / 1000).toFixed(1)}k` : d.amount > 0 ? `$${d.amount.toFixed(2)}` : ""}
                </span>
                <div className="w-full flex items-end" style={{ height: "100px" }}>
                  <div
                    className={`w-full rounded-t-xl transition-all ${isToday ? "bg-primary" : "bg-gray-100"}`}
                    style={{ height: `${pct}%`, minHeight: d.amount > 0 ? "6px" : "0px" }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-medium">{d.day}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Monthly Trend Chart ───────────────────────────────────────────────────────

function MonthlyTrendChart({ data, change, loading }: { data: MonthlyMo[]; change: string | null; loading: boolean }) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  const min = Math.min(...data.map((d) => d.amount));
  const range = max - min || 1;

  const w = 500; const h = 120;
  const pad = { x: 20, y: 16 };
  const innerW = w - pad.x * 2;
  const innerH = h - pad.y * 2;

  const points = data.map((d, i) => ({
    x: pad.x + (i / Math.max(data.length - 1, 1)) * innerW,
    y: pad.y + (1 - (d.amount - min) / range) * innerH,
    ...d,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M${points[0].x},${h - pad.y} ` + points.map((p) => `L${p.x},${p.y}`).join(" ") + ` L${points[points.length - 1].x},${h - pad.y} Z`;

  const isPositive = change === null || parseFloat(change) >= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Revenue Trend</h2>
          <p className="text-sm text-gray-400 mt-0.5">Last 6 months</p>
        </div>
        {loading ? <Skeleton className="h-5 w-16" /> : change !== null ? (
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {isPositive
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />}
            </svg>
            {isPositive ? "+" : ""}{change}%
          </div>
        ) : (
          <span className="text-xs text-gray-400">vs last month</span>
        )}
      </div>
      {loading ? (
        <Skeleton className="w-full h-28" />
      ) : (
        <>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8223D2" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8223D2" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#areaGrad)" />
            <polyline fill="none" stroke="#8223D2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={polyline} />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" fill="#8223D2" stroke="white" strokeWidth="2" />
            ))}
          </svg>
          <div className="flex justify-between mt-2">
            {data.map((d, i) => (
              <span key={i} className="text-[11px] text-gray-400 font-medium">{d.month}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Category Breakdown ────────────────────────────────────────────────────────

const CAT_COLORS: Record<string, string> = {
  Audio:              "bg-violet-500",
  Cases:              "bg-rose-500",
  Power:              "bg-amber-500",
  Accessories:        "bg-emerald-500",
  "Screen Protection": "bg-blue-500",
};
function catColor(cat: string) {
  return CAT_COLORS[cat] ?? "bg-gray-400";
}

function CategoryBreakdown({ data, loading }: { data: Category[]; loading: boolean }) {
  const maxRev   = Math.max(...data.map((d) => d.revenue), 1);
  const totalRev = data.reduce((s, d) => s + d.revenue, 0) || 1;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 mb-1">Revenue by Category</h2>
      <p className="text-sm text-gray-400 mb-5">All time breakdown</p>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-full mb-1.5" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400">No category data yet.</p>
      ) : (
        <div className="space-y-4">
          {data.map((d) => (
            <div key={d.cat}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${catColor(d.cat)}`} />
                  <span className="font-medium text-gray-700">{d.cat}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs">{Math.round((d.revenue / totalRev) * 100)}%</span>
                  <span className="font-bold text-gray-900">${d.revenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${catColor(d.cat)}`} style={{ width: `${(d.revenue / maxRev) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Order Funnel ──────────────────────────────────────────────────────────────

function OrderFunnel({ data, loading }: { data: FunnelStep[]; loading: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 mb-1">Order Funnel</h2>
      <p className="text-sm text-gray-400 mb-5">Conversion flow</p>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-2.5 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-gray-400 w-4">{i + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{s.label}</span>
                  <span className="font-bold text-gray-900">{s.count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${s.pct}%`, opacity: 1 - i * 0.15 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const EMPTY_ANALYTICS: Analytics = {
  summary: { totalRevenue: 0, totalOrders: 0, cancelRate: "0.0", avgOrderValue: 0, repeatCustomers: 0, monthlyChange: null },
  weekly:  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { day: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()], date: "", amount: 0 };
  }),
  monthly:  Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    return { month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()], key: "", amount: 0 };
  }),
  categories:  [],
  funnel: [
    { label: "Orders Placed", count: 0, pct: 100 },
    { label: "Confirmed",     count: 0, pct: 0 },
    { label: "Shipped",       count: 0, pct: 0 },
    { label: "Delivered",     count: 0, pct: 0 },
  ],
  topProducts: [],
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics>(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    adminAxios.get<Analytics>("/analytics")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  const { summary, weekly, monthly, categories, funnel, topProducts } = data;

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          loading={loading}
          title="Total Revenue"
          value={`$${summary.totalRevenue >= 1000 ? `${(summary.totalRevenue / 1000).toFixed(1)}k` : summary.totalRevenue.toFixed(0)}`}
          sub="all time"
          color="bg-primary/10"
          icon={<svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MetricCard
          loading={loading}
          title="Avg Order Value"
          value={`$${summary.avgOrderValue}`}
          sub="per order"
          color="bg-blue-50"
          icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <MetricCard
          loading={loading}
          title="Cancellation Rate"
          value={`${summary.cancelRate}%`}
          sub="of all orders"
          color="bg-red-50"
          icon={<svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MetricCard
          loading={loading}
          title="Repeat Customers"
          value={`${summary.repeatCustomers}`}
          sub="ordered 2+ times"
          color="bg-emerald-50"
          icon={<svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyBarChart data={weekly} loading={loading} />
        <MonthlyTrendChart data={monthly} change={summary.monthlyChange} loading={loading} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryBreakdown data={categories} loading={loading} />
        <OrderFunnel data={funnel} loading={loading} />
      </div>

      {/* Top products table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Product Performance</h2>
          <p className="text-sm text-gray-400 mt-0.5">Top 5 by revenue</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["#", "Product", "Category", "Price", "Stock", "Revenue"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : topProducts.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">No product data yet.</td>
                    </tr>
                  )
                  : topProducts.map((p, i) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-gray-400 font-bold text-sm">{i + 1}</td>
                        <td className="px-5 py-4 font-semibold text-gray-800 max-w-[200px] truncate">{p.name}</td>
                        <td className="px-5 py-4 text-gray-500">{p.category}</td>
                        <td className="px-5 py-4 font-bold text-gray-900">${p.price.toFixed(2)}</td>
                        <td className="px-5 py-4 text-gray-600">{p.stock}</td>
                        <td className="px-5 py-4 font-extrabold text-primary">${p.revenue.toLocaleString()}</td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
