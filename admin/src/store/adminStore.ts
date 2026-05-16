"use client";
import { create } from "zustand";
import { PRODUCTS } from "@/lib/mockData";
import type { Product } from "@/lib/mockData";

// ── UI Store ──────────────────────────────────────────────────────────────────

interface UIStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAdminStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));

// ── Products Store ────────────────────────────────────────────────────────────

interface ProductsStore {
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductsStore = create<ProductsStore>((set) => ({
  products: PRODUCTS,

  addProduct: (p) =>
    set((s) => ({
      products: [
        { ...p, id: `PRD-${String(s.products.length + 1).padStart(3, "0")}` },
        ...s.products,
      ],
    })),

  updateProduct: (id, updates) =>
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  deleteProduct: (id) =>
    set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
}));
