import { setLocalCart } from '@/lib/cart';
import type { Product } from '@prisma/client';
import { toast } from 'react-toastify';
import create from 'zustand';

export type Item = Product & { quantity: number };
export type CartItems = { [key: string]: Item } | Record<string, never>;
export interface CartState {
  items: CartItems;
  actions: {
    restoreCart: (cart: CartItems) => void;
    addToCart: (product: Product, quantity: number) => void;
    increaseQuantity: (productId: string, qty: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartItems: (items: Product[]) => void;
    clearCart: () => void;
  };
}

// todo: fix this any warning
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const storageItems: CartItems =
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '{}') : {};

const useCartStore = create<CartState>((set) => ({
  items: storageItems,
  // create an action folder once gets bigger
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
        setLocalCart(updatedCart.items);

        // show toast
        toast(`${product.name} (${quantity}x) agregado`);

        return updatedCart;
      });
    },
    increaseQuantity: (productId: string, qty: number) => {
      set((state) => {
        const product = state.items[productId];

        if (!product) {
          console.warn(`Product ${productId} not found`);
          return state;
        }

        const item: Item = { ...product, quantity: product.quantity + qty };

        const updatedCart = {
          items: {
            ...state.items,
            [productId]: {
              ...item,
            },
          },
        };

        toast(`${item.name} (${qty}x) agregado`);

        setLocalCart(updatedCart.items);

        return updatedCart;
      });
    },
    updateCartItems: (toUpdate: Product[]) => {
      set((state) => {
        const updatedCart = {
          items: {
            ...state.items,
          },
        };

        toUpdate.forEach((item) => {
          updatedCart.items[item.id] = {
            ...item,
            quantity: state.items[item.id]?.quantity || 0,
          };
        });

        setLocalCart(updatedCart.items);

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

        toast(`${state.items[productId]?.name || ''} eliminado`);

        setLocalCart(updatedCart.items);

        return updatedCart;
      });
    },

    clearCart: () => {
      set((_state) => {
        const updatedCart = {
          items: {},
        };

        setLocalCart;

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

