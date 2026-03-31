"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
};

export type OrderMode = "unknown" | "dine-in" | "delivery";

type CartState = {
  tableId: string | null;
  orderMode: OrderMode;
  note: string;
  items: CartItem[];
  setTableId: (tableId: string) => void;
  setOrderMode: (mode: OrderMode) => void;
  setNote: (note: string) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string) => void;
  setQuantity: (menuItemId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tableId: null,
      orderMode: "unknown",
      note: "",
      items: [],
      setTableId: (tableId) => set({ tableId }),
      setOrderMode: (orderMode) => set({ orderMode }),
      setNote: (note) => set({ note }),
      addItem: (item) => {
        const existing = get().items.find((cartItem) => cartItem.menuItemId === item.menuItemId);
        if (existing) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.menuItemId === item.menuItemId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          });
          return;
        }

        set({ items: [...get().items, { ...item, quantity: 1 }] });
      },
      removeItem: (menuItemId) =>
        set({ items: get().items.filter((cartItem) => cartItem.menuItemId !== menuItemId) }),
      setQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((cartItem) => cartItem.menuItemId !== menuItemId) });
          return;
        }

        set({
          items: get().items.map((cartItem) =>
            cartItem.menuItemId === menuItemId ? { ...cartItem, quantity } : cartItem
          )
        });
      },
      clear: () => set({ items: [], note: "" })
    }),
    {
      name: "restaurant-cart",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const useCartTotals = () => {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { count, total };
};
