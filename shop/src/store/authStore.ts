import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthStore {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login:  (user) => set({ user }),
      logout: ()     => set({ user: null }),
    }),
    { name: "jesup-auth" }
  )
);
