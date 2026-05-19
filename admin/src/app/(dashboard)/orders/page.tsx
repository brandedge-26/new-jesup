"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { adminAxios } from "@/lib/axios";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

interface OrderItem {
    name: string; brand: string; image: string; price: number; qty: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    userId: { fname: string; lname: string; email: string } | null;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    status: OrderStatus;
    shippingAddress: { name: string; phone?: string; street: string; city: string; state: string; zip: string };
    tracking?: string;
    estimatedDelivery?: string;
    createdAt: string;
}

const ALL_STATUSES: (OrderStatus | "All")[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES: Record<OrderStatus, string> = {
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Shipped:    "bg-blue-50 text-blue-700 border-blue-200",
    Delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled:  "bg-red-50 text-red-600 border-red-200",
};

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLES[status]}`}>
            {status}
        </span>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function OrdersPage() {
    const [orders, setOrders]           = useState<Order[]>([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState("");
    const [search, setSearch]           = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
    const [page, setPage]               = useState(1);
    const [selected, setSelected]       = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true); setError("");
        try {
            const res = await adminAxios.get("/orders");
            setOrders(res.data.orders ?? []);
        } catch {
            setError("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const filtered = useMemo(() => {
        let list = orders;
        if (statusFilter !== "All") list = list.filter((o) => o.status === statusFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((o) =>
                o.orderNumber.toLowerCase().includes(q) ||
                (o.userId?.email ?? "").toLowerCase().includes(q) ||
                `${o.userId?.fname ?? ""} ${o.userId?.lname ?? ""}`.toLowerCase().includes(q) ||
                o.shippingAddress.name.toLowerCase().includes(q)
            );
        }
        return list;
    }, [orders, statusFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const revenue   = orders.reduce((s, o) => s + o.total, 0);
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const pending   = orders.filter((o) => o.status === "Processing").length;

    async function handleStatusUpdate(status: OrderStatus) {
        if (!selected) return;
        setUpdatingStatus(true);
        try {
            await adminAxios.patch(`/orders/${selected._id}/status`, { status });
            setOrders((prev) => prev.map((o) => o._id === selected._id ? { ...o, status } : o));
            setSelected((prev) => prev ? { ...prev, status } : null);
        } catch {
            alert("Failed to update status.");
        } finally {
            setUpdatingStatus(false);
        }
    }

    return (
        <div className="space-y-5">

            {/* Mini stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Orders",    value: orders.length },
                    { label: "Total Revenue",   value: `$${revenue.toFixed(0)}` },
                    { label: "Delivered",        value: delivered },
                    { label: "Processing",       value: pending },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                        <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                        <p className="text-xl font-extrabold text-gray-900 mt-1">{loading ? "—" : s.value}</p>
                    </div>
                ))}
            </div>

            {error && <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="px-5 pt-5 pb-0 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h2 className="text-base font-bold text-gray-900">All Orders</h2>
                        <div className="sm:ml-auto flex items-center gap-2">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                </svg>
                                <input type="text" placeholder="Search orders…" value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-56" />
                            </div>
                            <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Status tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-0 -mx-1 px-1">
                        {ALL_STATUSES.map((s) => {
                            const count = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
                            return (
                                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${statusFilter === s ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}>
                                    {s}
                                    <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${statusFilter === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mt-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-y border-gray-100">
                                    {["Order", "Customer", "Items", "Date", "Status", "Total", ""].map((h) => (
                                        <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-400 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={7} className="px-5 py-16 text-center text-gray-400 text-sm">No orders found.</td></tr>
                                ) : paginated.map((o) => (
                                    <tr key={o._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-5 py-4 font-semibold text-primary whitespace-nowrap">#{o.orderNumber}</td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-800 whitespace-nowrap">{o.shippingAddress.name}</p>
                                            <p className="text-xs text-gray-400">{o.userId?.email ?? "—"}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600">{o.items.length}</span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">{formatDate(o.createdAt)}</td>
                                        <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                                        <td className="px-5 py-4 font-extrabold text-gray-900 whitespace-nowrap">${o.total.toFixed(2)}</td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => setSelected(o)} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-primary hover:text-primary-hover">
                                                View →
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
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
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
                                <p className="font-mono text-xs text-gray-400">#{selected.orderNumber}</p>
                                <h2 className="text-base font-bold text-gray-900 mt-0.5">{selected.shippingAddress.name}</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={selected.status} />
                                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[65vh]">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Email</p><p className="text-gray-800">{selected.userId?.email ?? "—"}</p></div>
                                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Phone</p><p className="text-gray-800">{selected.shippingAddress.phone ?? "—"}</p></div>
                                <div><p className="text-gray-400 text-xs font-medium mb-0.5">Placed</p><p className="text-gray-800">{formatDate(selected.createdAt)}</p></div>
                                <div className="col-span-2">
                                    <p className="text-gray-400 text-xs font-medium mb-0.5">Shipping Address</p>
                                    <p className="text-gray-800">{selected.shippingAddress.street}, {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.zip}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <p className="text-gray-400 text-xs font-medium mb-2">Items ({selected.items.length})</p>
                                <div className="rounded-xl border border-gray-100 overflow-hidden">
                                    {selected.items.map((item, i) => (
                                        <div key={i} className={`flex items-center justify-between px-4 py-3 gap-3 ${i < selected.items.length - 1 ? "border-b border-gray-100" : ""}`}>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                                                <p className="text-[11px] text-gray-400">{item.brand} · Qty {item.qty}</p>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 space-y-1.5 text-sm">
                                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${selected.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{selected.shipping === 0 ? "Free" : `$${selected.shipping.toFixed(2)}`}</span></div>
                                <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200"><span>Total</span><span>${selected.total.toFixed(2)}</span></div>
                            </div>

                            {/* Status update */}
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Update Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {(["Processing", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map((s) => (
                                        <button key={s} disabled={selected.status === s || updatingStatus}
                                            onClick={() => handleStatusUpdate(s)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${selected.status === s ? `${STATUS_STYLES[s]} cursor-default` : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5"}`}>
                                            {updatingStatus && selected.status !== s ? <Loader2 className="w-3 h-3 animate-spin inline" /> : s}
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
