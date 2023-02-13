import { t } from '../trpc';
import { z } from 'zod';

export const postalCodesRouter = t.router({
  getByCode: t.procedure
    .input(
      z.object({
        limit: z.number().optional(),
        // skip: z.number().optional(),
        code: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      const { limit, code } = input;

      if (!code) return;

      return ctx.prisma.postalCode.findMany({
        take: limit,
        // skip: skip,
        where: {
          code: {
            contains: code,
          },
        },
      });
    }),
});
