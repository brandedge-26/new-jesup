"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useState, useRef, useEffect } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":    "Dashboard",
  "/orders":       "Orders",
  "/products":     "Products",
  "/products/add": "Add Product",
  "/customers":    "Customers",
  "/analytics":    "Analytics",
  "/settings":              "Settings",
  "/repair/booking":        "Repair Appointments",
  "/repair/applications":   "Applications",
};

const NOTIFICATIONS = [
  { title: "New order received",   desc: "ORD-1051 placed by John Smith",              time: "2 min ago",  unread: true  },
  { title: "Low stock alert",      desc: "Ventev Powercell 6000+ has only 18 units",   time: "1 hr ago",   unread: true  },
  { title: "Product status updated", desc: "JBL Quantum 100M2 moved to Draft",         time: "3 hrs ago",  unread: false },
  { title: "New customer registered", desc: "hazel@example.com just signed up",        time: "5 hrs ago",  unread: false },
];

function useOutsideClick(cb: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cb]);
  return ref;
}

// ── Notification Menu ─────────────────────────────────────────────────────────

function NotificationMenu() {
  const [open, setOpen]   = useState(false);
  const [read, setRead]   = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const unreadCount = read ? 0 : NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900">Notifications</span>
            {!read && (
              <button
                onClick={() => setRead(true)}
                className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {NOTIFICATIONS.map((n, i) => {
              const isUnread = n.unread && !read;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${isUnread ? "bg-primary/[0.02]" : ""}`}
                >
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isUnread ? "bg-primary" : "bg-transparent"}`} />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isUnread ? "text-gray-900" : "text-gray-600"}`}>{n.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{n.desc}</p>
                    <p className="text-[10px] text-gray-300 mt-1">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <button className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Profile Menu ──────────────────────────────────────────────────────────────

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const user = useAdminAuthStore((s) => s.user);
  const logout = useAdminAuthStore((s) => s.logout);
  const router = useRouter();

  const initials = user
    ? `${user.fname[0] ?? ""}${user.lname[0] ?? ""}`.toUpperCase()
    : "JA";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-primary/30 transition-all"
        aria-label="Profile menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{user ? `${user.fname} ${user.lname}` : "Admin"}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); router.push("/dashboard"); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>

            <div className="border-t border-gray-100 mx-3 my-1" />

            <button
              onClick={async () => { setOpen(false); await logout(); router.replace("/login"); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Topbar ────────────────────────────────────────────────────────────────────

export default function Topbar() {
  const pathname = usePathname();
  const { toggleSidebar } = useAdminStore();

  const title = Object.entries(PAGE_TITLES)
    .filter(([path]) => pathname === path || pathname.startsWith(path + "/"))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 flex items-center gap-4 px-4 lg:px-6 shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Desktop collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        aria-label="Collapse sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div>
        <h1 className="text-base font-bold text-gray-900">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <NotificationMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
