import { Product } from "@prisma/client";
import create from "zustand";

interface CartState {
  items: Pick<Product, 'id' | 'name' | 'price' | 'discount'>[] & { quantity: number }[];
  addToCart: (product: Pick<Product, 'id' | 'name' | 'price' | 'discount'>, quantity: number) => void;
}

export const cartState = create<CartState>((set) => ({
  items: [],
  addToCart: (product, quantity) => {
    set((state) => ({
      items: [
        ...state.items,
        {
          ...product,
          quantity,
        },
      ],
    }));
  }
}));








