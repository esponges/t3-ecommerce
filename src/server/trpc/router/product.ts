import { z } from 'zod';
import { t, authedProcedure} from '../trpc';

export const productRouter = t.router({
  getAll: t.procedure
    .input(
      z.object({
        orderBy: z.enum(['price', 'category']).optional(),
      })
    )
    .query(({ ctx }) => {
      return ctx.prisma.product.findMany(
        // display the category name
        {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        }
      );
    }),
  getBy: t.procedure
    .input(
      z.object({
        name: z.string().optional(),
        id: z.string().optional(),
        specs: z.boolean().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.name && !input.id) {
        return;
      }

      const product = ctx.prisma.product.findFirst({
        where: {
          name: input.name,
          id: input.id,
        },
        include: {
          category: true,
          productSpecs: input.specs,
        },
      });

      return product;
    }),
  update: authedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        discount: z.number().optional(),
        categoryId: z.number().optional(),
        image: z.string().optional(),
        stock: z.number().optional(),
        score: z.number().optional(),
        favScore: z.number().optional(),
        productSpecs: z.object({
          capacity: z.string().nullable().optional(),
          volume: z.string().nullable().optional(),
          age: z.string().nullable().optional(),
          country: z.string().nullable().optional(),
          year: z.string().nullable().optional(),
          variety: z.string().nullable().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, productSpecs, ...data } = input;

      // TODO:
      // check admin role for this

      /* begin transaction */
      const trx = await ctx.prisma.$transaction([
        ctx.prisma.product.update({
          where: {
            id,
          },
          data: {
            name: data.name,
            description: data.description,
            discount: data.discount,
            categoryId: data.categoryId,
            price: data.price,
            image: data.image,
            stock: data.stock,
            score: data.score,
            favScore: data.favScore,
          },
        }),

        // upsert — update existing or create new specs
        ctx.prisma.productSpecs.upsert({
          where: {
            productId: id,
          },
          create: {
            // connect the updated product to the specs
            product: {
              connect: {
                id,
              },
            },
            ...productSpecs,
          },
          update: {
            ...productSpecs,
          }
        }),
      ]);

      return trx;
    }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        discount: z.number().optional(),
        categoryId: z.number(),
        image: z.string().optional(),
        stock: z.number().optional(),
        score: z.number().optional(),
        favScore: z.number().optional(),
        productSpecs: z.object({
          capacity: z.string().nullable().optional(),
          volume: z.string().nullable().optional(),
          age: z.string().nullable().optional(),
          country: z.string().nullable().optional(),
          year: z.string().nullable().optional(),
          variety: z.string().nullable().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productSpecs, ...data } = input;

      const product = await ctx.prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          discount: data.discount,
          categoryId: data.categoryId,
          price: data.price,
          image: data.image,
          stock: data.stock,
          score: data.score,
          favScore: data.favScore,
          productSpecs: {
            create: {
              ...productSpecs,
            },
          },
        },
      });

      return product;
    }),
  // get an array of products
  getBatchByIds: t.procedure
    .input(
      z.object({
        productIds: z.array(z.string()).optional(),
        include: z
          .object({
            category: z.boolean().optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { productIds, include } = input;

      if (!productIds?.length) {
        return [];
      }

      const productItems = await ctx.prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        include: include,
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
        favorite: z.boolean().optional(),
        ignoredIds: z.array(z.string()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, categoryId, cursor, favorite, ignoredIds } = input;
      const items = await ctx.prisma.product.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          favScore: 'desc',
        },
        where: {
          categoryId: categoryId ? categoryId : undefined,
          // show only products with any favScore
          favScore: favorite
            ? {
              gt: 0,
            }
            : undefined,
          // ignore defined ids
          id: {
            notIn: ignoredIds ? ignoredIds : undefined,
          },
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
  search: t.procedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        name: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
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
          price: 'desc',
        },
        where: {
          name: {
            contains: name ? name : undefined,
            mode: 'insensitive',
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
    }),
});
