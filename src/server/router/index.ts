// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { productRouter } from "./product";
import { orderRouter } from "./order";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", protectedExampleRouter)
  .merge("product.", productRouter)
  .merge('order.', orderRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
