import { z } from "zod";
import { createRouter } from "./context";

export const productRouter = createRouter()
  // no middleware required
  // .middleware(async ({ ctx, next }) => {
  //   if (!ctx.session) {
  //     throw new TRPCError({ code: 'UNAUTHORIZED' });
  //   }
  //   return next();
  // })
  .query('getAll', {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.product.findMany();
      } catch (error) {
        throw new Error(error as string);
      }
    },
  })
  .query('getById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        return await ctx.prisma.product.findUnique({
          where: {
            id: input.id,
          },
        });
      }
      catch (error) {
        throw new Error(error as string);
      }
    },
  })
  // add middleware for mutations
