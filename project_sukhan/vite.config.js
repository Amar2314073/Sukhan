import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icons.png'],
    devOptions: { enabled: true },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg}']
    },
    // manifest: {
    //   name: "Sukhan",
    //   short_name: "Sukhan",
    //   description: "A poetry sharing platform to express yourself through words.",
    //   theme_color: "#04070d",
    //   background_color: "#04070d",
    //   display: "standalone",
    //   scope: "/",
    //   icons: [
    //     {
    //       src: "/icons/icon-192.png",
    //       sizes: "192x192",
    //       type: "image/png"
    //     },
    //     {
    //       src: "/icons/icon-512.png",
    //       sizes: "512x512",
    //       type: "image/png"
    //     }
    //   ]
    // }
  })],
})

