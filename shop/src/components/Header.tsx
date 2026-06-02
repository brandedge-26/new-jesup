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
    label: "Devices",
    href: "/collections/devices",
    featured: true,
    columns: [
      {
        heading: "Apple iPhone",
        links: [
          { label: "iPhone 17 Pro Max", href: "/collections/devices?q=iPhone+17+Pro+Max" },
          { label: "iPhone 17 Pro",     href: "/collections/devices?q=iPhone+17+Pro" },
          { label: "iPhone 17",         href: "/collections/devices?q=iPhone+17" },
          { label: "iPhone 16 Pro Max", href: "/collections/devices?q=iPhone+16+Pro+Max" },
          { label: "iPhone 16 Pro",     href: "/collections/devices?q=iPhone+16+Pro" },
          { label: "iPhone 16 Plus",    href: "/collections/devices?q=iPhone+16+Plus" },
          { label: "iPhone 16",         href: "/collections/devices?q=iPhone+16" },
          { label: "iPhone 16e",        href: "/collections/devices?q=iPhone+16e" },
          { label: "iPhone 15 Pro Max", href: "/collections/devices?q=iPhone+15+Pro+Max" },
          { label: "iPhone 15 Pro",     href: "/collections/devices?q=iPhone+15+Pro" },
          { label: "iPhone 15 Plus",    href: "/collections/devices?q=iPhone+15+Plus" },
          { label: "iPhone 15",         href: "/collections/devices?q=iPhone+15" },
          { label: "Shop all Apple →",  href: "/collections/devices?q=iPhone" },
        ],
      },
      {
        heading: "Samsung Galaxy",
        links: [
          { label: "Galaxy S26 Ultra",  href: "/collections/devices?q=Galaxy+S26+Ultra" },
          { label: "Galaxy S26 Plus",   href: "/collections/devices?q=Galaxy+S26+Plus" },
          { label: "Galaxy S26",        href: "/collections/devices?q=Galaxy+S26" },
          { label: "Galaxy S25 Ultra",  href: "/collections/devices?q=Galaxy+S25+Ultra" },
          { label: "Galaxy S25 Plus",   href: "/collections/devices?q=Galaxy+S25+Plus" },
          { label: "Galaxy S25",        href: "/collections/devices?q=Galaxy+S25" },
          { label: "Galaxy S24 Ultra",  href: "/collections/devices?q=Galaxy+S24+Ultra" },
          { label: "Galaxy S24 Plus",   href: "/collections/devices?q=Galaxy+S24+Plus" },
          { label: "Galaxy S24",        href: "/collections/devices?q=Galaxy+S24" },
          { label: "Galaxy Z Fold 6",   href: "/collections/devices?q=Galaxy+Z+Fold" },
          { label: "Galaxy Z Flip 6",   href: "/collections/devices?q=Galaxy+Z+Flip" },
          { label: "Galaxy A16 5G",     href: "/collections/devices?q=Galaxy+A16" },
          { label: "Shop all Samsung →",href: "/collections/devices?q=Samsung" },
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
          { label: "Premium", href: "/collections/audio?badge=Top+Rated" },
          { label: "Gaming", href: "/collections/audio?q=Gaming" },
          { label: "Noise-Canceling", href: "/collections/audio?q=Noise" },
          { label: "In-Ear", href: "/collections/audio?q=In-Ear" },
          { label: "Over-the-ear", href: "/collections/audio?q=Over-Ear" },
          { label: "Bluetooth", href: "/collections/audio?q=Bluetooth" },
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
          { label: "MagSafe", href: "/collections/cases?q=MagSafe" },
          { label: "Fashion", href: "/collections/cases?q=Fashion" },
          { label: "Case wallets", href: "/collections/cases?q=Wallet" },
          { label: "Rugged", href: "/collections/cases?q=Rugged" },
          { label: "Slim", href: "/collections/cases?q=Slim" },
          { label: "Waterproof", href: "/collections/cases?q=Waterproof" },
        ],
      },
      {
        heading: "Apple",
        links: [
          { label: "iPhone 17 Pro Max", href: "/collections/devices?q=iPhone+17+Pro+Max" },
          { label: "iPhone 17 Pro", href: "/collections/devices?q=iPhone+17+Pro" },
          { label: "iPhone 17", href: "/collections/devices?q=iPhone+17" },
          { label: "iPhone 16 Pro Max", href: "/collections/devices?q=iPhone+16+Pro+Max" },
          { label: "iPhone 16 Pro", href: "/collections/devices?q=iPhone+16+Pro" },
          { label: "iPhone 16 Plus", href: "/collections/devices?q=iPhone+16+Plus" },
          { label: "iPhone 16", href: "/collections/devices?q=iPhone+16" },
          { label: "iPhone 16e", href: "/collections/devices?q=iPhone+16e" },
          { label: "iPhone 15 Pro Max", href: "/collections/devices?q=iPhone+15+Pro+Max" },
          { label: "iPhone 15 Pro", href: "/collections/devices?q=iPhone+15+Pro" },
          { label: "iPhone 15 Plus", href: "/collections/devices?q=iPhone+15+Plus" },
          { label: "iPhone 15", href: "/collections/devices?q=iPhone+15" },
          { label: "Shop all Apple →", href: "/collections/devices?q=iPhone" },
        ],
      },
      {
        heading: "Samsung",
        links: [
          { label: "Galaxy S26", href: "/collections/devices?q=Galaxy+S26" },
          { label: "Galaxy S26 Plus", href: "/collections/devices?q=Galaxy+S26+Plus" },
          { label: "Galaxy S26 Ultra", href: "/collections/devices?q=Galaxy+S26+Ultra" },
          { label: "Galaxy S25", href: "/collections/devices?q=Galaxy+S25" },
          { label: "Galaxy S25 Plus", href: "/collections/devices?q=Galaxy+S25+Plus" },
          { label: "Galaxy S25 Ultra", href: "/collections/devices?q=Galaxy+S25+Ultra" },
          { label: "Galaxy S24", href: "/collections/devices?q=Galaxy+S24" },
          { label: "Galaxy S24 Plus", href: "/collections/devices?q=Galaxy+S24+Plus" },
          { label: "Galaxy S24 Ultra", href: "/collections/devices?q=Galaxy+S24+Ultra" },
          { label: "Galaxy Z Fold 6", href: "/collections/devices?q=Galaxy+Z+Fold" },
          { label: "Galaxy Z Flip 6", href: "/collections/devices?q=Galaxy+Z+Flip" },
          { label: "Galaxy A16 5G", href: "/collections/devices?q=Galaxy+A16" },
          { label: "Shop all Samsung →", href: "/collections/devices?q=Samsung" },
        ],
      },
      {
        heading: "Google",
        links: [
          { label: "Pixel 9A", href: "/collections/cases?q=Pixel+9A" },
          { label: "Pixel 9 Pro XL", href: "/collections/cases?q=Pixel+9+Pro+XL" },
          { label: "Pixel 9 Pro", href: "/collections/cases?q=Pixel+9+Pro" },
          { label: "Pixel 9 Pro Fold", href: "/collections/cases?q=Pixel+9+Pro+Fold" },
          { label: "Pixel 9", href: "/collections/cases?q=Pixel+9" },
          { label: "Pixel 8 Pro", href: "/collections/cases?q=Pixel+8+Pro" },
          { label: "Pixel 8", href: "/collections/cases?q=Pixel+8" },
          { label: "Pixel 8A", href: "/collections/cases?q=Pixel+8A" },
          { label: "Shop all Google →", href: "/collections/cases?q=Pixel" },
        ],
      },
      {
        heading: "Motorola",
        links: [
          { label: "Moto G Power 5G", href: "/collections/cases?q=Moto+G+Power" },
          { label: "Moto G Stylus 5G", href: "/collections/cases?q=Moto+G+Stylus" },
          { label: "Moto G Power", href: "/collections/cases?q=Moto+G+Power" },
          { label: "Motorola Edge", href: "/collections/cases?q=Motorola+Edge" },
          { label: "Motorola Razr", href: "/collections/cases?q=Motorola+Razr" },
          { label: "Shop all Motorola →", href: "/collections/cases?q=Motorola" },
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
          { label: "iPhone", href: "/collections/screen-protection?q=iPhone" },
          { label: "Galaxy", href: "/collections/screen-protection?q=Galaxy" },
          { label: "Pixel", href: "/collections/screen-protection?q=Pixel" },
          { label: "Motorola", href: "/collections/screen-protection?q=Motorola" },
          { label: "Tablet", href: "/collections/screen-protection?q=Tablet" },
          { label: "Wearables", href: "/collections/screen-protection?q=Watch" },
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
          { label: "Cables & adapters", href: "/collections/power?q=Cable" },
          { label: "Power banks & batteries", href: "/collections/power?q=Power+Bank" },
          { label: "Charging stands & stations", href: "/collections/power?q=Stand" },
          { label: "Car chargers & mounts", href: "/collections/power?q=Car" },
          { label: "Wireless charging", href: "/collections/power?q=Wireless" },
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
          { label: "Grips, rings & stands", href: "/collections/accessories?q=Grip" },
          { label: "Gaming", href: "/collections/accessories?q=Gaming" },
          { label: "Mounts", href: "/collections/accessories?q=Mount" },
          { label: "Chains, wallets & charms", href: "/collections/accessories?q=Wallet" },
          { label: "MagSafe accessories", href: "/collections/accessories?q=MagSafe" },
          { label: "Organizers & carrying cases", href: "/collections/accessories?q=Organizer" },
          { label: "Storage & memory cards", href: "/collections/accessories?q=Storage" },
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
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
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
    ? `${user.fname[0] ?? ""}${user.lname[0] ?? ""}`.toUpperCase()
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
          <Image src="/jesup-logo.svg" alt="Logo" width={90} height={40} className="object-contain" priority />
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
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
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
                        <span className="w-10 h-10 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                          {initials || "U"}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.fname} {user.lname}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    {/* Menu items */}
                    <div className="py-2">
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        href="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8" />
                        </svg>
                        My Orders
                      </Link>
                      {user.role === "user" && (
                        <>
                          <Link
                            href="/track-order"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 16l4.553-2.276A1 1 0 0021 19.382V8.618a1 1 0 00-1.447-.894L15 10m0 9V10m0 0L9 7" />
                            </svg>
                            Track Order
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Wishlist
                          </Link>
                        </>
                      )}
                      {user.role === "admin" && (
                        <a
                          href={process.env.NEXT_PUBLIC_ADMIN_URL}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Dashboard
                        </a>
                      )}
                    </div>
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={async () => { setUserMenuOpen(false); await logout(); router.push("/"); }}
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
          <Image src="/jesup-logo.svg" alt="Logo" width={80} height={32} className="object-contain" priority />
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
          {/* User profile card */}
          {user ? (
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl">
                <span className="w-10 h-10 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                  {initials || "U"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.fname} {user.lname}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
                  Profile
                </Link>
                <Link href="/my-orders" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                  My Orders
                </Link>
                {user?.role === "user" && (
                  <>
                    <Link href="/track-order" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                      Track Order
                    </Link>
                    <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                      Wishlist
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="px-4 pt-4 pb-3 border-b border-gray-100 grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors">
                Sign in
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex items-center justify-center py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Create account
              </Link>
            </div>
          )}
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
            {user && (
              <div className="pt-3">
                <button
                  onClick={async () => { setMobileOpen(false); await logout(); router.push("/"); }}
                  className="w-full flex items-center gap-2 py-3 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
