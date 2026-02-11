import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    devOptions: { enabled: false },
    includeAssets: ['favicon.ico', 'apple-touch-icons.png'],
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg}']
    },
  })],
  build: {
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'
            if (id.includes('react-router')) return 'router'
            if (id.includes('redux')) return 'redux'
            return 'vendor'
          }
        }
      }
    }
  }
})

