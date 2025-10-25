import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  optimizeDeps: {
    include: ['buffer', 'process/browser'],
    exclude: ['lucide-react'],
  },
  server: {
    host: true,          // listen on 0.0.0.0
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443,   // HMR over the proxy’s TLS port
      // protocol: 'wss', // uncomment if HMR still fails
      // host: '<your-*.cloudworkstations.dev host>', // rarely needed
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
});
