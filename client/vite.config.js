import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group React and related libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Group Supabase
          'supabase': ['@supabase/supabase-js'],
          // Group other utilities
          'utils': ['axios', 'date-fns', 'canvas-confetti']
        }
      }
    },
    chunkSizeWarningLimit: 600 // Slightly increase the warning limit
  }
})