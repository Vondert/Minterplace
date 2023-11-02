import {defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return{
    plugins: [
    react(),
    nodePolyfills(),
    ],
    build: {
      target: "es2020",
      rollupOptions: {
          plugins: [ react(),
            nodePolyfills(),],
      },
    },
    optimizeDeps: {
      esbuildOptions: {
          target: "es2020"
      }
    }
  }
})
