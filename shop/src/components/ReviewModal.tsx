"use client";

import { useState } from "react";
import { privateAxios } from "@/lib/axios";

interface Props {
    productId: string;
    productName: string;
    onClose: () => void;
    onSuccess: (review: ReviewData) => void;
}

export interface ReviewData {
    _id: string;
    userName: string;
    rating: number;
    title: string;
    body: string;
    createdAt: string;
}

export default function ReviewModal({ productId, productName, onClose, onSuccess }: Props) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (rating === 0) { setError("Please select a star rating."); return; }
        if (!body.trim()) { setError("Please write your review."); return; }

        setLoading(true);
        setError("");
        try {
            const res = await privateAxios.post(`/reviews/${productId}`, { rating, title, body });
            onSuccess(res.data);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg ?? "Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{productName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Star picker */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating <span className="text-red-500">*</span></label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setRating(s)}
                                    onMouseEnter={() => setHovered(s)}
                                    onMouseLeave={() => setHovered(0)}
                                    className="transition-transform hover:scale-110"
                                    aria-label={`${s} star`}
                                >
                                    <svg
                                        className={`w-9 h-9 transition-colors ${s <= (hovered || rating) ? "fill-amber-400" : "fill-gray-200"}`}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                            {(hovered || rating) > 0 && (
                                <span className="ml-2 self-center text-sm font-semibold text-gray-600">
                                    {["", "Poor", "Fair", "Good", "Great", "Excellent"][hovered || rating]}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Review Title <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Summarize your experience"
                            maxLength={100}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                        />
                    </div>

                    {/* Body */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Review <span className="text-red-500">*</span></label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="What did you like or dislike? How was the quality?"
                            rows={4}
                            maxLength={1000}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
                        />
                        <p className="text-right text-xs text-gray-400 mt-1">{body.length}/1000</p>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-primary text-white py-3 text-sm font-bold hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}
