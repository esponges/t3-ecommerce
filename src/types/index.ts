import type { Order, OrderDetail } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export interface SessionProviders {
  discord: 'discord';
  facebook: 'facebook';
  google: 'google';
}

export enum AuthProviders {
  Discord = 'discord',
  Facebook = 'facebook',
  Google = 'google',
}

export enum PaymentMethods {
  Cash = 'cash',
  Transfer = 'transfer',
  // to implement
  // CreditCard = 'credit-card',
  // DebitCard = 'debit-card',
  // Paypal = 'paypal',
  // MercadoPago = 'mercado-pago',
}

/* Prisma queries don't include relations by default
  https://github.com/prisma/prisma/discussions/10928#discussioncomment-1920961
*/
export type OrderItem = Prisma.OrderItemGetPayload<{
  include: { product: true };
}>;

export type Product = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export type Category = Prisma.CategoryGetPayload<{}>;

export type OrderWithPayload = Prisma.OrderGetPayload<{
  include: { orderItems: true; orderDetail: true };
}>;

export interface OrderDetails extends Order {
  orderItems: OrderItem[];
  orderDetail: OrderDetail | null;
}

