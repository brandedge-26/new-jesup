"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: Props) {
  const { items, removeItem, updateQty, count } = useCartStore();
  const [visible, setVisible] = useState(false);

  // drive CSS transition
  useEffect(() => {
    if (open) {
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    } else {
      setVisible(false);
    }
  }, [open]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open && !visible) return null;

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const savings  = items.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price) * i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[160] w-full max-w-[420px] bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-out
          ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8M7 13L5.4 5M17 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <h2 className="text-base font-bold text-gray-900">Your Cart</h2>
            {count > 0 && (
              <span className="min-w-[22px] h-[22px] bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-9 h-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8M7 13L5.4 5M17 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-5 py-2">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  {/* Image */}
                  <Link href={`/products/${item.slug}`} onClick={onClose} className="shrink-0">
                    <div className="relative w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} onClick={onClose}>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-primary transition-colors">
                        {item.name}
                      </p>
                    </Link>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-gray-400">{item.brand}</span>
                      {item.color && (
                        <>
                          <span className="text-gray-200">·</span>
                          <span className="text-xs text-gray-400">{item.color}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                          aria-label="Decrease"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-900 select-none">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                          aria-label="Increase"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                        {item.qty > 1 && (
                          <p className="text-[10px] text-gray-400">${item.price.toFixed(2)} each</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.key)}
                    className="self-start p-1 text-gray-300 hover:text-red-500 transition-colors mt-0.5"
                    aria-label="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-3 bg-gray-50/60">
            {savings > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium">You save</span>
                <span className="text-emerald-600 font-bold">-${savings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-lg font-extrabold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 text-center">Shipping & taxes calculated at checkout</p>

            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-hover transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8M7 13L5.4 5M17 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              View Cart
            </Link>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
