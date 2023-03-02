import type { CartItems } from "@/store/cart";

export const setLocalCart = (cart: CartItems) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};
