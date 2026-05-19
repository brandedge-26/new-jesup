"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminStore } from "@/store/adminStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useState, useRef, useEffect } from "react";
import { useNotifStore } from "@/store/notifStore";

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
  "/notifications":         "Notifications",
};

const LS_KEY = "admin_last_seen_notif_time";

type NotifType = "order" | "appointment" | "application";

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  desc: string;
  createdAt: string;
  href: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

const TYPE_ICON: Record<NotifType, React.ReactNode> = {
  order: (
    <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
  ),
  appointment: (
    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  ),
  application: (
    <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  ),
};

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
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));

  const { notifs, lastSeen, loading, fetch, dismiss, markAllRead, unreadCount } = useNotifStore();

  // Fetch on mount only
  useEffect(() => {
    fetch();
  }, [fetch]);

  const count    = unreadCount();
  const preview  = notifs.slice(0, 6);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Notifications</span>
              {count > 0 && <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{count} new</span>}
            </div>
            {count > 0 && (
              <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {loading && notifs.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-gray-400">Loading...</div>
            ) : preview.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-gray-400">No notifications.</div>
            ) : (
              preview.map((n) => {
                const isUnread = new Date(n.createdAt) > new Date(lastSeen);
                const key = `${n.type}-${n.id}`;
                return (
                  <div key={key} className={`flex items-start gap-3 px-4 py-3 transition-colors group ${isUnread ? "bg-primary/[0.03]" : "hover:bg-gray-50"}`}>
                    <Link href={n.href} onClick={() => setOpen(false)} className="flex items-start gap-3 flex-1 min-w-0">
                      {TYPE_ICON[n.type]}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-semibold ${isUnread ? "text-gray-900" : "text-gray-600"}`}>{n.title}</p>
                          <p className="text-[10px] text-gray-300 shrink-0">{timeAgo(n.createdAt)}</p>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{n.desc}</p>
                      </div>
                    </Link>
                    <button onClick={() => dismiss(key)}
                      className="shrink-0 p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      aria-label="Dismiss">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <Link href="/notifications" onClick={() => setOpen(false)}
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
              View all notifications →
            </Link>
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
