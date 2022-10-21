import { z } from 'zod';
import { createRouter } from './context';

export const orderRouter = createRouter().mutation('create', {
  input: z.object({
    userId: z.string(),
    orderItems: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number(),
      })
    ),
    orderDetails: z.array(
      z.object({
        address: z.string(),
        city: z.string(),
        country: z.string(),
        postalCode: z.string(),
        phone: z.string(),
      })
    ),
  }),
  resolve: async ({ ctx, input }) => {
    try {
      const order = await ctx.prisma.order.create({
        data: {
          userId: input.userId,
          orderItems: {
            create: input.orderItems,
          },
          orderDetails: {
            create: input.orderDetails,
          },
        },
      });
      return order;
    } catch (error) {
      console.log(error);
    }
  },
});
