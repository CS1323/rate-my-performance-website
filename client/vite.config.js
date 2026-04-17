import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Debug: Log environment variables during build
console.log('[Vite Build Debug]');
console.log('  VITE_GA_ID:', process.env.VITE_GA_ID || 'NOT SET');
console.log('  VITE_API_BASE_URL:', process.env.VITE_API_BASE_URL || 'NOT SET');
console.log('  NODE_ENV:', process.env.NODE_ENV);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries for better caching
          'react-vendor': ['react', 'react-dom', 'react-router'],
          // Shared UI components that rarely change
          'ui-components': [
            './src/components/Header',
            './src/components/NavSidebar',
            './src/components/AdsSidebar'
          ]
        }
      }
    }
  },
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
