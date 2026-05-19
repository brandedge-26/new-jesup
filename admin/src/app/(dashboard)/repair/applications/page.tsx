"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { adminAxios } from "@/lib/axios";

interface ContactMessage {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

const PAGE_SIZE = 10;

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ContactApplicationsPage() {
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<ContactMessage | null>(null);
    const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await adminAxios.get("/contacts");
            setContacts(res.data.contacts ?? []);
        } catch {
            setError("Failed to load messages. Make sure you are logged in.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchContacts(); }, [fetchContacts]);

    const filtered = useMemo(() => {
        if (!search.trim()) return contacts;
        const q = search.toLowerCase();
        return contacts.filter((c) =>
            c.firstName.toLowerCase().includes(q) ||
            c.lastName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q) ||
            c.message.toLowerCase().includes(q)
        );
    }, [contacts, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    async function confirmDelete() {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await adminAxios.delete(`/contacts/${toDelete._id}`);
            setContacts((prev) => prev.filter((c) => c._id !== toDelete._id));
            setToDelete(null);
        } catch {
            alert("Failed to delete. Please try again.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Contact Messages</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{contacts.length} total messages</p>
                </div>
                <button
                    onClick={fetchContacts}
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
                            placeholder="Search by name, email, message…"
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                    </div>
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
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Email</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Phone</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Message</th>
                                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Received</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-16 text-sm text-gray-400">No messages found</td>
                                    </tr>
                                ) : paginated.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                                            {c.firstName} {c.lastName}
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-500">{c.email}</td>
                                        <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{c.phone || "—"}</td>
                                        <td className="px-4 py-3.5 max-w-xs">
                                            <p className="text-gray-500 text-xs truncate">{c.message}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-400 text-[11px] whitespace-nowrap">{formatDate(c.createdAt)}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setSelected(c)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                                                    title="View"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setToDelete(c)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
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
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-base font-bold text-gray-900">{selected.firstName} {selected.lastName}</h2>
                            <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Email</p><p className="text-gray-800">{selected.email}</p></div>
                                <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Phone</p><p className="text-gray-800">{selected.phone || "—"}</p></div>
                                <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Received</p><p className="text-gray-800">{formatDate(selected.createdAt)}</p></div>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Message</p>
                                <p className="text-gray-700 leading-relaxed">{selected.message}</p>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {toDelete && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => !deleting && setToDelete(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="px-6 pt-6 pb-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">Delete Message</h3>
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete the message from{" "}
                                <span className="font-semibold text-gray-700">{toDelete.firstName} {toDelete.lastName}</span>? This cannot be undone.
                            </p>
                        </div>
                        <div className="px-6 pb-6 flex gap-2">
                            <button onClick={() => setToDelete(null)} disabled={deleting}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} disabled={deleting}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                                {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
