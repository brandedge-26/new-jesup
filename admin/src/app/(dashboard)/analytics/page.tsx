import { WEEKLY_REVENUE, MONTHLY_REVENUE, ORDERS, PRODUCTS } from "@/lib/mockData";

function MetricCard({ title, value, sub, icon, color }: {
  title: string; value: string; sub: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{title}</p>
        <p className="text-xl font-extrabold text-gray-900 mt-0.5">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function WeeklyBarChart() {
  const max = Math.max(...WEEKLY_REVENUE.map((d) => d.amount));
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Daily Revenue</h2>
          <p className="text-sm text-gray-400 mt-0.5">This week</p>
        </div>
        <p className="text-lg font-extrabold text-gray-900">
          ${WEEKLY_REVENUE.reduce((s, d) => s + d.amount, 0).toLocaleString()}
        </p>
      </div>
      <div className="flex items-end gap-2 h-36">
        {WEEKLY_REVENUE.map((d, i) => {
          const pct = (d.amount / max) * 100;
          const isToday = i === WEEKLY_REVENUE.length - 1;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-semibold text-gray-700 hidden sm:block">
                ${d.amount >= 1000 ? `${(d.amount / 1000).toFixed(1)}k` : d.amount}
              </span>
              <div className="w-full flex items-end" style={{ height: "100px" }}>
                <div
                  className={`w-full rounded-t-xl transition-all ${isToday ? "bg-primary" : "bg-gray-100"}`}
                  style={{ height: `${pct}%`, minHeight: "6px" }}
                />
              </div>
              <span className="text-xs text-gray-400 font-medium">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthlyTrendChart() {
  const max = Math.max(...MONTHLY_REVENUE.map((d) => d.amount));
  const min = Math.min(...MONTHLY_REVENUE.map((d) => d.amount));
  const range = max - min || 1;

  // Build SVG polyline
  const w = 500; const h = 120;
  const pad = { x: 20, y: 16 };
  const innerW = w - pad.x * 2;
  const innerH = h - pad.y * 2;

  const points = MONTHLY_REVENUE.map((d, i) => {
    const x = pad.x + (i / (MONTHLY_REVENUE.length - 1)) * innerW;
    const y = pad.y + (1 - (d.amount - min) / range) * innerH;
    return { x, y, ...d };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M${points[0].x},${h - pad.y} ` + points.map((p) => `L${p.x},${p.y}`).join(" ") + ` L${points[points.length - 1].x},${h - pad.y} Z`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Revenue Trend</h2>
          <p className="text-sm text-gray-400 mt-0.5">Last 6 months</p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          +12.4%
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8223D2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8223D2" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)" />
        <polyline fill="none" stroke="#8223D2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={polyline} />
        {points.map((p) => (
          <circle key={p.month} cx={p.x} cy={p.y} r="4" fill="#8223D2" stroke="white" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {MONTHLY_REVENUE.map((d) => (
          <span key={d.month} className="text-[11px] text-gray-400 font-medium">{d.month}</span>
        ))}
      </div>
    </div>
  );
}

function CategoryBreakdown() {
  const cats = ["Audio", "Cases", "Power", "Accessories", "Screen Protection"];
  const data = cats.map((cat) => {
    const rev = 0; // simplified
    const count = PRODUCTS.filter((p) => p.category === cat).length;
    const revenue = PRODUCTS.filter((p) => p.category === cat).reduce((s, p) => s + p.revenue, 0);
    return { cat, count, revenue };
  });
  const maxRev = Math.max(...data.map((d) => d.revenue));
  const totalRev = data.reduce((s, d) => s + d.revenue, 0);

  const COLORS: Record<string, string> = {
    Audio:             "bg-violet-500",
    Cases:             "bg-rose-500",
    Power:             "bg-amber-500",
    Accessories:       "bg-emerald-500",
    "Screen Protection": "bg-blue-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 mb-1">Revenue by Category</h2>
      <p className="text-sm text-gray-400 mb-5">All time breakdown</p>
      <div className="space-y-4">
        {data.sort((a, b) => b.revenue - a.revenue).map((d) => (
          <div key={d.cat}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${COLORS[d.cat]}`} />
                <span className="font-medium text-gray-700">{d.cat}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs">{Math.round((d.revenue / totalRev) * 100)}%</span>
                <span className="font-bold text-gray-900">${d.revenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full ${COLORS[d.cat]}`} style={{ width: `${(d.revenue / maxRev) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderFunnel() {
  const total = ORDERS.length;
  const steps = [
    { label: "Orders Placed",    count: total,                                                          pct: 100  },
    { label: "Confirmed",        count: ORDERS.filter((o) => o.status !== "Cancelled").length,           pct: 94   },
    { label: "Shipped",          count: ORDERS.filter((o) => ["Shipped","Delivered"].includes(o.status)).length, pct: 72 },
    { label: "Delivered",        count: ORDERS.filter((o) => o.status === "Delivered").length,           pct: 56   },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 mb-1">Order Funnel</h2>
      <p className="text-sm text-gray-400 mb-5">Conversion flow</p>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-gray-400 w-4">{i + 1}</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{s.label}</span>
                <span className="font-bold text-gray-900">{s.count}</span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${s.pct}%`, opacity: 1 - i * 0.15 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const totalRevenue = PRODUCTS.reduce((s, p) => s + p.revenue, 0);
  const cancelRate   = ((ORDERS.filter((o) => o.status === "Cancelled").length / ORDERS.length) * 100).toFixed(1);
  const repeatCustomers = 12; // mock

  return (
    <div className="space-y-5">
      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"  value={`$${(totalRevenue / 1000).toFixed(1)}k`}  sub="all time"
          color="bg-primary/10"
          icon={<svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MetricCard
          title="Conversion Rate" value="3.24%" sub="visitors → orders"
          color="bg-blue-50"
          icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <MetricCard
          title="Cancellation Rate" value={`${cancelRate}%`} sub="of all orders"
          color="bg-red-50"
          icon={<svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <MetricCard
          title="Repeat Customers" value={`${repeatCustomers}`} sub="ordered 2+ times"
          color="bg-emerald-50"
          icon={<svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyBarChart />
        <MonthlyTrendChart />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryBreakdown />
        <OrderFunnel />
      </div>

      {/* Top stats table */}
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
              {[...PRODUCTS].sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-400 font-bold text-sm">{i + 1}</td>
                  <td className="px-5 py-4 font-semibold text-gray-800 max-w-[200px] truncate">{p.name}</td>
                  <td className="px-5 py-4 text-gray-500">{p.category}</td>
                  <td className="px-5 py-4 font-bold text-gray-900">${p.price.toFixed(2)}</td>
                  <td className="px-5 py-4 text-gray-600">{p.stock}</td>
                  <td className="px-5 py-4 font-extrabold text-primary">${p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
