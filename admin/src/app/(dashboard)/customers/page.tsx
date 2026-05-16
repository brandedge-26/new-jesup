"use client";

import { useState, useMemo } from "react";
import { CUSTOMERS } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 8;

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

export default function CustomersPage() {
  const [search,  setSearch]  = useState("");
  const [statusF, setStatusF] = useState<"All" | "Active" | "Inactive">("All");
  const [sortBy,  setSortBy]  = useState<"name" | "spent" | "orders" | "joined">("joined");
  const [page,    setPage]    = useState(1);

  const filtered = useMemo(() => {
    let data = [...CUSTOMERS];
    if (statusF !== "All") data = data.filter((c) => c.status === statusF);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      if (sortBy === "name")   return a.name.localeCompare(b.name);
      if (sortBy === "spent")  return b.totalSpent - a.totalSpent;
      if (sortBy === "orders") return b.orders - a.orders;
      return b.lastOrder.localeCompare(a.lastOrder);
    });
    return data;
  }, [search, statusF, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totalRevenue = CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0);
  const avgSpent     = totalRevenue / CUSTOMERS.length;
  const activeCount  = CUSTOMERS.filter((c) => c.status === "Active").length;

  return (
    <div className="space-y-5">
      {/* Mini stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: CUSTOMERS.length,            sub: "registered" },
          { label: "Active",          value: activeCount,                 sub: `${Math.round((activeCount / CUSTOMERS.length) * 100)}% active` },
          { label: "Total Revenue",   value: `$${totalRevenue.toFixed(0)}`, sub: "from customers" },
          { label: "Avg. Spend",      value: `$${avgSpent.toFixed(2)}`,   sub: "per customer" },
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">All Customers</h2>

          <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
            {/* Status filter */}
            <select
              value={statusF}
              onChange={(e) => { setStatusF(e.target.value as "All" | "Active" | "Inactive"); setPage(1); }}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

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

            {/* Add */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm shadow-primary/30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Customer
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Customer", "Phone", "City", "Orders", "Total Spent", "Last Order", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-gray-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                pageData.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} />
                        <div>
                          <p className="font-semibold text-gray-800 whitespace-nowrap">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{c.phone}</td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{c.city}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-900">{c.orders}</span>
                        <span className="text-gray-400 text-xs">orders</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">${c.totalSpent.toFixed(2)}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{c.lastOrder}</td>
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap text-xs">{c.joined}</td>
                    <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-4">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <button className="text-xs font-semibold text-primary hover:text-primary-hover">View</button>
                        <span className="text-gray-200">|</span>
                        <button className="text-xs font-semibold text-gray-400 hover:text-gray-600">Edit</button>
                      </div>
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
