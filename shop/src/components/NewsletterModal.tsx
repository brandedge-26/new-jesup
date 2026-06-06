"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LS_KEY = "jesup_newsletter";

export default function NewsletterModal() {
  const [show, setShow]       = useState(false);
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(LS_KEY)) return;
    const t = setTimeout(() => setShow(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(LS_KEY, "dismissed");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ email: email.trim() }),
        }
      );
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      localStorage.setItem(LS_KEY, "subscribed");
      setTimeout(() => setShow(false), 2800);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex"
          style={{ maxWidth: 760, maxHeight: "90vh" }}
        >

          {/* ── Left panel — newsletter image ── */}
          <div className="hidden sm:block w-[46%] shrink-0 relative overflow-hidden bg-gray-100">
            <Image
              src="/news-letter.webp"
              alt="Jesup Wireless Newsletter"
              fill
              className="object-cover"
              sizes="360px"
              priority
            />
          </div>

          {/* ── Right panel — form ── */}
          <div className="flex flex-col justify-center px-8 py-10 flex-1 min-w-0">

            {/* Close button */}
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {success ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center gap-3 text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#8223D2]/10 flex items-center justify-center mb-1">
                  <svg className="w-8 h-8 text-[#8223D2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl font-extrabold text-gray-900">You're subscribed!</p>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  We'll notify you the moment new products drop. Check your inbox!
                </p>
              </div>
            ) : (
              <>
                {/* Brand */}
                <p className="text-xs font-bold uppercase tracking-widest text-[#8223D2] mb-3">
                  jesup wireless
                </p>

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                  Be the first to<br />know about new drops.
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-gray-500 leading-relaxed mb-7">
                  Subscribe and get notified whenever a new product arrives — straight to your inbox.
                </p>

                {/* Form */}
                <form onSubmit={submit} className="space-y-3">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="Enter your email..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8223D2]/50 focus:border-[#8223D2] transition"
                  />

                  {error && (
                    <p className="text-xs text-red-500">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gray-900 hover:bg-gray-800 active:scale-[.98] text-white text-sm font-bold py-3.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Subscribing…
                      </span>
                    ) : (
                      "Notify me →"
                    )}
                  </button>
                </form>

                {/* Dismiss link */}
                <button
                  onClick={dismiss}
                  className="mt-5 w-full text-center text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors"
                >
                  No thanks, I'll find out later
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
