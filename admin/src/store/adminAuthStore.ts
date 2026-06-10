"use client";

import { create } from "zustand";
import { adminAxios, setAdminToken } from "@/lib/axios";

interface AdminUser {
    id: string;
    fname: string;
    lname: string;
    email: string;
    role: string;
}

interface AdminAuthState {
    user: AdminUser | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    initAuth: () => Promise<void>;
    updateUser: (data: Partial<AdminUser>) => void;
}

const SESSION_KEY = "jesup_admin_auth";

function saveSession(user: AdminUser, token: string) {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
    } catch { /* ignore */ }
}

function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

function getSession(): { user: AdminUser; token: string } | null {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch { return null; }
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,

    initAuth: async () => {
        // 1. Restore from sessionStorage instantly (no flicker)
        const session = getSession();
        if (session) {
            setAdminToken(session.token);
            set({ user: session.user, isAuthenticated: true, isInitialized: true });
            return;
        }

        // 2. Fallback — try refresh cookie
        try {
            const res = await adminAxios.get("/auth/refresh");
            const { accessToken, user } = res.data;
            if (user.role !== "admin") throw new Error("Not admin");
            setAdminToken(accessToken);
            saveSession(user, accessToken);
            set({ user, isAuthenticated: true, isInitialized: true });
        } catch {
            setAdminToken(null);
            clearSession();
            set({ user: null, isAuthenticated: false, isInitialized: true });
        }
    },

    login: async (email, password) => {
        const res = await adminAxios.post("/auth/admin-login", { email, password });
        const { accessToken, user } = res.data;
        setAdminToken(accessToken);
        saveSession(user, accessToken);
        set({ user, isAuthenticated: true, isInitialized: true });
    },

    updateUser: (data) => set((s) => ({ user: s.user ? { ...s.user, ...data } : s.user })),

    logout: async () => {
        try {
            await adminAxios.post("/auth/logout");
        } catch { /* ignore */ }
        setAdminToken(null);
        clearSession();
        set({ user: null, isAuthenticated: false });
    },
}));
