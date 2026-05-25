"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "./dropdownData";
import NavDropdown from "./NavDropdown";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, ShoppingBag } from "lucide-react";

function getInitials(fname: string, lname: string) {
  return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase();
}

function UserAvatar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
      >
        {getInitials(user.fname, user.lname)}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 animate-dropdown-in">
          {/* User info */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
              {getInitials(user.fname, user.lname)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.fname} {user.lname}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Dashboard link for admins */}
          {user.role === "admin" && (
            <div className="py-2 border-b border-gray-100">
              <a
                href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-gray-400 shrink-0" />
                Dashboard
              </a>
            </div>
          )}

          {/* Logout */}
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const clearLeaveTimer = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };
  const scheduleClose = () => {
    leaveTimer.current = setTimeout(() => setActiveDropdown(null), 180);
  };

  const handleNavEnter = (label: string) => {
    clearLeaveTimer();
    setActiveDropdown(label);
  };
  const handleNavLeave = () => scheduleClose();
  const handleDropdownEnter = () => clearLeaveTimer();
  const handleDropdownLeave = () => scheduleClose();

  const activeItem = navItems.find((n) => n.label === activeDropdown);

  const toggleMobileExpanded = (label: string) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  const handleMobileLogout = async () => {
    setMobileOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 w-full bg-white border-b border-gray-200 z-50">
        {/* ── Main bar ── */}
        <div className="px-6 lg:px-10 2xl:px-16 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/jesup-logo.svg"
              alt="Jesup"
              width={200}
              height={60}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = activeDropdown === item.label;
              return (
                <div
                  key={item.label}
                  className="relative h-16 flex items-center"
                  onMouseEnter={() =>
                    item.dropdown ? handleNavEnter(item.label) : undefined
                  }
                  onMouseLeave={item.dropdown ? handleNavLeave : undefined}
                >
                  <Link
                    href={item.href ?? "#"}
                    className={`flex items-center gap-1 text-sm transition-all duration-150 ${isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-gray-900 font-medium"
                      }`}
                  >
                    {item.label}
                    {item.dropdown && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isActive ? "rotate-180" : ""
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </Link>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-gray-900 rounded-t-full" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 shrink-0">

            {isAuthenticated ? (
              <UserAvatar />
            ) : (
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center px-5 py-2 rounded-full border border-gray-400 text-sm font-medium text-gray-800 hover:border-gray-700 transition-colors duration-150"
              >
                Login
              </Link>
            )}

            <Link
              href="/appointments"
              className="hidden lg:inline-flex items-center px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors duration-150"
            >
              Start a repair
            </Link>

            {/* Mobile user icon */}
            {isAuthenticated && user ? (
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold"
              >
                {getInitials(user.fname, user.lname)}
              </button>
            ) : (
              <Link
                href="/login"
                className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Login"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Desktop dropdown ── */}
        {activeItem?.dropdown && (
          <div
            className="absolute left-0 right-0 top-full z-40"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="px-6 lg:px-10 2xl:px-16 py-3 bg-transparent">
              <div className="max-w-5xl bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-dropdown-in">
                <NavDropdown panel={activeItem.dropdown} />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile menu overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
              <Image
                src="/jesup-logo.svg"
                alt="Jesup"
                width={200}
                height={40}
                className="h-12 w-auto object-contain"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile user info (if logged in) */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                  {getInitials(user.fname, user.lname)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.fname} {user.lname}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav items */}
            <nav className="flex flex-col flex-1 px-4 py-4 gap-1">
              {navItems.map((item) => {
                const isExpanded = mobileExpanded === item.label;
                return (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={() => toggleMobileExpanded(item.label)}
                          className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {item.label}
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                              }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="mt-2 mb-1 grid grid-cols-3 gap-2 px-1">
                            {item.dropdown.items.map((sub) =>
                              sub.image ? (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gray-100 hover:border-primary hover:bg-gray-50 transition-all group"
                                >
                                  <div className="relative w-12 h-10">
                                    <Image src={sub.image} alt={sub.label} fill className="object-contain" />
                                  </div>
                                  <span className="text-[11px] font-medium text-gray-600 group-hover:text-primary text-center leading-tight">
                                    {sub.label}
                                  </span>
                                </Link>
                              ) : (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="col-span-3 flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                                >
                                  {sub.label}
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              )
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href ?? "#"}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Bottom buttons */}
            <div className="flex flex-col gap-3 px-4 py-5 border-t border-gray-100 shrink-0">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-400 text-sm font-medium text-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop
                  </Link>
                  <button
                    onClick={handleMobileLogout}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-400 text-sm font-medium text-gray-800 hover:border-gray-700 transition-colors"
                >
                  Login
                </Link>
              )}
              <Link
                href="/appointments"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                Start a repair
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


// teri sehat hame manzoor he lekin usko nahi manzoor.
// to pir hamko b manzoor nahi.
