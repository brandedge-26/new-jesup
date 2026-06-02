"use client";

import { useState, useEffect, useCallback } from "react";
import { adminAxios } from "@/lib/axios";
import Pagination from "@/components/Pagination";

interface Review {
  _id: string;
  productId: { _id: string; name: string; image: string } | null;
  userName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

const PAGE_SIZE = 20;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= rating ? "text-amber-400" : "text-gray-200"}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ConfirmModal({ count, onConfirm, onCancel, loading }: {
  count: number; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-900 text-center">Delete {count} Review{count > 1 ? "s" : ""}?</h3>
        <p className="text-sm text-gray-500 text-center mt-1">This action cannot be undone.</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews,      setReviews]      = useState<Review[]>([]);
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [page,         setPage]         = useState(1);
  const [selected,     setSelected]     = useState<Set<string>>(new Set());
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [bulkLoading,  setBulkLoading]  = useState(false);

  const fetchReviews = useCallback(async (p = page) => {
    setLoading(true);
    setError("");
    try {
      const res = await adminAxios.get(`/reviews?page=${p}&limit=${PAGE_SIZE}`);
      setReviews(res.data.reviews);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchReviews(page); setSelected(new Set()); }, [page]); // eslint-disable-line

  const allSelected = reviews.length > 0 && reviews.every((r) => selected.has(r._id));

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(reviews.map((r) => r._id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    setBulkLoading(true);
    try {
      await adminAxios.delete("/reviews/bulk", { data: { ids: [...selected] } });
      setSelected(new Set());
      setShowConfirm(false);
      fetchReviews(page);
    } catch {
      alert("Failed to delete reviews.");
    } finally {
      setBulkLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Reviews</h1>
            <p className="text-xs text-gray-400 mt-0.5">{total} total reviews</p>
          </div>
          <button onClick={() => fetchReviews(page)}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition-colors" title="Refresh">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
            <span className="text-sm font-semibold text-primary">{selected.size} selected</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelected(new Set())} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-white transition-colors">
                Deselect all
              </button>
              <button onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete {selected.size}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-4 py-2.5 w-8">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer" />
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400">Product</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400">Reviewer</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400">Rating</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 hidden md:table-cell">Review</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="w-4 h-4 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-gray-200 rounded-lg" /><div className="h-2.5 w-28 bg-gray-200 rounded" /></div></td>
                      <td className="px-4 py-3"><div className="h-2.5 w-20 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-3 w-16 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-2.5 w-48 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-2.5 w-20 bg-gray-200 rounded" /></td>
                    </tr>
                  ))
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No reviews found.</td>
                  </tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r._id} onClick={() => toggleOne(r._id)}
                      className={`cursor-pointer transition-colors ${selected.has(r._id) ? "bg-primary/5" : "hover:bg-gray-50"}`}>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={selected.has(r._id)} onChange={() => toggleOne(r._id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {r.productId?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.productId.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />
                          )}
                          <p className="text-xs font-semibold text-gray-800 truncate max-w-[140px]">
                            {r.productId?.name ?? "Deleted product"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-gray-700">{r.userName}</p>
                      </td>
                      <td className="px-4 py-3"><Stars rating={r.rating} /></td>
                      <td className="px-4 py-3 hidden md:table-cell max-w-xs">
                        {r.title && <p className="text-xs font-semibold text-gray-700 truncate">{r.title}</p>}
                        <p className="text-xs text-gray-400 truncate">{r.body}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 px-4">
            <Pagination page={page} totalPages={totalPages} onPage={setPage} totalItems={total} pageSize={PAGE_SIZE} />
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          count={selected.size}
          loading={bulkLoading}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
