import { z } from 'zod';
import { t } from '../trpc';

export const productRouter = t.router({
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
