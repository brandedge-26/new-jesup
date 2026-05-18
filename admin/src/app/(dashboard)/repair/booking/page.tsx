"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { adminAxios } from "@/lib/axios";

type AppointmentStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

interface Appointment {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    deviceType: string;
    brand: string;
    model: string;
    damageTypes: string[];
    damageDescription?: string;
    appointmentDate: string;
    appointmentTime: string;
    zipCode?: string;
    streetAddress?: string;
    location?: { display?: string };
    marketingOptIn: boolean;
    status: AppointmentStatus;
    createdAt: string;
}

const ALL_STATUSES: AppointmentStatus[] = ["pending", "confirmed", "in-progress", "completed", "cancelled"];

const STATUS_STYLES: Record<AppointmentStatus, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    "in-progress": "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
};

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: AppointmentStatus }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLES[status]}`}>
            {STATUS_LABELS[status]}
        </span>
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RepairAppointmentPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | AppointmentStatus>("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Appointment | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await adminAxios.get("/appointments");
            setAppointments(res.data.data || res.data);
        } catch {
            setError("Failed to load appointments. Make sure you are logged in.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const filtered = useMemo(() => {
        let list = appointments;
        if (statusFilter !== "All") list = list.filter((b) => b.status === statusFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((b) =>
                b.firstName.toLowerCase().includes(q) ||
                b.lastName.toLowerCase().includes(q) ||
                b.email.toLowerCase().includes(q) ||
                b.brand.toLowerCase().includes(q) ||
                b.model.toLowerCase().includes(q) ||
                b.deviceType.toLowerCase().includes(q) ||
                b._id.toLowerCase().includes(q)
            );
        }
        return list;
    }, [appointments, statusFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    async function handleStatusUpdate(id: string, status: AppointmentStatus) {
        setUpdatingStatus(true);
        try {
            await adminAxios.patch(`/appointments/${id}/status`, { status });
            setAppointments((prev) =>
                prev.map((a) => (a._id === id ? { ...a, status } : a))
            );
            setSelected((prev) => (prev && prev._id === id ? { ...prev, status } : prev));
        } catch {
            alert("Failed to update status.");
        } finally {
            setUpdatingStatus(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Repair Appointments</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{appointments.length} total appointments</p>
                </div>
                <button
                    onClick={fetchAppointments}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name, email, device…"
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value as "All" | AppointmentStatus); setPage(1); }}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/60">
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Customer</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Device</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Damage</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Appointment</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Booked On</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-16 text-sm text-gray-400">No appointments found</td>
                                    </tr>
                                ) : paginated.map((b) => (
                                    <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3.5 min-w-[160px]">
                                            <p className="font-semibold text-gray-900">{b.firstName} {b.lastName}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{b.email}</p>
                                            <p className="text-[11px] text-gray-400">{b.phone}</p>
                                        </td>
                                        <td className="px-4 py-3.5 min-w-[140px]">
                                            <p className="font-medium text-gray-800">{b.brand} {b.model}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{b.deviceType}</p>
                                        </td>
                                        <td className="px-4 py-3.5 min-w-[140px] max-w-[180px]">
                                            <div className="flex flex-wrap gap-1">
                                                {b.damageTypes.map((d) => (
                                                    <span key={d} className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                                            <p>{formatDate(b.appointmentDate)}</p>
                                            <p className="text-[11px] text-gray-400">{b.appointmentTime}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap text-[11px]">{formatDate(b.createdAt)}</td>
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
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
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
                                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}
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
                                <p className="font-mono text-xs text-gray-400">{selected._id}</p>
                                <h2 className="text-base font-bold text-gray-900 mt-0.5">{selected.firstName} {selected.lastName}</h2>
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

                        <div className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Email</p><p className="text-gray-800">{selected.email}</p></div>
                                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Phone</p><p className="text-gray-800">{selected.phone}</p></div>
                                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Device</p><p className="text-gray-800">{selected.brand} {selected.model}</p></div>
                                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Type</p><p className="text-gray-800">{selected.deviceType}</p></div>
                                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Appointment</p><p className="text-gray-800">{formatDate(selected.appointmentDate)}</p></div>
                                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Time</p><p className="text-gray-800">{selected.appointmentTime}</p></div>
                                {selected.streetAddress && (
                                    <div className="col-span-2"><p className="text-gray-400 text-xs font-medium mb-0.5">Address</p><p className="text-gray-800">{selected.streetAddress}{selected.zipCode ? `, ${selected.zipCode}` : ""}</p></div>
                                )}
                                {selected.location?.display && (
                                    <div className="col-span-2"><p className="text-gray-400 text-xs font-medium mb-0.5">Location</p><p className="text-gray-800">{selected.location.display}</p></div>
                                )}
                                <div className="col-span-2">
                                    <p className="text-gray-400 text-xs font-medium mb-1">Damage</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selected.damageTypes.map((d) => (
                                            <span key={d} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">{d}</span>
                                        ))}
                                    </div>
                                </div>
                                {selected.damageDescription && (
                                    <div className="col-span-2"><p className="text-gray-400 text-xs font-medium mb-0.5">Notes</p><p className="text-gray-700 text-sm">{selected.damageDescription}</p></div>
                                )}
                            </div>

                            {/* Status update */}
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Update Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_STATUSES.map((s) => (
                                        <button
                                            key={s}
                                            disabled={selected.status === s || updatingStatus}
                                            onClick={() => handleStatusUpdate(selected._id, s)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${selected.status === s ? `${STATUS_STYLES[s]} cursor-default` : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5"}`}
                                        >
                                            {updatingStatus && selected.status !== s ? (
                                                <Loader2 className="w-3 h-3 animate-spin inline" />
                                            ) : STATUS_LABELS[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
