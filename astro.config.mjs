// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enable server-side rendering for API routes
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});