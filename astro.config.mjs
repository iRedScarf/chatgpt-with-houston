import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import solidJs from '@astrojs/solid-js'

export default defineConfig({
  // site: 'https://houston.ailoha.com/',
  output: "server",
  adapter: vercel({ analytics: true }),
  integrations: [
    solidJs(),
  ],
});
