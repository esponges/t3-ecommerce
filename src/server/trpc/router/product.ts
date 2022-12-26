import { z } from 'zod';
import { t } from '../trpc';

export const productRouter = t.router({
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  getById: t.procedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    const product = ctx.prisma.product.findUnique({
      where: {
        id: input.id,
      },
      // return the category information from the relation
      include: {
        category: true,
      },
    });

    return product;
  }),
  // get an array of products
  getBatchByIds: t.procedure
    .input(
      z.object({
        productIds: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const { productIds } = input;
      const productItems = await ctx.prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        include: {
          category: true,
        },
      });
      return productItems;
    }),
  // get an array of products
  // for infinite scroll
  getBatch: t.procedure
    .input(
      z.object({
        limit: z.number(),
        // cursor is a reference to the last item in the previous batch
        // it's used to fetch the next batch
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
        // return the last item from the array
        // and also remove it from items array
        const nextItem = items.pop(); 
        nextCursor = nextItem?.id;  
      }
      return {
        items,
        nextCursor,
      };
    }),
  // search by name for the search bar
  // debounce it ----
  search: t.procedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        name: z.string().optional(),
      })
    )
    .query(async({ ctx, input }) => {
      const { limit, skip, name, cursor } = input;

      // avoid empty search due to useQuery refetch()
      if (!name) {
        return {
          items: [],
          nextCursor: undefined,
        };
      }

      const items = await ctx.prisma.product.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'asc',
        },
        where: {
          name: {
            contains: name ? name : undefined,
          },
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
    }
    ),
});
