// import { env } from "@/env/server.mjs";
import { t } from "../trpc";
import { z } from "zod";

// WARNING
// this is a super simple auth router
// this is not a proper auth system
// ideally this would be against a database
// that would return a JWT token to the client
// and the client would send that token with every request to the server
export const adminRouter = t.router({
  auth: t.procedure
    .input(
      z.object({
        user: z.string(),
        password: z.string(),
      })
    )
    .query(({ input: { user: _user, password: _password } }) => {
      // todo: this could be against a database in the future
      // const adminPw = env.ADMIN_DASHBOARD_PASSWORD;
      // const adminUser = env.ADMIN_DASHBOARD_USER;

      // if (adminPw === password && adminUser === user) {
      //   return true;
      // }

      // return false;
    }),
});
