import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "@/server/db/client";
import { env } from "@/env/server.mjs";
import { PageRoutes } from "@/lib/routes";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      // Include user.id on session
      if (session.user) {
        // to update the User & Session schema you have to manually update it
        // in types/next-auth.d.ts https://stackoverflow.com/a/74746543/13772033
        session.user.id = user.id;
        session.user.admin = user?.admin;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: PageRoutes.Login,
    // signOut: '/auth/signout',
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
