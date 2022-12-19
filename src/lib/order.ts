import type { Product } from '@prisma/client';

type P = Product & { qty: number };

export const getOrderTotal = (products: P[]): number => {
  return products.reduce((acc, product) => {
    return acc + product.price * product.qty;
  }, 0);
};
