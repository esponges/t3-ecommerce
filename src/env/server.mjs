// @ts-check
/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { serverSchema } from "./schema.mjs";
import { env as clientEnv, formatErrors } from "./client.mjs";

const _serverEnv = serverSchema.safeParse(process.env);

// console.log("🔐 Validating environment variables for the server...", serverSchema.data);
console.log("🔐 Validating environment variables for the client...", clientEnv);


/** @type {{ NODE_ENV?: string }} */
let env = {};


// bypass checks in test environment
if (process.env.NODE_ENV !== "test") {
  if (!_serverEnv.success) {
    console.error(
      "❌ Invalid environment variables:\n",
      ...formatErrors(_serverEnv.error.format()),
    );
    throw new Error("Invalid environment variables");
  }

  for (let key of Object.keys(_serverEnv.data)) {
    if (key.startsWith("NEXT_PUBLIC_")) {
      console.warn("❌ You are exposing a server-side env-variable:", key);

      throw new Error("You are exposing a server-side env-variable");
    }
  }
  env = { ..._serverEnv.data, ...clientEnv };
} else {
  env = { NODE_ENV: "test", ...clientEnv };
}

export { env };

