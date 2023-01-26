import { z } from 'zod';
import { authedProcedure, t } from '../trpc';
import { sendOrderConfirmationEmail } from '@/server/common/mailer';

// todo: use protectedProcedure to require authentication
export const orderRouter = t.router({
  create: authedProcedure
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
  success: authedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // send email on create
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

      if (!user?.email) {
        return null;
      }

      await sendOrderConfirmationEmail(order, user.email);
      // TODO: emailjs doesn't work in the server
      // find an alternative to send emails server-side
      return order;
    }),
  getByUserId: authedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        take: z.boolean().optional(),
        orderItemDetails: z.boolean().optional(),
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
          orderItems: input.orderItemDetails
            ? {
              include: {
                product: true,
              },
            }
            : true,
          orderDetail: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input.take ? 1 : undefined,
      });

      return orders;
    }),
  getAll: authedProcedure.query(async ({ ctx }) => {
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
  getById: authedProcedure
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
          orderItems: {
            include: {
              product: true,
            },
          },
          orderDetail: true,
        },
      });
      return order;
    }),
});
