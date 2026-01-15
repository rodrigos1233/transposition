import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
// Workaround for CI environment
process.env.VITE_CJS_IGNORE_WARNING = 'true';
process.env.VITE_CJS_TRACE = 'true';

export default defineConfig({
  build: {
    // Avoid crypto requirement in CI
    cssCodeSplit: false,
    sourcemap: false,
    // Reduce chunk splitting
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    outDir: 'build', // Same as CRA default
  },

  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Fix VexFlow's import of structured-clone-es.js
      'structured-clone-es.js': 'structured-clone-es',
    },
  },
  server: {
    port: 3000, // Same as CRA default
    hmr: {
      // Force the HMR to always be active
      overlay: true,
    },
  },
});
