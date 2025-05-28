// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // <--- MUST BE PRESENT
  adapter: node({
    mode: 'standalone'
  }),
});