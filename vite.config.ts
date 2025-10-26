// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const isWorkstations =
  process.env.CLOUD_WORKSTATIONS === '1' ||
  // fallback detection when env isn’t set (works for workstations web preview)
  (process.env.HOSTNAME?.includes('cloudworkstations') ?? false)

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
    host: true,
    port: 5173,
    strictPort: true,
    hmr: isWorkstations
      ? {
          clientPort: 443,
          protocol: 'wss',
          // host: '<your-*.cloudworkstations.dev host>' // only if needed there
        }
      : undefined, // <-- on localhost, use normal HMR (no 443)
  },
  preview: {
    host: true,
    port: 5173,
  },
})
