"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import SearchModal from "./SearchModal";
import CartSidebar from "./CartSidebar";
import { useAuthStore } from "@/store/authStore";

// ─── Nav data ───────────────────────────────────────────────────────────────

const navItems = [
  {
    label: "Deals & More",
    href: "/collections/deals",
    columns: [
      {
        heading: "Featured collections",
        links: [
          { label: "Expert picks for a jet-setter",  href: "/collections/deals" },
          { label: "Expert picks for gamers",         href: "/collections/deals" },
          { label: "Expert picks for students",       href: "/collections/deals" },
          { label: "Expert picks under $25",          href: "/collections/deals" },
          { label: "Expert picks under $50",          href: "/collections/deals" },
          { label: "Expert picks under $100",         href: "/collections/deals" },
        ],
      },
    ],
  },
  {
    label: "Audio",
    href: "/collections/audio",
    columns: [
      {
        heading: "Shop by type",
        shopAll: "/collections/audio",
        links: [
          { label: "Premium",         href: "/collections/audio" },
          { label: "Gaming",          href: "/collections/audio" },
          { label: "Noise-Canceling", href: "/collections/audio" },
          { label: "In-Ear",          href: "/collections/audio" },
          { label: "Over-the-ear",    href: "/collections/audio" },
          { label: "Bluetooth",       href: "/collections/audio" },
        ],
      },
    ],
  },
  {
    label: "Cases",
    href: "/collections/cases",
    featured: true,
    columns: [
      {
        heading: "Shop by type",
        links: [
          { label: "MagSafe",      href: "/collections/cases" },
          { label: "Fashion",      href: "/collections/cases" },
          { label: "Case wallets", href: "/collections/cases" },
          { label: "Rugged",       href: "/collections/cases" },
          { label: "Slim",         href: "/collections/cases" },
          { label: "Waterproof",   href: "/collections/cases" },
        ],
      },
      {
        heading: "Apple",
        links: [
          { label: "iPhone 17 Pro Max", href: "/collections/cases" },
          { label: "iPhone 17 Pro",     href: "/collections/cases" },
          { label: "iPhone 17",         href: "/collections/cases" },
          { label: "iPhone 16 Pro Max", href: "/collections/cases" },
          { label: "iPhone 16 Pro",     href: "/collections/cases" },
          { label: "iPhone 16 Plus",    href: "/collections/cases" },
          { label: "iPhone 16",         href: "/collections/cases" },
          { label: "iPhone 16e",        href: "/collections/cases" },
          { label: "iPhone 15 Pro Max", href: "/collections/cases" },
          { label: "iPhone 15 Pro",     href: "/collections/cases" },
          { label: "iPhone 15 Plus",    href: "/collections/cases" },
          { label: "iPhone 15",         href: "/collections/cases" },
          { label: "Shop all Apple →",  href: "/collections/cases" },
        ],
      },
      {
        heading: "Samsung",
        links: [
          { label: "Galaxy S26",        href: "/collections/cases" },
          { label: "Galaxy S26 Plus",   href: "/collections/cases" },
          { label: "Galaxy S26 Ultra",  href: "/collections/cases" },
          { label: "Galaxy S25",        href: "/collections/cases" },
          { label: "Galaxy S25 Plus",   href: "/collections/cases" },
          { label: "Galaxy S25 Ultra",  href: "/collections/cases" },
          { label: "Galaxy S24",        href: "/collections/cases" },
          { label: "Galaxy S24 Plus",   href: "/collections/cases" },
          { label: "Galaxy S24 Ultra",  href: "/collections/cases" },
          { label: "Galaxy Z Fold 6",   href: "/collections/cases" },
          { label: "Galaxy Z Flip 6",   href: "/collections/cases" },
          { label: "Galaxy A16 5G",     href: "/collections/cases" },
          { label: "Shop all Samsung →",href: "/collections/cases" },
        ],
      },
      {
        heading: "Google",
        links: [
          { label: "Pixel 9A",           href: "/collections/cases" },
          { label: "Pixel 9 Pro XL",     href: "/collections/cases" },
          { label: "Pixel 9 Pro",        href: "/collections/cases" },
          { label: "Pixel 9 Pro Fold",   href: "/collections/cases" },
          { label: "Pixel 9",            href: "/collections/cases" },
          { label: "Pixel 8 Pro",        href: "/collections/cases" },
          { label: "Pixel 8",            href: "/collections/cases" },
          { label: "Pixel 8A",           href: "/collections/cases" },
          { label: "Shop all Google →",  href: "/collections/cases" },
        ],
      },
      {
        heading: "Motorola",
        links: [
          { label: "Moto G Power 5G",      href: "/collections/cases" },
          { label: "Moto G Stylus 5G",     href: "/collections/cases" },
          { label: "Moto G Power",         href: "/collections/cases" },
          { label: "Motorola Edge",        href: "/collections/cases" },
          { label: "Motorola Razr",        href: "/collections/cases" },
          { label: "Shop all Motorola →",  href: "/collections/cases" },
        ],
      },
    ],
  },
  {
    label: "Screen Protection",
    href: "/collections/screen-protection",
    columns: [
      {
        heading: "Shop by device",
        shopAll: "/collections/screen-protection",
        links: [
          { label: "iPhone",    href: "/collections/screen-protection" },
          { label: "Galaxy",    href: "/collections/screen-protection" },
          { label: "Pixel",     href: "/collections/screen-protection" },
          { label: "Motorola",  href: "/collections/screen-protection" },
          { label: "Tablet",    href: "/collections/screen-protection" },
          { label: "Wearables", href: "/collections/screen-protection" },
        ],
      },
    ],
  },
  {
    label: "Power",
    href: "/collections/power",
    columns: [
      {
        heading: "Shop by category",
        shopAll: "/collections/power",
        links: [
          { label: "Cables & adapters",               href: "/collections/power" },
          { label: "Power banks & batteries",         href: "/collections/power" },
          { label: "Charging stands & stations",      href: "/collections/power" },
          { label: "Car chargers & mounts",           href: "/collections/power" },
          { label: "Wireless charging",               href: "/collections/power" },
        ],
      },
    ],
  },
  {
    label: "Accessories",
    href: "/collections/accessories",
    columns: [
      {
        heading: "Shop by category",
        shopAll: "/collections/accessories",
        links: [
          { label: "Grips, rings & stands",         href: "/collections/accessories" },
          { label: "Gaming",                         href: "/collections/accessories" },
          { label: "Mounts",                         href: "/collections/accessories" },
          { label: "Chains, wallets & charms",       href: "/collections/accessories" },
          { label: "MagSafe accessories",            href: "/collections/accessories" },
          { label: "Organizers & carrying cases",    href: "/collections/accessories" },
          { label: "Storage & memory cards",         href: "/collections/accessories" },
        ],
      },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Header() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.count);
  const user      = useAuthStore((s) => s.user);
  const logout    = useAuthStore((s) => s.logout);
  const router = useRouter();
  const headerRef  = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "";

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 80);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function onScroll() { setOpenIndex(null); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white border-b border-gray-200">

      {/* ── Desktop nav ── */}
      <div className="hidden lg:flex items-center justify-between px-6 xl:px-10 h-16 max-w-screen-2xl mx-auto">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/new-logo.png" alt="Logo" width={90} height={40} className="object-contain" priority />
        </Link>

        {/* Nav */}
        <nav className="flex items-stretch h-full">
          {navItems.map((item, idx) => (
            <div
              key={item.label}
              className="relative flex items-stretch"
              onMouseEnter={() => { cancelClose(); setOpenIndex(idx); }}
              onMouseLeave={scheduleClose}
            >
              {/* Top-level label — click navigates, hover opens dropdown */}
              <button
                onClick={() => { router.push(item.href); setOpenIndex(null); }}
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
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </button>

              {/* Dropdown */}
              {openIndex === idx && (
                "featured" in item && item.featured ? (
                  /* Cases — wide multi-column */
                  <div
                    className="fixed left-5 right-5 mt-2 bg-white border border-gray-200 shadow-2xl rounded-2xl animate-dropdown-in z-50 overflow-hidden"
                    style={{ top: "calc(4rem + 8px)" }}
                  >
                    <div className="overflow-x-auto">
                      <div className="flex gap-8 px-8 py-6 min-w-max">
                        {item.columns.map((col) => (
                          <div key={col.heading} className="min-w-[140px]">
                            <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">{col.heading}</p>
                            <ul className="space-y-2">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    className={`text-sm transition-colors whitespace-nowrap ${link.label.startsWith("Shop all") ? "font-semibold text-primary hover:text-primary-hover" : "text-gray-600 hover:text-primary"}`}
                                    onClick={() => setOpenIndex(null)}
                                  >
                                    {link.label}
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
                  /* Regular dropdown */
                  <div
                    className="absolute top-full mt-2 left-0 bg-white border border-gray-200 shadow-2xl rounded-2xl animate-dropdown-in z-50"
                    style={{ width: "280px" }}
                  >
                    <div className="px-6 py-5">
                      {item.columns.map((col) => (
                        <div key={col.heading}>
                          <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">{col.heading}</p>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  className="text-sm text-gray-600 hover:text-primary transition-colors block py-0.5"
                                  onClick={() => setOpenIndex(null)}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {"shopAll" in col && col.shopAll && (
                            <Link
                              href={col.shopAll as string}
                              onClick={() => setOpenIndex(null)}
                              className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-colors"
                            >
                              Shop all
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}

          <Link href="/collections" className="flex items-center px-3 text-sm font-medium text-gray-800 hover:text-primary transition-colors">
            All Collections
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Search">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
          {/* User menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
              aria-label="Account"
            >
              {user ? (
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {initials || "U"}
                </span>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
              )}
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-dropdown-in">
                {user ? (
                  <>
                    {/* Profile header */}
                    <div className="px-4 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                          {initials || "U"}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    {/* Menu items */}
                    <div className="py-2">
                      {[
                        { label: "My Orders",   icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8",  href: "/orders" },
                        { label: "Wishlist",    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", href: "/wishlist" },
                        { label: "Settings",   icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", href: "/settings" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                          </svg>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); router.push("/"); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-3 space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-center w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-center w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Cart">
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
          <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Search">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
          <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors" aria-label="Cart">
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

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Cart sidebar */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-white overflow-y-auto animate-slide-in-right">
          <nav className="px-4 py-4 divide-y divide-gray-100">
            {navItems.map((item, idx) => (
              <div key={item.label}>
                <div className="flex items-center justify-between py-3">
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  <button
                    className="p-1 ml-2"
                    onClick={() => setMobileExpandedIndex(mobileExpandedIndex === idx ? null : idx)}
                  >
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${mobileExpandedIndex === idx ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {mobileExpandedIndex === idx && (
                  <div className="pb-4 space-y-4">
                    {item.columns.map((col) => (
                      <div key={col.heading}>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{col.heading}</p>
                        <ul className="space-y-1.5 pl-2">
                          {col.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                className={`text-sm transition-colors ${link.label.startsWith("Shop all") ? "font-semibold text-primary" : "text-gray-600 hover:text-primary"}`}
                                onClick={() => setMobileOpen(false)}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {"shopAll" in col && col.shopAll && (
                          <Link
                            href={col.shopAll as string}
                            onClick={() => setMobileOpen(false)}
                            className="mt-3 inline-flex items-center gap-1 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-colors"
                          >
                            Shop all
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3">
              <Link href="/collections" className="block py-3 text-sm font-semibold text-gray-800 hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>
                All Collections
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
