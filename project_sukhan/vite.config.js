import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';


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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})

