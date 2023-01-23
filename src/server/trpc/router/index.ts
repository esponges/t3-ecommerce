// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { productRouter } from "./product";
import { orderRouter } from "./order";
import { categoryRouter } from "./category";

export const appRouter = t.router({
  auth: authRouter,
  product: productRouter,
  order: orderRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
