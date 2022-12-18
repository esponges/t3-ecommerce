import { z } from 'zod';
import { t } from '../trpc';

// todo: use protectedProcedure to require authentication
export const orderRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        userId: z.string(),
        orderItems: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number(),
          })
        ),
        orderDetail: z.object({
          address: z.string(),
          city: z.string(),
          country: z.string(),
          postalCode: z.string(),
          phone: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
    }),
  // send email on create
  success: t.procedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input.id,
        },
        include: {
          orderItems: true,
          orderDetail: true,
        },
      });

      if (!order) {
        return null;
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (!user) {
        return null;
      }

      // TODO: emailjs doesn't work in the server
      // find an alternative to send emails server-side
      return order;
    }),
  getByUserId: t.procedure
    .input(
      z.object({
        userId: z.string().optional(),
        take: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.userId) {
        return null;
      }

      const orders = await ctx.prisma.order.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          orderItems: true,
          orderDetail: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input.take ? 1 : undefined,
      });
      return orders;
    }),
  getAll: t.procedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({
      include: {
        orderItems: true,
        orderDetail: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return orders;
  }),
  getById: t.procedure
    .input(
      // allow lazy fetching for Checkout
      z.object({
        id: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input.id,
        },
        include: {
          orderItems: true,
          orderDetail: true,
        },
      });
      return order;
    }),
});
