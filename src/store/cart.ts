import type { Product } from '@prisma/client';
import create from 'zustand';

export type Item = Product & { quantity: number };
export type CartItems = { [key: string]: Item } | Record<string, never>;
interface CartState {
  items: CartItems;
  restoreCart: (cart: CartItems) => void;
  addToCart: (product: Product, quantity: number) => void;
}

// todo: fix this any warning
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const storageItems: CartItems =
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '{}') : {};

export const useCartStore = create<CartState>((set) => ({
  items: storageItems,
  // move actions to separate file
  restoreCart: (cartItems?: CartItems) => {
    set({ items: cartItems ?? {} });
  },
  addToCart: (product, quantity) => {
    set((state) => {
      const item: Item = { ...product, quantity };

      const updatedCart = {
        items: {
          ...state.items,
          [product.id]: {
            ...item,
            quantity: (state.items[product.id]?.quantity || 0) + quantity,
          },
        },
      };

      // persist cart to local storage
      localStorage.setItem('cart', JSON.stringify(updatedCart.items));

      return updatedCart;
    });
  },
  removeFromCart: (productId: string) => {
    set((state) => {
      const updatedCart = {
        items: {
          ...state.items,
        },
      };

      delete updatedCart.items[productId];

      // persist cart to local storage
      localStorage.setItem('cart', JSON.stringify(updatedCart.items));

      return updatedCart;
    });
  },
}));
