import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
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
