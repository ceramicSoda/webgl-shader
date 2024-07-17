import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'bundle.js',
      },
    },
  },
});