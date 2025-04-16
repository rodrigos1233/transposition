import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import crypto from 'crypto';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: {},
    'process.env': {},
    'globalThis.crypto': JSON.stringify({
      getRandomValues: (arr: any) => crypto.randomBytes(arr.length)
    })
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000, // Same as CRA default
    hmr: {
      // Force the HMR to always be active
      overlay: true,
    },
  },
  build: {
    outDir: 'build', // Same as CRA default
  },
});
