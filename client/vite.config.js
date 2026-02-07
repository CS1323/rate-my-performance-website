import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to backend during development (npm run dev)
    // In production, requests go directly to the backend URL
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5001',
        changeOrigin: true
      },
      '/images': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
