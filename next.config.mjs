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
  // todo: this strategy changes in next13
  images: {
    domains: ["raw.githubusercontent.com", "ik.imagekit.io"],
    // imagekit
    
  },
  // add sass support
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
});
