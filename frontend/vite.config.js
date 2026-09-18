import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            // Suppress terminal proxy spam if backend is offline
          });
        },
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {});
        },
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {});
        },
      }
    }
  }
});
