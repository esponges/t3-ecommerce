// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { productRouter } from "./product";
import { orderRouter } from "./order";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  product: productRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
