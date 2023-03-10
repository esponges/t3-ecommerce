// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  FACEBOOK_CLIENT_ID: z.string(),
  FACEBOOK_CLIENT_SECRET: z.string(),
  GMAIL_APP_PASSWORD: z.string(),
  GMAIL_USERNAME: z.string(),
  ADMIN_EMAILS: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_BAR: z.string(),
  NEXT_PUBLIC_NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_IMAGEKIT_URL: z.string(),
  NEXT_PUBLIC_BANK_NAME: z.string(),
  NEXT_PUBLIC_BANK_ACCOUNT_NAME: z.string(),
  NEXT_PUBLIC_BANK_ACCOUNT_NUMBER: z.string(),
  NEXT_PUBLIC_CONTACT_EMAIL: z.string(),
  NEXT_PUBLIC_IG_URL: z.string(),
  NEXT_PUBLIC_PHONE_NUMBER: z.string(),
  NEXT_PUBLIC_BANK_ACCOUNT_CLABE: z.string(),
  NEXT_PUBLIC_STORE_NAME: z.string(),
  NEXT_PUBLIC_STORE_ADDRESS: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
  NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
  NEXT_PUBLIC_IMAGEKIT_URL: process.env.NEXT_PUBLIC_IMAGEKIT_URL,
  NEXT_PUBLIC_BANK_NAME: process.env.NEXT_PUBLIC_BANK_NAME,
  NEXT_PUBLIC_BANK_ACCOUNT_NAME: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME,
  NEXT_PUBLIC_BANK_ACCOUNT_NUMBER: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER,
  NEXT_PUBLIC_BANK_ACCOUNT_CLABE: process.env.NEXT_PUBLIC_BANK_ACCOUNT_CLABE,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  NEXT_PUBLIC_IG_URL: process.env.NEXT_PUBLIC_IG_URL,
  NEXT_PUBLIC_PHONE_NUMBER: process.env.NEXT_PUBLIC_PHONE_NUMBER,
  NEXT_PUBLIC_STORE_NAME: process.env.NEXT_PUBLIC_STORE_NAME,
  NEXT_PUBLIC_STORE_ADDRESS: process.env.NEXT_PUBLIC_STORE_ADDRESS,
};
