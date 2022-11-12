import { z } from 'zod';
import { t } from '../trpc';

export const productRouter = t.router({
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  getById: t.procedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.product.findUnique({
      where: {
        id: input.id,
      },
    });
  }),
  // get an array of products
  // for infinite scroll
  getBatch: t.procedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        categoryId: z.number().optional(),
      })
    )
    .query(async({ ctx, input }) => {
      const { limit, skip, categoryId, cursor } = input;
      const items = await ctx.prisma.product.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'asc',
        },
        where: {
          categoryId: categoryId ? categoryId : undefined,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
});
