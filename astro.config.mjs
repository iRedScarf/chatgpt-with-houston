import { defineConfig } from 'astro/config';

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://chatgpt-with-houston.vercel.app/', // process.env.DEPLOY_URL || 
  output: "server",
  adapter: vercel()
});
