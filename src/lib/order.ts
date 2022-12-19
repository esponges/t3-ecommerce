import type { Product } from '@prisma/client';

export const getOrderTotal = (products: Product[]): number => {
  return products.reduce((acc, product) => {
    return acc + product.price;
  }, 0);
};
