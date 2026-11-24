import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (/[\\/]node_modules[\\/](lottie-web|lottie-react)[\\/]/.test(id)) {
                return 'vendor-lottie';
              }
              if (/[\\/]node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) {
                return 'vendor-motion';
              }
              if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) {
                return 'vendor-icons';
              }
              if (
                /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|react-helmet-async|@remix-run)[\\/]/.test(
                  id
                )
              ) {
                return 'vendor-react';
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 500,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        usePolling: true,
      },
    },
  };
});
