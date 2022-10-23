import { useEffect, useState } from 'react';
import { useCartStore, CartItems } from '../../store/cart';

export const useCartItems = () => {
  const { items } = useCartStore((state) => state);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const cartTotal = Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);

  // get rid of hydration problems
  // since we set them from the localStorage in the store
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCartItems(items);
    }
  }, [items]);

  return { cartItems, cartTotal };
};
