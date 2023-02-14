import { t } from '../trpc';
import { z }  from 'zod';

export const categoryRouter = t.router({
  getAll: t.procedure
    .input(
      z.object({
        take: z.number().optional(),
      }).optional()
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findMany({
        orderBy: {
          score: 'desc'
        },
        take: input?.take,
      });
    }),
});
