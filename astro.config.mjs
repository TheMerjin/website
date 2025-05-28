// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless'; // Use Vercel's adapter

export default defineConfig({
  output: 'server', // optional — this is inferred by adapter
  adapter: vercel(),
});
