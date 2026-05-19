"use client";

import { create } from "zustand";
import { adminAxios } from "@/lib/axios";

const LS_SEEN_KEY      = "admin_last_seen_notif_time";
const LS_DISMISSED_KEY = "admin_dismissed_notifs";

export type NotifType = "order" | "appointment" | "application";

export interface Notif {
  id: string;
  type: NotifType;
  title: string;
  desc: string;
  createdAt: string;
  href: string;
}

function loadDismissed(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_DISMISSED_KEY) ?? "[]"); } catch { return []; }
}
function saveDismissed(ids: string[]) {
  localStorage.setItem(LS_DISMISSED_KEY, JSON.stringify(ids));
}

interface NotifState {
  notifs:       Notif[];       // all (excluding dismissed)
  dismissedIds: string[];
  lastSeen:     string;
  loading:      boolean;

  fetch:        () => Promise<void>;
  dismiss:      (key: string) => void;   // key = `${type}-${id}`
  markAllRead:  () => void;

  // derived
  unreadCount:  () => number;
}

export const useNotifStore = create<NotifState>((set, get) => ({
  notifs:       [],
  dismissedIds: [],
  lastSeen:     new Date(0).toISOString(),
  loading:      false,

  fetch: async () => {
    // Hydrate from localStorage on first call
    const lastSeen     = localStorage.getItem(LS_SEEN_KEY) ?? new Date(0).toISOString();
    const dismissedIds = loadDismissed();
    set({ loading: true, lastSeen, dismissedIds });

    try {
      const [ordersRes, apptsRes, contactsRes] = await Promise.allSettled([
        adminAxios.get("/orders"),
        adminAxios.get("/appointments"),
        adminAxios.get("/contacts"),
      ]);

      const all: Notif[] = [];

      if (ordersRes.status === "fulfilled") {
        (ordersRes.value.data.orders ?? []).forEach((o: {
          _id: string; orderNumber: string; total: number; createdAt: string;
          userId: { fname: string; lname: string } | null;
        }) => {
          const customer = o.userId ? `${o.userId.fname} ${o.userId.lname}` : "Guest";
          all.push({
            id: o._id, type: "order",
            title: "New order received",
            desc: `#${o.orderNumber} by ${customer} · $${o.total.toFixed(2)}`,
            createdAt: o.createdAt, href: "/orders",
          });
        });
      }
      if (apptsRes.status === "fulfilled") {
        (apptsRes.value.data.appointments ?? []).forEach((a: {
          _id: string; name: string; device?: string; brand?: string; createdAt: string;
        }) => {
          all.push({
            id: a._id, type: "appointment",
            title: "New appointment booked",
            desc: `${a.name} — ${[a.brand, a.device].filter(Boolean).join(" ")}`,
            createdAt: a.createdAt, href: "/repair/booking",
          });
        });
      }
      if (contactsRes.status === "fulfilled") {
        (contactsRes.value.data.contacts ?? []).forEach((c: {
          _id: string; firstName: string; lastName: string; email: string; createdAt: string;
        }) => {
          all.push({
            id: c._id, type: "application",
            title: "New contact message",
            desc: `${c.firstName} ${c.lastName} — ${c.email}`,
            createdAt: c.createdAt, href: "/repair/applications",
          });
        });
      }

      all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Filter dismissed
      const visible = all.filter((n) => !dismissedIds.includes(`${n.type}-${n.id}`));
      set({ notifs: visible });
    } catch { /* ignore */ }
    finally { set({ loading: false }); }
  },

  dismiss: (key: string) => {
    const dismissed = [...get().dismissedIds, key];
    saveDismissed(dismissed);
    set({
      dismissedIds: dismissed,
      notifs: get().notifs.filter((n) => `${n.type}-${n.id}` !== key),
    });
  },

  markAllRead: () => {
    const now = new Date().toISOString();
    localStorage.setItem(LS_SEEN_KEY, now);
    set({ lastSeen: now });
  },

  unreadCount: () => {
    const { notifs, lastSeen } = get();
    return notifs.filter((n) => new Date(n.createdAt) > new Date(lastSeen)).length;
  },
}));
