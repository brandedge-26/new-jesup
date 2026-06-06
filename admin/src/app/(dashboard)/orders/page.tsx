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
    discount?: number;
    promoCode?: string;
    total: number;
    status: OrderStatus;
    paymentMethod: "stripe" | "paypal" | "cod";
    paymentStatus: "pending" | "paid" | "failed";
    paymentIntentId?: string;
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

function PaymentBadge({ method, status }: { method: "stripe" | "paypal" | "cod"; status: "pending" | "paid" | "failed" }) {
    const isCard    = method === "stripe";
    const isPayPal  = method === "paypal";
    const isPaid    = status === "paid";
    const isFailed  = status === "failed";

    const badgeCls = isCard
        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
        : isPayPal
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-gray-50 text-gray-600 border-gray-200";

    const label = isCard ? "Card" : isPayPal ? "PayPal" : "COD";

    return (
        <div className="flex flex-col gap-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border w-fit ${badgeCls}`}>
                {isCard ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5z" /></svg>
                ) : isPayPal ? (
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.824l-1.175 7.45h3.546l.943-5.985h2.19c4.717 0 7.353-2.375 8.234-7.065a5.76 5.76 0 0 0-.34-.195z"/></svg>
                ) : (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75" /></svg>
                )}
                {label}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border w-fit ${isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : isFailed ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                {isPaid ? "Paid" : isFailed ? "Failed" : "Pending"}
            </span>
        </div>
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
    const [checkedIds,    setCheckedIds]    = useState<Set<string>>(new Set());
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);
    const [bulkLoading,   setBulkLoading]   = useState(false);

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

    const allChecked = paginated.length > 0 && paginated.every((o) => checkedIds.has(o._id));
    function toggleAllChecked() {
        if (allChecked) setCheckedIds(new Set());
        else setCheckedIds(new Set(paginated.map((o) => o._id)));
    }
    function toggleChecked(id: string) {
        setCheckedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    }
    async function handleBulkDelete() {
        setBulkLoading(true);
        try {
            await adminAxios.delete("/orders/bulk", { data: { ids: [...checkedIds] } });
            setCheckedIds(new Set());
            setShowBulkConfirm(false);
            fetchOrders();
        } catch {
            alert("Failed to delete orders.");
        } finally {
            setBulkLoading(false);
        }
    }

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

            {/* Bulk action bar */}
            {checkedIds.size > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
                    <span className="text-sm font-semibold text-primary">{checkedIds.size} selected</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCheckedIds(new Set())} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-white transition-colors">Deselect all</button>
                        <button onClick={() => setShowBulkConfirm(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete {checkedIds.size}
                        </button>
                    </div>
                </div>
            )}

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
                                    <th className="px-5 py-3 w-8">
                                        <input type="checkbox" checked={allChecked} onChange={toggleAllChecked} className="rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer" />
                                    </th>
                                    {["Order", "Customer", "Items", "Date", "Status", "Payment", "Total", ""].map((h) => (
                                        <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-400 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginated.length === 0 ? (
                                    <tr><td colSpan={7} className="px-5 py-16 text-center text-gray-400 text-sm">No orders found.</td></tr>
                                ) : paginated.map((o) => (
                                    <tr key={o._id} className={`transition-colors group ${checkedIds.has(o._id) ? "bg-primary/5" : "hover:bg-gray-50"}`}>
                                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" checked={checkedIds.has(o._id)} onChange={() => toggleChecked(o._id)} className="rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer" />
                                        </td>
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
                                        <td className="px-5 py-4"><PaymentBadge method={o.paymentMethod ?? "stripe"} status={o.paymentStatus ?? "pending"} /></td>
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
                                {(selected.discount ?? 0) > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount {selected.promoCode && <span className="font-mono text-[10px] bg-emerald-100 px-1 rounded">{selected.promoCode}</span>}</span>
                                        <span>-${selected.discount!.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200"><span>Total</span><span>${selected.total.toFixed(2)}</span></div>
                            </div>

                            {/* Payment info */}
                            <div className="rounded-xl border border-gray-100 px-4 py-3 text-sm space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Payment</p>
                                <div className="flex items-center justify-between">
                                    <PaymentBadge method={selected.paymentMethod ?? "stripe"} status={selected.paymentStatus ?? "pending"} />
                                    {selected.paymentIntentId && (
                                        <span className="text-[10px] font-mono text-gray-400 truncate max-w-[160px]">{selected.paymentIntentId}</span>
                                    )}
                                </div>
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

            {/* Bulk delete confirm */}
            {showBulkConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowBulkConfirm(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 text-center">Delete {checkedIds.size} Order{checkedIds.size > 1 ? "s" : ""}?</h3>
                        <p className="text-sm text-gray-500 text-center mt-1">This action cannot be undone.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowBulkConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleBulkDelete} disabled={bulkLoading}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
                                {bulkLoading ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
