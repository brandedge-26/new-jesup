"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, type Product } from "@/lib/collectionData";

// ─── Build flat search index ─────────────────────────────────────────────────

interface SearchEntry extends Product {
  collectionId: string;
  collectionTitle: string;
}

const ALL_PRODUCTS: SearchEntry[] = Object.entries(COLLECTIONS).flatMap(
  ([id, col]) =>
    col.products.map((p) => ({ ...p, collectionId: id, collectionTitle: col.title }))
);

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
  const [query, setQuery]       = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [visible, setVisible]   = useState(false);   // drives CSS transition
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

  // ── filter logic
  const results = useCallback((): SearchEntry[] => {
    const pool =
      activeTab === "all"
        ? ALL_PRODUCTS
        : ALL_PRODUCTS.filter((p) => p.collectionId === activeTab);

    if (!query.trim()) return pool.slice(0, 12);

    const q = query.toLowerCase();
    return pool
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.collectionTitle.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [query, activeTab])();

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
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-8">
              <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <p className="text-gray-500 font-medium">No products found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different keyword or category</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Product image */}
                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="56px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{product.brand}</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {product.collectionTitle}
                        </span>
                        {product.badge && (
                          <>
                            <span className="text-gray-200">·</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                              ${product.badge === "Sale" ? "bg-red-100 text-red-600"
                              : product.badge === "New" ? "bg-emerald-100 text-emerald-600"
                              : product.badge === "Best Seller" ? "bg-amber-100 text-amber-700"
                              : "bg-purple-100 text-purple-700"}`}
                            >
                              {product.badge}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
                      )}
                    </div>

                    {/* Arrow */}
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
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
