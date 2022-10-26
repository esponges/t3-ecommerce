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
    orderDetail: z.array(
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
          orderDetail: {
            create: input.orderDetail,
          },
        },
      });
      return order;
    } catch (error) {
      console.log(error);
    }
  },
}).query('getByUserId', {
  input: z.object({
    userId: z.string(),
    latest: z.boolean().optional(),
  }),
  resolve: async ({ ctx, input }) => {
    try {
      const order = await ctx.prisma.order.findMany({
      // get the latest order
        where: {
          userId: input.userId,
        },
        ...(input.latest ? { orderBy: {
          id: 'desc',
        },
        take: 1 } : {}),
      });
      return order;
    }
    catch (error) {
      console.log(error);
    }
  },
}).query('getAll', {
  resolve: async ({ ctx }) => {
    try {
      const order = await ctx.prisma.order.findMany();
      return order;
    }
    catch (error) {
      console.log(error);
    }
  }
});
