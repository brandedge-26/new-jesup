"use client";

import { useState, useMemo } from "react";
import { ORDERS, type OrderStatus } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;
const ALL_STATUSES: (OrderStatus | "All")[] = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_COUNTS = (status: OrderStatus | "All") => {
  if (status === "All") return ORDERS.length;
  return ORDERS.filter((o) => o.status === status).length;
};

export default function OrdersPage() {
  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState<OrderStatus | "All">("All");
  const [page,    setPage]    = useState(1);

  const filtered = useMemo(() => {
    let data = ORDERS;
    if (status !== "All") data = data.filter((o) => o.status === status);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q)
      );
    }
    return data;
  }, [search, status]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageData    = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleStatus(s: OrderStatus | "All") {
    setStatus(s);
    setPage(1);
  }
  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  // Summary cards
  const revenue   = ORDERS.reduce((s, o) => s + o.total, 0);
  const delivered = ORDERS.filter((o) => o.status === "Delivered").length;

  return (
    <div className="space-y-5">

      {/* Mini stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",    value: ORDERS.length,           sub: "all time" },
          { label: "Total Revenue",   value: `$${revenue.toFixed(0)}`, sub: "all orders" },
          { label: "Delivered",       value: delivered,               sub: `${Math.round((delivered / ORDERS.length) * 100)}% success` },
          { label: "Pending / Processing", value: ORDERS.filter((o) => o.status === "Pending" || o.status === "Processing").length, sub: "need action" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className="text-xl font-extrabold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 pt-5 pb-0 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-base font-bold text-gray-900">All Orders</h2>
            <div className="sm:ml-auto flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search orders…"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-56"
                />
              </div>
              {/* Export btn */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0 -mx-1 px-1">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  status === s
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {s}
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                  status === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {STATUS_COUNTS(s)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-gray-100">
                {["Order ID", "Customer", "Product", "Date", "Payment", "Items", "Status", "Total", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-gray-400 text-sm">
                    No orders match your search.
                  </td>
                </tr>
              ) : (
                pageData.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-4 font-semibold text-primary whitespace-nowrap">{o.id}</td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-gray-800 whitespace-nowrap">{o.customer}</p>
                        <p className="text-xs text-gray-400">{o.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-[160px]">
                      <p className="text-gray-600 truncate" title={o.product}>{o.product}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{o.date}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{o.payment}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                        {o.items}
                      </span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-4 font-extrabold text-gray-900 whitespace-nowrap">${o.total.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-primary hover:text-primary-hover">
                        View →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-100 px-5">
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPage={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </div>
  );
}
