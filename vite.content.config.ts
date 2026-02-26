import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: 'src/extension/content/index.ts',
      formats: ['iife'],
      name: 'showdownTeamCheckContent',
      fileName: () => 'content.js',
    },
  },
});
