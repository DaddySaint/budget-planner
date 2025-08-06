import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  optimizeDeps: {
    exclude: ['path', 'fs', 'url', 'source-map-js']
  },
  css: {
    postcss: './postcss.config.cjs'
  }
})
