import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

export default defineConfig({
  output: 'server',

  // This automatically picks the right mode for Vercel
  adapter: vercel(),

  integrations: [react()]
});