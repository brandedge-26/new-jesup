"use client";

import { useState, useMemo, useEffect } from "react";
import { adminAxios } from "@/lib/axios";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 8;

// ── Types ──────────────────────────────────────────────────────────────────────

interface Customer {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = [
    "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500",
    "bg-rose-500",   "bg-cyan-500", "bg-orange-500",  "bg-pink-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-9 h-9 rounded-full ${colors[idx]} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
      {initials}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search,  setSearch]      = useState("");
  const [sortBy,  setSortBy]      = useState<"joined" | "spent" | "orders" | "name">("joined");
  const [page,    setPage]        = useState(1);

  useEffect(() => {
    adminAxios.get("/users")
      .then((res) => setCustomers(res.data.users ?? []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let data = [...customers];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) =>
          `${c.fname} ${c.lname}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      if (sortBy === "name")   return `${a.fname} ${a.lname}`.localeCompare(`${b.fname} ${b.lname}`);
      if (sortBy === "spent")  return b.totalSpent - a.totalSpent;
      if (sortBy === "orders") return b.orderCount - a.orderCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return data;
  }, [customers, search, sortBy]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage     = Math.min(page, totalPages);
  const pageData     = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgSpent     = customers.length > 0 ? totalRevenue / customers.length : 0;
  const withOrders   = customers.filter((c) => c.orderCount > 0).length;

  return (
    <div className="space-y-5">

      {/* Mini stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: loading ? "—" : customers.length,                   sub: "registered users" },
          { label: "With Orders",     value: loading ? "—" : withOrders,                         sub: "have purchased" },
          { label: "Total Revenue",   value: loading ? "—" : `$${totalRevenue.toLocaleString()}`, sub: "from customers" },
          { label: "Avg. Spend",      value: loading ? "—" : `$${avgSpent.toFixed(2)}`,           sub: "per customer" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            {loading ? (
              <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mt-1" />
            ) : (
              <p className="text-xl font-extrabold text-gray-900 mt-1">{s.value}</p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">All Customers</h2>

          <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setPage(1); }}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer"
            >
              <option value="joined">Latest First</option>
              <option value="spent">Highest Spend</option>
              <option value="orders">Most Orders</option>
              <option value="name">Name A–Z</option>
            </select>

            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search customers…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-52"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Customer", "Orders", "Total Spent", "Last Order", "Joined"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                          <div className="h-2.5 w-36 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    {[1, 2, 3, 4].map((j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                pageData.map((c) => {
                  const name = `${c.fname} ${c.lname}`;
                  return (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={name} />
                          <div>
                            <p className="font-semibold text-gray-800 whitespace-nowrap">{name}</p>
                            <p className="text-xs text-gray-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-900">{c.orderCount}</span>
                          <span className="text-gray-400 text-xs">orders</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">${c.totalSpent.toFixed(2)}</td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                        {c.lastOrderDate ? formatDate(c.lastOrderDate) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-400 whitespace-nowrap text-xs">{formatDate(c.createdAt)}</td>
                    </tr>
                  );
                })
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
