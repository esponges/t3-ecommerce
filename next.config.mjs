import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  env: {
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    EMAILJS_USER_ID_PUBLIC_KEY: process.env.EMAILJS_USER_ID_PUBLIC_KEY,
    EMAILJS_FROM_EMAIL: process.env.EMAILJS_FROM_EMAIL,
  },
  // todo: this strategy changes in next13
  images: {
    domains: ["raw.githubusercontent.com"],
  },
  // add sass support
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
});
