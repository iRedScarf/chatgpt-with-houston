import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";
import solidJs from '@astrojs/solid-js'

export default defineConfig({
  // site: 'https://houston.ailoha.com/',
  adapter: vercel({
    webAnalytics: { enabled: true },
    maxDuration: 60,
  }),
  integrations: [
    solidJs(),
  ],
});
