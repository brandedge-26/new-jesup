"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/collectionData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchEntry extends Product {
  collectionId: string;
  collectionTitle: string;
}

const CATEGORY_TO_SLUG: Record<string, string> = {
  Audio:              "audio",
  Cases:              "cases",
  "Screen Protection":"screen-protection",
  Power:              "power",
  Accessories:        "accessories",
};

const COLLECTION_TITLE: Record<string, string> = {
  audio:              "Audio",
  cases:              "Cases",
  "screen-protection":"Screen Protection",
  power:              "Power",
  accessories:        "Accessories",
};

interface _BPVariant { name: string; options: { label: string }[] }
interface _BP {
  _id: string; name: string; brand?: string; price: number;
  originalPrice?: number; rating?: number; reviews?: number;
  image?: string; badge?: string; inStock?: boolean;
  slug?: string; category?: string; colors?: string[];
  variants?: _BPVariant[];
}

function mapBP(p: _BP): SearchEntry {
  const colorVariant = p.variants?.find((v) => v.name.toLowerCase() === "color");
  const colors = (p.colors?.length ? p.colors : colorVariant?.options.map((o) => o.label)) ?? [];
  const collectionId = CATEGORY_TO_SLUG[p.category ?? ""] ?? "audio";
  return {
    id: p._id, name: p.name, brand: p.brand ?? "", price: p.price,
    originalPrice: p.originalPrice, rating: p.rating ?? 4.5,
    reviews: p.reviews ?? 0, colors, image: p.image ?? "",
    badge: p.badge as Product["badge"], inStock: p.inStock ?? true,
    slug: p.slug || p._id,
    collectionId, collectionTitle: COLLECTION_TITLE[collectionId] ?? p.category ?? "",
  };
}

const TABS = [
  { id: "all",                label: "All" },
  { id: "cases",              label: "Cases" },
  { id: "audio",              label: "Audio" },
  { id: "screen-protection",  label: "Screen Protection" },
  { id: "power",              label: "Power" },
  { id: "accessories",        label: "Accessories" },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery]         = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [visible, setVisible]     = useState(false);
  const [apiResults, setApiResults] = useState<SearchEntry[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── animation: mount → next tick → set visible=true for transition in
  useEffect(() => {
    if (open) {
      setVisible(false);
      const t = requestAnimationFrame(() => setVisible(true));
      // auto-focus after transition starts
      setTimeout(() => inputRef.current?.focus(), 80);
      return () => cancelAnimationFrame(t);
    } else {
      setVisible(false);
      // reset state after close animation
      const t = setTimeout(() => {
        setQuery("");
        setActiveTab("all");
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ── API search with debounce
  useEffect(() => {
    if (query.trim().length < 2) { setApiResults([]); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setApiLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(
          `${apiUrl}/products?search=${encodeURIComponent(query.trim())}&limit=12`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setApiResults((data.products ?? []).map(mapBP));
        }
      } catch { /* ignore */ } finally { setApiLoading(false); }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  // ── close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // ── lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── filter logic: API only
  const results = useCallback((): SearchEntry[] => {
    if (!query.trim()) return [];
    return apiResults.filter((p) => activeTab === "all" || p.collectionId === activeTab).slice(0, 20);
  }, [query, activeTab, apiResults])();

  if (!open && !visible) return null;

  return (
    /* Backdrop */
    <div
      className={`fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4 transition-all duration-250
        ${visible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div
        className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden
          transition-all duration-250 ease-out
          ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-3"}`}
        style={{ maxHeight: "80vh" }}
      >
        {/* ── Search input row ── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands…"
            className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Clear"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Tab strip ── */}
        <div className="flex items-center gap-1 px-4 py-2.5 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
                ${activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Results ── */}
        <div className="overflow-y-auto flex-1">
          {apiLoading && (
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Searching…
            </div>
          )}
          {results.length === 0 && !apiLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-8">
              <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              {!query.trim() ? (
                <p className="text-gray-400 font-medium">Start typing to search products…</p>
              ) : (
                <>
                  <p className="text-gray-500 font-medium">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different keyword or category</p>
                </>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Product image */}
                    <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="44px"
                      />
                    </div>

                    {/* Name only */}
                    <p className="flex-1 text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer hint ── */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {query.trim()
              ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
              : `Showing ${results.length} products`}
          </p>
          <p className="text-xs text-gray-400 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
