import { create } from "zustand";
import { publicAxios } from "@/lib/axios";

export interface AuthUser {
    id: string;
    fname: string;
    lname: string;
    email: string;
    role: string;
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;

    setAccessToken: (token: string) => void;
    updateUser: (data: Partial<AuthUser>) => void;
    initAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (fname: string, lname: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isInitialized: false,

    setAccessToken: (token) => set({ accessToken: token }),

    updateUser: (data) => set((s) => ({ user: s.user ? { ...s.user, ...data } : s.user })),

    initAuth: async () => {
        try {
            const res = await publicAxios.get("/auth/refresh");
            set({
                accessToken: res.data.accessToken,
                user: res.data.user,
                isAuthenticated: true,
                isInitialized: true,
            });
        } catch {
            set({ accessToken: null, user: null, isAuthenticated: false, isInitialized: true });
        }
    },

    login: async (email, password) => {
        const res = await publicAxios.post("/auth/login", { email, password });
        set({
            user: res.data.user,
            accessToken: res.data.accessToken,
            isAuthenticated: true,
        });
    },

    register: async (fname, lname, email, password) => {
        const res = await publicAxios.post("/auth/register", { fname, lname, email, password });
        set({
            user: res.data.user,
            accessToken: res.data.accessToken,
            isAuthenticated: true,
        });
    },

    logout: async () => {
        try {
            await publicAxios.post("/auth/logout");
        } finally {
            set({ user: null, accessToken: null, isAuthenticated: false });
        }
    },
}));
