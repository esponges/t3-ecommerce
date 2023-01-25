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
  GMAIL_APP_PASSWORD: z.string(),
  GMAIL_USERNAME: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_BAR: z.string(),
  NEXT_PUBLIC_NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string(),
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: z.string(),
  NEXT_PUBLIC_EMAILJS_USER_ID_PUBLIC_KEY: z.string(),
  NEXT_PUBLIC_EMAILJS_FROM_EMAIL: z.string(),
  NEXT_PUBLIC_IMAGEKIT_URL: z.string(),
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
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  NEXT_PUBLIC_EMAILJS_USER_ID_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_USER_ID_PUBLIC_KEY,
  NEXT_PUBLIC_EMAILJS_FROM_EMAIL: process.env.NEXT_PUBLIC_EMAILJS_FROM_EMAIL,
  NEXT_PUBLIC_IMAGEKIT_URL: process.env.NEXT_PUBLIC_IMAGEKIT_URL,
};
