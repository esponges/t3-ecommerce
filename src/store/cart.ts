import type { Product } from '@prisma/client';
import create from 'zustand';

export type Item = Product & { quantity: number };
export type CartItems = { [key: string]: Item } | Record<string, never>;
interface CartState {
  items: CartItems;
  actions: {
    restoreCart: (cart: CartItems) => void;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
  };
}

// todo: fix this any warning
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const storageItems: CartItems =
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '{}') : {};

const useCartStore = create<CartState>((set) => ({
  items: storageItems,
  actions: {
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
    }
  }

}));

// export selectors and actions
// if we subscribe directly to the store in the component
// we will get a new object every time the store changes
// and the component will re-render at every change in the store
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartActions = () => useCartStore((state) => state.actions);

