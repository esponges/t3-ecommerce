import { t } from "../trpc";


export const categoryRouter = t.router({
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
});
