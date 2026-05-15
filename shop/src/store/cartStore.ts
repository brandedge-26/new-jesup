import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  /** unique key = productId + color */
  key: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  color: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  /** total number of units in cart */
  count: number;
  addItem: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,

      addItem: (item, qty = 1) => {
        const key = `${item.productId}-${item.color}`;
        const existing = get().items.find((i) => i.key === key);
        let items: CartItem[];
        if (existing) {
          items = get().items.map((i) =>
            i.key === key ? { ...i, qty: i.qty + qty } : i
          );
        } else {
          items = [...get().items, { ...item, key, qty }];
        }
        set({ items, count: items.reduce((s, i) => s + i.qty, 0) });
      },

      removeItem: (key) => {
        const items = get().items.filter((i) => i.key !== key);
        set({ items, count: items.reduce((s, i) => s + i.qty, 0) });
      },

      updateQty: (key, qty) => {
        if (qty < 1) { get().removeItem(key); return; }
        const items = get().items.map((i) => (i.key === key ? { ...i, qty } : i));
        set({ items, count: items.reduce((s, i) => s + i.qty, 0) });
      },

      clearCart: () => set({ items: [], count: 0 }),
    }),
    { name: "jesup-cart" }
  )
);
