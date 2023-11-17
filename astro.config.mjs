import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: 'https://chatgpt-with-houston.vercel.app/',
  output: "server",
  adapter: vercel({ analytics: true }),
});
