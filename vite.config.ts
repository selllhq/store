import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    proxy: {
      '^/*\.selll\.store': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
