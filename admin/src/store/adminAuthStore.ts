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

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,

    initAuth: async () => {
        try {
            const res = await adminAxios.get("/auth/refresh");
            const { accessToken, user } = res.data;
            if (user.role !== "admin") throw new Error("Not admin");
            setAdminToken(accessToken);
            set({ user, isAuthenticated: true, isInitialized: true });
        } catch {
            setAdminToken(null);
            set({ user: null, isAuthenticated: false, isInitialized: true });
        }
    },

    login: async (email, password) => {
        const res = await adminAxios.post("/auth/admin-login", { email, password });
        const { accessToken, user } = res.data;
        setAdminToken(accessToken);
        set({ user, isAuthenticated: true });
    },

    updateUser: (data) => set((s) => ({ user: s.user ? { ...s.user, ...data } : s.user })),

    logout: async () => {
        try {
            await adminAxios.post("/auth/logout");
        } catch {
            // ignore
        }
        setAdminToken(null);
        set({ user: null, isAuthenticated: false });
    },
}));
