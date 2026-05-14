"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

// ─── Nav data ───────────────────────────────────────────────────────────────

const navItems = [
  {
    label: "Deals and more",
    columns: [
      {
        heading: "Featured collections",
        links: [
          "Expert picks for a jet-setter",
          "Expert picks for gamers",
          "Expert picks for students",
          "Expert picks under $25",
          "Expert picks under $50",
          "Expert picks under $100",
        ],
      },
    ],
  },
  {
    label: "Audio",
    columns: [
      {
        heading: "Shop by type",
        links: ["Premium", "Gaming", "Noise-Canceling", "In-Ear", "Over-the-ear", "Bluetooth"],
        shopAll: true,
      },
    ],
  },
  {
    label: "Cases",
    featured: true,
    columns: [
      {
        heading: "Shop by type",
        links: ["MagSafe", "Fashion", "Case wallets", "Rugged", "Slim", "Waterproof"],
      },
      {
        heading: "Apple",
        links: [
          "iPhone 17 Pro Max",
          "iPhone 17 Pro",
          "iPhone 17",
          "iPhone 16 Pro Max",
          "iPhone 16 Pro",
          "iPhone 16 Plus",
          "iPhone 16",
          "iPhone 16e",
          "iPhone 15 Pro Max",
          "iPhone 15 Pro",
          "iPhone 15 Plus",
          "iPhone 15",
          "Shop all Apple",
        ],
      },
      {
        heading: "Samsung",
        links: [
          "Galaxy S26",
          "Galaxy S26 Plus",
          "Galaxy S26 Ultra",
          "Galaxy S25",
          "Galaxy S25 Plus",
          "Galaxy S25 Ultra",
          "Galaxy S24",
          "Galaxy S24 Plus",
          "Galaxy S24 Ultra",
          "Galaxy Z Fold 6",
          "Galaxy Z Fold 5",
          "Galaxy Z Flip 6",
          "Galaxy Z Flip 5",
          "Galaxy A16 5G",
          "Galaxy A15 5G",
          "Shop all Samsung",
        ],
      },
      {
        heading: "Google",
        links: [
          "Pixel 9A",
          "Pixel 9 Pro XL",
          "Pixel 9 Pro",
          "Pixel 9 Pro Fold",
          "Pixel 9",
          "Pixel 8 Pro",
          "Pixel 8",
          "Pixel 8A",
          "Shop all Google",
        ],
      },
      {
        heading: "Motorola",
        links: [
          "Moto G Power 5G",
          "Moto G Stylus 5G",
          "Moto G Power",
          "Motorola Edge",
          "Motorola Razr",
          "Shop all Motorola",
        ],
      },
    ],
  },
  {
    label: "Screen Protection",
    columns: [
      {
        heading: "Shop by device",
        links: ["iPhone", "Galaxy", "Pixel", "Motorola", "Tablet", "Wearables"],
        shopAll: true,
      },
    ],
  },
  {
    label: "Power",
    columns: [
      {
        heading: "Shop by category",
        links: [
          "Cables and adapters",
          "Power banks and batteries",
          "Charging ports, stands, and stations",
          "Car chargers and mounts",
          "Wireless",
        ],
        shopAll: true,
      },
    ],
  },
  {
    label: "Accessories",
    columns: [
      {
        heading: "Shop by category",
        links: [
          "Grips, rings, and stands",
          "Gaming",
          "Mounts",
          "Chains, wallets, and charms",
          "Keyboards and mice",
          "Organizers and carrying cases",
          "Storage and memory cards",
        ],
        shopAll: true,
      },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Header() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);
  const cartCount = useCartStore((s) => s.count);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 80);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on scroll
  useEffect(() => {
    function onScroll() { setOpenIndex(null); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef} className="relative z-50 bg-white border-b border-gray-200">
      {/* ── Desktop nav ── */}
      <div className="hidden lg:flex items-center justify-between px-6 xl:px-10 h-16 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/new-logo.png" alt="Logo" width={90} height={40} className="object-contain" priority />
        </Link>

        {/* Nav — items-stretch so buttons fill full h-16, enabling bottom-0 underline per item */}
        <nav className="flex items-stretch h-full">
          {navItems.map((item, idx) => (
            <div
              key={item.label}
              className="relative flex items-stretch"
              onMouseEnter={() => { cancelClose(); setOpenIndex(idx); }}
              onMouseLeave={scheduleClose}
            >
              <button
                className={`relative flex items-center gap-1 px-3 text-sm font-medium transition-colors
                  ${openIndex === idx ? "text-primary" : "text-gray-800 hover:text-primary"}`}
              >
                {item.label}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openIndex === idx ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {openIndex === idx && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </button>

              {/* Per-item dropdown */}
              {openIndex === idx && (
                "featured" in item && item.featured ? (
                  /* ── Featured (Cases) — full-width columns only ── */
                  <div className="fixed left-5 right-5 mt-2 bg-white border border-gray-300 shadow-xl rounded-xl animate-dropdown-in z-50 overflow-hidden"
                    style={{ top: "calc(4rem + 8px)" }}
                  >
                    <div className="overflow-x-auto">
                      <div className="flex gap-8 px-8 py-6 min-w-max">
                        {item.columns.map((col) => (
                          <div key={col.heading} className="min-w-[140px]">
                            <p className="font-semibold text-sm text-gray-900 mb-3">{col.heading}</p>
                            <ul className="space-y-2">
                              {col.links.map((link) => (
                                <li key={link}>
                                  <Link
                                    href="#"
                                    className="text-sm text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
                                    onClick={() => setOpenIndex(null)}
                                  >
                                    {link}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Regular dropdown — fixed width matching Power ── */
                  <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 shadow-xl rounded-xl animate-dropdown-in z-50" style={{ width: "300px" }}>
                    <div className="px-6 py-6">
                      {item.columns.map((col) => (
                        <div key={col.heading}>
                          <p className="font-semibold text-sm text-gray-900 mb-3">{col.heading}</p>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link}>
                                <Link
                                  href="#"
                                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                                  onClick={() => setOpenIndex(null)}
                                >
                                  {link}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {"shopAll" in col && col.shopAll && (
                            <button className="mt-5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-colors">
                              Shop all
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}

          <Link
            href="/help"
            className="flex items-center px-3 text-sm font-medium text-gray-800 hover:text-primary transition-colors"
          >
            Get help
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Search">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
          <button className="p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Account">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            </svg>
          </button>
          <button className="relative p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Cart">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8M7 13L5.4 5M17 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile bar ── */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14">
        <Link href="/">
          <Image src="/new-logo.png" alt="Logo" width={80} height={32} className="object-contain" priority />
        </Link>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Search">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
          <button className="relative p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Cart">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8M7 13L5.4 5M17 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {cartCount}
            </span>
          </button>
          <button className="p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Menu" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-white overflow-y-auto animate-slide-in-right">
          <nav className="px-4 py-4 divide-y divide-gray-100">
            {navItems.map((item, idx) => (
              <div key={item.label}>
                <button
                  className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-800"
                  onClick={() => setMobileExpandedIndex(mobileExpandedIndex === idx ? null : idx)}
                >
                  {item.label}
                  <svg
                    className={`w-4 h-4 transition-transform ${mobileExpandedIndex === idx ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileExpandedIndex === idx && (
                  <div className="pb-3 space-y-4">
                    {item.columns.map((col) => (
                      <div key={col.heading}>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          {col.heading}
                        </p>
                        <ul className="space-y-1.5 pl-2">
                          {col.links.map((link) => (
                            <li key={link}>
                              <Link
                                href="#"
                                className="text-sm text-gray-600 hover:text-primary transition-colors"
                                onClick={() => setMobileOpen(false)}
                              >
                                {link}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {"shopAll" in col && col.shopAll && (
                          <button className="mt-4 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-colors">
                            Shop all
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3">
              <Link href="/help" className="block py-3 text-sm font-semibold text-gray-800" onClick={() => setMobileOpen(false)}>
                Get help
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
