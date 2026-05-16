"use client";

import { useState, useMemo } from "react";
import { REPAIR_BOOKINGS, RepairStatus, RepairBooking } from "@/lib/mockData";

const ALL_STATUSES: RepairStatus[] = ["Pending", "Diagnosing", "In Repair", "Ready", "Completed", "Cancelled"];

const STATUS_STYLES: Record<RepairStatus, string> = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Diagnosing: "bg-blue-50 text-blue-700 border-blue-200",
  "In Repair": "bg-purple-50 text-purple-700 border-purple-200",
  Ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-gray-100 text-gray-600 border-gray-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
};

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: RepairStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

function DeliveryBadge({ delivery }: { delivery: "Drop-off" | "Mail-in" }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${delivery === "Drop-off" ? "bg-indigo-50 text-indigo-600" : "bg-orange-50 text-orange-600"
      }`}>
      {delivery}
    </span>
  );
}

export default function RepairAppointmentPage() {
  const [statusFilter, setStatusFilter] = useState<"All" | RepairStatus>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<RepairBooking | null>(null);

  const filtered = useMemo(() => {
    let list = REPAIR_BOOKINGS;
    if (statusFilter !== "All") list = list.filter((b) => b.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.customer.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.brand.toLowerCase().includes(q) ||
        b.model.toLowerCase().includes(q) ||
        b.issue.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Repair Appointments</h1>
          <p className="text-sm text-gray-400 mt-0.5">{REPAIR_BOOKINGS.length} total appointments</p>
        </div>
        {/* <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm shadow-primary/30">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Appointment
        </button> */}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar: search + status filter */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by customer, device, issue…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as "All" | RepairStatus); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">ID</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Customer</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Device</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Issue</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Delivery</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Scheduled</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Estimate</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Technician</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-sm text-gray-400">No appointments found</td>
                </tr>
              ) : paginated.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs text-gray-500 whitespace-nowrap">{b.id}</td>
                  <td className="px-4 py-3.5 min-w-[160px]">
                    <p className="font-semibold text-gray-900">{b.customer}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{b.email}</p>
                    <p className="text-[11px] text-gray-400">{b.phone}</p>
                  </td>
                  <td className="px-4 py-3.5 min-w-[140px]">
                    <p className="font-medium text-gray-800">{b.brand} {b.model}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{b.device}</p>
                  </td>
                  <td className="px-4 py-3.5 min-w-[120px] max-w-[160px]">
                    <p className="text-gray-700 truncate">{b.issue}</p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <DeliveryBadge delivery={b.delivery} />
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{b.scheduledDate}</td>
                  <td className="px-4 py-3.5 font-semibold text-gray-800 whitespace-nowrap">${b.estimate}</td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{b.technician}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setSelected(b)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="font-mono text-xs text-gray-400">{selected.id}</p>
                <h2 className="text-base font-bold text-gray-900 mt-0.5">{selected.customer}</h2>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selected.status} />
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Email</p><p className="text-gray-800">{selected.email}</p></div>
                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Phone</p><p className="text-gray-800">{selected.phone}</p></div>
                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Device</p><p className="text-gray-800">{selected.brand} {selected.model}</p></div>
                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Type</p><p className="text-gray-800">{selected.device}</p></div>
                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Delivery</p><p className="text-gray-800">{selected.delivery}</p></div>
                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Estimate</p><p className="text-gray-800 font-semibold">${selected.estimate}</p></div>
                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Booked On</p><p className="text-gray-800">{selected.dateBooked}</p></div>
                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Scheduled</p><p className="text-gray-800">{selected.scheduledDate}</p></div>
                <div className="col-span-2"><p className="text-gray-400 text-xs font-medium mb-0.5">Technician</p><p className="text-gray-800">{selected.technician}</p></div>
                <div className="col-span-2"><p className="text-gray-400 text-xs font-medium mb-0.5">Issue</p><p className="text-gray-800">{selected.issue}</p></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
              <button className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">Update Status</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
