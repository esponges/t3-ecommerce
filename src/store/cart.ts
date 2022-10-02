import { Product } from "@prisma/client";
import create from "zustand";

type Item = Product & { quantity: number };

interface CartState {
  items: { [key: string]: Item };
  addToCart: (product: Product, quantity: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: {},
  addToCart: (product, quantity) => {
    set((state) => {
      const item: Item = { ...product, quantity };
      return {
        items: { ...state.items, [product.id]: {
          ...item,
          quantity: (state.items[product.id]?.quantity || 0) + quantity,
        } },
      };
    });
  },
}));
