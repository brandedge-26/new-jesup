"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useNotifStore, type NotifType } from "@/store/notifStore";
import Pagination from "@/components/Pagination";

// ── Config ─────────────────────────────────────────────────────────────────────

type Tab = "All" | "Orders" | "Appointments" | "Applications";
const TABS: Tab[] = ["All", "Orders", "Appointments", "Applications"];
const TAB_TYPE: Record<Tab, NotifType | null> = {
  All: null, Orders: "order", Appointments: "appointment", Applications: "application",
};
const PAGE_SIZE = 10;

const TYPE_STYLES: Record<NotifType, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  order: {
    bg: "bg-violet-50", text: "text-violet-600", label: "Order",
    icon: (
      <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  appointment: {
    bg: "bg-blue-50", text: "text-blue-600", label: "Appointment",
    icon: (
      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  application: {
    bg: "bg-pink-50", text: "text-pink-600", label: "Application",
    icon: (
      <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { notifs, lastSeen, loading, fetch, dismiss, markAllRead, unreadCount } = useNotifStore();
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [page, setPage]           = useState(1);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = useMemo(() => {
    const type = TAB_TYPE[activeTab];
    return type ? notifs.filter((n) => n.type === type) : notifs;
  }, [notifs, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const counts: Record<Tab, number> = useMemo(() => ({
    All:          notifs.length,
    Orders:       notifs.filter((n) => n.type === "order").length,
    Appointments: notifs.filter((n) => n.type === "appointment").length,
    Applications: notifs.filter((n) => n.type === "application").length,
  }), [notifs]);

  const unread = unreadCount();

  function changeTab(tab: Tab) { setActiveTab(tab); setPage(1); }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Admin</p>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5">All Notifications</h1>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
          >
            Mark all read ({unread})
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => changeTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading && notifs.length === 0 ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                  <div className="h-2.5 w-64 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : pageData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">No {activeTab !== "All" ? activeTab.toLowerCase() : ""} notifications.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {pageData.map((n) => {
                const isUnread = new Date(n.createdAt) > new Date(lastSeen);
                const style    = TYPE_STYLES[n.type];
                const key      = `${n.type}-${n.id}`;
                return (
                  <div key={key}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors group ${isUnread ? "bg-primary/[0.02]" : "hover:bg-gray-50"}`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center shrink-0`}>
                      {style.icon}
                    </div>

                    {/* Content (clickable) */}
                    <Link href={n.href} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${isUnread ? "text-gray-900" : "text-gray-600"}`}>
                          {n.title}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{n.desc}</p>
                    </Link>

                    {/* Time */}
                    <p className="text-[11px] text-gray-400 shrink-0 hidden sm:block">{timeAgo(n.createdAt)}</p>

                    {/* Unread dot */}
                    {isUnread && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}

                    {/* Delete / dismiss */}
                    <button
                      onClick={() => dismiss(key)}
                      className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                      aria-label="Dismiss notification"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-100 px-5">
                <Pagination
                  page={safePage}
                  totalPages={totalPages}
                  onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  totalItems={filtered.length}
                  pageSize={PAGE_SIZE}
                />
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
